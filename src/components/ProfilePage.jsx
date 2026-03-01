import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/main.webp';
import profileBg from '../assets/profile.jpg';


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

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        phone: '',
        education: '',
        bio: '',
        hospital: '',
        experience: '',
        country: '',
        state: '',
        city: ''
    });
    const [originalEmail, setOriginalEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setUser({
                ...user,
                ...currentUser,
                phone: currentUser.phone || '',
                education: currentUser.education || '',
                bio: currentUser.bio || '',
                hospital: currentUser.hospital || '',
                experience: currentUser.experience || '',
                country: currentUser.country || '',
                state: currentUser.state || '',
                city: currentUser.city || ''
            });
            setOriginalEmail(currentUser.email);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdate = (e) => {
        e.preventDefault();

        // 1. Update the master users list
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === originalEmail);

        if (userIndex !== -1) {
            const updatedUser = { ...users[userIndex], ...user };
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));

            // 2. Update the session currentUser
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="app-container" style={{
            backgroundImage: `url(${profileBg})`,

            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <button className="nav-btn" onClick={() => navigate(-1)} style={{
                position: 'fixed',
                top: '2rem',
                left: '2rem',
                zIndex: 100
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
            </button>

            <div className="glass-panel form-card animate-fade-in" style={{
                maxWidth: '650px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div className="brand-header" style={{ marginBottom: '1rem' }}>
                    <img src={logo} alt="Aurexia Logo" className="app-logo-small" style={{ width: '45px', height: '45px' }} />
                    <h1 className="title-small gradient-text" style={{ fontSize: '2rem' }}>Your Profile</h1>
                </div>

                {message && <p className="success-message" style={{ color: 'var(--color-green)', fontWeight: '600', textAlign: 'center', margin: '0' }}>{message}</p>}

                <form onSubmit={handleUpdate} className="auth-form" style={{ display: 'grid', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: '0' }}>
                        <label style={{ fontSize: '0.85rem' }}>Full Name</label>
                        <input
                            type="text"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className="glass-input"
                            style={{ padding: '10px 14px', marginBottom: '0' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>Email (Primary)</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0', opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>Role</label>
                            <input
                                type="text"
                                value={user.role}
                                disabled
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0', opacity: 0.7, cursor: 'not-allowed', textTransform: 'capitalize' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>Phone Number</label>
                            <input
                                type="tel"
                                value={user.phone}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0' }}
                                placeholder="Contact info"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>Education</label>
                            <input
                                type="text"
                                value={user.education}
                                onChange={(e) => setUser({ ...user, education: e.target.value })}
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0' }}
                                placeholder="Academic background"
                            />
                        </div>
                    </div>

                    {user.role === 'counsellor' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>Hospital/Clinic Name</label>
                                <input
                                    type="text"
                                    value={user.hospital}
                                    onChange={(e) => setUser({ ...user, hospital: e.target.value })}
                                    className="glass-input"
                                    style={{ padding: '10px 14px', marginBottom: '0' }}
                                    placeholder="Where do you practice?"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>Years of Experience</label>
                                <input
                                    type="text"
                                    value={user.experience}
                                    onChange={(e) => setUser({ ...user, experience: e.target.value })}
                                    className="glass-input"
                                    style={{ padding: '10px 14px', marginBottom: '0' }}
                                    placeholder="e.g. 10+ years"
                                />
                            </div>
                        </div>
                    )}

                    {user.role === 'counsellor' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>Country</label>
                                <select
                                    value={user.country}
                                    onChange={(e) => {
                                        const newCountry = e.target.value;
                                        setUser({ ...user, country: newCountry, state: '', city: '' });
                                    }}
                                    className="glass-input"
                                    style={{ padding: '10px 14px', marginBottom: '0', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                >
                                    <option value="" style={{ background: '#1a1a1a' }}>Select Country</option>
                                    {Object.keys(locationData).map(country => (
                                        <option key={country} value={country} style={{ background: '#1a1a1a' }}>{country}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>State</label>
                                <select
                                    value={user.state}
                                    onChange={(e) => {
                                        const newState = e.target.value;
                                        setUser({ ...user, state: newState, city: '' });
                                    }}
                                    disabled={!user.country}
                                    className="glass-input"
                                    style={{
                                        padding: '10px 14px',
                                        marginBottom: '0',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        opacity: !user.country ? 0.5 : 1
                                    }}
                                >
                                    <option value="" style={{ background: '#1a1a1a' }}>Select State</option>
                                    {user.country && locationData[user.country] && Object.keys(locationData[user.country]).map(state => (
                                        <option key={state} value={state} style={{ background: '#1a1a1a' }}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>City</label>
                                <select
                                    value={user.city}
                                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                                    disabled={!user.state}
                                    className="glass-input"
                                    style={{
                                        padding: '10px 14px',
                                        marginBottom: '0',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        opacity: !user.state ? 0.5 : 1
                                    }}
                                >
                                    <option value="" style={{ background: '#1a1a1a' }}>Select City</option>
                                    {user.state && locationData[user.country][user.state] && locationData[user.country][user.state].map(city => (
                                        <option key={city} value={city} style={{ background: '#1a1a1a' }}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '0' }}>
                        <label style={{ fontSize: '0.85rem' }}>Basic Bio</label>
                        <textarea
                            value={user.bio}
                            onChange={(e) => setUser({ ...user, bio: e.target.value })}
                            className="glass-input"
                            style={{
                                minHeight: '60px',
                                maxHeight: '80px',
                                resize: 'none',
                                padding: '10px 14px',
                                marginBottom: '0',
                                fontSize: '0.9rem'
                            }}
                            placeholder="A brief bit about you..."
                        />
                    </div>

                    <button type="submit" className="cta-button full-width" style={{ marginTop: '0.5rem' }}>Submit Changes</button>
                </form>
            </div>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default ProfilePage;
