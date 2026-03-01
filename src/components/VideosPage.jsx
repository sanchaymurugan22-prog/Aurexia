import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import mainBg from '../assets/videos.jpg';

const MENTAL_HEALTH_VIDEOS = [
    { title: "TED: What Makes a Good Life?", id: "8KkKuTCFvzI" },
    { title: "TED: How to Make Stress Your Friend", id: "RcGyVTAoXEU" },
    { title: "TED: The Power of Vulnerability", id: "iCvmsMzlF7o" },
    { title: "TED: All it Takes is 10 Mindful Minutes", id: "qzR62JJCMBQ" },
    { title: "TED: My Stroke of Insight", id: "UyyjU8fzEYU" },
    { title: "TED: How to Stay Calm Under Stress", id: "8jPQjjsBbIc" },
    { title: "TED: How to Practice Emotional First Aid", id: "F2hc2FLOdhI" },
    { title: "TED-Ed: What is Depression?", id: "z-IR48Mb3W0" },
    { title: "Yoga With Adriene: 10-Minute Yoga For Self Care", id: "VpW33Celubg" },
    { title: "Yoga With Adriene: Yoga For Anxiety and Stress", id: "hJbRpHZr_d0" },
    { title: "Thich Nhat Hanh: The Art of Suffering", id: "RVYnN8mBejY" },
    { title: "Moojiji: A Commitment to Self Discovery", id: "ftRwpnBsam4" },
    { title: "Anna Freud: We All Have Mental Health", id: "DxIDKZHW3-E" },
    { title: "Mel Robbins: How to Stop Screwing Yourself Over", id: "Lp7E973zozc" },
    { title: "Headspace: Quick Meditation - Changing Perspective", id: "iN6g2mr0p3Q" },
    { title: "The Honest Guys: 10-Minute Guided Mindfulness Meditation", id: "6p_yaNFSYao" },
    { title: "TED: How to Make Learning as Addictive as Social Media", id: "P6FORpg0KVo" },
    { title: "TEDx: The Skill of Self Confidence", id: "w-HYZv6HzAs" },
    { title: "TED: 10 Ways to Have a Better Conversation", id: "R1vskiVDwl4" },
    { title: "TED: Grit - The Power of Passion and Perseverance", id: "H14bBuluwB8" },
    { title: "TED: Why Social Health is Key to Happiness", id: "LpSDuDIaBGk" },
    { title: "TED: Changing the Narrative of Mental Health", id: "G5UT0K_NEig" },
    { title: "One-Moment Meditation: How to Meditate in a Moment", id: "F6eFFCi12v8" },
    { title: "The Honest Guys: Blissful Deep Relaxation", id: "Jyy0ra2WcQQ" },
    { title: "TED: The Power of Introverts", id: "c0KYU2j0TM4" },
    { title: "TED: The Power of Believing You Can Improve", id: "_X0mgOOSpLU" },
    { title: "Psych2Go: 8 Toxic Things Parents Say", id: "GS_mATLF7BE" },
    { title: "Psych2Go: Burnout vs Depression", id: "bPSHOlvAlm8" }
];

const VideosPage = () => {
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(18);

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 10, MENTAL_HEALTH_VIDEOS.length));
    };

    return (
        <div className="app-container" style={{
            background: 'transparent',
            height: 'auto',
            minHeight: 'auto',
            overflow: 'visible',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '2rem 2rem 0 2rem'
        }}>
            {/* Fixed Background Layer */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${mainBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                zIndex: -1
            }}></div>
            <header className="top-panel" style={{
                position: 'relative',
                background: 'none',
                backdropFilter: 'none',
                border: 'none',
                padding: '0 0 2rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 'auto',
                width: '100%'
            }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <button className="nav-btn" onClick={() => navigate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Back
                    </button>
                </div>
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <h1 className="gradient-text" style={{ fontSize: '5rem', margin: 0, fontWeight: '900', letterSpacing: '-3px', lineHeight: '1' }}>Videos</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '1rem', fontWeight: '500' }}>
                        Peace, Spirituality & Mental Wellness
                    </p>
                </div>
            </header>

            <main style={{
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '1rem 0 0 0'
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '2rem',
                    width: '100%'
                }}>
                    {MENTAL_HEALTH_VIDEOS.slice(0, visibleCount).map((video, index) => (
                        <div
                            key={`${video.id}-${index}`}
                            className="glass-panel animate-fade-in"
                            style={{
                                padding: '1.5rem',
                                animationDelay: `${index * 0.05}s`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                transition: 'transform 0.3s ease',
                                cursor: 'default',
                                width: '100%',
                                maxWidth: '400px',
                                flex: '1 1 320px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                position: 'relative',
                                paddingBottom: '56.25%', // 16:9 Aspect Ratio
                                height: 0,
                                overflow: 'hidden',
                                borderRadius: '12px',
                                background: 'rgba(0,0,0,0.1)'
                            }}>
                                <iframe
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: 'none'
                                    }}
                                    src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                margin: 0,
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                lineHeight: '1.4'
                            }}>
                                {video.title}
                            </h3>
                        </div>
                    ))}
                </div>

                {visibleCount < MENTAL_HEALTH_VIDEOS.length && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '4rem'
                    }}>
                        <button
                            className="glass-panel"
                            style={{
                                padding: '1rem 3rem',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                            onClick={handleLoadMore}
                        >
                            View more
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                )}
            </main>

            {/* Decorative background elements */}
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
        </div>
    );
};

export default VideosPage;
