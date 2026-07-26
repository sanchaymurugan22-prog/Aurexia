import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../App.css';
import logo from '../assets/logo.jpg';
import loginBg from '../assets/login.jpg';

const SignupPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('public');
    const [showPassword, setShowPassword] = useState(false);

    const { t } = useLanguage();

    const getDashboardPath = (userRole) => {
        switch (userRole) {
            case 'counsellor':
                return '/main2';
            case 'tutor':
                return '/main3';
            case 'admin':
                return '/main4';
            default:
                return '/main';
        }
    };

    const getCollectionForRole = (userRole) => {
        switch (userRole) {
            case 'counsellor': return 'counsellors';
            case 'tutor': return 'tutors';
            case 'admin': return 'admins';
            case 'public':
            default: return 'users';
        }
    };

    useEffect(() => {
        const existingUser = JSON.parse(localStorage.getItem('currentUser'));
        if (existingUser) {
            navigate(getDashboardPath(existingUser.role));
        }
    }, [navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const newUser = { name, email, role, loginCount: 0, uid: user.uid };
            
            // Save to Firestore role-specific collection
            const collectionName = getCollectionForRole(role);
            await setDoc(doc(db, collectionName, user.uid), newUser);

            const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
            
            // Remove old user if it existed but without auth
            const filteredUsers = existingUsers.filter(u => u.email !== email);
            const updatedUsers = [...filteredUsers, newUser];
            
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Sign out the user so they have to login again
            await signOut(auth);
            
            alert('Sign in successful! Please log in with your new credentials.');
            navigate('/login');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="fixed-screen-container" style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="glass-panel form-card animate-fade-in" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
                <div className="brand-header">
                    <img src={logo} alt="Aurexia Logo" className="app-logo-small" />
                    <h1 className="title-small gradient-text">Aurexia</h1>
                    <p className="tagline-small">{t('lightnessForMind')}</p>
                </div>

                <h2>{t('signup')}</h2>

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="form-group">
                        <label>{t('name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="glass-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="glass-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('role')}</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="glass-input role-select"
                            required
                        >
                            <option value="public">{t('public')}</option>
                            <option value="counsellor">{t('counsellor')}</option>
                            <option value="tutor">{t('tutor')}</option>
                            <option value="admin">{t('admin')}</option>
                        </select>
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
                    <button type="submit" className="cta-button full-width">{t('signup')}</button>
                </form>

                <p className="switch-auth">
                    {t('alreadyHaveAccount')} <Link to="/login">{t('loginHere')}</Link>
                </p>
            </div>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default SignupPage;
