import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import mainBg from '../assets/main.webp';
import publicUsersBg from '../assets/publicusers.avif';


const PublicUsers = () => {
    const navigate = useNavigate();
    const [publicUsers, setPublicUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [userActivity, setUserActivity] = useState({
        questions: [],
        replies: [],
        appointments: [],
        classes: []
    });

    useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const filtered = allUsers.filter(u => u.role === 'public');
        setPublicUsers(filtered);
    }, []);

    useEffect(() => {
        if (selectedUser) {
            // Fetch Forum Activity
            const forumData = JSON.parse(localStorage.getItem('aurexia_peer_forum_data') || '[]');
            const userQuestions = forumData.filter(q => q.userEmail === selectedUser.email);
            const userReplies = [];
            forumData.forEach(q => {
                q.replies.forEach(r => {
                    if (r.userEmail === selectedUser.email) {
                        userReplies.push({ ...r, questionTitle: q.question });
                    }
                });
            });

            // Fetch Appointments
            const appts = JSON.parse(localStorage.getItem('appointments') || '[]');
            const userAppts = appts.filter(a => a.userEmail === selectedUser.email);

            // Fetch Classes
            const classes = JSON.parse(localStorage.getItem('booked_classes') || '[]');
            const userClasses = classes.filter(c => c.userEmail === selectedUser.email);

            setUserActivity({
                questions: userQuestions,
                replies: userReplies,
                appointments: userAppts,
                classes: userClasses
            });
        }
    }, [selectedUser]);

    const handleBack = () => {
        navigate('/main4');
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setActiveTab('overview');
    };

    return (
        <div className="app-container" style={{
            background: 'transparent',
            height: 'auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '8rem',
            paddingBottom: '4rem',
            position: 'relative'
        }}>
            {/* Fixed Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${publicUsersBg})`,

                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                zIndex: -1
            }}></div>

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
                Back
            </button>

            <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h1 className="title gradient-text" style={{
                    fontSize: '4rem',
                    fontWeight: '900',
                    margin: 0,
                    letterSpacing: '-1px'
                }}>Public Users Management</h1>
            </header>

            <div className="results-grid" style={{
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '1200px',
                padding: '0 2rem'
            }}>
                {publicUsers.length > 0 ? (
                    publicUsers.map((user, index) => (
                        <div
                            key={index}
                            className={hoveredIndex === index ? "glass-panel" : ""}
                            onClick={() => handleUserClick(user)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                width: '300px',
                                padding: '2rem',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: hoveredIndex === index ? 'rgba(255,255,255,0.15)' : '#ffffff',
                                border: '1px solid',
                                borderColor: hoveredIndex === index ? 'var(--color-blue)' : 'rgba(0,0,0,0.05)',
                                transform: hoveredIndex === index ? 'translateY(-5px)' : 'translateY(0)',
                                boxShadow: hoveredIndex === index ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '15px',
                                    background: 'var(--color-blue)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#fff'
                                }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '1.2rem',
                                        color: hoveredIndex === index ? '#fff' : '#1f2937',
                                        transition: 'color 0.3s ease'
                                    }}>{user.name}</h3>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.9rem',
                                        color: hoveredIndex === index ? 'rgba(255,255,255,0.6)' : '#6b7280',
                                        transition: 'color 0.3s ease'
                                    }}>Public User</p>
                                </div>
                            </div>
                            <p style={{
                                margin: 0,
                                fontSize: '0.95rem',
                                color: hoveredIndex === index ? 'rgba(255,255,255,0.8)' : '#4b5563',
                                wordBreak: 'break-all',
                                textAlign: 'left',
                                transition: 'color 0.3s ease'
                            }}>{user.email}</p>
                        </div>
                    ))
                ) : (
                    <div className="glass-panel" style={{ padding: '3rem', color: '#fff' }}>
                        No public users found.
                    </div>
                )}
            </div>

            {/* User Details Modal - Dashboard View */}
            {showModal && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1.5rem'
                }} onClick={closeModal}>
                    <div
                        className="glass-panel animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '750px',
                            maxHeight: '90vh',
                            padding: '2.5rem',
                            borderRadius: '30px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'rgba(255,255,255,0.6)',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '12px',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
                            {/* Profile Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '2rem' }}>
                                <div style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '24px',
                                    background: 'linear-gradient(135deg, var(--color-blue), #00d2ff)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '2.8rem',
                                    fontWeight: '900',
                                    color: '#fff',
                                    boxShadow: '0 15px 35px rgba(0,102,255,0.25)'
                                }}>
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h2 style={{ fontSize: '2.2rem', color: '#fff', margin: '0 0 0.3rem 0', fontWeight: '800' }}>{selectedUser.name}</h2>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-blue)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            Administrative View
                                        </span>
                                        <span style={{ height: '15px', width: '1px', background: 'rgba(255,255,255,0.2)' }}></span>
                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{selectedUser.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Navigation */}
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                padding: '4px',
                                borderRadius: '15px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {['overview', 'forum', 'appointments', 'classes'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            borderRadius: '12px',
                                            background: activeTab === tab ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                            border: 'none',
                                            color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
                                            cursor: 'pointer',
                                            fontWeight: activeTab === tab ? '700' : '600',
                                            fontSize: '0.9rem',
                                            textTransform: 'capitalize',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                paddingRight: '1rem',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                            }}>
                                {activeTab === 'overview' && (
                                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
                                            <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.5rem 0', fontWeight: '800' }}>Contact Phone</p>
                                                <p style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>{selectedUser.phone || 'Not available'}</p>
                                            </div>
                                            <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.5rem 0', fontWeight: '800' }}>Educational Level</p>
                                                <p style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>{selectedUser.education || 'Not registered'}</p>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.5rem 0', fontWeight: '800' }}>Personal Bio</p>
                                            <p style={{ fontSize: '1rem', color: '#fff', margin: 0, lineHeight: 1.6, fontStyle: selectedUser.bio ? 'normal' : 'italic', opacity: selectedUser.bio ? 1 : 0.5 }}>
                                                {selectedUser.bio || 'User has not provided a biography yet.'}
                                            </p>
                                        </div>
                                        <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.5rem 0', fontWeight: '800' }}>Platform Interaction</p>
                                                <p style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>{selectedUser.loginCount || 0} Successful Logins</p>
                                            </div>
                                            <div style={{ height: '10px', width: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${Math.min((selectedUser.loginCount || 0) * 5, 100)}%`, background: 'var(--color-blue)', borderRadius: '5px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'forum' && (
                                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <section>
                                            <h4 style={{ color: 'var(--color-blue)', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: '800', display: 'flex', justifyContent: 'space-between' }}>
                                                Questions Posted
                                                <span style={{ opacity: 0.5, fontWeight: '400' }}>{userActivity.questions.length} total</span>
                                            </h4>
                                            {userActivity.questions.length > 0 ? userActivity.questions.map(q => (
                                                <div key={q.id} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '18px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                    <p style={{ color: '#fff', fontSize: '1rem', margin: '0 0 0.8rem 0', fontWeight: '600', lineHeight: 1.4 }}>{q.question}</p>
                                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                                            {q.likes} Likes
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                            {q.replies.length} Replies
                                                        </span>
                                                        <span>{q.time}</span>
                                                    </div>
                                                </div>
                                            )) : <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '20px', color: 'rgba(255,255,255,0.3)' }}>No questions published.</div>}
                                        </section>
                                        <section>
                                            <h4 style={{ color: 'var(--color-blue)', marginBottom: '1.2rem', fontSize: '1.1rem', fontWeight: '800', display: 'flex', justifyContent: 'space-between' }}>
                                                Community Participation
                                                <span style={{ opacity: 0.5, fontWeight: '400' }}>{userActivity.replies.length} replies</span>
                                            </h4>
                                            {userActivity.replies.length > 0 ? userActivity.replies.map(r => (
                                                <div key={r.id} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '18px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.6rem', fontWeight: '700', textTransform: 'uppercase' }}>Responding to: {r.questionTitle}</p>
                                                    <p style={{ color: '#fff', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>{r.text}</p>
                                                </div>
                                            )) : <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '20px', color: 'rgba(255,255,255,0.3)' }}>No replies contributed.</div>}
                                        </section>
                                    </div>
                                )}

                                {activeTab === 'appointments' && (
                                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <h4 style={{ color: 'var(--color-blue)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '800' }}>Booking History</h4>
                                        {userActivity.appointments.length > 0 ? userActivity.appointments.map(a => (
                                            <div key={a.id} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <h4 style={{ color: '#fff', margin: '0 0 0.3rem 0', fontSize: '1.05rem', fontWeight: '700' }}>{a.doctorName}</h4>
                                                        <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                                            <span>{a.date}</span>
                                                            <span>{a.timeSlot}</span>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        padding: '6px 14px',
                                                        borderRadius: '10px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        background: a.status === 'cancelled' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                        color: a.status === 'cancelled' ? '#ef4444' : '#10b981',
                                                        border: '1px solid',
                                                        borderColor: a.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                                                    }}>
                                                        {a.status}
                                                    </div>
                                                </div>
                                                {a.status === 'cancelled' && a.cancellationReason && (
                                                    <div style={{
                                                        marginTop: '0.5rem',
                                                        padding: '0.8rem',
                                                        borderRadius: '12px',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                                        color: '#000000',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        <strong>Cancellation Reason:</strong> {a.cancellationReason}
                                                    </div>
                                                )}
                                            </div>
                                        )) : <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '25px', color: 'rgba(255,255,255,0.3)' }}>User has no recorded counsellor appointments.</div>}
                                    </div>
                                )}

                                {activeTab === 'classes' && (
                                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <h4 style={{ color: 'var(--color-blue)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '800' }}>Workshop & Class Registrations</h4>
                                        {userActivity.classes.length > 0 ? userActivity.classes.map(c => (
                                            <div key={c.id} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <h4 style={{ color: '#fff', margin: '0 0 0.2rem 0', fontSize: '1.1rem', fontWeight: '700' }}>{c.title}</h4>
                                                        <p style={{ color: 'var(--color-blue)', fontSize: '0.85rem', margin: 0, fontWeight: '700' }}>{c.instructor}</p>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                                                        <span style={{ color: '#10b981', fontWeight: '800', fontSize: '0.9rem' }}>{c.price}</span>
                                                        {c.status && (
                                                            <span style={{
                                                                fontSize: '0.7rem',
                                                                padding: '4px 8px',
                                                                borderRadius: '6px',
                                                                background: c.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                                                color: c.status === 'cancelled' ? '#ef4444' : '#10b981',
                                                                textTransform: 'uppercase',
                                                                fontWeight: '700'
                                                            }}>
                                                                {c.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                        {c.date}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                        {c.time}
                                                    </span>
                                                </div>
                                                {c.status === 'cancelled' && c.cancellationReason && (
                                                    <div style={{
                                                        marginTop: '0.5rem',
                                                        padding: '0.8rem',
                                                        borderRadius: '12px',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                                        color: '#000000',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        <strong>Cancellation Reason:</strong> {c.cancellationReason}
                                                    </div>
                                                )}
                                            </div>
                                        )) : <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '25px', color: 'rgba(255,255,255,0.3)' }}>User has not registered for any classes or events.</div>}
                                    </div>
                                )}
                            </div>

                            <button
                                className="nav-btn logout-primary-btn"
                                onClick={closeModal}
                                style={{
                                    width: '100%',
                                    marginTop: 'auto',
                                    padding: '1.2rem',
                                    borderRadius: '18px',
                                    fontWeight: '800',
                                    fontSize: '1.1rem',
                                    background: 'var(--color-blue)',
                                    color: '#fff',
                                    border: 'none',
                                    boxShadow: '0 10px 25px rgba(0,102,255,0.2)'
                                }}
                            >
                                Finish Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default PublicUsers;
