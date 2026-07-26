import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { db } from '../firebase';
import { doc, setDoc, deleteField } from 'firebase/firestore';
import '../App.css';
import logo from '../assets/logo.jpg';
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
    const { language, setLanguage, t } = useLanguage();
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        phone: '',
        education: '',
        designation: '',
        bio: '',
        hospital: '',
        experience: '',
        country: '',
        state: '',
        city: ''
    });
    const [originalEmail, setOriginalEmail] = useState('');
    const [message, setMessage] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ta', label: 'தமிழ்' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'kn', label: 'ಕನ್ನಡ' },
        { code: 'te', label: 'తెలుగు' },
        { code: 'ml', label: 'മലയാളം' }
    ];

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setUser({
                ...currentUser,
                phone: currentUser.phone || '',
                education: currentUser.education || '',
                designation: currentUser.designation || '',
                bio: currentUser.bio || '',
                hospital: currentUser.hospital || '',
                experience: currentUser.experience || '',
                country: currentUser.country || '',
                state: currentUser.state || '',
                city: currentUser.city || ''
            });
            setOriginalEmail(currentUser.email);
            setSelectedLanguage(language);
        } else {
            navigate('/login');
        }
    }, [navigate, language]);

    const getCollectionForRole = (userRole) => {
        switch (userRole) {
            case 'counsellor': return 'counsellors';
            case 'tutor': return 'tutors';
            case 'admin': return 'admins';
            case 'public':
            default: return 'public';
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // Update the master users list locally first
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === originalEmail);

            let baseUser = userIndex !== -1 ? { ...users[userIndex], ...user } : { ...user };
            
            let firestoreUpdate = { ...baseUser };

            if (!['counsellor', 'tutor'].includes(baseUser.role)) {
                delete baseUser.hospital;
                delete baseUser.experience;
                delete baseUser.country;
                delete baseUser.state;
                delete baseUser.city;
                delete baseUser.designation;
                
                firestoreUpdate.hospital = deleteField();
                firestoreUpdate.experience = deleteField();
                firestoreUpdate.country = deleteField();
                firestoreUpdate.state = deleteField();
                firestoreUpdate.city = deleteField();
                firestoreUpdate.designation = deleteField();
            }

            if (userIndex !== -1) {
                users[userIndex] = baseUser;
                localStorage.setItem('users', JSON.stringify(users));
            }

            // Also update the session currentUser
            localStorage.setItem('currentUser', JSON.stringify(baseUser));

            // Save changes to Firestore in the correct role-specific collection
            if (baseUser.uid) {
                const collectionName = getCollectionForRole(baseUser.role);
                const cleanPayload = {};
                Object.keys(firestoreUpdate).forEach(key => {
                    if (firestoreUpdate[key] !== undefined) {
                        cleanPayload[key] = firestoreUpdate[key];
                    }
                });
                console.log(`[Firestore Profile Update] Saving to collection "${collectionName}" for UID: ${baseUser.uid}`, cleanPayload);
                await setDoc(doc(db, collectionName, baseUser.uid), cleanPayload, { merge: true });
                console.log(`[Firestore Profile Update] Successfully saved to "${collectionName}".`);
            }

            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`Error updating profile: ${error.message}`);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="app-container" style={{
            backgroundImage: `url(${profileBg})`,
            minHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '3rem',
            paddingBottom: '3rem'
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
                {t('back')}
            </button>

            <div className="glass-panel form-card animate-fade-in" style={{
                maxWidth: '650px',
                width: '100%',
                maxHeight: 'calc(100vh - 4rem)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                overflowY: 'auto'
            }}>
                <div className="brand-header" style={{ marginBottom: '1rem' }}>
                    <img src={logo} alt="Aurexia Logo" className="app-logo-small" style={{ width: '45px', height: '45px' }} />
                    <h1 className="title-small gradient-text" style={{ fontSize: '2rem' }}>{t('yourProfile')}</h1>
                </div>

                {message && <p className="success-message" style={{ color: 'var(--color-green)', fontWeight: '600', textAlign: 'center', margin: '0' }}>{message}</p>}

                <div style={{ marginBottom: '1rem' }}>
                    <button
                        type="button"
                        className="nav-btn"
                        onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                        style={{ marginBottom: '1rem', width: '100%', justifyContent: 'center' }}
                    >
                        {t('changeLanguage')}
                    </button>

                    {showLanguageOptions && (
                        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('selectLanguage')}</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        className="nav-btn"
                                        onClick={() => setSelectedLanguage(lang.code)}
                                        style={{
                                            width: '100%',
                                            background: selectedLanguage === lang.code ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.4)',
                                            borderColor: selectedLanguage === lang.code ? 'rgba(59, 130, 246, 0.7)' : 'rgba(255, 255, 255, 0.6)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="cta-button full-width"
                                onClick={() => setLanguage(selectedLanguage)}
                                disabled={!selectedLanguage}
                            >
                                {t('setLanguage')}
                            </button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleUpdate} className="auth-form" style={{ display: 'grid', gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: '0' }}>
                        <label style={{ fontSize: '0.85rem' }}>{t('fullName')}</label>
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
                            <label style={{ fontSize: '0.85rem' }}>{t('emailPrimary')}</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0', opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>{t('role')}</label>
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
                            <label style={{ fontSize: '0.85rem' }}>{t('phoneNumber')}</label>
                            <input
                                type="tel"
                                value={user.phone}
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0' }}
                                placeholder={t('contactInfo')}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>{t('education')}</label>
                            <input
                                type="text"
                                value={user.education}
                                onChange={(e) => setUser({ ...user, education: e.target.value })}
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0' }}
                                placeholder={t('academicBackground')}
                            />
                        </div>
                    </div>

                    {['counsellor', 'tutor'].includes(user.role) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>{t('hospitalName')}</label>
                                <input
                                    type="text"
                                    value={user.hospital}
                                    onChange={(e) => setUser({ ...user, hospital: e.target.value })}
                                    className="glass-input"
                                    style={{ padding: '10px 14px', marginBottom: '0' }}
                                    placeholder={t('whereDoYouPractice')}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>Designation</label>
                                <input
                                    type="text"
                                    value={user.designation}
                                    onChange={(e) => setUser({ ...user, designation: e.target.value })}
                                    className="glass-input"
                                    style={{ padding: '10px 14px', marginBottom: '0' }}
                                    placeholder="e.g. Senior Specialist"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>{t('yearsOfExperience')}</label>
                                <input
                                    type="text"
                                    value={user.experience}
                                    onChange={(e) => setUser({ ...user, experience: e.target.value })}
                                    className="glass-input"
                                    style={{ padding: '10px 14px', marginBottom: '0' }}
                                    placeholder={t('experienceExample')}
                                />
                            </div>
                        </div>
                    )}

                    {['counsellor', 'tutor'].includes(user.role) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>{t('country')}</label>
                                <select
                                    value={user.country}
                                    onChange={(e) => {
                                        const newCountry = e.target.value;
                                        setUser({ ...user, country: newCountry, state: '', city: '' });
                                    }}
                                    className="glass-input"
                                    style={{ padding: '10px 14px', marginBottom: '0', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                >
                                    <option value="" style={{ background: '#1a1a1a' }}>{t('selectCountry')}</option>
                                    {Object.keys(locationData).map(country => (
                                        <option key={country} value={country} style={{ background: '#1a1a1a' }}>{country}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>{t('state')}</label>
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
                                    <option value="" style={{ background: '#1a1a1a' }}>{t('selectState')}</option>
                                    {user.country && locationData[user.country] && Object.keys(locationData[user.country]).map(state => (
                                        <option key={state} value={state} style={{ background: '#1a1a1a' }}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '0' }}>
                                <label style={{ fontSize: '0.85rem' }}>{t('city')}</label>
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
                                    <option value="" style={{ background: '#1a1a1a' }}>{t('selectCity')}</option>
                                    {user.state && locationData[user.country][user.state] && locationData[user.country][user.state].map(city => (
                                        <option key={city} value={city} style={{ background: '#1a1a1a' }}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '0' }}>
                        <label style={{ fontSize: '0.85rem' }}>{t('basicBio')}</label>
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
                            placeholder={t('bioPlaceholder')}
                        />
                    </div>

                    <button type="submit" className="cta-button full-width" style={{ marginTop: '0.5rem' }}>{t('submitChanges')}</button>
                </form>
            </div>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default ProfilePage;
