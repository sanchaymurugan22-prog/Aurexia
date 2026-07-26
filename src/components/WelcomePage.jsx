import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import mainBg from '../assets/mainpage.jpg';
import '../App.css';

const WelcomePage = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useLanguage();

    const offerCards = [
        {
            title: 'AI Companion',
            description: 'Instant emotional support, guided self-reflection, and calm check-ins with an empathetic digital companion.',
            route: '/ai-companion',
            icon: (
                <div className="tile-icon icon-animate-ai" style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 6px 18px rgba(59,130,246,0.08)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3C8.686 3 6 5.686 6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9c0-3.314-2.686-6-6-6z" />
                        <path d="M8 21v-2a4 4 0 0 1 8 0v2" />
                        <circle cx="12" cy="11" r="1.2" fill="#2563eb" />
                    </svg>
                </div>
            )
        },
        {
            title: 'Peer Forum',
            description: 'A safe space to share experiences, discover empathy, and connect with people who understand your journey.',
            route: '/peer-forum',
            icon: (
                <div className="tile-icon icon-animate-peer" style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 6px 18px rgba(16,185,129,0.06)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 3V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <path d="M8 10h8" />
                    </svg>
                </div>
            )
        },
        {
            title: 'Book a Counsellor',
            description: 'Schedule one-on-one guidance with trusted professionals and regain calm with personalized care.',
            route: '/book-counsellor',
            icon: (
                <div className="tile-icon icon-animate-counsellor" style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 6px 18px rgba(249,115,22,0.06)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </div>
            )
        },
        {
            title: 'Videos',
            description: 'Watch calming sessions, mindful tutorials, and expert stories designed to inspire peace.',
            route: '/videos',
            icon: (
                <div className="tile-icon icon-animate-video" style={{ width: '48px', height: '48px', borderRadius: '18px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
            )
        },
        {
            title: 'Library of Wisdom',
            description: 'Browse books, articles, and insights created to help you grow and feel grounded.',
            route: '/books',
            icon: (
                <div className="tile-icon" style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 6px 18px rgba(16,185,129,0.06)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7h14v13H3z" />
                        <path d="M7 3v4" />
                    </svg>
                </div>
            )
        },
        {
            title: 'Sound Sanctuary',
            description: 'Explore soothing melodies, calming soundscapes, and mindful music for inner peace.',
            route: '/sound-sanctuary',
            icon: (
                <div className="tile-icon icon-animate-sound" style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(249,115,22,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 6px 18px rgba(249,115,22,0.06)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v10" />
                        <circle cx="12" cy="17" r="4" />
                    </svg>
                </div>
            )
        },
        {
            title: 'Classes & Events',
            description: 'Join live workshops, group sessions, and community events to grow together and learn.',
            route: '/classes',
            icon: (
                <div className="tile-icon icon-animate-classes" style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 6px 18px rgba(59,130,246,0.08)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="14" rx="2" />
                        <path d="M8 20v-4" />
                    </svg>
                </div>
            )
        }
    ];

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="app-container" style={{ width: '100%', maxWidth: '100vw', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', padding: '2rem 2rem', backgroundImage: `url(${mainBg})` }}>
            <h2 className="gradient-text" style={{ fontSize: '3.2rem', margin: '0 0 1rem', fontWeight: '800', textAlign: 'center' }}>Aurexia at a glance</h2>
            <div className="glass-panel animate-fade-in" style={{
                padding: '2.5rem 3rem',
                maxWidth: '1400px',
                width: '100%',
                textAlign: 'center',
                animationDelay: '0.1s'
            }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '700', letterSpacing: '0.18em', color: 'var(--color-blue)' }}>Discover what makes Aurexia special</h3>
                <h2 className="gradient-text" style={{ fontSize: '2.8rem', margin: '0 0 1.2rem', fontWeight: '800' }}>Your personal sanctuary for mental wellness</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.85', fontSize: '1.15rem', maxWidth: '1200px', margin: '0 auto' }}>
                    Aurexia is your personal sanctuary for mental wellness, designed to bring clarity and peace to your digital life.
                    We are dedicated to helping you find balance and mindfulness in every step of your journey.
                </div>
            </div>

            <div style={{
                width: '100%',
                maxWidth: '1400px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '1.75rem',
                justifyItems: 'stretch',
                marginTop: '1.5rem'
            }}>
                <div className="glass-panel animate-fade-in" style={{
                    padding: '2.25rem',
                    flex: '1 1 520px',
                    minWidth: '320px',
                    width: '100%',
                    textAlign: 'center',
                    animationDelay: '0.2s',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '800' }}>{t('ourVision')}</h2>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '1.05rem' }}>
                        To create a world where mental well-being is a seamless part of daily life, accessible to every soul, anywhere, at any time.
                        We envision a future where digital spaces foster genuineness and tranquility.
                    </div>
                </div>

                <div className="glass-panel animate-fade-in" style={{
                    padding: '2.25rem',
                    flex: '1 1 520px',
                    minWidth: '340px',
                    width: '100%',
                    textAlign: 'center',
                    animationDelay: '0.3s',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '800' }}>{t('ourMission')}</h2>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '1.05rem' }}>
                        Aurexia seeks to provide a serene digital sanctuary, empowering individuals through compassionate technology,
                        supportive community, and professional guidance to cultivate resilience and inner peace.
                    </div>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '1400px', marginTop: '1.5rem', textAlign: 'center' }}>
                <h2 className="gradient-text animate-fade-in" style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: '800' }}>{t('whatWeOffer')}</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '1.75rem',
                    width: '100%',
                    justifyItems: 'center'
                }}>
                    {offerCards.map((card, index) => {
                        const isLast = index === offerCards.length - 1;
                        return (
                            <div key={index} className="glass-panel animate-fade-in" onClick={() => card.route && navigate(card.route)} style={{
                                padding: '1.8rem',
                                textAlign: 'left',
                                animationDelay: `${0.15 + index * 0.08}s`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                minHeight: '240px',
                                width: '100%',
                                maxWidth: '640px',
                                justifySelf: isLast ? 'center' : 'stretch',
                                gridColumn: isLast ? '2 / 3' : 'auto',
                                cursor: card.route ? 'pointer' : 'default'
                            }}>
                                {card.icon}
                                <h3 className="gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.8rem', fontWeight: '800' }}>{card.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.98rem' }}>{card.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '1400px', marginTop: '2.5rem', textAlign: 'center', position: 'relative' }}>
                <h2 className="gradient-text animate-fade-in" style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: '800' }}>What our community says</h2>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div 
                        ref={scrollRef}
                        style={{
                            display: 'flex',
                            gap: '2rem',
                            paddingBottom: '2.5rem',
                            padding: '1rem',
                            overflowX: 'auto',
                            scrollBehavior: 'smooth',
                            width: '100%'
                        }}
                        className="no-scrollbar"
                    >
                        {[
                            { name: 'Aarav S.', role: 'Student', quote: 'Aurexia helped me manage exam stress. The AI companion is always there.', rating: 5 },
                            { name: 'Priya M.', role: 'University Student', quote: "Aurexia's resources are a life-saver during finals week. Highly recommended!", rating: 5 },
                            { name: 'Sarah K.', role: 'Graphic Designer', quote: 'The daily check-ins give me so much peace and help me stay grounded.', rating: 5 },
                            { name: 'David L.', role: 'Software Engineer', quote: 'I\'ve never felt more supported. The community is incredibly empathetic.', rating: 4 },
                            { name: 'Elena R.', role: 'Teacher', quote: 'The peer forum is such a safe space to share and heal together.', rating: 5 },
                            { name: 'Michael B.', role: 'Marketing Manager', quote: 'Booking a counsellor was seamless. The professional help is top-notch.', rating: 5 },
                            { name: 'Anita Y.', role: 'Nurse', quote: 'The sounds sanctuary helps me sleep every night after long shifts.', rating: 5 },
                            { name: 'James T.', role: 'Freelancer', quote: 'A wonderful community for mental wellness. The interface is beautiful.', rating: 4 },
                            { name: 'Chloe W.', role: 'Writer', quote: 'The guided reflections are incredibly insightful and spark my creativity.', rating: 5 },
                            { name: 'Rahul P.', role: 'Chef', quote: 'Aurexia is my go-to app for mindfulness during a busy day in the kitchen.', rating: 5 },
                            { name: 'Emma H.', role: 'Architect', quote: 'I love the AI companion, it\'s always there to listen without judgment.', rating: 5 },
                            { name: 'Liam F.', role: 'College Student', quote: 'The video resources are fantastic. Very calming and informative.', rating: 4 },
                            { name: 'Sofia G.', role: 'HR Specialist', quote: 'Finally, a mental health platform that actually cares about its users.', rating: 5 },
                            { name: 'Oliver N.', role: 'Musician', quote: 'The live classes are engaging and have taught me great coping mechanisms.', rating: 5 },
                            { name: 'Mia D.', role: 'UI/UX Designer', quote: 'A beautiful interface and amazing features. A joy to use daily.', rating: 5 },
                            { name: 'William C.', role: 'Sales Rep', quote: 'Aurexia changed my approach to self-care completely for the better.', rating: 5 },
                            { name: 'Isabella V.', role: 'Librarian', quote: 'The library of wisdom is packed with great, inspiring reads.', rating: 4 },
                            { name: 'Noah J.', role: 'Entrepreneur', quote: 'Highly recommend this to anyone feeling overwhelmed by their work.', rating: 5 },
                            { name: 'Ava L.', role: 'Yoga Instructor', quote: 'The daily positive affirmations keep me motivated and centered.', rating: 5 },
                            { name: 'Lucas M.', role: 'Photographer', quote: 'Such a calming and well-designed platform. It truly feels like a sanctuary.', rating: 5 }
                        ].map((review, index) => (
                            <div key={index} className="glass-panel animate-fade-in" style={{
                                padding: '2.5rem',
                                textAlign: 'left',
                                animationDelay: `${0.1 + (index * 0.05)}s`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.25rem',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                minWidth: '320px',
                                maxWidth: '320px',
                                flexShrink: 0,
                                borderRadius: '20px'
                            }}>
                                <div style={{ display: 'flex', gap: '4px', color: '#fbbf24' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                                <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', flex: '1', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                    "{review.quote}"
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{review.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-blue)', fontWeight: '600', marginTop: '4px' }}>{review.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
