import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
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

const getDashboardPath = (role) => {
    switch (role) {
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

const LanguageSelection = () => {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const [selectedLang, setSelectedLang] = useState(language || null);

    useEffect(() => {
        const existingUser = JSON.parse(localStorage.getItem('currentUser'));
        if (existingUser) {
            navigate(getDashboardPath(existingUser.role));
        }
    }, [navigate]);

    const handleContinue = () => {
        if (selectedLang) {
            setLanguage(selectedLang);
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
                    <h1 className="title-small gradient-text">{t('chooseLanguage')}</h1>
                    <p className="tagline-small">{t('selectLanguage')}</p>
                </header>
                <div className="language-grid">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-card ${selectedLang === lang.code ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedLang(lang.code);
                                setLanguage(lang.code);
                            }}
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
                    {t('continue')}
                </button>
            </div>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default LanguageSelection;
