import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/main.webp';

const MainPage4 = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = React.useState([]);
    const [showNotifications, setShowNotifications] = React.useState(false);

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User', role: 'public', email: 'guest@aurexia.com' };
    const notificationKey = `notifications_${currentUser.email}`;

    React.useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem(notificationKey) || '[]');
        setNotifications(storedNotifications);
    }, [notificationKey]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, unread: false }));
        setNotifications(updated);
        localStorage.setItem(notificationKey, JSON.stringify(updated));
    };

    const deleteNotification = (e, id) => {
        e.stopPropagation();
        const updated = notifications.filter(n => n.id !== id);
        setNotifications(updated);
        localStorage.setItem(notificationKey, JSON.stringify(updated));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        localStorage.setItem(notificationKey, JSON.stringify([]));
    };

    const toggleNotifications = () => {
        if (!showNotifications) {
            markAllAsRead();
        }
        setShowNotifications(!showNotifications);
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    return (
        <div className="app-container" style={{
            minHeight: '100vh',
            height: 'auto',
            width: '100%',
            background: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            overflow: 'visible',
            position: 'relative',
            paddingBottom: '2rem'
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
                zIndex: -1
            }} />
            <header className="top-panel">
                <div className="brand-section">
                    <img src={logo} alt="Aurexia Logo" className="app-logo-small" />
                    <div className="top-panel-content">
                        <h1 className="title-small gradient-text">Aurexia</h1>
                        <p className="tagline-small">Lightness for the mind</p>
                    </div>
                </div>

                <nav className="top-nav-menu">
                    {/* Management Links */}
                    <button className="nav-text-link" onClick={() => navigate('/public-users')}>Public users</button>
                    <button className="nav-text-link" onClick={() => navigate('/manage-counsellors')}>Counsellors</button>
                    <button className="nav-text-link" onClick={() => navigate('/manage-tutors')}>Tutors</button>
                    <button className="nav-text-link" onClick={() => navigate('/complaints-reports')}>Complaints and Reports</button>

                    {/* Profile Icon */}
                    <button className="icon-only-btn" title="Profile" onClick={() => navigate('/profile')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>

                    {/* Notification Bell */}
                    <div style={{ position: 'relative' }}>
                        <button
                            className="icon-only-btn"
                            title="Notifications"
                            onClick={toggleNotifications}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '10px',
                                    height: '10px',
                                    background: '#ef4444',
                                    borderRadius: '50%',
                                    border: '2px solid white'
                                }}></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="glass-panel animate-fade-in" style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                width: '300px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                marginTop: '1rem',
                                padding: '2rem',
                                zIndex: 100,
                                textAlign: 'left',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Notifications</h3>
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={clearAllNotifications}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {notifications.length === 0 ? (
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No new notifications</p>
                                    ) : (
                                        notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                onClick={() => {
                                                    if (notification.type === 'appointment') {
                                                        navigate('/book-counsellor#my-appointments');
                                                        setShowNotifications(false);
                                                    } else if (notification.type === 'class_booking') {
                                                        navigate('/classes#my-classes');
                                                        setShowNotifications(false);
                                                    } else if (notification.type === 'report') {
                                                        navigate('/complaints-reports');
                                                        setShowNotifications(false);
                                                    }
                                                }}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    fontSize: '0.9rem',
                                                    cursor: (notification.type === 'appointment' || notification.type === 'class_booking') ? 'pointer' : 'default',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (notification.type === 'appointment' || notification.type === 'class_booking') {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                        e.currentTarget.style.borderColor = 'var(--color-blue)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (notification.type === 'appointment' || notification.type === 'class_booking') {
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                    }
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: '600' }}>
                                                        {notification.type === 'appointment' ? 'Appointment Booked!' :
                                                            notification.type === 'class_booking' ? 'Class Join Success!' :
                                                                notification.type === 'report' ? 'New User Report' : 'Notification'}
                                                    </p>
                                                    <button
                                                        onClick={(e) => deleteNotification(e, notification.id)}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'var(--text-secondary)',
                                                            cursor: 'pointer',
                                                            padding: '2px',
                                                            opacity: 0.5,
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#ef4444'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                                    {notification.type === 'class_booking' ? (
                                                        <>Join <strong>{notification.className}</strong> with <strong>{notification.tutorName}</strong> on {notification.date} at {notification.time}.</>
                                                    ) : notification.type === 'report' ? (
                                                        <>{notification.message}</>
                                                    ) : (
                                                        <>Session with <strong>{notification.doctorName}</strong> on {notification.date} at {notification.time}.</>
                                                    )}
                                                </p>
                                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--color-blue)' }}>
                                                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logout Button */}
                    <button className="nav-btn logout-primary-btn" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
                </nav>
            </header>

            <main className="hero-section">
                <div className="glass-panel welcome-card animate-fade-in">
                    <div className="welcome-header">
                        <p className="user-greeting">Welcome Admin, {currentUser.name}</p>
                        <h1 className="welcome-title gradient-text">Welcome to Aurexia</h1>
                    </div>
                    <p className="welcome-text">
                        A peaceful retreat for your mind to find its balance.
                        In this safe harbor, we celebrate your journey toward wellness,
                        offering you the tools to breathe deeply, reflect clearly, and grow beautifully.
                    </p>
                </div>
            </main>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default MainPage4;
