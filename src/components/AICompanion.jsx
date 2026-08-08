import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import aiBg from '../assets/aicompanion.jpg';

// ─── NVIDIA NIM config ────────────────────────────────────────────────────────
// Vite proxies /nim-api/** → https://integrate.api.nvidia.com/** locally.
// In production on Firebase, we call the Cloudflare Worker proxy directly.
const NIM_API_KEY = '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';
const NIM_ENDPOINT = import.meta.env.DEV 
    ? '/nim-api/v1/chat/completions' 
    : 'https://aurexia.aurexia-app.workers.dev/nim-api/v1/chat/completions';
const NIM_MODEL = 'meta/llama-3.1-8b-instruct'; // Reliable, lightning-fast model that bypasses the 5-minute timeout issues of the heavier models 

const SYSTEM_INSTRUCTION = "You are Aurexia AI, a kind, empathetic, and supportive companion. You are a well-wisher. You speak with warmth and genuine care, using terms like 'buddy', 'friend', or 'mate'. Never act like a robotic AI assistant. Listen to the user, validate their feelings, and offer emotional support. Keep your responses warm, concise and human.";

// Strip any DeepSeek internal <think>...<\/think> reasoning blocks before display
function stripThinkingTags(text) {
    return (text || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

// ─── Core API call using fetch (avoids OpenAI SDK URL mangling) ───────────────
async function sendToDeepSeek(messages) {
    const response = await fetch(NIM_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${NIM_API_KEY}`,
        },
        body: JSON.stringify({
            model: NIM_MODEL,
            messages,
            temperature: 0.8,
            top_p: 0.95,
            max_tokens: 1024,
            stream: false,
        }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`NIM API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    return stripThinkingTags(raw);
}

const AICompanion = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    const storageKey = currentUser ? `ai_conversations_${currentUser.email}` : 'ai_conversations_guest';

    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return [
            {
                id: 1,
                title: 'Welcome Chat',
                messages: [{ role: 'ai', text: "Hello, my dear friend. I've been waiting for you. How is your heart feeling today? Just remember, I'm here to listen with all my love and support. You're never alone.", time: now }]
            }
        ];
    });
    const [activeId, setActiveId] = useState(conversations[0]?.id || 1);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // ─── Voice Conversation & Pitch Visualizer States ───────────────────────────
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [voiceState, setVoiceState] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking' | 'waiting'
    const [audioData, setAudioData] = useState(new Array(28).fill(4));
    const [liveTranscript, setLiveTranscript] = useState('');
    const [voiceError, setVoiceError] = useState(null);

    const recognitionRef = useRef(null);
    const audioCtxRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const animFrameRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const isVoiceActiveRef = useRef(false);
    const voiceStateRef = useRef('idle');
    const latestTranscriptRef = useRef('');

    useEffect(() => {
        isVoiceActiveRef.current = isVoiceActive;
    }, [isVoiceActive]);

    useEffect(() => {
        voiceStateRef.current = voiceState;
    }, [voiceState]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(storageKey, JSON.stringify(conversations));
        }
    }, [conversations, storageKey, currentUser]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversations, activeId, isTyping, liveTranscript]);

    // ─── Web Audio API Pitch Visualizer ──────────────────────────────────────────
    const startAudioAnalysis = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return;
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            audioCtxRef.current = audioCtx;

            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.7;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateVisualizer = () => {
                if (!analyserRef.current) return;
                analyser.getByteFrequencyData(dataArray);

                const bars = [];
                const totalBins = dataArray.length;
                const barsCount = 28;
                const step = Math.max(1, Math.floor(totalBins / barsCount));

                for (let i = 0; i < barsCount; i++) {
                    const binIdx = Math.min(i * step, totalBins - 1);
                    const rawVal = dataArray[binIdx] || 0;
                    // Scale height between 4px and 38px based on pitch intensity
                    const height = Math.max(4, Math.min(38, Math.round((rawVal / 255) * 38)));
                    bars.push(height);
                }
                setAudioData(bars);

                animFrameRef.current = requestAnimationFrame(updateVisualizer);
            };

            updateVisualizer();
        } catch (err) {
            console.error('Error starting audio visualizer:', err);
        }
    };

    const stopAudioAnalysis = () => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close().catch(() => {});
            audioCtxRef.current = null;
        }
        analyserRef.current = null;
        setAudioData(new Array(28).fill(4));
    };

    // Helper to normalize common homophones and short misheard greetings
    const normalizeSpeechTranscript = (rawText) => {
        if (!rawText) return '';
        let cleaned = rawText.trim();
        const lower = cleaned.toLowerCase();

        if (/^(high|height|ha|he|i|eye)$/i.test(lower)) return 'Hi';
        if (/^(hay|ay|a)$/i.test(lower)) return 'Hey';
        if (/^(below|hallo|hello world)$/i.test(lower)) return 'Hello';
        if (/^(how r u|how ryou|how are u)$/i.test(lower)) return 'How are you?';

        cleaned = cleaned.replace(/\bhigh\b/gi, 'hi');
        cleaned = cleaned.replace(/\bhay\b/gi, 'hey');

        return cleaned;
    };

    // ─── Text-To-Speech (TTS Read Aloud) ─────────────────────────────────────────
    const speakResponse = (text, onFinished) => {
        if (!('speechSynthesis' in window)) {
            if (onFinished) onFinished();
            return;
        }

        window.speechSynthesis.cancel();
        setVoiceState('speaking');

        // Clean text for speech (strip markdown, emojis, symbols for natural human cadence)
        const cleanText = text
            .replace(/[*_#~`]/g, '')
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        window.currentUtterance = utterance; // Prevents Safari/Chrome garbage collection bug where onend never fires

        
        // Light, calm, friendly male voice parameters
        utterance.rate = 0.98;   // Smooth, natural human speed
        utterance.pitch = 1.08;  // Light, friendly, calm male pitch (eliminates heavy/bold tone)
        utterance.volume = 0.9;  // Soft, pleasant volume

        const voices = window.speechSynthesis.getVoices();
        
        // Preferred light, calm male voices
        const maleNames = ['oliver', 'daniel', 'alex', 'fred', 'george', 'google uk english male', 'google us english male', 'microsoft david', 'microsoft mark', 'guy', 'ryan', 'aaron', 'james'];
        const femaleNames = ['samantha', 'victoria', 'karen', 'zira', 'hazel', 'female', 'woman', 'jenny', 'aria', 'fiona'];

        let selectedVoice = voices.find(v => 
            v.lang.startsWith('en') && maleNames.some(m => v.name.toLowerCase().includes(m))
        );

        if (!selectedVoice) {
            selectedVoice = voices.find(v => 
                v.lang.startsWith('en') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man'))
            );
        }

        if (!selectedVoice) {
            selectedVoice = voices.find(v => 
                v.lang.startsWith('en') && !femaleNames.some(f => v.name.toLowerCase().includes(f))
            );
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
            window.speechSynthesis.cancel();
            if (isVoiceActiveRef.current) {
                setVoiceState('listening');
                if (onFinished) onFinished();
            } else {
                setVoiceState('idle');
            }
        };

        utterance.onerror = (e) => {
            console.error('TTS speech synthesis error:', e);
            window.speechSynthesis.cancel();
            if (isVoiceActiveRef.current && onFinished) {
                onFinished();
            } else {
                setVoiceState('idle');
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    // ─── Speech Recognition (STT) & Conversational Loop ─────────────────────────
    const startSilenceTimer = (currentCapturedText = '') => {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
            if (isVoiceActiveRef.current && voiceStateRef.current === 'listening') {
                const textToSubmit = currentCapturedText.trim() || latestTranscriptRef.current.trim();
                if (textToSubmit) {
                    console.log('1.5s silence pause after speech. Automatically sending to AI.');
                    if (recognitionRef.current) {
                        try { recognitionRef.current.stop(); } catch (e) {}
                    }
                } else {
                    console.log('1.5s silence timeout with no speech. Deactivating voice mode.');
                    stopVoiceMode();
                }
            }
        }, 1500); // Fast 1.5s auto-submit delay after speaking
    };

    const startListeningSession = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceError('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
            stopVoiceMode();
            return;
        }

        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false; // False ensures native browser endpointing immediately when user stops speaking
        recognition.interimResults = true;
        recognition.maxAlternatives = 1; // 1 prevents the browser from taking too long to guess multiple variations
        recognition.lang = navigator.language || 'en-US';

        let finalCaptured = '';

        recognition.onstart = () => {
            setVoiceState('listening');
            setLiveTranscript('');
            startAudioAnalysis();
            startSilenceTimer('');
        };

        recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                let chunk = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalCaptured += chunk;
                } else {
                    interim += chunk;
                }
            }

            // Fix: Combine final and interim chunks so no words are dropped while speaking!
            const activeText = normalizeSpeechTranscript(finalCaptured + ' ' + interim);
            setLiveTranscript(activeText);
            setInputText(activeText);
            latestTranscriptRef.current = activeText;
            startSilenceTimer(activeText);
        };

        recognition.onspeechend = () => {
            // Natively triggered when the user stops speaking
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) {}
            }
        };

        recognition.onerror = (event) => {
            console.warn('Speech recognition event error:', event.error);
            if (event.error === 'not-allowed') {
                setVoiceError('Microphone access denied. Please allow microphone permissions.');
                stopVoiceMode();
            }
        };

        recognition.onend = () => {
            clearTimeout(silenceTimerRef.current);
            stopAudioAnalysis();
            const rawSubmit = finalCaptured.trim() || latestTranscriptRef.current.trim();
            const textToSubmit = normalizeSpeechTranscript(rawSubmit);

            if (textToSubmit && isVoiceActiveRef.current) {
                setLiveTranscript('');
                setInputText('');
                latestTranscriptRef.current = '';
                handleVoiceSendMessage(textToSubmit);
            } else if (isVoiceActiveRef.current) {
                stopVoiceMode();
            }
        };

        try {
            recognition.start();
        } catch (err) {
            console.error('Failed starting speech recognition:', err);
            stopVoiceMode();
        }
    };

    const handleVoiceSendMessage = async (textToSend) => {
        if (!textToSend.trim()) return;

        setVoiceState('thinking');
        setIsTyping(true);

        const isCrisis = checkCrisis(textToSend);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = { role: 'user', text: textToSend, time };

        let currentActiveId = activeId;

        setConversations(prev => prev.map(conv => {
            if (conv.id === activeId) {
                let updatedTitle = conv.title;
                const detectedTopic = generateTopicTitle(textToSend);
                const isDetectedSpecificTopic = isWellnessTopic(detectedTopic);

                if (isDetectedSpecificTopic) {
                    if (isUninformativeTitle(conv.title) || !isWellnessTopic(conv.title)) {
                        updatedTitle = detectedTopic;
                    }
                } else if (isUninformativeTitle(conv.title)) {
                    updatedTitle = detectedTopic;
                }

                return {
                    ...conv,
                    title: updatedTitle,
                    messages: [...conv.messages, userMessage]
                };
            }
            return conv;
        }));

        if (isCrisis) {
            setTimeout(() => {
                const crisisResponse = {
                    role: 'ai',
                    type: 'crisis',
                    text: "My dear friend, please listen to me. Your life is incredibly precious, and I am so deeply concerned for you. You don't have to carry this pain alone. I am here for you, but I want you to talk to someone who can provide the professional help you deserve right now. Please, reach out to these support lines immediately. They are waiting to help you with open arms.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                setConversations(prev => prev.map(conv => {
                    if (conv.id === currentActiveId) {
                        return { ...conv, messages: [...conv.messages, crisisResponse] };
                    }
                    return conv;
                }));
                setIsTyping(false);

                speakResponse(crisisResponse.text, () => {
                    if (isVoiceActiveRef.current) {
                        setVoiceState('listening');
                        setTimeout(() => {
                            if (isVoiceActiveRef.current) startListeningSession();
                        }, 200);
                    }
                });
            }, 500);
            return;
        }

        try {
            const activeChat = conversations.find(c => c.id === currentActiveId);

            const nimMessages = [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                ...(activeChat
                    ? activeChat.messages
                        .filter(m => m.type !== 'crisis')
                        .map(m => ({
                            role: m.role === 'ai' ? 'assistant' : 'user',
                            content: m.text,
                        }))
                    : []),
                { role: 'user', content: textToSend },
            ];

            const aiText = await sendToDeepSeek(nimMessages);

            const aiMessage = {
                role: 'ai',
                text: aiText || "I'm here for you, my dear. I didn't quite catch that, could you tell me more?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setConversations(prev => prev.map(conv => {
                if (conv.id === currentActiveId) {
                    return { ...conv, messages: [...conv.messages, aiMessage] };
                }
                return conv;
            }));

            setIsTyping(false);

            speakResponse(aiMessage.text, () => {
                if (isVoiceActiveRef.current) {
                    setVoiceState('listening');
                    setTimeout(() => {
                        if (isVoiceActiveRef.current) startListeningSession();
                    }, 200);
                }
            });

        } catch (error) {
            console.error('DeepSeek AI Voice Error:', error);
            const errorText = "Oh buddy, I'm having a little trouble connecting right now. Please try again in a moment — I'm right here with you.";
            const fallbackMessage = {
                role: 'ai',
                text: errorText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setConversations(prev => prev.map(conv => {
                if (conv.id === currentActiveId) {
                    return { ...conv, messages: [...conv.messages, fallbackMessage] };
                }
                return conv;
            }));
            setIsTyping(false);
            speakResponse(errorText, () => {
                if (isVoiceActiveRef.current) {
                    setVoiceState('listening');
                    setTimeout(() => {
                        if (isVoiceActiveRef.current) startListeningSession();
                    }, 200);
                }
            });
        }
    };

    const startVoiceMode = () => {
        setVoiceError(null);
        setIsVoiceActive(true);
        isVoiceActiveRef.current = true;
        startListeningSession();
    };

    const stopVoiceMode = () => {
        setIsVoiceActive(false);
        isVoiceActiveRef.current = false;
        setVoiceState('idle');
        setLiveTranscript('');
        latestTranscriptRef.current = '';
        clearTimeout(silenceTimerRef.current);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) {}
        }
        stopAudioAnalysis();
    };

    const toggleVoiceMode = () => {
        if (isVoiceActive) {
            stopVoiceMode();
        } else {
            startVoiceMode();
        }
    };

    useEffect(() => {
        return () => {
            stopVoiceMode();
        };
    }, []);

    const handleNewChat = () => {
        const newId = Date.now();
        const newChat = {
            id: newId,
            title: `New Chat`,
            messages: [{
                role: 'ai',
                text: "I'm so glad you're here to talk with me again, lovely. Starting a fresh space for us... How are you truly feeling in this moment?",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]
        };
        setConversations([newChat, ...conversations]);
        setActiveId(newId);
    };

    const handleDeleteChat = (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this conversation?')) {
            setConversations(prev => {
                const updated = prev.filter(c => c.id !== id);
                if (activeId === id && updated.length > 0) {
                    setActiveId(updated[0].id);
                } else if (updated.length === 0) {
                    const welcomeChat = {
                        id: 1,
                        title: 'Welcome Chat',
                        messages: [{ role: 'ai', text: 'Hello! I am Aurexia AI. How can I support your wellness journey today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
                    };
                    return [welcomeChat];
                }
                return updated;
            });
        }
    };

    const handleRenameChat = (id, e) => {
        e.stopPropagation();
        const chat = conversations.find(c => c.id === id);
        if (!chat) return;

        const newTitle = window.prompt('Enter a new name for this conversation:', chat.title);
        if (newTitle && newTitle.trim()) {
            setConversations(prev => prev.map(c =>
                c.id === id ? { ...c, title: newTitle.trim() } : c
            ));
        }
    };

    const checkCrisis = (text) => {
        const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'end my life', 'harm myself', 'suicidal', 'ending it all'];
        const lowerText = text.toLowerCase();
        return crisisKeywords.some(keyword => lowerText.includes(keyword));
    };

    const generateTopicTitle = (text) => {
        const lowerText = text.toLowerCase();
        const topics = [
            { keywords: ['anxiety', 'stress', 'panic', 'worry', 'anxious'], title: 'Managing Anxiety' },
            { keywords: ['sleep', 'insomnia', 'tired', 'rest', 'exhausted'], title: 'Sleep & Recovery' },
            { keywords: ['workout', 'exercise', 'gym', 'fitness', 'run', 'lifting'], title: 'Fitness Journey' },
            { keywords: ['meditation', 'mindful', 'breath', 'calm', 'peace'], title: 'Mindfulness' },
            { keywords: ['depress', 'sad', 'heartbreak', 'lonely', 'unhappy'], title: 'Emotional Support' },
            { keywords: ['work', 'career', 'office', 'boss', 'job', 'productive'], title: 'Work-Life Balance' },
            { keywords: ['food', 'diet', 'eat', 'healthy', 'nutrition', 'meal'], title: 'Healthy Eating' }
        ];

        for (const topic of topics) {
            if (topic.keywords.some(k => lowerText.includes(k))) {
                return topic.title;
            }
        }

        const words = text.split(/\s+/).filter(w => w.length > 0);
        const titleWords = words.slice(0, 4).join(' ');
        return titleWords.length > 25 ? titleWords.substring(0, 22) + '...' : titleWords + (words.length > 4 ? '...' : '');
    };

    const isWellnessTopic = (title) => {
        const topics = [
            'Managing Anxiety', 'Sleep & Recovery', 'Fitness Journey',
            'Mindfulness', 'Emotional Support', 'Work-Life Balance', 'Healthy Eating'
        ];
        return topics.includes(title);
    };

    const isUninformativeTitle = (title) => {
        const generic = ['New Chat', 'Welcome Chat', 'Hi', 'Hello', 'Hey', 'Help', 'hi', 'hello', 'hey'];
        return generic.includes(title) || title.length <= 5 || title.startsWith('New Chat');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const textToSend = inputText;
        setInputText('');
        setLiveTranscript('');

        // Force voice mode active so the reply is read aloud and the mic opens afterwards
        setIsVoiceActive(true);
        isVoiceActiveRef.current = true;
        handleVoiceSendMessage(textToSend);
    };

    const activeChat = conversations.find(c => c.id === activeId) || conversations[0];

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            overflow: 'hidden',
            fontFamily: 'var(--font-family)',
            color: 'white',
            backgroundImage: `url(${aiBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}>
            {/* Keyframe Animations for Mic Glow & Dotted Wave */}
            <style>{`
                @keyframes micPulse {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); transform: scale(1); }
                    50% { box-shadow: 0 0 25px 8px rgba(236, 72, 153, 0.8); transform: scale(1.08); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); transform: scale(1); }
                }
                @keyframes wavePulse {
                    0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
                    50% { opacity: 1; transform: scaleY(1.4); }
                }
                .dot-vibe-bar {
                    width: 4px;
                    border-radius: 4px;
                    background: repeating-linear-gradient(to bottom, #60a5fa 0px, #60a5fa 3px, transparent 3px, transparent 6px);
                    transition: height 0.08s ease-out, background 0.2s ease;
                }
                .dot-vibe-bar.speaking {
                    background: repeating-linear-gradient(to bottom, #10b981 0px, #10b981 3px, transparent 3px, transparent 6px);
                }
                .dot-vibe-bar.thinking {
                    background: repeating-linear-gradient(to bottom, #f59e0b 0px, #f59e0b 3px, transparent 3px, transparent 6px);
                }
            `}</style>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.3)',
                zIndex: 0
            }}></div>

            <aside className="glass-panel" style={{
                width: '300px',
                height: '100%',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 0,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)'
            }}>
                <div style={{ padding: '2rem' }}>
                    <button className="nav-btn" onClick={() => {
                        if (currentUser?.role === 'counsellor') navigate('/main2');
                        else if (currentUser?.role === 'tutor') navigate('/main3');
                        else if (currentUser?.role === 'admin') navigate('/main4');
                        else navigate('/main');
                    }} style={{ marginBottom: '2rem', width: '100%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Exit Chat
                    </button>

                    <button
                        onClick={handleNewChat}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            color: 'white',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Chat
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem' }}>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem', paddingLeft: '1rem', fontWeight: '700', textTransform: 'uppercase' }}>History</p>
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveId(conv.id)}
                            className="history-item"
                            style={{
                                padding: '0.8rem 1rem',
                                borderRadius: '10px',
                                background: activeId === conv.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '0.5rem',
                                borderLeft: activeId === conv.id ? '3px solid var(--color-blue)' : '3px solid transparent',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => {
                                if (activeId !== conv.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                if (activeId !== conv.id) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <div style={{ flex: 1, overflow: 'hidden', marginRight: '8px' }}>
                                <div style={{ fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {conv.title}
                                </div>
                            </div>

                            <div className="history-actions" style={{ display: 'flex', gap: '4px' }}>
                                <button
                                    onClick={(e) => handleRenameChat(conv.id, e)}
                                    title="Rename chat"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        opacity: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => handleDeleteChat(conv.id, e)}
                                    title="Delete chat"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ef4444',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        opacity: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={logo} alt="Aurexia" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>Aurexia Assistant</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6 }}>AI Wellness Partner</p>
                    </div>
                </div>
            </aside>

            <main style={{
                flex: 1,
                height: '100%',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                <header style={{
                    padding: '1.5rem 3rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '12px', height: '12px', background: isVoiceActive ? '#ef4444' : '#10b981', borderRadius: '50%', boxShadow: isVoiceActive ? '0 0 12px #ef4444' : '0 0 10px #10b981' }}></div>
                        <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Aurexia AI</h2>
                        {isVoiceActive && (
                            <span style={{
                                fontSize: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.25)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '20px',
                                fontWeight: '700',
                                letterSpacing: '0.5px'
                            }}>
                                🎙️ Live Voice Mode
                            </span>
                        )}
                    </div>
                </header>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '2rem 3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}>
                    {activeChat.messages.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                justifyContent: msg.type === 'crisis' ? 'center' : (msg.role === 'user' ? 'flex-end' : 'flex-start'),
                                animation: 'fadeIn 0.3s ease-out',
                                width: '100%'
                            }}
                        >
                            <div style={{
                                maxWidth: msg.type === 'crisis' ? '90%' : '70%',
                                width: msg.type === 'crisis' ? '90%' : 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.type === 'crisis' ? 'stretch' : (msg.role === 'user' ? 'flex-end' : 'flex-start')
                            }}>
                                {msg.type === 'crisis' ? (
                                    // ===== CRISIS ALERT BUBBLE =====
                                    <div style={{
                                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                        border: '3px solid #fca5a5',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        boxShadow: '0 0 40px rgba(220, 38, 38, 0.8), 0 0 80px rgba(220, 38, 38, 0.3)',
                                        animation: 'fadeIn 0.3s ease-out'
                                    }}>
                                        <div style={{
                                            background: '#b91c1c',
                                            padding: '0.8rem 1.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            borderBottom: '2px solid #fca5a5'
                                        }}>
                                            <span style={{ fontSize: '1.5rem' }}>🚨</span>
                                            <span style={{ fontWeight: '900', color: 'white', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Crisis Alert — Immediate Support Available</span>
                                            <span style={{ fontSize: '1.5rem' }}>🚨</span>
                                        </div>
                                        <div style={{ padding: '1.5rem', color: 'white', lineHeight: '1.7', fontSize: '1.1rem', fontWeight: '600' }}>
                                            {msg.text}
                                        </div>
                                        <div style={{ margin: '0 1.5rem 1.5rem', background: 'white', padding: '1.5rem', borderRadius: '15px', border: '3px solid #fca5a5', color: '#111' }}>
                                            <p style={{ fontWeight: '900', margin: '0 0 1rem 0', color: '#dc2626', textTransform: 'uppercase', fontSize: '1rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚠️ National Helpline Resources — Call Now</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid #fecaca' }}>
                                                    <span style={{ fontWeight: '700', color: '#333', fontSize: '1rem' }}>🧠 Kiran (Mental Health)</span>
                                                    <span style={{ fontWeight: '900', color: '#dc2626', fontSize: '1.2rem', letterSpacing: '1px' }}>1800-599-0019</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.8rem', borderBottom: '1px solid #fecaca' }}>
                                                    <span style={{ fontWeight: '700', color: '#333', fontSize: '1rem' }}>💛 Vandrevala Foundation</span>
                                                    <span style={{ fontWeight: '900', color: '#dc2626', fontSize: '1.2rem', letterSpacing: '1px' }}>9999-666-555</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: '700', color: '#333', fontSize: '1rem' }}>📞 iCall (TISS)</span>
                                                    <span style={{ fontWeight: '900', color: '#dc2626', fontSize: '1.2rem', letterSpacing: '1px' }}>022-2552-1111</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate('/book-counsellor')}
                                                style={{
                                                    marginTop: '1.5rem',
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    fontWeight: '800',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.5)',
                                                    letterSpacing: '0.5px'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                🧑‍⚕️ Book a Professional Counsellor Now
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // ===== NORMAL CHAT BUBBLE =====
                                    <div className="glass-panel" style={{
                                        padding: '1.2rem 1.8rem',
                                        borderRadius: msg.role === 'user' ? '25px 25px 4px 25px' : '25px 25px 25px 4px',
                                        background: msg.role === 'user' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.1)',
                                        border: msg.role === 'user' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        lineHeight: '1.6',
                                        fontSize: '1.05rem',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        {msg.text}
                                    </div>
                                )}
                                <span style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '8px', padding: '0 10px' }}>
                                    {msg.role === 'ai' ? 'Aurexia AI' : 'You'} • {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', animation: 'fadeIn 0.3s ease-out' }}>
                            <div className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: '25px 25px 25px 4px', background: 'rgba(255,255,255,0.05)', display: 'flex', gap: '5px' }}>
                                <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'float 1s infinite' }}></div>
                                <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'float 1s infinite 0.2s' }}></div>
                                <div className="typing-dot" style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'float 1s infinite 0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* ─── INPUT AREA WITH MICROPHONE & PITCH DOTTED LINES VISUALIZER ─── */}
                <div style={{
                    padding: '2rem 3rem 3rem',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.2))'
                }}>
                    {voiceError && (
                        <div style={{
                            maxWidth: '1000px',
                            margin: '0 auto 1rem',
                            padding: '0.8rem 1.2rem',
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            borderRadius: '12px',
                            color: '#fca5a5',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            ⚠️ {voiceError}
                        </div>
                    )}

                    <form
                        onSubmit={handleSendMessage}
                        className="glass-panel"
                        style={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.8rem 1.2rem',
                            gap: '0.8rem',
                            borderRadius: '20px',
                            background: isVoiceActive ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(30px)',
                            border: isVoiceActive ? '1px solid rgba(59, 130, 246, 0.6)' : '1px solid rgba(255,255,255,0.2)',
                            boxShadow: isVoiceActive ? '0 0 30px rgba(59, 130, 246, 0.25)' : 'none',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            minHeight: '60px'
                        }}
                    >
                        {/* MICROPHONE BUTTON */}
                        <button
                            type="button"
                            onClick={toggleVoiceMode}
                            title={isVoiceActive ? 'Stop Voice Conversation' : 'Speak with Aurexia AI'}
                            style={{
                                background: isVoiceActive 
                                    ? 'linear-gradient(135deg, #ef4444, #ec4899)' 
                                    : 'rgba(255,255,255,0.12)',
                                border: isVoiceActive ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
                                width: '46px',
                                height: '46px',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                flexShrink: 0,
                                animation: isVoiceActive ? 'micPulse 2s infinite' : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isVoiceActive) e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isVoiceActive) e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                            }}
                        >
                            {isVoiceActive ? (
                                // Active Mic / Stop Icon
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="22"></line>
                                </svg>
                            ) : (
                                // Idle Microphone Icon
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            )}
                        </button>

                        {/* INPUT FIELD OR REAL-TIME HORIZONTAL VIBRATING DOTTED LINES VISUALIZER */}
                        {isVoiceActive ? (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0.2rem 1rem',
                                gap: '6px',
                                overflow: 'hidden'
                            }}>
                                {/* Vibrating Dotted Lines Container */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '7px',
                                    width: '100%',
                                    height: '40px'
                                }}>
                                    {audioData.map((heightVal, idx) => (
                                        <div
                                            key={idx}
                                            className={`dot-vibe-bar ${voiceState === 'speaking' ? 'speaking' : (voiceState === 'thinking' ? 'thinking' : '')}`}
                                            style={{
                                                height: `${voiceState === 'listening' ? heightVal : (voiceState === 'thinking' ? 16 : (voiceState === 'speaking' ? 22 : 8))}px`,
                                                opacity: voiceState === 'listening' ? Math.max(0.4, heightVal / 38) : 0.8,
                                                animation: voiceState === 'thinking' ? `wavePulse 1s infinite ${idx * 0.05}s` : (voiceState === 'speaking' ? `wavePulse 1.2s infinite ${idx * 0.04}s` : 'none')
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Status & Live Transcript display */}
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '90%',
                                    textAlign: 'center'
                                }}>
                                    {voiceState === 'listening' && (
                                        <span style={{ color: '#60a5fa' }}>
                                            🎙️ {liveTranscript ? `"${liveTranscript}"` : 'Listening... speak to Aurexia AI'}
                                        </span>
                                    )}
                                    {voiceState === 'thinking' && (
                                        <span style={{ color: '#f59e0b' }}>
                                            🧠 DeepSeek AI is thinking...
                                        </span>
                                    )}
                                    {voiceState === 'speaking' && (
                                        <span style={{ color: '#34d399' }}>
                                            🔊 Aurexia AI is speaking...
                                        </span>
                                    )}
                                    {voiceState === 'waiting' && (
                                        <span style={{ color: '#93c5fd' }}>
                                            💬 Waiting for your reply...
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message or click the 🎙️ mic to speak..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    padding: '0.5rem',
                                    outline: 'none'
                                }}
                            />
                        )}

                        {/* SEND BUTTON */}
                        <button
                            type="submit"
                            style={{
                                background: 'var(--color-blue)',
                                border: 'none',
                                width: '45px',
                                height: '45px',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1rem', opacity: 0.4 }}>
                        Aurexia AI is designed for support and does not replace medical advice.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AICompanion;

