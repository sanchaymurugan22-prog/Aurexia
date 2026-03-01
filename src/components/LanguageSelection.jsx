import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import languageBg from '../assets/splash.jpg';

const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
];

const LanguageSelection = () => {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState(null);

    const handleContinue = () => {
        if (selectedLang) {
            localStorage.setItem('userLanguage', selectedLang);
            navigate('/login');
        }
    };

    return (
        <div className="fixed-screen-container" style={{
            backgroundImage: `url(${languageBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="glass-panel language-screen-card animate-fade-in">
                <header className="brand-header">
                    <img src={logo} alt="Aurexia Logo" className="app-logo-small" />
                    <h1 className="title-small gradient-text">Choose Language</h1>
                    <p className="tagline-small">Please select your preferred language</p>
                </header>

                <div className="language-grid">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-card ${selectedLang === lang.code ? 'selected' : ''}`}
                            onClick={() => setSelectedLang(lang.code)}
                        >
                            <span className="lang-native">{lang.native}</span>
                            <span className="lang-name">{lang.name}</span>
                        </button>
                    ))}
                </div>

                <button
                    className="cta-button full-width continue-btn"
                    disabled={!selectedLang}
                    onClick={handleContinue}
                >
                    Continue
                </button>
            </div>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default LanguageSelection;
