import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
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

const defaultPhotos = [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
];




const ProfilePage2 = () => {
    const navigate = useNavigate();
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
        city: '',
        image: defaultPhotos[0]
    });

    const [originalEmail, setOriginalEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setUser(prevUser => ({
                ...prevUser,
                ...currentUser,
                phone: currentUser.phone || '',
                education: currentUser.education || '',
                designation: currentUser.designation || '',
                bio: currentUser.bio || '',
                hospital: currentUser.hospital || '',
                experience: currentUser.experience || '',
                country: currentUser.country || '',
                state: currentUser.state || '',
                city: currentUser.city || '',
                image: currentUser.image || defaultPhotos[0]
            }));
            setOriginalEmail(currentUser.email);

        } else {
            navigate('/login');
        }
    }, [navigate]);

    const getCollectionForRole = (userRole) => {
        switch (userRole) {
            case 'counsellor': return 'counsellors';
            case 'tutor': return 'tutors';
            case 'admin': return 'admins';
            case 'public':
            default: return 'public';
        }
    };

    const handleRegister = async () => {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === originalEmail);

            let updatedUser = { ...user, isRegisteredPractitioner: true };

            if (userIndex !== -1) {
                updatedUser = { ...users[userIndex], ...user, isRegisteredPractitioner: true };
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
            }

            // Update the session currentUser
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Save changes to Firestore in the correct role-specific collection
            if (updatedUser.uid) {
                const collectionName = getCollectionForRole(updatedUser.role);
                const cleanPayload = {};
                Object.keys(updatedUser).forEach(key => {
                    if (updatedUser[key] !== undefined) {
                        cleanPayload[key] = updatedUser[key];
                    }
                });
                console.log(`[Firestore Practitioner Register] Saving to "${collectionName}" (UID: ${updatedUser.uid})`, cleanPayload);
                await setDoc(doc(db, collectionName, updatedUser.uid), cleanPayload, { merge: true });
                console.log(`[Firestore Practitioner Register] Successfully saved to "${collectionName}".`);
            }

            setMessage('Registered as Practicioner successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`Registration Error: ${error.message}`);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser({ ...user, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === originalEmail);

            let updatedUser = { ...user };

            if (userIndex !== -1) {
                updatedUser = { ...users[userIndex], ...user };
                users[userIndex] = updatedUser;
                localStorage.setItem('users', JSON.stringify(users));
            }

            // Update the session currentUser
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Save changes to Firestore in the correct role-specific collection
            if (updatedUser.uid) {
                const collectionName = getCollectionForRole(updatedUser.role);
                const cleanPayload = {};
                Object.keys(updatedUser).forEach(key => {
                    if (updatedUser[key] !== undefined) {
                        cleanPayload[key] = updatedUser[key];
                    }
                });
                console.log(`[Firestore Profile2 Update] Saving to "${collectionName}" (UID: ${updatedUser.uid})`, cleanPayload);
                await setDoc(doc(db, collectionName, updatedUser.uid), cleanPayload, { merge: true });
                console.log(`[Firestore Profile2 Update] Successfully saved to "${collectionName}".`);
            }

            setMessage('Counsellor Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`Error updating profile: ${error.message}`);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="app-container" style={{
            background: 'transparent',
            height: '100vh',
            overflow: 'hidden', // Prevent body scroll
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative'
        }}>
            {/* Scrollable Content Wrapper */}
            <div style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none',  // IE 10+
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4rem 1rem'
            }} className="no-scrollbar">

                {/* Fixed Background Layer */}
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${profileBg})`,

                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    zIndex: -1
                }}></div>




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
                        <h1 className="title-small gradient-text" style={{ fontSize: '2rem' }}>Professional Profile</h1>
                    </div>

                    {message && <p className="success-message" style={{ color: 'var(--color-green)', fontWeight: '600', textAlign: 'center', margin: '0' }}>{message}</p>}

                    <div className="photo-selection-section" style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.75rem', textAlign: 'center' }}>Choose Profile Photo</label>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            {defaultPhotos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo}
                                    alt={`Default ${index + 1}`}
                                    onClick={() => setUser({ ...user, image: photo })}
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                        border: user.image === photo ? '3px solid var(--color-blue)' : '2px solid transparent',
                                        transition: 'all 0.2s ease',
                                        opacity: user.image === photo ? 1 : 0.6
                                    }}
                                />
                            ))}

                            {/* Custom Upload Button */}
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="file"
                                    id="custom-photo-upload"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="custom-photo-upload"
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        border: (!defaultPhotos.includes(user.image)) ? '3px solid var(--color-blue)' : '2px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    title="Upload Custom Photo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                </label>
                                {!defaultPhotos.includes(user.image) && user.image && (
                                    <img
                                        src={user.image}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            pointerEvents: 'none',
                                            zIndex: -1
                                        }}
                                        alt="Preview"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

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
                                <label style={{ fontSize: '0.85rem' }}>Email (Locked)</label>
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
                                <label style={{ fontSize: '0.85rem' }}>Hospital / Practice Name</label>
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
                        </div>

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>Years of Experience</label>
                            <input
                                type="text"
                                value={user.experience}
                                onChange={(e) => setUser({ ...user, experience: e.target.value })}
                                className="glass-input"
                                style={{ padding: '10px 14px', marginBottom: '0' }}
                                placeholder="e.g. 5+ Years"
                            />
                        </div>

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

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <label style={{ fontSize: '0.85rem' }}>Professional Bio</label>
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
                                placeholder="Tell patients about your expertise..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button type="submit" className="cta-button" style={{ flex: 1 }}>Save Professional Profile</button>
                            <button
                                type="button"
                                className="cta-button"
                                style={{
                                    flex: 1,
                                    background: (!user.country || !user.state || !user.city) ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, var(--color-blue), var(--color-green))',
                                    border: (!user.country || !user.state || !user.city) ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                    color: (!user.country || !user.state || !user.city) ? 'rgba(255, 255, 255, 0.4)' : '#fff',
                                    cursor: (!user.country || !user.state || !user.city) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '700'
                                }}
                                disabled={!user.country || !user.state || !user.city}
                                title={(!user.country || !user.state || !user.city) ? "Please select Country, State, and City to register" : "Register as a Practitioner to appear in search results"}
                                onClick={handleRegister}
                            >
                                Register as Practitioner
                            </button>
                        </div>

                    </form>
                </div>

                {/* Decorative background elements */}
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>
        </div>
    );
};

export default ProfilePage2;
