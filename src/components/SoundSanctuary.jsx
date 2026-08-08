import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import soundBg from '../assets/sound.jpeg';

const cards = [
  {
    title: 'Meditation Tracks',
    text: 'Guided sessions for deep breathing, stress relief, and restful focus.',
    route: '/meditation_tracks'
  },
  {
    title: 'Nature Ambience',
    text: 'Calming rain, forest, and ocean sounds to ground your senses.',
    route: '/nature_ambience'
  },
  {
    title: 'Sleep Support',
    text: 'Gentle audio designed to help you drift off with peace and comfort.',
    route: '/sleep_support'
  }
];

const SoundSanctuary = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage: `url(${soundBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '2rem',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Back Button */}
      <button className="nav-btn" onClick={() => navigate(-1)} style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
      }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
      </button>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>Sound Sanctuary</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '880px', margin: '0 auto 0' }}>
          Discover calming soundscapes, guided audio journeys, and soothing melodies designed to restore balance, ease the mind, and help you relax.
        </p>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          {cards.map((item, index) => (
            <div
              key={index}
              className="glass-panel"
              onClick={() => item.route && navigate(item.route)}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '1.75rem',
                textAlign: 'center',
                minHeight: '220px',
                cursor: item.route ? 'pointer' : 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: item.route ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoundSanctuary;
