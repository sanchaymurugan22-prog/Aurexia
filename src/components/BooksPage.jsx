import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/books.avif';

const BooksPage = () => {
    const navigate = useNavigate();
    const [selectedBook, setSelectedBook] = useState(null);
    const [brokenImages, setBrokenImages] = useState(new Set());
    const [visibleCount, setVisibleCount] = useState(8);

    const handleImageError = (id) => {
        setBrokenImages(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 8, books.length));
    };

    const books = [
        {
            title: "Meditations",
            author: "Marcus Aurelius",
            theme: "Stoicism & Peace",
            archiveId: "dli.ministry.16976",
            coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
            color: "linear-gradient(135deg, #1e293b, #334155)"
        },
        {
            title: "As a Man Thinketh",
            author: "James Allen",
            theme: "Mindset & Wellness",
            archiveId: "asmanthinketh00alleiala",
            coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
            color: "linear-gradient(135deg, #0ea5e9, #22d3ee)"
        },
        {
            title: "The Prophet",
            author: "Kahlil Gibran",
            theme: "Spirituality & Love",
            archiveId: "prophet0000kahl_f5b5",
            coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
            color: "linear-gradient(135deg, #f59e0b, #fbbf24)"
        },
        {
            title: "Walden",
            author: "Henry David Thoreau",
            theme: "Solitude & Nature",
            archiveId: "henry-david-thoreau_walden",
            coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
            color: "linear-gradient(135deg, #10b981, #34d399)"
        },
        {
            title: "Siddhartha",
            author: "Hermann Hesse",
            theme: "Spiritual Journey",
            archiveId: "Siddhartha-HermanHesse",
            coverImage: "https://images.unsplash.com/photo-1512753362248-6630593ddc74",
            color: "linear-gradient(135deg, #8b5cf6, #a78bfa)"
        },
        {
            title: "The Dhammapada",
            author: "Buddha",
            theme: "Wisdom & Peace",
            archiveId: "Dhammapada_201307",
            coverImage: "https://images.unsplash.com/photo-1467634863644-8a706dbf4369",
            color: "linear-gradient(135deg, #ef4444, #f87171)"
        },
        {
            title: "Thinking as a Science",
            author: "Henry Hazlitt",
            theme: "Mental Clarity",
            archiveId: "thinkingasscienc01hazl",
            coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8",
            color: "linear-gradient(135deg, #3b82f6, #60a5fa)"
        },
        {
            title: "Self-Reliance",
            author: "Ralph Waldo Emerson",
            theme: "Individuality",
            archiveId: "selfreliance00emer",
            coverImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8",
            color: "linear-gradient(135deg, #16a34a, #4ade80)"
        },
        {
            title: "Gitanjali",
            author: "Rabindranath Tagore",
            theme: "Spiritual Poetry",
            archiveId: "gitanjali00unse",
            coverImage: "https://images.unsplash.com/photo-1464675402506-69670d9da993",
            color: "linear-gradient(135deg, #ea580c, #fb923c)"
        },
        {
            title: "The Bhagavad Gita",
            author: "Vyasa",
            theme: "Divine Wisdom",
            archiveId: "gitapress-gita-roman",
            coverImage: "https://images.unsplash.com/photo-1609139003551-ee40f5f73ec0",
            color: "linear-gradient(135deg, #d97706, #f59e0b)"
        },
        {
            title: "The Art of War",
            author: "Sun Tzu",
            theme: "Strategy & Peace",
            archiveId: "artofwar0000sunz_o9w6",
            coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            color: "linear-gradient(135deg, #991b1b, #b91c1c)"
        },
        {
            title: "Beyond Good & Evil",
            author: "F. Nietzsche",
            theme: "Philosophy",
            archiveId: "beyondgoodevil0000niet",
            coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
            color: "linear-gradient(135deg, #451a03, #78350f)"
        },
        {
            title: "Tao Te Ching",
            author: "Lao Tzu",
            theme: "Ancient Wisdom",
            archiveId: "taotechinglaotzu00laot",
            coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            color: "linear-gradient(135deg, #475569, #64748b)"
        },
        {
            title: "The Book of Tea",
            author: "Kakuzo Okakura",
            theme: "Zen & Aesthetics",
            archiveId: "bookoftea00okak_0",
            coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
            color: "linear-gradient(135deg, #059669, #10b981)"
        },
        {
            title: "Common Sense",
            author: "Thomas Paine",
            theme: "Reason & Freedom",
            archiveId: "commonsense01pain",
            coverImage: "https://images.unsplash.com/photo-1491849231940-844a4ca8882b",
            color: "linear-gradient(135deg, #dc2626, #ef4444)"
        },
        {
            title: "Narrative of the Life",
            author: "Frederick Douglass",
            theme: "Freedom & Grit",
            archiveId: "narrativeoflifeo00doug",
            coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
            color: "linear-gradient(135deg, #4b5563, #6b7280)"
        },
        {
            title: "Leaves of Grass",
            author: "Walt Whitman",
            theme: "Life & Nature",
            archiveId: "leavesofgrass00whitiala",
            coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
            color: "linear-gradient(135deg, #16a34a, #22c55e)"
        },
        {
            title: "The Varieties of Religious Experience",
            author: "William James",
            theme: "Spirituality",
            archiveId: "varietiesofreli00jameuoft",
            coverImage: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866",
            color: "linear-gradient(135deg, #4f46e5, #6366f1)"
        },
        {
            title: "The Soul of Man",
            author: "Oscar Wilde",
            theme: "Individualism",
            archiveId: "soulofmancentral00wild",
            coverImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853",
            color: "linear-gradient(135deg, #7c3aed, #8b5cf6)"
        },
        {
            title: "Duty",
            author: "Samuel Smiles",
            theme: "Character & Ethics",
            archiveId: "dutywithillustr00smilgoog",
            coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
            color: "linear-gradient(135deg, #2563eb, #3b82f6)"
        }
    ];

    return (
        <div className="app-container" style={{
            background: 'transparent',
            minHeight: 'auto',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflow: 'visible'
        }}>
            {/* Fixed Background Layer */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#0f172a', // Fallback dark color
                backgroundImage: `url(${mainBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                zIndex: -1
            }}></div>
            <header className="top-panel" style={{
                justifyContent: 'flex-start',
                background: 'none',
                backdropFilter: 'none',
                borderBottom: 'none',
                WebkitBackdropFilter: 'none',
                paddingTop: '2.5rem'
            }}>
                <button className="nav-btn" onClick={() => navigate('/main')} style={{ marginLeft: '1rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </button>
            </header>

            <main className="hero-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, paddingTop: '6rem', paddingBottom: '2rem' }}>
                <h1 className="title gradient-text" style={{ fontSize: '4.5rem', marginBottom: '4rem' }}>Library of Wisdom</h1>

                <div className="books-grid" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2.5rem',
                    maxWidth: '1200px',
                    width: '95%',
                    padding: '0 1.5rem',
                    margin: '0 auto',
                    justifyContent: 'center'
                }}>
                    {books
                        .filter(book => !brokenImages.has(book.archiveId))
                        .slice(0, visibleCount)
                        .map((book, index) => (
                            <div
                                key={index}
                                className="glass-panel book-card animate-fade-in"
                                style={{
                                    animationDelay: `${index * 0.05}s`,
                                    padding: '1.2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease',
                                    height: 'auto',
                                    width: '320px',
                                    flex: '0 1 320px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '16px'
                                }}
                                onClick={() => setSelectedBook(book)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.05)';
                                    const img = e.currentTarget.querySelector('.cover-img');
                                    if (img) img.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    const img = e.currentTarget.querySelector('.cover-img');
                                    if (img) img.style.transform = 'scale(1)';
                                }}
                            >
                                <div className="book-cover" style={{
                                    width: '100%',
                                    aspectRatio: '3/4.2',
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    marginBottom: '1.2rem',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                                    position: 'relative',
                                    background: book.color
                                }}>
                                    <img
                                        src={`${book.coverImage}?auto=format&fit=crop&q=80&w=600`}
                                        alt={book.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.6s ease'
                                        }}
                                        className="cover-img"
                                        onError={() => handleImageError(book.archiveId)}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.65rem',
                                        color: 'white',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {book.theme}
                                    </div>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white', margin: '0 0 0.3rem 0', lineHeight: '1.3', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{book.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 1.2rem 0' }}>{book.author}</p>
                                <div style={{
                                    marginTop: 'auto',
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.1)',
                                    fontSize: '0.85rem',
                                    padding: '0.7rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: '600'
                                }}>
                                    Read Inside
                                </div>
                            </div>
                        ))}
                </div>

                {visibleCount < books.length && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '5rem',
                        width: '100%'
                    }}>
                        <button
                            className="glass-panel"
                            style={{
                                padding: '1.2rem 3.5rem',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(15px)',
                                borderRadius: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.08) translateY(-5px)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onClick={handleLoadMore}
                        >
                            View more
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                )}
            </main>

            {/* Internal PDF Viewer Overlay */}
            {
                selectedBook && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 2000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.95)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <div style={{
                            width: '98%',
                            height: '95%',
                            maxWidth: '1400px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                padding: '0.7rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white', fontWeight: '800' }}>{selectedBook.title}</h2>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.8, margin: 0, color: 'white' }}>{selectedBook.author}</p>
                                </div>
                                <button
                                    className="nav-btn"
                                    onClick={() => setSelectedBook(null)}
                                    style={{
                                        background: 'var(--color-blue)',
                                        color: 'white',
                                        padding: '0.7rem 1.5rem',
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                    Exit Reader
                                </button>
                            </div>
                            <div style={{
                                flex: 1,
                                background: '#000',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 30px 80px rgba(0,0,0,1)',
                                position: 'relative',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <iframe
                                    src={`https://archive.org/embed/${selectedBook.archiveId}?ui=full&view=theater`}
                                    title={selectedBook.title}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                    frameBorder="0"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Decorative background elements */}
            <div className="glow-orb orb-1" style={{ position: 'fixed' }}></div>
            <div className="glow-orb orb-2" style={{ position: 'fixed' }}></div>
        </div >
    );
};

export default BooksPage;
