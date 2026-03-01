import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import classBg from '../assets/myclassesandevents.jpg';

const locationData = {
    'India': {
        'Delhi': ['Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
        'West Bengal': ['Kolkata', 'Howrah', 'Durgapur'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara']
    },
    'USA': {
        'New York': ['New York City', 'Buffalo', 'Rochester'],
        'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'],
        'Illinois': ['Chicago', 'Aurora', 'Naperville'],
        'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin'],
        'Arizona': ['Phoenix', 'Tucson', 'Mesa'],
        'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown']
    },
    'UK': {
        'England': ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Bristol'],
        'Scotland': ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee'],
        'Wales': ['Cardiff', 'Swansea', 'Newport'],
        'Northern Ireland': ['Belfast', 'Derry', 'Lisburn']
    },
    'Australia': {
        'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
        'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
        'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast'],
        'Western Australia': ['Perth', 'Rockingham', 'Mandurah'],
        'South Australia': ['Adelaide', 'Mount Gambier', 'Gawler']
    },
    'Canada': {
        'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton'],
        'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
        'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
        'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge']
    }
};

const TutorClasses = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const [form, setForm] = useState({
        country: '',
        state: '',
        city: '',
        eventName: '',
        date: '',
        time: '',
        maxParticipants: '',
        feeType: 'Free',
        feeAmount: '',
        description: '',
        eventImage: ''
    });

    const [myClasses, setMyClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Event Management States
    const [selectedClass, setSelectedClass] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [reasonType, setReasonType] = useState(''); // 'remove_participant' or 'cancel_event'
    const [targetParticipant, setTargetParticipant] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'tutor') {
            navigate('/login');
            return;
        }
        const classes = JSON.parse(localStorage.getItem('tutor_created_classes') || '[]');
        setMyClasses(classes.filter(c => c.tutorEmail === currentUser.email));
    }, [currentUser, navigate]);

    const fetchParticipants = (classId) => {
        const allBookings = JSON.parse(localStorage.getItem('booked_classes') || '[]');
        const classParticipants = allBookings.filter(b => b.classId === classId);
        setParticipants(classParticipants);
    };

    const handleOpenDetails = (cls) => {
        setSelectedClass(cls);
        fetchParticipants(cls.id);
        setShowDetailModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailModal(false);
        setSelectedClass(null);
        setParticipants([]);
    };

    const openReasonModal = (type, participant = null) => {
        setReasonType(type);
        setTargetParticipant(participant);
        setShowReasonModal(true);
    };

    const closeReasonModal = () => {
        setShowReasonModal(false);
        setReasonType('');
        setTargetParticipant(null);
        setCancelReason('');
    };

    const handleRemoveParticipant = () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason.');
            return;
        }

        const allBookings = JSON.parse(localStorage.getItem('booked_classes') || '[]');
        const updatedBookings = allBookings.filter(b => b.id !== targetParticipant.id);
        localStorage.setItem('booked_classes', JSON.stringify(updatedBookings));

        // Notify user
        const notification = {
            id: Date.now(),
            type: 'class_removal',
            className: selectedClass.eventName,
            tutorName: currentUser.name,
            reason: cancelReason,
            date: selectedClass.date,
            timestamp: new Date().toISOString(),
            unread: true
        };
        const userNotificationKey = `notifications_${targetParticipant.userEmail}`;
        const existingNotifications = JSON.parse(localStorage.getItem(userNotificationKey) || '[]');
        localStorage.setItem(userNotificationKey, JSON.stringify([notification, ...existingNotifications]));

        setParticipants(participants.filter(p => p.id !== targetParticipant.id));
        closeReasonModal();
        setMessage('Participant removed and notified.');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleCancelEvent = () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason.');
            return;
        }

        // Remove from tutor_created_classes
        const allClasses = JSON.parse(localStorage.getItem('tutor_created_classes') || '[]');
        const updatedClasses = allClasses.filter(c => c.id !== selectedClass.id);
        localStorage.setItem('tutor_created_classes', JSON.stringify(updatedClasses));

        // Notify all participants and remove their bookings
        const allBookings = JSON.parse(localStorage.getItem('booked_classes') || '[]');
        const eventParticipants = allBookings.filter(b => b.classId === selectedClass.id);

        eventParticipants.forEach(p => {
            const notification = {
                id: Date.now() + Math.random(),
                type: 'event_cancelled',
                className: selectedClass.eventName,
                tutorName: currentUser.name,
                reason: cancelReason,
                date: selectedClass.date,
                timestamp: new Date().toISOString(),
                unread: true
            };
            const userNotificationKey = `notifications_${p.userEmail}`;
            const existingNotifications = JSON.parse(localStorage.getItem(userNotificationKey) || '[]');
            localStorage.setItem(userNotificationKey, JSON.stringify([notification, ...existingNotifications]));
        });

        const remainingBookings = allBookings.filter(b => b.classId !== selectedClass.id);
        localStorage.setItem('booked_classes', JSON.stringify(remainingBookings));

        setMyClasses(myClasses.filter(c => c.id !== selectedClass.id));
        handleCloseDetails();
        closeReasonModal();
        setMessage('Event cancelled and all participants notified.');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, eventImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateClass = (e) => {
        e.preventDefault();

        const newClass = {
            id: Date.now(),
            ...form,
            tutorName: currentUser.name,
            tutorEmail: currentUser.email,
            createdAt: new Date().toISOString()
        };

        const allAvailableClasses = JSON.parse(localStorage.getItem('tutor_created_classes') || '[]');
        const updatedAll = [newClass, ...allAvailableClasses];
        localStorage.setItem('tutor_created_classes', JSON.stringify(updatedAll));

        setMyClasses([newClass, ...myClasses]);
        setMessage('Class created successfully!');
        setShowForm(false);

        // Reset specific fields
        setForm({
            ...form,
            eventName: '',
            date: '',
            time: '',
            maxParticipants: '',
            feeAmount: '',
            description: '',
            eventImage: ''
        });

        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${classBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                zIndex: -1
            }}></div>


            <div className="app-container" style={{
                background: 'transparent',
                height: 'auto',
                minHeight: '100vh',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4rem 1rem'
            }}>

                <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <h1 className="title gradient-text" style={{ fontSize: '3.5rem', textAlign: 'center', fontWeight: '900' }}>My Classes and Events</h1>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            className="nav-btn logout-primary-btn"
                            onClick={() => setShowForm(!showForm)}
                            style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '15px' }}
                        >
                            {showForm ? 'Cancel Creation' : 'Create a Class'}
                        </button>
                    </div>

                    {/* Create Class Section */}
                    {showForm && (
                        <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
                            <h2 className="welcome-title gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Create a Class</h2>

                            {message && <p style={{ color: 'var(--color-green)', fontWeight: '700', textAlign: 'center', marginBottom: '1.5rem' }}>{message}</p>}

                            <form onSubmit={handleCreateClass} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Country</label>
                                        <select
                                            className="glass-input"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.country}
                                            onChange={(e) => setForm({ ...form, country: e.target.value, state: '', city: '' })}
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            {Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>State</label>
                                        <select
                                            className="glass-input"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.state}
                                            onChange={(e) => setForm({ ...form, state: e.target.value, city: '' })}
                                            disabled={!form.country}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {form.country && Object.keys(locationData[form.country]).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>City</label>
                                        <select
                                            className="glass-input"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            disabled={!form.state}
                                            required
                                        >
                                            <option value="">Select City</option>
                                            {form.state && locationData[form.country][form.state].map(ct => <option key={ct} value={ct}>{ct}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Event Name</label>
                                        <input
                                            type="text"
                                            className="glass-input"
                                            placeholder="e.g. Yoga for Peace"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.eventName}
                                            onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Date</label>
                                        <input
                                            type="date"
                                            className="glass-input"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Time</label>
                                        <input
                                            type="time"
                                            className="glass-input"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.time}
                                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Max Participants</label>
                                        <input
                                            type="number"
                                            className="glass-input"
                                            placeholder="20"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.maxParticipants}
                                            onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Fee Type</label>
                                        <select
                                            className="glass-input"
                                            style={{ background: 'white', color: 'black' }}
                                            value={form.feeType}
                                            onChange={(e) => setForm({ ...form, feeType: e.target.value })}
                                        >
                                            <option value="Free">Free</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>
                                    {form.feeType === 'Paid' && (
                                        <div>
                                            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Amount</label>
                                            <input
                                                type="text"
                                                className="glass-input"
                                                placeholder="e.g. ₹500"
                                                style={{ background: 'white', color: 'black' }}
                                                value={form.feeAmount}
                                                onChange={(e) => setForm({ ...form, feeAmount: e.target.value })}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Event Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="glass-input"
                                        style={{ background: 'white', color: 'black', padding: '0.8rem' }}
                                    />
                                    {form.eventImage && (
                                        <div style={{ marginTop: '1rem', position: 'relative', width: '100px', height: '100px' }}>
                                            <img src={form.eventImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, eventImage: '' })}
                                                style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}
                                            >×</button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Description</label>
                                    <textarea
                                        className="glass-input"
                                        placeholder="Describe the event..."
                                        style={{ background: 'white', color: 'black', minHeight: '100px', resize: 'none' }}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <button type="submit" className="nav-btn logout-primary-btn" style={{ width: '100%', padding: '1.2rem', fontSize: '1.3rem', borderRadius: '15px' }}>
                                    Create Class
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Ongoing Classes Section */}
                    <div id="ongoing-classes">
                        <h2 className="welcome-title gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Ongoing Classes</h2>
                        {myClasses.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                {myClasses.map(c => (
                                    <div
                                        key={c.id}
                                        className="glass-panel animate-fade-in"
                                        style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                        onClick={() => handleOpenDetails(c)}
                                    >
                                        {c.eventImage && (
                                            <div style={{ height: '180px', width: '100%' }}>
                                                <img src={c.eventImage} alt={c.eventName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <h3 style={{ margin: 0, color: 'white', fontSize: '1.4rem' }}>{c.eventName}</h3>
                                                <span style={{
                                                    background: c.feeType === 'Free' ? '#10b981' : 'var(--color-blue)',
                                                    padding: '4px 10px',
                                                    borderRadius: '50px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '700'
                                                }}>{c.feeType === 'Paid' ? c.feeAmount : 'FREE'}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{c.description}</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                                <div>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Date & Time</p>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{c.date}</p>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-blue)' }}>{c.time}</p>
                                                </div>
                                                <div>
                                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Location</p>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>{c.city}</p>
                                                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{c.state}, {c.country}</p>
                                                </div>
                                            </div>
                                            <p style={{ marginTop: '1rem', fontSize: '0.85rem', textAlign: 'right', opacity: 0.5 }}>
                                                Max: {c.maxParticipants} participants
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                No ongoing classes yet. Create one above!
                            </div>
                        )}
                    </div>
                </div>

                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>

            {/* Event Detail Modal */}
            {showDetailModal && selectedClass && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(15px)',
                    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{
                        maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                        padding: '0', borderRadius: '32px', position: 'relative', border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <button onClick={handleCloseDetails} style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)',
                            border: 'none', color: 'white', cursor: 'pointer', padding: '10px', borderRadius: '50%', zIndex: 10
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', height: '100%' }}>
                            <div style={{ height: '400px', width: '100%' }}>
                                <img src={selectedClass.eventImage} alt={selectedClass.eventName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>{selectedClass.eventName}</h2>
                                    <p style={{ color: 'var(--color-blue)', fontWeight: '700', fontSize: '1.1rem' }}>{selectedClass.date} at {selectedClass.time}</p>
                                </div>

                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{selectedClass.description}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Enrolled</p>
                                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{participants.length}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Capacity</p>
                                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>{selectedClass.maxParticipants}</p>
                                    </div>
                                </div>

                                <button
                                    className="nav-btn"
                                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '1rem', borderRadius: '15px' }}
                                    onClick={() => openReasonModal('cancel_event')}
                                >
                                    Cancel Event
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h3 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '2rem' }}>Participants</h3>
                            {participants.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                    {participants.map(p => (
                                        <div key={p.id} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, color: 'white' }}>{p.participantName}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>{p.age} years</p>
                                                </div>
                                                <button
                                                    onClick={() => openReasonModal('remove_participant', p)}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                </button>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-blue)' }}>📞 {p.phoneNumber}</p>
                                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', opacity: 0.4 }}>Enrolled on {new Date(p.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>No participants yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reason Modal */}
            {showReasonModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)',
                    zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-panel animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '3rem', textAlign: 'center' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                            {reasonType === 'cancel_event' ? 'Cancel Event' : 'Remove Participant'}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                            {reasonType === 'cancel_event'
                                ? 'Are you sure you want to cancel this event? All participants will be notified.'
                                : `Are you sure you want to remove ${targetParticipant?.participantName}? They will be notified with your reason.`}
                        </p>

                        <textarea
                            className="glass-input"
                            placeholder="Please provide a reason..."
                            style={{ background: 'white', color: 'black', minHeight: '120px', resize: 'none', marginBottom: '1.5rem' }}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button className="nav-btn" onClick={closeReasonModal} style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Back</button>
                            <button
                                className="nav-btn"
                                style={{ background: '#ef4444', color: 'white' }}
                                onClick={reasonType === 'cancel_event' ? handleCancelEvent : handleRemoveParticipant}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

export default TutorClasses;
