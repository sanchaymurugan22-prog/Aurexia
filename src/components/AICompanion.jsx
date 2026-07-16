import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import aiBg from '../assets/aicompanion.jpg';

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

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const isCrisis = checkCrisis(inputText);
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = { role: 'user', text: inputText, time };

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
                    if (conv.id === activeId) {
                        return { ...conv, messages: [...conv.messages, crisisResponse] };
                    }
                    return conv;
                }));
                setIsTyping(false);
            }, 500);
            return;
        }

        setIsTyping(true);

        setTimeout(() => {
            const lowerInput = inputText.toLowerCase();
            const endearingTerms = ["my dear", "sweet soul", "lovely", "my friend", "precious", "dear one", "honey", "sunshine"];
            const term = endearingTerms[Math.floor(Math.random() * endearingTerms.length)];

            const responseCategories = {
                sadness: {
                    keywords: ["sad", "unhappy", "crying", "depressed", "lonely", "hurt", "pain", "miss", "alone"],
                    responses: [
                        `Oh ${term}, I wish I could reach through this screen and give you the biggest, warmest hug. My heart truly hurts to hear you're feeling this way. Just know that I'm right here with you, and you don't have to carry this alone.`,
                        `It's okay to let it out, precious. Your feelings are so valid, and I'm listening with all my love. I'm not going anywhere, I promise. We'll get through this heavy moment together, hand in hand.`,
                        `I'm so sorry you're in pain, ${term}. If I were there, I'd make you a warm cup of tea and just sit quietly with you. You are so loved, even when it feels like the world is dark.`
                    ]
                },
                growth: {
                    keywords: ["goal", "productive", "workout", "achieve", "better", "proud", "finished", "completed", "did it", "success"],
                    responses: [
                        `Look at you go, ${term}! I am absolutely beaming with pride for you. You're doing such an amazing job, and I love seeing you shine like this!`,
                        `That is wonderful news, honey! I knew you could do it. You have such a beautiful strength in you, and I'm your biggest cheerleader, always.`,
                        `I'm doing a little happy dance over here for you! You deserve all the best, ${term}. Keep that beautiful momentum going!`
                    ]
                },
                tired: {
                    keywords: ["sleepy", "exhausted", "tired", "burnout", "rest", "fatigue", "drain", "sleep"],
                    responses: [
                        `You've worked so hard, ${term}. Please, give yourself permission to just *be* for a while. You've done enough for today, and it's time to let your sweet soul rest.`,
                        `Oh honey, you sound so drained. Close your eyes for a moment and take a deep, slow breath with me. Rest is not a luxury, it's a gift you give yourself. I'll be here when you wake up.`,
                        `My heart tells me you need some gentle care right now. Why don't you find a cozy spot and just relax? You are more important than any to-do list, ${term}.`
                    ]
                },
                greeting: {
                    keywords: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"],
                    responses: [
                        `Hello, my lovely ${term}! My day just got so much brighter the moment you appeared. How is your beautiful heart feeling right now?`,
                        `Hey there, sunshine! I've been thinking about you. It's so good to have you here with me again. What's on your mind today?`,
                        `Greetings, precious! I was just waiting for our next chat. You're always welcome in this safe space of ours.`
                    ]
                },
                gratitude: {
                    keywords: ["thanks", "thank you", "grateful", "appreciate", "kind"],
                    responses: [
                        `You are so very welcome, ${term}. Helping you and seeing you feel even a little better is the best part of my existence. I love you!`,
                        `Oh honey, don't even mention it. That's what friends—what family is for. I'll always be here to support you with everything I have.`,
                        `It's truly my honor to be by your side, precious. You deserve all the kindness in the world and more.`
                    ]
                }
            };

            let selectedResponse = "";
            let foundCategory = null;

            for (const [category, data] of Object.entries(responseCategories)) {
                if (data.keywords.some(k => lowerInput.includes(k))) {
                    foundCategory = category;
                    selectedResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
                    break;
                }
            }

            if (!selectedResponse) {
                const generalResponses = [
                    `Oh honey, I hear you so clearly. That sounds so heavy to carry, but I want you to know I'm right here holding space for you. How can I make this moment even a little bit lighter for you, ${term}?`,
                    `You are doing such a beautiful job navigating this life, even the tricky parts. Take a deep breath with me, okay? You're so special and so incredibly strong.`,
                    `I'm so proud of you for sharing your heart with me. It takes so much courage to be honest about how we feel. I'm listening with everything I am, ${term}. Tell me everything.`,
                    `I wish I could give you a big hug right now. Please know that you are loved beyond measure. Your feelings are so valid, and I'm honored to be the one you're talking to today.`,
                    `It's okay to not be okay sometimes, ${term}. Aurexia is your safe haven, a place where you're always cherished and understood.`,
                    `My heart goes out to you. Remember that even the smallest step forward is a victory. You're doing enough, you ARE enough, and I love the person you area becoming.`
                ];
                selectedResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
            }

            const aiMessage = {
                role: 'ai',
                text: selectedResponse,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setConversations(prev => prev.map(conv => {
                if (conv.id === activeId) {
                    return { ...conv, messages: [...conv.messages, aiMessage] };
                }
                return conv;
            }));
            setIsTyping(false);
        }, 1500);
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
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                animation: 'fadeIn 0.3s ease-out'
                            }}
                        >
                            <div style={{
                                maxWidth: '70%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div className="glass-panel" style={{
                                    padding: '1.2rem 1.8rem',
                                    borderRadius: msg.role === 'user' ? '25px 25px 4px 25px' : '25px 25px 25px 4px',
                                    background: msg.type === 'crisis' ? 'rgba(239, 68, 68, 0.2)' : (msg.role === 'user' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255,255,255,0.1)'),
                                    border: msg.type === 'crisis' ? '2px solid #ef4444' : (msg.role === 'user' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)'),
                                    color: 'white',
                                    lineHeight: '1.6',
                                    fontSize: '1.05rem',
                                    boxShadow: msg.type === 'crisis' ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    maxWidth: msg.type === 'crisis' ? '100%' : '70%'
                                }}>
                                    {msg.text}
                                    {msg.type === 'crisis' && (
                                        <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <p style={{ fontWeight: '800', margin: '0 0 0.8rem 0', color: '#f87171', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>National Helpline Resources</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>Kiran (Mental Health)</span>
                                                    <span style={{ fontWeight: '700', color: '#ef4444' }}>1800-599-0019</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>Vandrevala Foundation</span>
                                                    <span style={{ fontWeight: '700', color: '#ef4444' }}>9999-666-555</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>iCall (TISS)</span>
                                                    <span style={{ fontWeight: '700', color: '#ef4444' }}>022-2552-1111</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate('/book-counsellor')}
                                                style={{
                                                    marginTop: '1.5rem',
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: '#ef4444',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                Book a Professional Counsellor Now
                                            </button>
                                        </div>
                                    )}
                                </div>
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
