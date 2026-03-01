import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import loginBg from '../assets/login.jpg';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check for banned users first
        const bannedUsers = JSON.parse(localStorage.getItem('aurexia_banned_users') || '[]');
        const bannedUser = bannedUsers.find(u => u.email === email);
        if (bannedUser) {
            setError(`Your account has been banned. Reason: ${bannedUser.reason}`);
            return;
        }

        const userIndex = users.findIndex(u => u.email === email && u.password === password);

        if (userIndex !== -1) {
            // Increment login count
            users[userIndex].loginCount = (users[userIndex].loginCount || 0) + 1;

            // Save updated users list
            localStorage.setItem('users', JSON.stringify(users));

            // Store current session user
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

            switch (users[userIndex].role) {
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
        } else {
            setError('Invalid credentials');
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
                    <p className="tagline-small">Lightness for the mind</p>
                </div>

                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="glass-input"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
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
                                aria-label={showPassword ? "Hide password" : "Show password"}
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
                    <button type="submit" className="cta-button full-width">Login</button>
                </form>

                <p className="switch-auth">
                    New user? <Link to="/signup">Sign up here</Link>
                </p>
            </div>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default LoginPage;
