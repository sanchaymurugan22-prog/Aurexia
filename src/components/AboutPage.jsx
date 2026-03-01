import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/main.webp';
import aboutBg from '../assets/aboutpage.jpg';

const AboutPage = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

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
        <>
            {/* Fixed Background Layer */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${aboutBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                zIndex: -1
            }}></div>

            <div className="app-container" style={{
                background: 'transparent',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: '4rem 1rem 1rem', // Minimal bottom padding
                height: 'auto',
                minHeight: 'min-content', // Allow it to collapse to content size
                overflow: 'visible'
            }}>
                <button className="nav-btn" onClick={() => navigate(-1)} style={{
                    position: 'fixed',
                    top: '2rem',
                    left: '2rem',
                    zIndex: 100
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </button>

                {/* Top Center Branding Section */}
                <div className="branding-section animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <img src={logo} alt="Aurexia Logo" style={{ width: '90px', height: '90px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }} />
                    <h1 className="title-small gradient-text" style={{ fontSize: '3.5rem', margin: '0.5rem 0' }}>Aurexia</h1>
                    <p className="tagline-small" style={{ fontSize: '1.25rem', color: 'white', fontWeight: '500' }}>Lightness for the mind</p>
                </div>

                {/* Content Sections Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
                    {/* Description Card */}
                    <div className="glass-panel animate-fade-in" style={{
                        padding: '2rem 3rem',
                        maxWidth: '800px',
                        textAlign: 'center',
                        animationDelay: '0.1s'
                    }}>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem' }}>
                            Aurexia is your personal sanctuary for mental wellness,
                            designed to bring clarity and peace to your digital life.
                            We are dedicated to helping you find balance and mindfulness
                            in every step of your journey.
                        </div>
                    </div>

                    {/* Parallel Vision & Mission Container */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '2rem',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        width: '100%',
                        maxWidth: '1000px',
                        flexWrap: 'wrap'
                    }}>
                        {/* Vision Card */}
                        <div className="glass-panel animate-fade-in" style={{
                            padding: '2rem',
                            flex: '1',
                            minWidth: '300px',
                            maxWidth: '450px',
                            textAlign: 'center',
                            animationDelay: '0.2s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '700' }}>Our Vision</h2>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                                To create a world where mental well-being is a seamless part of daily life,
                                accessible to every soul, anywhere, at any time. We envision a future
                                where digital spaces foster genuineness and tranquility.
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="glass-panel animate-fade-in" style={{
                            padding: '2rem',
                            flex: '1',
                            minWidth: '300px',
                            maxWidth: '450px',
                            textAlign: 'center',
                            animationDelay: '0.3s',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h2 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '700' }}>Our Mission</h2>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                                Aurexia seeks to provide a serene digital sanctuary, empowering individuals
                                through compassionate technology, supportive community, and professional
                                guidance to cultivate resilience and inner peace.
                            </div>
                        </div>
                    </div>

                    {/* What We Offer Section */}
                    <div style={{ width: '100%', maxWidth: '1000px', marginTop: '3rem', textAlign: 'center' }}>
                        <h2 className="gradient-text animate-fade-in" style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: '800' }}>What We Offer</h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                            gap: '2.5rem',
                            width: '100%'
                        }}>
                            {/* AI Companion */}
                            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'left', animationDelay: '0.4s' }}>
                                <div style={{ marginBottom: '1.5rem', color: 'var(--color-blue)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                                </div>
                                <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI Companion</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    Your always-available empathetic partner, providing immediate support, guided meditations,
                                    and a safe space to express your thoughts without judgment.
                                </p>
                            </div>

                            {/* Peer Forum */}
                            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'left', animationDelay: '0.5s' }}>
                                <div style={{ marginBottom: '1.5rem', color: 'var(--color-green)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                                <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Peer Forum</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    Connect with a supportive community. Share experiences, find encouragement,
                                    and grow together in a safe, moderated environment built on mutual respect.
                                </p>
                            </div>

                            {/* Professional Counselling */}
                            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'left', animationDelay: '0.6s' }}>
                                <div style={{ marginBottom: '1.5rem', color: 'var(--color-orange)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1a.3.3 0 1 0 .2-.3Z" /><path d="M13 15c.3 0 .5.3.5.5s-.2.5-.5.5h-2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1a.3.3 0 1 1 0 .7H11a1.3 1.3 0 0 0-1.3 1.3v5c0 .7.6 1.3 1.3 1.3h2Z" /><path d="M16 19a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-1a.3.3 0 1 0-.2.3Z" /><circle cx="12" cy="12" r="3" /><path d="m11.3 12.7.7-.7.7.7" /><path d="m11.3 11.3.7.7.7-.7" /></svg>
                                </div>
                                <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Professional Counselling</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    Access certified mental health professionals for personalized 1-on-1 sessions.
                                    Our platform offers secure, confidential, and tailored guidance for your needs.
                                </p>
                            </div>

                            {/* Resources */}
                            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'left', animationDelay: '0.7s' }}>
                                <div style={{ marginBottom: '1.5rem', color: 'var(--color-blue)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M13 3v11l-3-3-3 3V3" /></svg>
                                </div>
                                <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Resources</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    A curated library of articles, toolkits, and interactive exercises designed to help
                                    you understand your mind and cultivate lasting resilience and peace.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Community Reviews Section */}
                    <div style={{ width: '100%', maxWidth: '1400px', marginTop: '5rem', textAlign: 'center' }}>
                        <h2 className="gradient-text animate-fade-in" style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: '800' }}>What our community says</h2>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflowX: 'auto',
                            gap: '2rem',
                            paddingBottom: '2.5rem',
                            scrollBehavior: 'smooth',
                            WebkitOverflowScrolling: 'touch',
                            padding: '1rem'
                        }}>
                            {[
                                { name: "Aarav S.", role: "School Student", quote: "Aurexia helped me manage exam stress. The AI companion is like a friend who always listens." },
                                { name: "Priya M.", role: "College Student", quote: "Finding a balance between studies and life was hard. Aurexia's resources are a life-saver." },
                                { name: "James L.", role: "Software Engineer", quote: "Burning out is real. Using the breathing exercises during breaks has kept me sane." },
                                { name: "Sarah T.", role: "School Student", quote: "I used to feel lonely, but the peer forum showed me I'm not alone in my struggles." },
                                { name: "David K.", role: "Retired Teacher", quote: "It's never too late to prioritize mental health. This app is simple enough for everyone." },
                                { name: "Ananya R.", role: "College Student", quote: "The professional counselling is so easy to access. No more waiting weeks for an appointment." },
                                { name: "Michael B.", role: "Sales Manager", quote: "High-pressure jobs need high-quality support. Aurexia provides exactly that." },
                                { name: "Emma W.", role: "Parent", quote: "As a mother of two, finding 'me time' is hard. Aurexia's meditations are perfect." },
                                { name: "Robert P.", role: "Doctor", quote: "I recommend Aurexia to my patients for mindfulness. It's a great supplementary tool." },
                                { name: "Isabella S.", role: "Graphic Designer", quote: "The glassmorphic design is beautiful! It makes mental care feel premium." }
                            ].map((review, index) => (
                                <div key={index} className="glass-panel animate-fade-in" style={{
                                    padding: '2.5rem',
                                    textAlign: 'left',
                                    animationDelay: `${0.1 + (index % 5) * 0.1}s`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.25rem',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    minWidth: '500px',
                                    maxWidth: '500px',
                                    flexShrink: 0
                                }}>
                                    {/* Star Rating */}
                                    <div style={{ display: 'flex', gap: '4px', color: '#FFD700' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        ))}
                                    </div>

                                    {/* Review Quote */}
                                    <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', flex: '1', fontSize: '1.5rem', lineHeight: '1.6' }}>
                                        "{review.quote}"
                                    </div>

                                    {/* Reviewer Info with Profile Icon */}
                                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '50%',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(255, 255, 255, 0.2)'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{review.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-blue)', fontWeight: '600' }}>{review.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Our Core Values Section */}
                    <div style={{ width: '100%', maxWidth: '1400px', marginTop: '5rem', marginBottom: '0', textAlign: 'center', marginLeft: '-4rem' }}>
                        <h2 className="gradient-text animate-fade-in" style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: '800' }}>Our core values</h2>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1.5rem',
                            width: '100%',
                            padding: '0 2rem'
                        }}>
                            {/* Left Navigation Arrow */}
                            <button className="nav-btn icon-only-btn animate-fade-in" onClick={() => scroll('left')} style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                flexShrink: 0,
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            {/* Core Values Scrolling Container */}
                            <div
                                ref={scrollRef}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflowX: 'hidden',
                                    gap: '2rem',
                                    paddingBottom: '2.5rem',
                                    scrollBehavior: 'smooth',
                                    WebkitOverflowScrolling: 'touch',
                                    padding: '1rem',
                                    flex: 1,
                                    msOverflowStyle: 'none',
                                    scrollbarWidth: 'none'
                                }}
                            >
                                {[
                                    {
                                        title: "Respect",
                                        desc: "Fostering an environment of dignity and mutual understanding for every soul we touch.",
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
                                        color: "var(--color-blue)"
                                    },
                                    {
                                        title: "Team Spirit",
                                        desc: "Building a supportive community where we grow together, believing the whole is greater than the sum of its parts.",
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                                        color: "var(--color-green)"
                                    },
                                    {
                                        title: "Knowledge Sharing",
                                        desc: "Empowering each other with insights, shared experiences, and collective wisdom for mental clarity.",
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>,
                                        color: "var(--color-orange)"
                                    },
                                    {
                                        title: "Expertise",
                                        desc: "Commitment to professional excellence and scientifically-backed guidance in every wellbeing resource.",
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
                                        color: "var(--color-blue)"
                                    },
                                    {
                                        title: "Quality",
                                        desc: "Delivering the highest standard of care and premium digital experiences for our community.",
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="m4.93 4.93 14.14 14.14" /><path d="M2 12h20" /><path d="m4.93 19.07 14.14-14.14" /></svg>,
                                        color: "var(--color-green)"
                                    },
                                    {
                                        title: "Creativity",
                                        desc: "Innovating new paths toward mindfulness, using technology to foster peace and tranquility.",
                                        icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-3.92 19.21c.54.24.73.76.73 1.28v.51c0 .55.45 1 1 1h4.38c.55 0 1-.45 1-1v-.51c0-.52.19-1.04.73-1.28A10 10 0 0 0 12 2" /><path d="M9 10h6" /><path d="M10 14h4" /><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M2 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="M12 22v-2" /><path d="m19.07 19.07-1.41-1.41" /><path d="M22 12h-2" /><path d="m19.07 4.93-1.41 1.41" /></svg>,
                                        color: "var(--color-orange)"
                                    }
                                ].map((value, index) => (
                                    <div key={index} className="glass-panel animate-fade-in" style={{
                                        padding: '2.5rem',
                                        textAlign: 'left',
                                        animationDelay: `${0.4 + index * 0.1}s`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.25rem',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        minWidth: '350px',
                                        maxWidth: '350px',
                                        flexShrink: 0
                                    }}>
                                        <div style={{ color: value.color }}>
                                            {value.icon}
                                        </div>
                                        <h3 className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: '700' }}>{value.title}</h3>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
                                            {value.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Right Navigation Arrow */}
                            <button className="nav-btn icon-only-btn animate-fade-in" onClick={() => scroll('right')} style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                flexShrink: 0,
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    </div>

                    {/* Meet Our Team Section */}
                    <div style={{ width: '100%', maxWidth: '1200px', marginTop: '6rem', marginBottom: '2rem', textAlign: 'center' }}>
                        <h2 className="gradient-text animate-fade-in" style={{ fontSize: '3rem', marginBottom: '3.5rem', fontWeight: '800' }}>Meet our team</h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '2.5rem',
                            width: '100%'
                        }}>
                            {[
                                {
                                    name: "Sanchay",
                                    role: "Founder & CEO",
                                    bio: "Sanchay founded Aurexia with a mission to make mental wellness a priority for everyone, everywhere.",
                                    color: "var(--color-blue)"
                                },
                                {
                                    name: "Harishmitha",
                                    role: "Chief Psychologist",
                                    bio: "Dr. Harishmitha leads our team of wellness experts, ensuring our content is rooted in compassion and science.",
                                    color: "var(--color-green)"
                                },
                                {
                                    name: "Giridhari Prakash",
                                    role: "Lead AI Engineer",
                                    bio: "Giridhari is the architect behind our empathetic AI companion, constantly improving its ability to listen and support.",
                                    color: "var(--color-orange)"
                                },
                                {
                                    name: "Sharmila",
                                    role: "Chief Wellness Officer",
                                    bio: "Sharmila oversees the holistic wellness strategy, ensuring all of Aurexia's resources are effective and beneficial.",
                                    color: "var(--color-blue)"
                                },
                                {
                                    name: "Kevin",
                                    role: "Lead Product Designer",
                                    bio: "Kevin crafts the user experience, ensuring Aurexia is intuitive, accessible, and a pleasure to use.",
                                    color: "var(--color-green)"
                                },
                                {
                                    name: "Harishini",
                                    role: "Community Manager",
                                    bio: "Harishini nurtures our peer forum, fostering a safe, anonymous, and supportive space for everyone.",
                                    color: "var(--color-orange)"
                                }
                            ].map((member, index) => (
                                <div key={index} className="glass-panel animate-fade-in" style={{
                                    padding: '2.5rem',
                                    textAlign: 'center',
                                    animationDelay: `${0.1 + (index * 0.1)}s`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '1.25rem',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    {/* Profile Icon Placeholder */}
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: `2px solid ${member.color}`,
                                        marginBottom: '0.5rem'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{member.name}</h3>
                                        <p style={{ fontSize: '1rem', fontWeight: '600', color: member.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{member.role}</p>
                                    </div>

                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                        {member.bio}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
