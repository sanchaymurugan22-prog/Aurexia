import React, { useState } from 'react';

const ReportModal = ({ onClose }) => {
    const [category, setCategory] = useState('Bug');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User', email: 'guest@aurexia.com' };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newReport = {
            id: Date.now(),
            reporter: currentUser.name,
            reporterEmail: currentUser.email,
            type: category, // Functionally the 'Reason' or 'Type'
            reason: description, // The core message/description
            message: description, // Keeping compatible with Admin view which might expect 'message'
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            reportedUser: 'System/General', // Default for general reports
            target: 'General Report',
            targetType: 'general'
        };

        // 1. Save to global reports list
        const existingReports = JSON.parse(localStorage.getItem('aurexia_reports') || '[]');
        localStorage.setItem('aurexia_reports', JSON.stringify([...existingReports, newReport]));

        // 2. Add notification for Admin
        // Assuming admin email is admin@aurexia.com
        const adminEmail = 'admin@aurexia.com';
        const adminNotificationKey = `notifications_${adminEmail}`;
        const adminNotifications = JSON.parse(localStorage.getItem(adminNotificationKey) || '[]');

        adminNotifications.push({
            id: Date.now() + 1,
            type: 'report',
            message: `New ${category} report from ${currentUser.name}: ${description}`,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            unread: true,
            reportId: newReport.id
        });
        localStorage.setItem(adminNotificationKey, JSON.stringify(adminNotifications));

        // 3. Add confirmation notification for User
        const userNotificationKey = `notifications_${currentUser.email}`;
        const userNotifications = JSON.parse(localStorage.getItem(userNotificationKey) || '[]');
        userNotifications.push({
            id: Date.now() + 2,
            type: 'system',
            message: `Your report regarding "${category}" has been submitted. We will review it shortly.`,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            unread: true
        });
        localStorage.setItem(userNotificationKey, JSON.stringify(userNotifications));

        // Simulate network delay for better UX
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Report submitted successfully! Thank you for your feedback.");
            onClose();
        }, 800);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }} onClick={onClose}>
            <div
                className="glass-panel animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '2rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Report an Issue</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            padding: '5px'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="Bug" style={{ color: 'black' }}>Technical Bug</option>
                            <option value="Harassment" style={{ color: 'black' }}>Harassment / Abuse</option>
                            <option value="Content" style={{ color: 'black' }}>Inappropriate Content</option>
                            <option value="Suggestion" style={{ color: 'black' }}>Feature Suggestion</option>
                            <option value="Other" style={{ color: 'black' }}>Other</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Please describe the issue or your suggestion in detail..."
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                outline: 'none',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="nav-btn logout-primary-btn"
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: '700',
                            justifyContent: 'center',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
