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
const NIM_MODEL = 'deepseek-ai/deepseek-v4-pro';

const SYSTEM_INSTRUCTION = "You are Aurexia AI, a kind, empathetic, and supportive companion. You are a well-wisher. You speak with warmth and genuine care, using terms like 'buddy', 'friend', or 'mate'. Never act like a robotic AI assistant. Listen to the user, validate their feelings, and offer emotional support. Keep your responses warm, concise and human.";

// Strip any DeepSeek internal <think>...</think> reasoning blocks before display
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
    }, [conversations, activeId, isTyping]);

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

        const isCrisis = checkCrisis(inputText);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = { role: 'user', text: inputText, time };

        let currentActiveId = activeId;

        setConversations(prev => prev.map(conv => {
            if (conv.id === activeId) {
                let updatedTitle = conv.title;
                const detectedTopic = generateTopicTitle(inputText);
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

        setInputText('');

        if (isCrisis) {
            setIsTyping(true);
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
            }, 500);
            return;
        }

        setIsTyping(true);

        try {
            // Get conversation history for the active chat
            const activeChat = conversations.find(c => c.id === currentActiveId);

            // Build OpenAI-compatible messages array with system prompt
            const nimMessages = [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                // Replay existing history (excluding crisis bubbles)
                ...(activeChat
                    ? activeChat.messages
                        .filter(m => m.type !== 'crisis')
                        .map(m => ({
                            role: m.role === 'ai' ? 'assistant' : 'user',
                            content: m.text,
                        }))
                    : []),
                // Add the new user message
                { role: 'user', content: inputText },
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

        } catch (error) {
            // Log full error details for debugging
            console.error('DeepSeek AI Error:', error?.message || error);
            console.error('Error status:', error?.status);
            console.error('Error response:', error?.response);

            let errorText = "Oh buddy, I'm having a little trouble connecting right now. Please try again in a moment — I'm right here with you.";

            // Surface API-level errors in dev
            if (import.meta.env.DEV && error?.message) {
                console.warn('[DEV] Full error:', JSON.stringify(error, null, 2));
            }

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
        } finally {
            setIsTyping(false);
        }
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
                        <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                        <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Aurexia AI</h2>
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
                                        {/* Red pulsing header banner */}
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
                                        {/* Message body */}
                                        <div style={{ padding: '1.5rem', color: 'white', lineHeight: '1.7', fontSize: '1.1rem', fontWeight: '600' }}>
                                            {msg.text}
                                        </div>
                                        {/* Helpline resources */}
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

                <div style={{
                    padding: '2rem 3rem 3rem',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.2))'
                }}>
                    <form
                        onSubmit={handleSendMessage}
                        className="glass-panel"
                        style={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.8rem 1.2rem',
                            gap: '1rem',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message to your AI wellness partner..."
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
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
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
