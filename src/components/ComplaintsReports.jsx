import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/main.webp';
import complaintsBg from '../assets/complaintsandreports.jpg';


const ComplaintsReports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'question', 'reply', 'general'
    const [selectedReport, setSelectedReport] = useState(null);

    // Fetch reports from localStorage
    // Fetch reports from localStorage and clean up legacy mock data
    useEffect(() => {
        let storedReports = JSON.parse(localStorage.getItem('aurexia_reports') || '[]');

        // Filter out legacy mock data (IDs 1-4 were small integers, new IDs are timestamps)
        const activeReports = storedReports.filter(r => r.id > 10000);

        // Update localStorage if we filtered anything out
        if (activeReports.length !== storedReports.length) {
            localStorage.setItem('aurexia_reports', JSON.stringify(activeReports));
        }

        setReports(activeReports.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)));
    }, []);

    const updateStatus = (id, newStatus) => {
        const updatedReports = reports.map(r => r.id === id ? { ...r, status: newStatus } : r);
        setReports(updatedReports);
        localStorage.setItem('aurexia_reports', JSON.stringify(updatedReports));
        if (selectedReport && selectedReport.id === id) {
            setSelectedReport({ ...selectedReport, status: newStatus });
        }
    };

    const handleBack = () => {
        navigate('/main4');
    };

    const filteredReports = reports.filter(report => {
        const statusMatch = filter === 'all' ? true :
            filter === 'pending' ? report.status === 'pending' :
                filter === 'resolved' ? report.status !== 'pending' : true;

        const typeMatch = typeFilter === 'all' ? true :
            report.targetType === typeFilter;

        return statusMatch && typeMatch;
    });

    const handleDeleteContent = (report) => {
        if (!window.confirm("Are you sure you want to delete this content? This cannot be undone.")) return;

        const forumData = JSON.parse(localStorage.getItem('aurexia_peer_forum_data') || '[]');
        let updatedForumData;
        let contentFound = false;

        if (report.targetType === 'question') {
            const initialLength = forumData.length;
            updatedForumData = forumData.filter(q => q.id !== report.targetId);
            if (updatedForumData.length < initialLength) contentFound = true;
        } else {
            updatedForumData = forumData.map(q => {
                const initialReplies = q.replies.length;
                const updatedReplies = q.replies.filter(r => r.id !== report.targetId);
                if (updatedReplies.length < initialReplies) contentFound = true;
                return { ...q, replies: updatedReplies };
            });
        }

        if (contentFound) {
            localStorage.setItem('aurexia_peer_forum_data', JSON.stringify(updatedForumData));
            updateStatus(report.id, 'Resolved - Content Deleted');
            alert("Content deleted successfully.");
        } else {
            alert("Content not found. It might have been already deleted.");
            updateStatus(report.id, 'Resolved - Content Already Deleted');
        }
    };

    const handleBanUser = (report) => {
        if (!window.confirm(`Are you sure you want to BAN ${report.reportedUser}? This action will permanently delete ALL their content, bookings, and data from the platform.`)) return;

        const userEmail = report.reportedUserEmail;
        const bannedUsers = JSON.parse(localStorage.getItem('aurexia_banned_users') || '[]');

        if (!bannedUsers.some(u => u.email === userEmail)) {
            // 1. Add to Banned Users List
            bannedUsers.push({
                email: userEmail,
                name: report.reportedUser,
                reason: report.reason,
                reportId: report.id,
                date: new Date().toISOString()
            });
            localStorage.setItem('aurexia_banned_users', JSON.stringify(bannedUsers));

            // 2. Delete Forum Data (Questions & Replies)
            let forumData = JSON.parse(localStorage.getItem('aurexia_peer_forum_data') || '[]');
            // Remove questions created by the user
            forumData = forumData.filter(q => q.userEmail !== userEmail && q.user !== report.reportedUser);
            // Remove replies created by the user in remaining questions
            forumData = forumData.map(q => ({
                ...q,
                replies: q.replies ? q.replies.filter(r => r.userEmail !== userEmail && r.user !== report.reportedUser) : []
            }));
            localStorage.setItem('aurexia_peer_forum_data', JSON.stringify(forumData));

            // 3. Delete Appointments
            const appointments = JSON.parse(localStorage.getItem('aurexia_appointments') || '[]');
            const updatedAppointments = appointments.filter(a => a.userEmail !== userEmail && a.email !== userEmail);
            localStorage.setItem('aurexia_appointments', JSON.stringify(updatedAppointments));

            // 4. Delete Class Bookings
            const classBookings = JSON.parse(localStorage.getItem('aurexia_class_bookings') || '[]');
            const updatedClassBookings = classBookings.filter(b => b.userEmail !== userEmail && b.email !== userEmail);
            localStorage.setItem('aurexia_class_bookings', JSON.stringify(updatedClassBookings));

            // 5. Update Reports
            let allReports = JSON.parse(localStorage.getItem('aurexia_reports') || '[]');
            // Remove reports filed BY the banned user (optional, but good for cleanup)
            allReports = allReports.filter(r => r.reporterEmail !== userEmail);

            // Mark all reports AGAINST the banned user as Resolved
            allReports = allReports.map(r =>
                (r.reportedUserEmail === userEmail || r.reportedUser === report.reportedUser)
                    ? { ...r, status: 'Resolved - User Banned' }
                    : r
            );

            localStorage.setItem('aurexia_reports', JSON.stringify(allReports));
            setReports(allReports.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)));

            if (selectedReport && (selectedReport.reportedUserEmail === userEmail || selectedReport.reportedUser === report.reportedUser)) {
                setSelectedReport({ ...selectedReport, status: 'Resolved - User Banned' });
            }

            alert(`User ${report.reportedUser} has been banned. All their forum posts, bookings, and class registrations have been deleted.`);
        } else {
            alert("User is already banned.");
        }
    };

    return (
        <div className="app-container" style={{
            backgroundImage: `url(${complaintsBg})`,

            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <button
                onClick={handleBack}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#000000',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    zIndex: 10
                }}
                className="animate-fade-in"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
            </button>

            <main className="hero-section" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="title gradient-text" style={{ fontSize: '3.5rem', marginTop: '4rem', marginBottom: '3rem' }}>Complaints & Reports</h1>

                <div className="glass-panel" style={{
                    maxWidth: '1200px',
                    width: '100%',
                    padding: '2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        {/* Type Filter */}
                        <div style={{ display: 'flex', gap: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '15px' }}>
                            {['all', 'question', 'reply', 'general'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(type)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: typeFilter === type ? 'var(--color-blue)' : 'transparent',
                                        color: typeFilter === type ? '#fff' : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        textTransform: 'capitalize',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Status Filter */}
                        <div style={{ display: 'flex', gap: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '15px' }}>
                            {['all', 'pending', 'resolved'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: filter === status ? 'var(--color-blue)' : 'transparent',
                                        color: filter === status ? '#fff' : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        textTransform: 'capitalize',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {filteredReports.map(report => (
                            <div
                                key={report.id}
                                className="glass-panel animate-fade-in"
                                onClick={() => setSelectedReport(report)}
                                style={{
                                    padding: '1.5rem',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    transition: 'transform 0.3s, border-color 0.3s',
                                    textAlign: 'left',
                                    background: 'rgba(255, 255, 255, 0.65)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--color-blue)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        fontSize: '0.75rem',
                                        color: 'var(--color-blue)',
                                        fontWeight: '800',
                                        textTransform: 'uppercase'
                                    }}>
                                        {report.type}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            color: report.status === 'pending' ? '#ef4444' : '#10b981'
                                        }}>
                                            {report.status === 'pending' ? 'PENDING' : 'RESOLVED'}
                                        </span>
                                        {report.status.includes(' - ') && (
                                            <span style={{
                                                fontSize: '0.65rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                color: '#fff',
                                                background: report.status.includes('Banned') ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)',
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {report.status.split(' - ')[1]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h4 style={{ color: '#000', margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '700' }}>Reported: {report.reportedUser}</h4>
                                <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.85rem', margin: '0 0 1rem 0', fontWeight: '600' }}>By: {report.reporter} • {report.date}</p>
                                <p style={{
                                    color: 'rgba(0,0,0,0.85)',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    fontWeight: '500'
                                }}>
                                    {report.reason}
                                </p>
                            </div>
                        ))}
                        {filteredReports.length === 0 && (
                            <p style={{ color: 'rgba(255,255,255,0.5)', colSpan: '3', textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>No reports found.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Selection Modal */}
            {selectedReport && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: '2rem'
                }} onClick={() => setSelectedReport(null)}>
                    <div
                        className="glass-panel animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: '700px',
                            padding: '3rem',
                            borderRadius: '30px',
                            textAlign: 'left',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    fontSize: '0.8rem',
                                    color: 'var(--color-blue)',
                                    fontWeight: '800'
                                }}>
                                    {selectedReport.type.toUpperCase()}
                                </span>
                                <h2 style={{ fontSize: '2rem', color: '#fff', margin: '1rem 0 0.2rem 0' }}>Report against: {selectedReport.reportedUser}</h2>
                                <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Reporter: {selectedReport.reporter} ({selectedReport.reporterEmail})</p>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: '800' }}>Reason for Report</p>
                            <p style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 1.5rem 0', fontWeight: '600', lineHeight: 1.5 }}>{selectedReport.reason}</p>

                            {selectedReport.contentSnapshot && (
                                <>
                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: '800' }}>Reported Content Snapshot</p>
                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '10px', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
                                        "{selectedReport.contentSnapshot}"
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', fontWeight: '700' }}>Admin Actions:</p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => handleDeleteContent(selectedReport)}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderRadius: '12px',
                                        background: 'rgba(245, 158, 11, 0.2)',
                                        border: '1px solid rgba(245, 158, 11, 0.4)',
                                        color: '#f59e0b',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        flex: 1
                                    }}
                                >
                                    Delete Content
                                </button>

                                <button
                                    onClick={() => handleBanUser(selectedReport)}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderRadius: '12px',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        border: '1px solid rgba(239, 68, 68, 0.4)',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        flex: 1
                                    }}
                                >
                                    Ban User Account
                                </button>

                                <button
                                    onClick={() => updateStatus(selectedReport.id, 'Resolved - Dismissed')}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderRadius: '12px',
                                        background: 'rgba(16, 185, 129, 0.2)',
                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                        color: '#10b981',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        flex: 1
                                    }}
                                >
                                    Dismiss Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintsReports;
