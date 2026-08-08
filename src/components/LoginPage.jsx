import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { auth, db, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
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

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check for banned users
            const bannedUsers = JSON.parse(localStorage.getItem('aurexia_banned_users') || '[]');
            const bannedUser = bannedUsers.find(u => u.email === user.email);
            if (bannedUser) {
                await auth.signOut();
                setError(`${t('bannedAccount')}: ${bannedUser.reason}`);
                setLoading(false);
                return;
            }

            // Fetch user info from Firestore safely
            const collections = ['public', 'counsellors', 'tutors', 'admins', 'users'];
            let userDocSnap = null;
            let foundCollection = null;

            try {
                for (const col of collections) {
                    const docRef = doc(db, col, user.uid);
                    const snap = await getDoc(docRef);
                    if (snap.exists()) {
                        userDocSnap = snap;
                        foundCollection = col;
                        break;
                    }
                }
            } catch (dbErr) {
                console.warn('Firestore read error during Google login:', dbErr);
            }

            const localUsers = JSON.parse(localStorage.getItem('users')) || [];
            const localUser = localUsers.find(u => u.email === user.email || u.uid === user.uid);

            let userData = {
                name: user.displayName || localUser?.name || user.email.split('@')[0],
                email: user.email,
                role: userDocSnap?.data()?.role || localUser?.role || 'public',
                loginCount: 1,
                uid: user.uid,
                photoURL: user.photoURL || localUser?.photoURL || '',
                authProvider: 'google'
            };

            if (userDocSnap) {
                userData = { ...userData, ...userDocSnap.data() };
                userData.loginCount = (userData.loginCount || 0) + 1;
            } else if (localUser) {
                userData = { ...localUser, loginCount: (localUser.loginCount || 0) + 1 };
            }

            try {
                const targetCollection = foundCollection || getCollectionForRole(userData.role);
                const cleanPayload = {};
                Object.keys(userData).forEach(key => {
                    if (userData[key] !== undefined) {
                        cleanPayload[key] = userData[key];
                    }
                });
                console.log(`[Firestore Google Login] Syncing user to "${targetCollection}" (UID: ${user.uid})...`);
                await setDoc(doc(db, targetCollection, user.uid), cleanPayload, { merge: true });
                console.log(`[Firestore Google Login] Successfully synced to "${targetCollection}".`);
            } catch (fsErr) {
                console.warn('Firestore update error during Google login:', fsErr);
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            let userIndex = users.findIndex(u => u.email === user.email || u.uid === user.uid);

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
            console.error('Firebase Google Login Error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Google sign in was cancelled.');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup was blocked by your browser. Please allow popups for this website.');
            } else {
                setError(err.message || 'Google sign in failed.');
            }
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

                <div className="auth-divider">
                    <span>{t('or')}</span>
                </div>

                <button
                    type="button"
                    className="google-btn full-width"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{t('loginWithGoogle')}</span>
                </button>

                <p className="switch-auth">
                    {t('newUser')} <Link to="/signup">{t('signup')}</Link>
                </p>
            </div>


            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default LoginPage;
