import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useLanguage } from '../context/LanguageContext.jsx';
import ReportModal from './ReportModal';

const Header = ({ onShowAppointments }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'Guest User',
        role: 'public',
        email: 'guest@aurexia.com'
    };
    const { t } = useLanguage();
    
    const notificationKey = `notifications_${currentUser.email}`;

    useEffect(() => {
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
        navigate('/language');
    };

    const handleNotificationClick = (notification) => {
        if (notification.type === 'appointment' || notification.type === 'appointment_cancelled_by_doctor') {
            navigate('/book-counsellor#my-appointments');
        } else if (notification.type === 'class_booking' || notification.type === 'class_removal' || notification.type === 'event_cancelled') {
            if (currentUser.role === 'tutor') {
                navigate('/tutor-classes#ongoing-classes');
            } else {
                navigate('/classes#my-classes');
            }
        } else if (notification.type === 'new_booking' || notification.type === 'appointment_cancelled') {
            if (onShowAppointments) {
                onShowAppointments();
            } else {
                navigate('/main2');
            }
        } else if (notification.type === 'class_joining' || notification.type === 'class_cancellation') {
            navigate('/tutor-classes#ongoing-classes');
        } else if (notification.type === 'report') {
            navigate('/complaints-reports');
        }
        setShowNotifications(false);
        setIsMobileMenuOpen(false);
    };

    // Define navigation links based on user role
    const getNavLinks = () => {
        switch (currentUser.role) {
            case 'counsellor':
                return [
                    { label: t('about'), path: '/about' },
                    { label: t('aiCompanion'), path: '/ai-companion' },
                    { label: t('peerForum'), path: '/peer-forum' },
                    { 
                        label: t('appointments'), 
                        action: () => {
                            if (onShowAppointments) {
                                onShowAppointments();
                            } else {
                                navigate('/main2');
                            }
                        } 
                    },
                    { label: t('videos'), path: '/videos' },
                    { label: t('libraryOfWisdom'), path: '/books' },
                    { label: t('classesAndEvents'), path: '/classes' }
                ];
            case 'tutor':
                return [
                    { label: t('about'), path: '/about' },
                    { label: t('aiCompanion'), path: '/ai-companion' },
                    { label: t('peerForum'), path: '/peer-forum' },
                    { label: t('classesAndEvents'), path: '/tutor-classes' },
                    { label: t('bookCounsellor'), path: '/book-counsellor' },
                    { label: t('videos'), path: '/videos' },
                    { label: t('libraryOfWisdom'), path: '/books' }
                ];
            case 'admin':
                return [
                    { label: t('publicUsers'), path: '/public-users' },
                    { label: t('counsellors'), path: '/manage-counsellors' },
                    { label: t('tutors'), path: '/manage-tutors' },
                    { label: t('complaintsAndReports'), path: '/complaints-reports' }
                ];
            default: // public user or guest
                return [
                    { label: t('about'), path: '/about' },
                    { label: t('aiCompanion'), path: '/ai-companion' },
                    { label: t('peerForum'), path: '/peer-forum' },
                    { label: t('bookCounsellor'), path: '/book-counsellor' },
                    { label: t('videos'), path: '/videos' },
                    { label: t('libraryOfWisdom'), path: '/books' },
                    { label: t('classesAndEvents'), path: '/classes' }
                ];
        }
    };

    const navLinks = getNavLinks();
    const profilePath = currentUser.role === 'counsellor' ? '/profile2' : '/profile';

    return (
        <header className="top-panel responsive-header">
            <div className="brand-section" onClick={() => {
                if (currentUser.role === 'counsellor') navigate('/main2');
                else if (currentUser.role === 'tutor') navigate('/main3');
                else if (currentUser.role === 'admin') navigate('/main4');
                else navigate('/main');
            }} style={{ cursor: 'pointer' }}>
                <img
                    src={logo}
                    alt="Aurexia Logo"
                    className="app-logo-small"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <div className="top-panel-content">
                    <h1 className="title-small gradient-text">Aurexia</h1>
                    <p className="tagline-small">{t('lightnessForMind')}</p>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="top-nav-menu desktop-only">
                <div className="nav-links-scroll-container">
                    {navLinks.map((link, i) => (
                        link.action ? (
                            <button key={i} className="nav-text-link" onClick={link.action}>{link.label}</button>
                        ) : (
                            <button key={i} className={`nav-text-link ${location.pathname === link.path ? 'active' : ''}`} onClick={() => navigate(link.path)}>{link.label}</button>
                        )
                    ))}
                </div>

                {/* Profile Icon */}
                <button 
                    className={`icon-only-btn ${location.pathname === profilePath ? 'active' : ''}`} 
                    title={t('profile')} 
                    onClick={() => navigate(profilePath)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>

                {/* Report Issue Button (Public users only) */}
                {currentUser.role === 'public' && (
                    <button
                        className="icon-only-btn"
                        title={t('reportIssue')}
                        onClick={() => setShowReportModal(true)}
                        style={{ color: '#fbbf24' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </button>
                )}

                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-only-btn"
                        title={t('notifications')}
                        onClick={toggleNotifications}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {unreadCount > 0 && (
                            <span className="notification-badge"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="glass-panel notifications-dropdown animate-fade-in">
                            <div className="dropdown-header">
                                <h3>{t('notifications')}</h3>
                                {notifications.length > 0 && (
                                    <button onClick={clearAllNotifications} className="clear-all-btn">
                                        {t('clearAll')}
                                    </button>
                                )}
                            </div>
                            <div className="dropdown-list">
                                {notifications.length === 0 ? (
                                    <p className="no-notifications">{t('noNotifications')}</p>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="notification-item clickable"
                                        >
                                            <div className="notification-title-bar">
                                                <p className="notification-type">
                                                    {notification.type === 'appointment' ? 'Appointment Booked!' :
                                                     notification.type === 'class_booking' ? 'Class Join Success!' :
                                                     notification.type === 'class_removal' ? 'Class Spot Removed' :
                                                     notification.type === 'event_cancelled' ? 'Event Cancelled' :
                                                     notification.type === 'appointment_cancelled_by_doctor' ? 'Appointment Cancelled' :
                                                     notification.type === 'class_joining' ? 'New Participant Joined!' :
                                                     notification.type === 'class_cancellation' ? 'Participant Cancelled' :
                                                     notification.type === 'new_booking' ? 'New Session Request!' :
                                                     notification.type === 'appointment_cancelled' ? 'Appointment Cancelled' : 'Notification'}
                                                </p>
                                                <button
                                                    onClick={(e) => deleteNotification(e, notification.id)}
                                                    className="delete-notification-btn"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                            <p className="notification-desc">
                                                {notification.type === 'class_booking' ? (
                                                    <>Join <strong>{notification.className}</strong> with <strong>{notification.tutorName}</strong> on {notification.date} at {notification.time}.</>
                                                ) : notification.type === 'class_removal' ? (
                                                    <>You have been removed from <strong>{notification.className}</strong> by <strong>{notification.tutorName}</strong>. Reason: {notification.reason}</>
                                                ) : notification.type === 'event_cancelled' ? (
                                                    <>The event <strong>{notification.className}</strong> has been cancelled by <strong>{notification.tutorName}</strong>. Reason: {notification.reason}</>
                                                ) : notification.type === 'appointment_cancelled_by_doctor' ? (
                                                    <>Your session with <strong>Dr. {notification.doctorName}</strong> on {notification.date} has been cancelled. Reason: {notification.reason}</>
                                                ) : notification.type === 'class_joining' ? (
                                                    <><strong>{notification.studentName}</strong> ({notification.studentAge}y) has joined <strong>{notification.className}</strong>.</>
                                                ) : notification.type === 'class_cancellation' ? (
                                                    <><strong>{notification.studentName}</strong> has cancelled their spot in <strong>{notification.className}</strong>. Reason: {notification.reason}</>
                                                ) : notification.type === 'new_booking' ? (
                                                    <><strong>{notification.patientName}</strong> booked a session for {notification.date} at {notification.time}.</>
                                                ) : notification.type === 'appointment_cancelled' ? (
                                                    <><strong>{notification.cancelledBy}</strong> cancelled the session for {notification.date}. Reason: {notification.reason}</>
                                                ) : (
                                                    <>Session with <strong>{notification.doctorName}</strong> on {notification.date} at {notification.time}.</>
                                                )}
                                            </p>
                                            <p className="notification-time">
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
                    {t('logout')}
                </button>
            </nav>

            {/* Mobile Layout Controls (Hamburger + Profile + Notifications) */}
            <div className="mobile-controls-row mobile-only">
                {/* Mobile Notification Icon */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-only-btn"
                        title={t('notifications')}
                        onClick={toggleNotifications}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {unreadCount > 0 && (
                            <span className="notification-badge"></span>
                        )}
                    </button>

                    {/* Mobile Notifications Dropdown */}
                    {showNotifications && (
                        <div className="glass-panel notifications-dropdown animate-fade-in mobile-dropdown">
                            <div className="dropdown-header">
                                <h3>{t('notifications')}</h3>
                                {notifications.length > 0 && (
                                    <button onClick={clearAllNotifications} className="clear-all-btn">
                                        {t('clearAll')}
                                    </button>
                                )}
                            </div>
                            <div className="dropdown-list">
                                {notifications.length === 0 ? (
                                    <p className="no-notifications">{t('noNotifications')}</p>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="notification-item clickable"
                                        >
                                            <div className="notification-title-bar">
                                                <p className="notification-type">
                                                    {notification.type === 'appointment' ? 'Appointment Booked!' :
                                                     notification.type === 'class_booking' ? 'Class Join Success!' :
                                                     notification.type === 'class_removal' ? 'Class Spot Removed' :
                                                     notification.type === 'event_cancelled' ? 'Event Cancelled' :
                                                     notification.type === 'appointment_cancelled_by_doctor' ? 'Appointment Cancelled' :
                                                     notification.type === 'class_joining' ? 'New Participant Joined!' :
                                                     notification.type === 'class_cancellation' ? 'Participant Cancelled' :
                                                     notification.type === 'new_booking' ? 'New Session Request!' :
                                                     notification.type === 'appointment_cancelled' ? 'Appointment Cancelled' : 'Notification'}
                                                </p>
                                                <button
                                                    onClick={(e) => deleteNotification(e, notification.id)}
                                                    className="delete-notification-btn"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                            <p className="notification-desc">
                                                {notification.type === 'class_booking' ? (
                                                    <>Join <strong>{notification.className}</strong> with <strong>{notification.tutorName}</strong> on {notification.date} at {notification.time}.</>
                                                ) : notification.type === 'class_removal' ? (
                                                    <>You have been removed from <strong>{notification.className}</strong>. Reason: {notification.reason}</>
                                                ) : notification.type === 'event_cancelled' ? (
                                                    <>The event <strong>{notification.className}</strong> has been cancelled. Reason: {notification.reason}</>
                                                ) : notification.type === 'appointment_cancelled_by_doctor' ? (
                                                    <>Your session with <strong>Dr. {notification.doctorName}</strong> on {notification.date} has been cancelled. Reason: {notification.reason}</>
                                                ) : notification.type === 'class_joining' ? (
                                                    <><strong>{notification.studentName}</strong> joined <strong>{notification.className}</strong>.</>
                                                ) : (
                                                    <>Appointment with <strong>{notification.doctorName}</strong> on {notification.date}.</>
                                                )}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Profile Icon */}
                <button 
                    className={`icon-only-btn ${location.pathname === profilePath ? 'active' : ''}`} 
                    onClick={() => navigate(profilePath)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </button>

                {/* Mobile Report Issue Button (Public users only) */}
                {currentUser.role === 'public' && (
                    <button
                        className="icon-only-btn"
                        title={t('reportIssue')}
                        onClick={() => setShowReportModal(true)}
                        style={{ color: '#fbbf24' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </button>
                )}

                {/* Hamburger Button */}
                <button 
                    className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="mobile-nav-drawer glass-panel animate-fade-in">
                    <div className="mobile-drawer-content">
                        {navLinks.map((link, i) => (
                            <button
                                key={i}
                                className="mobile-nav-link"
                                onClick={() => {
                                    if (link.action) {
                                        link.action();
                                    } else {
                                        navigate(link.path);
                                    }
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                {link.label}
                            </button>
                        ))}
                        {currentUser.role === 'public' && (
                            <button 
                                className="mobile-nav-link" 
                                onClick={() => { setShowReportModal(true); setIsMobileMenuOpen(false); }} 
                                style={{ color: '#fbbf24' }}
                            >
                                {t('reportIssue')}
                            </button>
                        )}
                        <button className="mobile-nav-link mobile-logout-btn" onClick={handleLogout}>
                            {t('logout')}
                        </button>
                    </div>
                </div>
            )}
            
            {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
        </header>
    );
};

export default Header;
