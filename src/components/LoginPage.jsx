import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getCollectionForRole = (userRole) => {
    switch (userRole) {
        case 'counsellor': return 'counsellors';
        case 'tutor': return 'tutors';
        case 'admin': return 'admins';
        case 'public':
        default: return 'public';
    }
};
import '../App.css';
import logo from '../assets/logo.jpg';
import loginBg from '../assets/login.jpg';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { t } = useLanguage();

    useEffect(() => {
        const existingUser = JSON.parse(localStorage.getItem('currentUser'));
        if (existingUser) {
            switch (existingUser.role) {
                case 'counsellor':
                    navigate('/main2');
                    break;
                case 'tutor':
                    navigate('/main3');
                    break;
                case 'admin':
                    navigate('/main4');
                    break;
                default:
                    navigate('/main');
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Check for banned users first
        const bannedUsers = JSON.parse(localStorage.getItem('aurexia_banned_users') || '[]');
        const bannedUser = bannedUsers.find(u => u.email === email);
        if (bannedUser) {
            setError(`${t('bannedAccount')}: ${bannedUser.reason}`);
            setLoading(false);
            return;
        }

        try {
            // 1. Authenticate with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch user info from Firestore safely
            const collections = ['public', 'counsellors', 'tutors', 'admins', 'users'];
            let userDocSnap = null;

            try {
                for (const col of collections) {
                    const docRef = doc(db, col, user.uid);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        userDocSnap = snap;
                        break;
                    }
                }
            } catch (dbErr) {
                console.warn('Firestore read error during login:', dbErr);
            }

            // 3. Match with local cache or build default user payload
            const localUsers = JSON.parse(localStorage.getItem('users')) || [];
            const localUser = localUsers.find(u => u.email === email || u.uid === user.uid);

            let userData = {
                name: user.displayName || localUser?.name || email.split('@')[0],
                email: user.email,
                role: localUser?.role || 'public',
                loginCount: 1,
                uid: user.uid,
                password: password
            };

            if (userDocSnap) {
                userData = { ...userData, ...userDocSnap.data() };
                userData.loginCount = (userData.loginCount || 0) + 1;
                // Preserve password if missing or update with current password
                if (!userData.password) userData.password = password;
            } else if (localUser) {
                userData = { ...localUser, loginCount: (localUser.loginCount || 0) + 1 };
                if (!userData.password) userData.password = password;
            }

            // 4. Update login count in Firestore in role-specific collection
            try {
                const targetCollection = getCollectionForRole(userData.role);
                const cleanPayload = {};
                Object.keys(userData).forEach(key => {
                    if (userData[key] !== undefined) {
                        cleanPayload[key] = userData[key];
                    }
                });
                console.log(`[Firestore Login Update] Syncing user to "${targetCollection}" (UID: ${user.uid})...`);
                await setDoc(doc(db, targetCollection, user.uid), cleanPayload, { merge: true });
                console.log(`[Firestore Login Update] Successfully synced to "${targetCollection}".`);
            } catch (fsErr) {
                console.warn('Firestore update error during login:', fsErr);
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            let userIndex = users.findIndex(u => u.email === email || u.uid === user.uid);

            if (userIndex !== -1) {
                users[userIndex] = userData;
            } else {
                users.push(userData);
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(userData));

            switch (userData.role) {
                case 'counsellor': navigate('/main2'); break;
                case 'tutor': navigate('/main3'); break;
                case 'admin': navigate('/main4'); break;
                default: navigate('/main');
            }
        } catch (err) {
            console.error('Firebase Login Error:', err);
            let errMsg = 'Invalid credentials or authentication failed';
            if (err.code === 'auth/user-not-found') {
                errMsg = 'No account found with this email. Please sign up first.';
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                errMsg = 'Incorrect email or password. Please try again.';
            } else if (err.code === 'auth/invalid-email') {
                errMsg = 'Please enter a valid email address.';
            } else if (err.code === 'auth/too-many-requests') {
                errMsg = 'Too many failed login attempts. Please try again later.';
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed-screen-container" style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="glass-panel form-card animate-fade-in" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
                <div className="brand-header">
                    <img src={logo} alt="Aurexia Logo" className="app-logo-small" />
                    <h1 className="title-small gradient-text">Aurexia</h1>
                    <p className="tagline-small">{t('lightnessForMind')}</p>
                </div>

                <h2>{t('login')}</h2>
                {error && <p className="error-message" style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label>{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="glass-input"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('password')}</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="glass-input"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="cta-button full-width" disabled={loading}>
                        {loading ? 'Signing In...' : t('login')}
                    </button>
                </form>

                <p className="switch-auth">
                    {t('newUser')} <Link to="/signup">{t('loginHere')}</Link>
                </p>
            </div>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default LoginPage;
