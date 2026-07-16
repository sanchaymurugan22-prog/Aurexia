import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../App.css';
import splashBg from '../assets/splash.jpg';
import logo from '../assets/logo.jpg';

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
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
            } else {
                navigate('/language');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    const { t } = useLanguage();

    return (
        <div className="fixed-screen-container" style={{
            backgroundImage: `url(${splashBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="glass-panel hero-card">
                <img src={logo} alt="Aurexia Logo" className="app-logo" />
                <h1 className="title gradient-text">Aurexia</h1>
                <p className="tagline">{t('lightnessForMind')}</p>
            </div>

            {/* Decorative background elements - kept for consistency but might be less visible */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default SplashScreen;
