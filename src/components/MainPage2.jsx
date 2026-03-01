import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/main.webp';

const MainPage2 = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = React.useState([]);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showAppointments, setShowAppointments] = React.useState(false);
    const [appointments, setAppointments] = React.useState([]);
    const [showCancelModal, setShowCancelModal] = React.useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = React.useState(null);
    const [cancellationReason, setCancellationReason] = React.useState('');

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User', role: 'public', email: 'guest@aurexia.com' };
    const notificationKey = `notifications_${currentUser.email}`;

    React.useEffect(() => {
        const storedNotifications = JSON.parse(localStorage.getItem(notificationKey) || '[]');
        setNotifications(storedNotifications);

        const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const doctorAppointments = allAppointments.filter(a => a.doctorEmail === currentUser.email);
        setAppointments(doctorAppointments);
    }, [notificationKey, currentUser.email]);

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

    const handleCancelClick = (apt) => {
        setAppointmentToCancel(apt);
        setShowCancelModal(true);
    };

    const confirmCancellation = () => {
        if (!cancellationReason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }

        const all = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAll = all.map(a => {
            if (a.id === appointmentToCancel.id) {
                return {
                    ...a,
                    status: 'cancelled',
                    cancelledBy: 'doctor',
                    cancellationReason: cancellationReason,
                    cancelledAt: new Date().toISOString()
                };
            }
            return a;
        });

        localStorage.setItem('appointments', JSON.stringify(updatedAll));
        setAppointments(updatedAll.filter(a => a.doctorEmail === currentUser.email));

        // Notify User
        const userNotification = {
            id: Date.now(),
            type: 'appointment_cancelled_by_doctor',
            doctorName: currentUser.name,
            patientName: appointmentToCancel.patientName,
            date: appointmentToCancel.date,
            time: appointmentToCancel.timeSlot,
            reason: cancellationReason,
            timestamp: new Date().toISOString(),
            unread: true,
            message: `Your appointment with Dr. ${currentUser.name} has been cancelled.`
        };

        const userKey = `notifications_${appointmentToCancel.userEmail}`;
        const existingUserNotifs = JSON.parse(localStorage.getItem(userKey) || '[]');
        localStorage.setItem(userKey, JSON.stringify([userNotification, ...existingUserNotifs]));

        setShowCancelModal(false);
        setAppointmentToCancel(null);
        setCancellationReason('');
    };

    const deleteCancelledAppointments = () => {
        if (!window.confirm("Are you sure you want to delete ALL cancelled appointments? This cannot be undone.")) return;

        const all = JSON.parse(localStorage.getItem('appointments') || '[]');
        // Keep appointments that are either NOT for this doctor OR are NOT cancelled
        const updatedAll = all.filter(a => a.doctorEmail !== currentUser.email || a.status !== 'cancelled');

        localStorage.setItem('appointments', JSON.stringify(updatedAll));
        setAppointments(updatedAll.filter(a => a.doctorEmail === currentUser.email));
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    return (
        <div className="app-container" style={{
            backgroundImage: `url(${mainBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingBottom: '2rem'
        }}>
            {!showAppointments && (
                <header className="top-panel">
                    <div className="brand-section">
                        <img src={logo} alt="Aurexia Logo" className="app-logo-small" />
                        <div className="top-panel-content">
                            <h1 className="title-small gradient-text">Aurexia</h1>
                            <p className="tagline-small">Lightness for the mind</p>
                        </div>
                    </div>

                    <nav className="top-nav-menu">
                        {/* Feature Links (Ordered Left to Right) */}
                        <button className="nav-text-link" onClick={() => navigate('/about')}>About</button>
                        <button className="nav-text-link" onClick={() => navigate('/ai-companion')}>AI Companion</button>
                        <button className="nav-text-link" onClick={() => navigate('/peer-forum')}>Peer Forum</button>
                        <button className="nav-text-link" onClick={() => { setShowAppointments(true); setShowNotifications(false); }}>Appointments</button>
                        <button className="nav-text-link" onClick={() => navigate('/videos')}>Videos</button>
                        <button className="nav-text-link" onClick={() => navigate('/books')}>Library of Wisdom</button>
                        <button className="nav-text-link" onClick={() => navigate('/classes')}>Classes & Events</button>


                        {/* Profile Icon */}
                        <button className="icon-only-btn" title="Profile" onClick={() => navigate('/profile2')}>

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
                                                        } else if (notification.type === 'class_booking' || notification.type === 'class_removal' || notification.type === 'event_cancelled') {
                                                            navigate('/classes#my-classes');
                                                            setShowNotifications(false);
                                                        } else if (notification.type === 'new_booking' || notification.type === 'appointment_cancelled') {
                                                            setShowAppointments(true);
                                                            setShowNotifications(false);
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        background: 'rgba(255,255,255,0.05)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        fontSize: '0.9rem',
                                                        cursor: (notification.type === 'appointment' || notification.type === 'class_booking' || notification.type === 'new_booking' || notification.type === 'appointment_cancelled' || notification.type === 'class_removal' || notification.type === 'event_cancelled') ? 'pointer' : 'default',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (notification.type === 'appointment' || notification.type === 'class_booking' || notification.type === 'new_booking' || notification.type === 'appointment_cancelled' || notification.type === 'class_removal' || notification.type === 'event_cancelled') {
                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                            e.currentTarget.style.borderColor = 'var(--color-blue)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (notification.type === 'appointment' || notification.type === 'class_booking' || notification.type === 'new_booking' || notification.type === 'appointment_cancelled' || notification.type === 'class_removal' || notification.type === 'event_cancelled') {
                                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                        }
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: '600' }}>
                                                            {notification.type === 'appointment' ? 'Appointment Booked!' :
                                                                notification.type === 'class_booking' ? 'Class Join Success!' :
                                                                    notification.type === 'class_removal' ? 'Class Spot Removed' :
                                                                        notification.type === 'event_cancelled' ? 'Event Cancelled' :
                                                                            notification.type === 'new_booking' ? 'New Session Request!' :
                                                                                notification.type === 'appointment_cancelled' ? 'Appointment Cancelled' : 'Notification'}
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
                                                        ) : notification.type === 'class_removal' ? (
                                                            <>You have been removed from <strong>{notification.className}</strong> by <strong>{notification.tutorName}</strong>. Reason: {notification.reason}</>
                                                        ) : notification.type === 'event_cancelled' ? (
                                                            <>The event <strong>{notification.className}</strong> has been cancelled by <strong>{notification.tutorName}</strong>. Reason: {notification.reason}</>
                                                        ) : notification.type === 'new_booking' ? (
                                                            <><strong>{notification.patientName}</strong> booked a session for {notification.date} at {notification.time}.</>
                                                        ) : notification.type === 'appointment_cancelled' ? (
                                                            <><strong>{notification.cancelledBy}</strong> cancelled the session for {notification.date}. Reason: {notification.reason}</>
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
            )}


            <main className="hero-section" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 0 }}>
                {!showAppointments ? (
                    <div className="glass-panel welcome-card animate-fade-in">
                        <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p className="user-greeting">Welcome doctor, {currentUser.name}</p>
                                <h1 className="welcome-title gradient-text">Welcome to Aurexia</h1>
                                {(currentUser.hospital || currentUser.experience) && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        marginTop: '0.8rem',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        fontWeight: '500',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center'
                                    }}>
                                        {currentUser.hospital && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                                                {currentUser.hospital}
                                            </div>
                                        )}
                                        {currentUser.experience && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                                {currentUser.experience} Exp.
                                            </div>
                                        )}
                                        {(currentUser.city || currentUser.state || currentUser.country) && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                {[currentUser.city, currentUser.state, currentUser.country].filter(Boolean).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="welcome-text">
                            A peaceful retreat for your mind to find its balance.
                            In this safe harbor, we celebrate your journey toward wellness,
                            offering you the tools to breathe deeply, reflect clearly, and grow beautifully.
                        </p>
                        <button
                            className="cta-button"
                            style={{ marginTop: '2rem' }}
                            onClick={() => setShowAppointments(true)}
                        >
                            View Active Appointments
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className="nav-btn"
                            onClick={() => setShowAppointments(false)}
                            style={{
                                position: 'fixed',
                                top: '1.25rem',
                                left: '1.5rem',
                                zIndex: 1000,
                                padding: '0.8rem 1.2rem',
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: 'black'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            <span style={{ fontWeight: '700' }}>Back</span>
                        </button>

                        <div className="glass-panel welcome-card animate-fade-in" style={{ padding: '3rem 3rem 1rem 3rem', maxWidth: '1000px', marginTop: '4rem', marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0 }}>Dr. {currentUser.name}'s Appointments</h1>
                                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Manage your booked sessions and patient details</p>
                                </div>
                            </div>




                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Active Appointments */}
                                <div>
                                    <h2 style={{ color: 'white', fontSize: '1.8rem', textAlign: 'left', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-green)' }}></span>
                                        Active Appointments
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {appointments.filter(a => a.status !== 'cancelled').length === 0 ? (
                                            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' }}>
                                                <p style={{ color: 'var(--text-secondary)' }}>No active appointments.</p>
                                            </div>
                                        ) : (
                                            appointments.filter(a => a.status !== 'cancelled').map(app => (
                                                <div key={app.id} style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '20px',
                                                    padding: '1.5rem 2rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: '1.5rem'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                                        <div style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '50%',
                                                            background: 'var(--color-blue)',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            fontSize: '1.5rem',
                                                            fontWeight: 'bold',
                                                            color: 'white'
                                                        }}>
                                                            {app.patientName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>{app.patientName}</h3>
                                                            <p style={{ margin: '0.2rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                                Age: {app.age} | {app.phoneNumber}
                                                            </p>
                                                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                                                Booked by: {app.userName}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', color: 'var(--color-blue)', fontWeight: '700', fontSize: '0.9rem' }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                                {app.date}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', color: 'var(--color-green)', fontWeight: '700', fontSize: '0.9rem' }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                                {app.timeSlot}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleCancelClick(app)}
                                                            style={{
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                                color: '#ef4444',
                                                                padding: '0.6rem 1.2rem',
                                                                borderRadius: '12px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: '700',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                                                            onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Cancelled Appointments */}
                                {appointments.filter(a => a.status === 'cancelled').length > 0 && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h2 style={{ color: 'white', fontSize: '1.8rem', textAlign: 'left', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                                                Cancelled Appointments
                                            </h2>
                                            <button
                                                onClick={deleteCancelledAppointments}
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                                    color: '#ef4444',
                                                    padding: '0.6rem 1.2rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                Delete All Cancelled
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {appointments.filter(a => a.status === 'cancelled').map(app => (
                                                <div key={app.id} style={{
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    borderRadius: '20px',
                                                    padding: '1.5rem 2rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: '1.5rem',
                                                    opacity: 0.8
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
                                                        <div style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            borderRadius: '50%',
                                                            background: 'rgba(239, 68, 68, 0.2)',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            fontSize: '1.5rem',
                                                            fontWeight: 'bold',
                                                            color: '#ef4444'
                                                        }}>
                                                            {app.patientName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>{app.patientName}</h3>
                                                            <p style={{ margin: '0.2rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                                Cancelled by {app.cancelledBy === 'doctor' ? 'You' : 'User'}
                                                            </p>
                                                            <div style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                                                <p style={{ margin: 0, color: 'white', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                                                    " {app.cancellationReason} "
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                                            Scheduled: {app.date} | {app.timeSlot}
                                                        </div>
                                                        <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                            Cancelled on {new Date(app.cancelledAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>


            {/* Cancellation Reason Modal */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2.5rem',
                        position: 'relative'
                    }}>
                        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: 0 }}>Cancel Appointment</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'left' }}>
                            Please provide a reason for cancelling the appointment with <strong>{appointmentToCancel?.patientName}</strong>.
                        </p>

                        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600' }}>Reason for Cancellation</label>
                            <textarea
                                className="glass-input"
                                placeholder="Enter reason here..."
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    padding: '1rem',
                                    resize: 'none',
                                    borderRadius: '16px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                className="nav-btn"
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setAppointmentToCancel(null);
                                    setCancellationReason('');
                                }}
                                style={{ padding: '1rem' }}
                            >
                                Not Now
                            </button>
                            <button
                                className="nav-btn logout-primary-btn"
                                style={{ padding: '1rem', background: '#ef4444', borderColor: '#ef4444' }}
                                onClick={confirmCancellation}
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Decorative background elements wrapped to prevent overflow white space */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: -1
            }}>
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>
        </div >
    );
};

export default MainPage2;
