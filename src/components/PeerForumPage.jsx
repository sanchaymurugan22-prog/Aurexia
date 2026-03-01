import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/peerforum.jpg';

const PeerForumPage = () => {
    const navigate = useNavigate();
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [newReplyText, setNewReplyText] = useState("");
    const [isAsking, setIsAsking] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState("");
    const [newQuestionTags, setNewQuestionTags] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [isViewingActivity, setIsViewingActivity] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportingItem, setReportingItem] = useState(null); // { id, type, user, userEmail, content }
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User', education: 'Student', email: 'guest@aurexia.com' };

    const initialMockQuestions = [
        {
            id: 1,
            user: "Alex M.",
            role: "Freshman, Computer Science",
            time: "12m ago",
            question: "How do you deal with the constant fear of not being 'good enough' compared to your peers? Imposter syndrome is hitting hard this semester.",
            tags: ["Academics", "Mental Health"],
            likes: 42,
            isLiked: false,
            replies: [
                { id: 101, user: "Dr. Chen", role: "Psychologist", text: "Imposter syndrome is a very real thing in high-pressure environments. Remember that you were selected for this program based on your merit, not luck.", likes: 24, isLiked: false },
                { id: 102, user: "Mark J.", role: "Senior student", text: "I felt exactly like this in my first year. It gets better as you find your niche and build your own projects. Don't compare your 'behind-the-scenes' with everyone else's 'highlight reel'.", likes: 42, isLiked: false }
            ]
        },
        {
            id: 2,
            user: "Sarah K.",
            role: "Junior, Psychology",
            time: "1h ago",
            question: "I feel incredibly lonely even when I'm in a crowded lecture hall. Does the feeling of isolation in university ever truly go away?",
            tags: ["Social", "Loneliness"],
            likes: 89,
            isLiked: false,
            replies: [
                { id: 201, user: "Emma W.", role: "Senior Student", text: "Loneliness in a crowd is the toughest kind. Have you tried joining smaller, hobby-based clubs? That's where I found my true community.", likes: 15, isLiked: false }
            ]
        },
        {
            id: 3,
            user: "David L.",
            role: "Senior, Finance",
            time: "3h ago",
            question: "The job market is terrifying right now. I've had 20 rejections this month. How do you stay motivated to keep applying when everything feels hopeless?",
            tags: ["Career", "Anxiety"],
            likes: 156,
            isLiked: false,
            replies: []
        },
        {
            id: 4,
            user: "Priya R.",
            role: "Sophomore, Arts",
            time: "5h ago",
            question: "I miss home so much it's physically painful. I can't seem to focus on my assignments because I just want to go back. Any tips for homesickness?",
            tags: ["Personal", "Home"],
            likes: 24,
            isLiked: false,
            replies: []
        },
        {
            id: 5,
            user: "James W.",
            role: "Med Student, Year 2",
            time: "8h ago",
            question: "Sleep deprivation is starting to affect my cognitive abilities. Is this normal for med school or am I doing something wrong?",
            tags: ["Health", "Academics"],
            likes: 67,
            isLiked: false,
            replies: []
        },
        {
            id: 6,
            user: "Emma B.",
            role: "Grad Student, Biotech",
            time: "1d ago",
            question: "My relationship with my research advisor has turned toxic. I'm scared to speak up because my degree depends on them. What should I do?",
            tags: ["Career", "Ethics"],
            likes: 210,
            isLiked: false,
            replies: []
        },
        {
            id: 7,
            user: "Ryan G.",
            role: "Freshman, Engineering",
            time: "1d ago",
            question: "I'm only in this major because my parents forced me. I secretly want to be a musician. I feel like I'm living a lie and it's exhausting.",
            tags: ["Personal", "Future"],
            likes: 132,
            isLiked: false,
            replies: []
        },
        {
            id: 8,
            user: "Chloe T.",
            role: "Junior, Architecture",
            time: "2d ago",
            question: "Does anyone else spend hours in the studio just pretending to work because they're too overwhelmed to actually start?",
            tags: ["Productivity", "Anxiety"],
            likes: 95,
            isLiked: false,
            replies: []
        },
        {
            id: 9,
            user: "Mark S.",
            role: "Sophomore, Sports Science",
            time: "2d ago",
            question: "I'm always the one listening to my friends' problems, but I feel like no one ever listens to mine. How do you set boundaries without losing friends?",
            tags: ["Social", "Relationships"],
            likes: 54,
            isLiked: false,
            replies: []
        },
        {
            id: 10,
            user: "Lily H.",
            role: "Senior, Literature",
            time: "3d ago",
            question: "I'm terrified of graduating and losing the structured life of a student. What does 'real life' even look like after university?",
            tags: ["Future", "Anxiety"],
            likes: 178,
            isLiked: false,
            replies: []
        },
        {
            id: 11,
            user: "Daniel P.",
            role: "Freshman, Physics",
            time: "4d ago",
            question: "Everyone seems to have their life figured out already. Am I the only one who still doesn't know what they want to do?",
            tags: ["Future", "Mental Health"],
            likes: 45,
            isLiked: false,
            replies: []
        },
        {
            id: 12,
            user: "Sophie M.",
            role: "Junior, Biology",
            time: "4d ago",
            question: "How do you maintain a long-distance relationship while in university? It's getting really hard to balance everything.",
            tags: ["Relationships", "Social"],
            likes: 82,
            isLiked: false,
            replies: []
        },
        {
            id: 13,
            user: "Kevin T.",
            role: "Sophomore, CS",
            time: "5d ago",
            question: "I spend more time debugging my code than actually writing it. Is this what being a dev is like?",
            tags: ["Academics", "Career"],
            likes: 210,
            isLiked: false,
            replies: []
        },
        {
            id: 14,
            user: "Rachel G.",
            role: "Senior, Art History",
            time: "5d ago",
            question: "The libraries are always full and I can't find a quiet place to study. Any secret spots on campus?",
            tags: ["Academics", "Student Life"],
            likes: 34,
            isLiked: false,
            replies: []
        },
        {
            id: 15,
            user: "Chris L.",
            role: "Med Student",
            time: "6d ago",
            question: "I haven't slept more than 4 hours a night this week. How do you stay focused during 3-hour lectures?",
            tags: ["Health", "Academics"],
            likes: 156,
            isLiked: false,
            replies: []
        },
        {
            id: 16,
            user: "Aisha B.",
            role: "Graduate, Econ",
            time: "6d ago",
            question: "I finally landed my first job after 50 applications! Don't give up, everyone. It takes time but you'll get there.",
            tags: ["Career", "Success"],
            likes: 432,
            isLiked: false,
            replies: []
        },
        {
            id: 17,
            user: "Nicolas F.",
            role: "Freshman, Design",
            time: "1w ago",
            question: "My laptop just died right before finals. Does anyone know if the IT desk lends out replacements?",
            tags: ["Academics", "Student Life"],
            likes: 67,
            isLiked: false,
            replies: []
        },
        {
            id: 18,
            user: "Maya S.",
            role: "Junior, Comm",
            time: "1w ago",
            question: "Feeling the burnout already. How do you take a break without feeling guilty about not studying?",
            tags: ["Mental Health", "Productivity"],
            likes: 289,
            isLiked: false,
            replies: []
        },
        {
            id: 19,
            user: "Tom R.",
            role: "Senior, Eng",
            time: "1w ago",
            question: "I'm struggling with the math in my advanced fluids class. Anyone want to start a study group?",
            tags: ["Academics", "Social"],
            likes: 54,
            isLiked: false,
            replies: []
        },
        {
            id: 20,
            user: "Grace L.",
            role: "Sophomore, Psych",
            time: "2w ago",
            question: "I'm thinking about changing my major but I'm afraid I've already wasted too much time. Is it ever too late?",
            tags: ["Future", "Personal"],
            likes: 121,
            isLiked: false,
            replies: []
        }
    ];

    // Initial questions state from localStorage
    const [questions, setQuestions] = useState(() => {
        const saved = localStorage.getItem('aurexia_peer_forum_data');
        return saved ? JSON.parse(saved) : initialMockQuestions;
    });

    React.useEffect(() => {
        localStorage.setItem('aurexia_peer_forum_data', JSON.stringify(questions));
    }, [questions]);

    const handleBack = () => {
        if (isAsking) {
            setIsAsking(false);
            setNewQuestionText("");
            setNewQuestionTags("");
        } else if (isViewingActivity) {
            setIsViewingActivity(false);
        } else if (selectedQuestionId !== null) {
            setSelectedQuestionId(null);
        } else {
            navigate(-1);
        }
    };

    const handlePostQuestion = () => {
        if (!newQuestionText.trim()) return;

        const newQuestion = {
            id: Date.now(),
            user: currentUser.name || "You",
            role: currentUser.education || "Student",
            userEmail: currentUser.email,
            time: "Just now",
            question: newQuestionText,
            tags: newQuestionTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
            likes: 0,
            isLiked: false,
            replies: []
        };

        setQuestions([newQuestion, ...questions]);
        setIsAsking(false);
        setNewQuestionText("");
        setNewQuestionTags("");
    };

    const handleAddReply = (questionId) => {
        if (!newReplyText.trim()) return;

        const newReply = {
            id: Date.now(),
            user: currentUser.name || "You",
            role: currentUser.education || "Student",
            userEmail: currentUser.email,
            text: newReplyText,
            likes: 0,
            isLiked: false
        };

        setQuestions(prevQuestions => prevQuestions.map(q => {
            if (q.id === questionId) {
                return { ...q, replies: [...q.replies, newReply] };
            }
            return q;
        }));

        setNewReplyText("");
    };

    const handleLikeQuestion = (questionId) => {
        setQuestions(prevQuestions => prevQuestions.map(q => {
            if (q.id === questionId) {
                const becomingLiked = !q.isLiked;
                return {
                    ...q,
                    isLiked: becomingLiked,
                    likes: becomingLiked ? q.likes + 1 : q.likes - 1
                };
            }
            return q;
        }));
    };

    const handleLikeReply = (questionId, replyId) => {
        setQuestions(prevQuestions => prevQuestions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    replies: q.replies.map(r => {
                        if (r.id === replyId) {
                            const becomingLiked = !r.isLiked;
                            return {
                                ...r,
                                isLiked: becomingLiked,
                                likes: becomingLiked ? r.likes + 1 : r.likes - 1
                            };
                        }
                        return r;
                    })
                };
            }
            return q;
        }));
    };

    const handleDeleteReply = (questionId, replyId) => {
        setQuestions(prevQuestions => prevQuestions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    replies: q.replies.filter(r => r.id !== replyId)
                };
            }
            return q;
        }));
    };

    const handleDeleteQuestion = (questionId) => {
        setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
        if (selectedQuestionId === questionId) {
            setSelectedQuestionId(null);
        }
    };

    const handleReportClick = (item, type, content) => {
        setReportingItem({
            id: item.id,
            type: type,
            user: item.user,
            userEmail: item.userEmail || 'unknown@example.com', // Fallback if email missing in mock data
            content: content
        });
        setShowReportModal(true);
    };

    const handleSubmitReport = () => {
        if (!reportReason.trim()) return;

        const newReport = {
            id: Date.now(),
            reporter: currentUser.name,
            reporterEmail: currentUser.email,
            reportedUser: reportingItem.user,
            reportedUserEmail: reportingItem.userEmail,
            type: 'Inappropriate Content', // Generic type, could be dynamic
            reason: reportReason,
            targetId: reportingItem.id,
            targetType: reportingItem.type,
            message: reportReason, // Using reason as message for consistency with Admin view
            contentSnapshot: reportingItem.content,
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        };

        // Save to aurexia_reports
        const existingReports = JSON.parse(localStorage.getItem('aurexia_reports') || '[]');
        localStorage.setItem('aurexia_reports', JSON.stringify([...existingReports, newReport]));

        // Add notification to reporter
        const notifications = JSON.parse(localStorage.getItem('aurexia_notifications') || '[]');
        notifications.push({
            id: Date.now(),
            userEmail: currentUser.email,
            message: `Your report against ${reportingItem.user} has been submitted to the admin. We will review it shortly.`,
            date: new Date().toISOString().split('T')[0],
            read: false
        });
        localStorage.setItem('aurexia_notifications', JSON.stringify(notifications));

        // Add notification to ADMIN
        const adminEmail = 'admin@aurexia.com';
        const adminNotificationKey = `notifications_${adminEmail}`;
        const adminNotifications = JSON.parse(localStorage.getItem(adminNotificationKey) || '[]');
        adminNotifications.push({
            id: Date.now() + 1, // Ensure unique ID
            type: 'report',
            message: `New Report: ${reportingItem.user} was reported by ${currentUser.name}.`,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            unread: true
        });
        localStorage.setItem(adminNotificationKey, JSON.stringify(adminNotifications));

        alert("Reporting reported to admin, we will get back to you soon!");
        setShowReportModal(false);
        setReportReason("");
        setReportingItem(null);
    };

    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    return (
        <div className="app-container" style={{
            background: 'transparent',
            height: 'auto',
            minHeight: 'auto',
            overflow: 'visible',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        }}>
            {/* Fixed Background Layer */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${mainBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                zIndex: -1
            }}></div>

            {/* Background elements moved to fixed position to prevent scroll expanding */}
            <div className="glow-orb orb-1" style={{ position: 'fixed' }}></div>
            <div className="glow-orb orb-2" style={{ position: 'fixed' }}></div>

            {/* Back Button */}
            <button className="nav-btn" onClick={handleBack} style={{
                position: 'fixed',
                top: '2rem',
                left: '2rem',
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                {isAsking ? "Cancel" : (selectedQuestionId || isViewingActivity) ? "Back to Forum" : "Back"}
            </button>

            <main style={{
                width: '100%',
                maxWidth: '900px',
                margin: '0 auto',
                padding: '2.5rem 2rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem',
                position: 'relative',
                zIndex: 5
            }}>
                {isAsking ? (
                    <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem' }}>Ask the Peer Community</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Your Question</label>
                                    <textarea
                                        value={newQuestionText}
                                        onChange={(e) => setNewQuestionText(e.target.value)}
                                        placeholder="What's on your mind? Share your thoughts, struggles, or questions..."
                                        style={{
                                            width: '100%',
                                            minHeight: '150px',
                                            background: 'rgba(255,255,255,0.9)',
                                            border: '2px solid var(--color-blue)',
                                            borderRadius: '16px',
                                            padding: '1.2rem',
                                            color: 'black',
                                            fontSize: '1.1rem',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s ease',
                                            boxSizing: 'border-box'
                                        }}
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Related Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newQuestionTags}
                                        onChange={(e) => setNewQuestionTags(e.target.value)}
                                        placeholder="e.g. Mental Health, Academics, Social"
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.9)',
                                            border: '2px solid var(--color-blue)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            color: 'black',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s ease',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={handlePostQuestion}
                                        className="nav-btn logout-primary-btn"
                                        style={{ padding: '1rem 2.5rem', flex: 1, fontSize: '1.1rem' }}
                                    >
                                        Post Question
                                    </button>
                                    <button
                                        onClick={() => setIsAsking(false)}
                                        className="nav-btn"
                                        style={{
                                            padding: '1rem 2rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (!isViewingActivity && !selectedQuestionId) ? (
                    <>
                        <div>
                            <h1 className="gradient-text animate-fade-in" style={{
                                fontSize: '5rem',
                                fontWeight: '900',
                                textAlign: 'center',
                                marginBottom: '1rem',
                                letterSpacing: '-2px'
                            }}>Peer forum</h1>

                            <p className="animate-fade-in" style={{
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: '1.25rem',
                                marginBottom: '2rem',
                                animationDelay: '0.1s'
                            }}>
                                A safe space for students to share, support, and grow together.
                            </p>

                            <div className="animate-fade-in" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1.5rem',
                                marginBottom: '3rem',
                                animationDelay: '0.2s'
                            }}>
                                <button
                                    onClick={() => setIsAsking(true)}
                                    className="nav-btn logout-primary-btn"
                                    style={{
                                        padding: '1.2rem 3rem',
                                        fontSize: '1.2rem',
                                        fontWeight: '800',
                                        borderRadius: '50px',
                                        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                                        transform: 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}>
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Ask a question
                                </button>
                                <button
                                    onClick={() => {
                                        setIsViewingActivity(true);
                                        setSelectedQuestionId(null);
                                        setIsAsking(false);
                                    }}
                                    className="nav-btn logout-primary-btn"
                                    style={{
                                        padding: '1.2rem 2.5rem',
                                        fontSize: '1.1rem',
                                        fontWeight: '800',
                                        borderRadius: '50px',
                                        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                                        transform: 'scale(1)',
                                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    My Questions & Replies
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                            {questions.slice(0, visibleCount).map((item, index) => (
                                <div key={item.id} className="glass-panel animate-fade-in" style={{
                                    padding: '2rem',
                                    textAlign: 'left',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    animationDelay: `${0.1 + (index % 10) * 0.05}s`,
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.user}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.role} • {item.time}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {item.tags.map((tag, i) => (
                                                <span key={i} style={{
                                                    fontSize: '0.7rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    padding: '4px 10px',
                                                    borderRadius: '50px',
                                                    color: 'var(--color-blue)',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.6', margin: '0.5rem 0' }}>
                                        {item.question}
                                    </p>

                                    <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLikeQuestion(item.id);
                                            }}
                                            style={{
                                                background: item.isLiked ? 'rgba(59, 130, 246, 0.2)' : 'none',
                                                border: item.isLiked ? '1px solid var(--color-blue)' : 'none',
                                                color: item.isLiked ? 'var(--color-blue)' : 'var(--text-secondary)',
                                                borderRadius: '50px',
                                                padding: item.isLiked ? '4px 12px' : '4px 0',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease',
                                                fontWeight: item.isLiked ? '700' : '400'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={item.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2.83a2 2 0 0 0 1.74-1c.38-.66.75-1.32 1.12-1.98a4 4 0 0 1 4.54-1.93 4 4 0 0 1 2.76 2.79z" /></svg>
                                            {item.likes}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReportClick(item, 'question', item.question);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            title="Report Abuse"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedQuestionId(item.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--color-blue)',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            Reply
                                        </button>
                                        <button
                                            onClick={() => setSelectedQuestionId(item.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-secondary)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {item.replies.length} replies
                                        </button>
                                        {(item.userEmail === currentUser.email || item.user === "You") && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm("Are you sure you want to delete this question?")) {
                                                        handleDeleteQuestion(item.id);
                                                    }
                                                }}
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    borderRadius: '50px',
                                                    padding: '4px 12px',
                                                    color: '#ef4444',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s ease',
                                                    marginLeft: 'auto'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {visibleCount < questions.length && (
                            <div className="animate-fade-in" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '1rem',
                                animationDelay: '0.2s'
                            }}>
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 10)}
                                    className="nav-btn"
                                    style={{
                                        padding: '1rem 3rem',
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        borderRadius: '50px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    View more
                                </button>
                            </div>
                        )}
                    </>
                ) : isViewingActivity ? (
                    <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <h2 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem' }}>My Activity</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Track your contributions to the community</p>
                        </div>

                        {/* My Questions Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div style={{ borderLeft: '4px solid var(--color-blue)', paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>Questions You've Asked</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Full details of your community contributions</p>
                            </div>

                            {questions.filter(q => q.userEmail === currentUser.email).length > 0 ? (
                                questions.filter(q => q.userEmail === currentUser.email).map((item, index) => (
                                    <div key={item.id} className="glass-panel" style={{ padding: '2.5rem', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Posted on {item.time}</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {item.tags.map((tag, i) => (
                                                    <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '6px 14px', borderRadius: '50px', color: 'var(--color-blue)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <p style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700', lineHeight: '1.5', marginBottom: '1.5rem' }}>{item.question}</p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', paddingBottom: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>{item.likes}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>{item.replies.length} Replies</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button onClick={() => { setIsViewingActivity(false); setSelectedQuestionId(item.id); }} style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '8px 20px', borderRadius: '50px', color: 'var(--color-blue)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.3s ease' }}>View Full Thread</button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this question?")) {
                                                            handleDeleteQuestion(item.id);
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                                        borderRadius: '50px',
                                                        padding: '8px 16px',
                                                        color: '#ef4444',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                                    <p style={{ fontSize: '1.2rem' }}>You haven't asked any questions yet.</p>
                                </div>
                            )}
                        </div>

                        {/* My Replies Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1.5rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: '800' }}>Replies You've Posted</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Your helpful contributions to other discussions</p>
                            </div>

                            {(function () {
                                const userReplies = [];
                                questions.forEach(q => {
                                    // Only include replies to OTHER people's questions to satisfy the "not anything else" requirement
                                    if (q.userEmail !== currentUser.email) {
                                        q.replies.forEach(r => {
                                            if (r.userEmail === currentUser.email) {
                                                userReplies.push({ question: q, reply: r });
                                            }
                                        });
                                    }
                                });

                                return userReplies.length > 0 ? (
                                    userReplies.map((item, index) => (
                                        <div key={item.reply.id} className="glass-panel" style={{ padding: '2rem', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                            <div style={{ marginBottom: '1.5rem', borderLeft: '3px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Replying to {item.question.user}'s question:</p>
                                                <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontStyle: 'italic', fontWeight: '500' }}>"{item.question.question}"</p>
                                            </div>
                                            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                                <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: '1.6', margin: 0 }}>{item.reply.text}</p>
                                            </div>
                                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.reply.likes} Likes received</span>
                                                    <button
                                                        onClick={() => { setIsViewingActivity(false); setSelectedQuestionId(item.question.id); }}
                                                        style={{ background: 'none', border: 'none', color: 'var(--color-blue)', cursor: 'pointer', fontWeight: '700' }}
                                                    >
                                                        View Full Thread
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this reply?")) {
                                                            handleDeleteReply(item.question.id, item.reply.id);
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                                        borderRadius: '50px',
                                                        padding: '5px 12px',
                                                        color: '#ef4444',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                                        <p style={{ fontSize: '1.2rem' }}>You haven't replied to any questions yet.</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Original Question in Thread */}
                        <div className="glass-panel" style={{ padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedQuestion.user}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedQuestion.role} • {selectedQuestion.time}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <button
                                        onClick={() => handleLikeQuestion(selectedQuestion.id)}
                                        style={{
                                            background: selectedQuestion.isLiked ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                            border: `1px solid ${selectedQuestion.isLiked ? 'var(--color-blue)' : 'rgba(255,255,255,0.1)'}`,
                                            borderRadius: '50px',
                                            padding: '8px 16px',
                                            color: selectedQuestion.isLiked ? 'var(--color-blue)' : 'var(--text-primary)',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s ease',
                                            fontWeight: '700'
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={selectedQuestion.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2.83a2 2 0 0 0 1.74-1c.38-.66.75-1.32 1.12-1.98a4 4 0 0 1 4.54-1.93 4 4 0 0 1 2.76 2.79z" /></svg>
                                        {selectedQuestion.likes}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReportClick(selectedQuestion, 'question', selectedQuestion.question);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        title="Report Abuse"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                                        Report
                                    </button>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.4rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                {selectedQuestion.question}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {selectedQuestion.tags.map((tag, i) => (
                                        <span key={i} style={{
                                            fontSize: '0.8rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            padding: '5px 12px',
                                            borderRadius: '50px',
                                            color: 'var(--color-blue)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>{tag}</span>
                                    ))}
                                </div>
                                {(selectedQuestion.userEmail === currentUser.email || selectedQuestion.user === "You") && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this question?")) {
                                                handleDeleteQuestion(selectedQuestion.id);
                                            }
                                        }}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '50px',
                                            padding: '6px 16px',
                                            color: '#ef4444',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s ease',
                                            fontWeight: '600'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        Delete Question
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Add Reply Section */}
                        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>Add your reply</h3>
                            <textarea
                                key={`reply-${selectedQuestion.id}`}
                                value={newReplyText}
                                onChange={(e) => setNewReplyText(e.target.value)}
                                placeholder="Write your supportive reply..."
                                autoFocus
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    background: '#ffffff',
                                    border: '2px solid var(--color-blue)',
                                    borderRadius: '12px',
                                    padding: '1.2rem',
                                    color: 'black',
                                    fontSize: '1.1rem',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    zIndex: 10,
                                    cursor: 'text',
                                    boxSizing: 'border-box'
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => handleAddReply(selectedQuestion.id)}
                                    className="nav-btn logout-primary-btn"
                                    style={{ padding: '0.75rem 2rem' }}
                                >
                                    Post Reply
                                </button>
                            </div>
                        </div>

                        {/* Replies List (Sorted by Likes) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                {selectedQuestion.replies.length} Replies
                            </h3>
                            {[...selectedQuestion.replies]
                                .sort((a, b) => b.likes - a.likes)
                                .map((reply, idx) => (
                                    <div key={reply.id} className="glass-panel animate-fade-in" style={{
                                        padding: '1.5rem',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        animationDelay: `${idx * 0.1}s`
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{reply.user}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{reply.role}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => handleLikeReply(selectedQuestion.id, reply.id)}
                                                    style={{
                                                        background: reply.isLiked ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                                        border: `1px solid ${reply.isLiked ? 'var(--color-blue)' : 'rgba(255,255,255,0.1)'}`,
                                                        borderRadius: '50px',
                                                        padding: '5px 12px',
                                                        color: reply.isLiked ? 'var(--color-blue)' : 'var(--text-primary)',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        transition: 'all 0.2s ease',
                                                        fontWeight: reply.isLiked ? '700' : '500'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = reply.isLiked ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.1)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = reply.isLiked ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)'}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={reply.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2.83a2 2 0 0 0 1.74-1c.38-.66.75-1.32 1.12-1.98a4 4 0 0 1 4.54-1.93 4 4 0 0 1 2.76 2.79z" /></svg>
                                                    {reply.likes}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleReportClick(reply, 'reply', reply.text);
                                                    }}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'var(--text-secondary)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    title="Report Abuse"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                                                </button>

                                                {(reply.user === "You" || reply.userEmail === currentUser.email) && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this reply?")) {
                                                                handleDeleteReply(selectedQuestion.id, reply.id);
                                                            }
                                                        }}
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                                            borderRadius: '50px',
                                                            padding: '5px 12px',
                                                            color: '#ef4444',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                        title="Delete reply"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6' }}>
                                            {reply.text}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}
            </main>

            {/* Report Modal */}
            {showReportModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000
                }} onClick={() => setShowReportModal(false)}>
                    <div
                        className="glass-panel animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            padding: '2rem',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Report User</h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                            You are reporting <strong>{reportingItem?.user}</strong>. Please explain why you are submitting this report.
                        </p>

                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Please provide a clear explanation..."
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '10px',
                                padding: '1rem',
                                color: 'white',
                                marginBottom: '1.5rem',
                                resize: 'vertical'
                            }}
                        />

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowReportModal(false)}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    background: '#ef4444',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerForumPage;
