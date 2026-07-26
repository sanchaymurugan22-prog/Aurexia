import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// --- Icons (SVG) ---
const Icons = {
  Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Search: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Library: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>,
  Play: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8z"/></svg>,
  Pause: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>,
  SkipBack: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>,
  SkipFwd: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>,
  Volume: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
  Back: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Heart: ({ solid }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Dots: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
};

const MeditationTracks = () => {
  const navigate = useNavigate();
  
  // App State
  const [currentUser, setCurrentUser] = useState(null);
  const [allTracks, setAllTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Audio & Playback State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('0:00');
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  // App Features State
  const [tabHistory, setTabHistory] = useState(['home']);
  const activeTab = tabHistory[tabHistory.length - 1];

  const [searchQuery, setSearchQuery] = useState('');
  const [focusedTrack, setFocusedTrack] = useState(null);
  const [menuTrackId, setMenuTrackId] = useState(null);
  
  // Persisted Data State (Firebase)
  const [likedSongs, setLikedSongs] = useState([]); // array of track objects
  const [albums, setAlbums] = useState([]); // array of { id, name, tracks: [trackObjects] }
  const [newAlbumName, setNewAlbumName] = useState('');
  
  // Computed displayed tracks (useMemo so it updates Reactively)
  const displayedTracks = useMemo(() => {
    if (activeTab === 'search') {
      if (!searchQuery) return [];
      const q = searchQuery.toLowerCase();
      return allTracks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
      );
    }
    if (activeTab === 'liked') {
      return likedSongs;
    }
    if (activeTab !== 'home') {
      const album = albums.find(a => a.id === activeTab);
      if (album) return album.tracks;
      return [];
    }
    return allTracks; 
  }, [allTracks, likedSongs, albums, activeTab, searchQuery]);

  // Auto-Play Next Track Logic
  const handleTrackEnded = () => {
    // Determine the current playlist context. If we are focused on a single track but there is an active playlist in the background, we use the active tab's tracks.
    const activeList = displayedTracks;
    if (activeList.length === 0 || !currentTrack) {
        setIsPlaying(false);
        return;
    }
    
    const currentIndex = activeList.findIndex(t => t.id === currentTrack.id);
    let nextIndex = 0;
    
    if (currentIndex !== -1 && currentIndex < activeList.length - 1) {
        nextIndex = currentIndex + 1;
    } else {
        // Loop to start if it was the last track, or play random if it wasn't in the list
        nextIndex = Math.floor(Math.random() * activeList.length);
    }
    
    const nextTrack = activeList[nextIndex];
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
    
    // If the user is currently viewing a single focused track, update the view to the new track too!
    if (focusedTrack) {
      setFocusedTrack(nextTrack);
    }
  };

  const handleNextTrack = () => handleTrackEnded();

  const handlePrevTrack = () => {
    const activeList = displayedTracks;
    if (activeList.length === 0 || !currentTrack) return;
    
    const currentIndex = activeList.findIndex(t => t.id === currentTrack.id);
    let prevIndex = activeList.length - 1;
    
    if (currentIndex > 0) {
        prevIndex = currentIndex - 1;
    }
    
    const nextTrack = activeList[prevIndex];
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
    
    if (focusedTrack) {
      setFocusedTrack(nextTrack);
    }
  };

  // Internal Back Button Logic
  const handleInternalBack = () => {
    if (focusedTrack) {
      setFocusedTrack(null);
    } else if (tabHistory.length > 1) {
      setTabHistory(prev => prev.slice(0, -1));
    } else {
      navigate(-1);
    }
  };

  const changeTab = (tab) => {
    setFocusedTrack(null);
    setTabHistory(prev => [...prev, tab]);
  };

  // 1. Load User
  useEffect(() => {
    const init = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      setCurrentUser(user);

      try {
        const fetchedTracks = [];
        setAllTracks(fetchedTracks);
        if (fetchedTracks.length > 0) {
          setCurrentTrack(fetchedTracks[0]);
        }

        if (user && user.email) {
          setLikedSongs([]);
          setAlbums([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Playback blocked:", e);
        setIsPlaying(false);
      });
    }
  };

  const playTrack = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      togglePlayPause();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Attempt immediate play to bypass mobile restrictions, though autoPlay attribute will catch it too
      if (audioRef.current) {
         // Using setTimeout to let the DOM src update before calling play
         setTimeout(() => {
             audioRef.current.play().catch(e => console.error("Auto-play failed:", e));
         }, 50);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      if (dur) {
        setProgress((current / dur) * 100);
        const mins = Math.floor(current / 60);
        const secs = Math.floor(current % 60);
        setCurrentTimeFormatted(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current && audioRef.current.duration) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const handleVolumeSeek = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - bounds.left, bounds.width));
    setVolume(x / bounds.width);
  };

  const isLiked = (trackId) => likedSongs.some(t => t.id === trackId);

  const toggleLike = async (track, e) => {
    if(e) e.stopPropagation();
    if (!currentUser || !currentUser.email) {
      alert("Please log in to like songs.");
      return;
    }

    const currentlyLiked = isLiked(track.id);

    try {
      if (currentlyLiked) {
        setLikedSongs(prev => prev.filter(t => t.id !== track.id));
      } else {
        setLikedSongs(prev => [...prev, track]);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName.trim() || !currentUser) return;
    
    const albumId = 'pl_' + Date.now().toString();
    const newAlbum = { id: albumId, name: newAlbumName.trim(), tracks: [] };
    
    try {
      setAlbums([...albums, newAlbum]);
      setNewAlbumName('');
    } catch (err) {
      console.error("Error creating album:", err);
    }
  };

  const addTrackToAlbum = async (albumId, track, e) => {
    e.stopPropagation();
    if (!currentUser) return;

    try {
      const updatedAlbums = [...albums];
      const albumIndex = updatedAlbums.findIndex(a => a.id === albumId);
      if (albumIndex > -1) {
        const album = updatedAlbums[albumIndex];
        if (!album.tracks.some(t => t.id === track.id)) {
          album.tracks.push(track);
          setAlbums(updatedAlbums);
        }
      }
      setMenuTrackId(null);
    } catch (err) {
      console.error("Error adding to playlist:", err);
    }
  };

  const handleTrackNameClick = (track, e) => {
    e.stopPropagation();
    setFocusedTrack(track);
  };

  const renderTrackListRows = (tracks) => {
    return tracks.map((track, index) => {
      const isActive = currentTrack && currentTrack.id === track.id;
      const liked = isLiked(track.id);
      
      return (
        <div key={track.id} className={`track-list-row ${isActive ? 'active' : ''}`} style={{ position: 'relative', borderRadius: '4px', background: isActive ? 'rgba(0,0,0,0.05)' : 'transparent' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = isActive ? 'rgba(0,0,0,0.05)' : 'transparent'}>
          {/* Play/Pause Area */}
          <div onClick={() => playTrack(track)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px' }}>
            {isActive && isPlaying ? <Icons.Volume /> : <span style={{color: '#64748b'}}>{index + 1}</span>}
          </div>
          
          {/* Info Area (Click name to Focus) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={track.img} alt={track.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span 
                onClick={(e) => handleTrackNameClick(track, e)}
                style={{ color: isActive ? '#0ea5e9' : '#0f172a', fontWeight: isActive ? 600 : 500, cursor: 'pointer', fontSize: '1rem' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {track.title}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{track.artist}</span>
            </div>
          </div>
          
          <div onClick={() => playTrack(track)} style={{ color: '#64748b', fontSize: '0.9rem', cursor: 'pointer' }}>{track.album}</div>
          
          {/* Actions Area */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
            <button className={`track-icon-btn ${liked ? 'liked' : ''}`} onClick={(e) => toggleLike(track, e)} style={{ color: liked ? '#ef4444' : '#9ca3af' }}>
              <Icons.Heart solid={liked} />
            </button>
            <span style={{ fontSize: '0.9rem', color: '#64748b', minWidth: '40px', textAlign: 'right' }}>{track.duration}</span>
            <button className="track-icon-btn" style={{ color: '#9ca3af' }} onClick={(e) => { e.stopPropagation(); setMenuTrackId(menuTrackId === track.id ? null : track.id); }}>
              <Icons.Dots />
            </button>
            
            {/* Context Menu Popup */}
            {menuTrackId === track.id && (
              <div className="track-context-menu" onClick={e => e.stopPropagation()} style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '0.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748b' }}>Add to Playlist</div>
                {albums.length === 0 && <div style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#0f172a' }}>No playlists yet.</div>}
                
                {albums.map(album => {
                  const inAlbum = album.tracks.some(t => t.id === track.id);
                  return (
                    <button key={album.id} className="context-menu-item" onClick={(e) => addTrackToAlbum(album.id, track, e)} style={{ color: '#0f172a' }}>
                      {album.name} {inAlbum ? '(Added)' : ''}
                    </button>
                  );
                })}
                
                <div className="context-menu-divider" style={{ background: '#e2e8f0' }}></div>
                
                <form className="create-album-form" onSubmit={createAlbum}>
                  <input 
                    type="text" 
                    placeholder="New playlist name" 
                    className="create-album-input"
                    value={newAlbumName}
                    onChange={e => setNewAlbumName(e.target.value)}
                    style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1' }}
                  />
                  <button type="submit" className="create-album-btn" style={{ background: '#0ea5e9', color: '#ffffff' }}>Create & Add</button>
                </form>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="music-layout-container" style={{ justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
        <h2 style={{ color: '#0ea5e9' }}>Loading Sound Sanctuary...</h2>
      </div>
    );
  }

  const visibleTracks = displayedTracks;

  return (
    <div className="music-layout-container" onClick={() => setMenuTrackId(null)} style={{ background: '#f3f4f6', color: '#0f172a' }}>
      
      {/* Ambient Border Overlay */}
      <div className={`ambient-border-overlay ${isPlaying ? 'active' : ''}`}></div>

      {/* Hidden Audio Element (Always rendered to preserve ref) */}
      <audio
        ref={audioRef}
        src={currentTrack ? currentTrack.audioUrl : ''}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        autoPlay={isPlaying}
      />

      {/* Sidebar (Left Pane) */}
      <div className="music-sidebar" style={{ background: '#ffffff', borderRight: '1px solid #e5e7eb', margin: '0.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div className={`sidebar-item ${activeTab === 'home' && !focusedTrack ? 'active' : ''}`} onClick={() => changeTab('home')} style={{ color: activeTab === 'home' && !focusedTrack ? '#0ea5e9' : '#475569', background: activeTab === 'home' && !focusedTrack ? '#f0f9ff' : 'transparent' }}>
            <Icons.Home /> Home
          </div>
          <div className={`sidebar-item ${activeTab === 'search' && !focusedTrack ? 'active' : ''}`} onClick={() => changeTab('search')} style={{ color: activeTab === 'search' && !focusedTrack ? '#0ea5e9' : '#475569', background: activeTab === 'search' && !focusedTrack ? '#f0f9ff' : 'transparent' }}>
            <Icons.Search /> Search
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontWeight: 600, marginBottom: '1rem', padding: '0.5rem 1rem' }}>
            <Icons.Library /> Your Library
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            <div 
              className={`album-item ${activeTab === 'liked' && !focusedTrack ? 'active' : ''}`}
              onClick={() => changeTab('liked')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTab === 'liked' && !focusedTrack ? '#0ea5e9' : '#475569', background: activeTab === 'liked' && !focusedTrack ? '#f0f9ff' : 'transparent' }}
            >
              <Icons.Heart solid={true} /> Liked Songs
            </div>
            
            <div style={{ margin: '1rem 0', height: '1px', background: '#e5e7eb' }}></div>
            
            {albums.map(album => (
              <div 
                key={album.id} 
                className={`album-item ${activeTab === album.id && !focusedTrack ? 'active' : ''}`}
                onClick={() => changeTab(album.id)}
                style={{ color: activeTab === album.id && !focusedTrack ? '#0ea5e9' : '#475569', background: activeTab === album.id && !focusedTrack ? '#f0f9ff' : 'transparent' }}
              >
                {album.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="music-main-content" style={{ background: 'linear-gradient(to bottom, #bae6fd, #f8fafc 40%)', margin: '0.5rem 0.5rem 0.5rem 0', borderRadius: '8px', overflowY: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Top Navbar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, padding: '1rem 2rem', display: 'flex', alignItems: 'center', background: 'transparent' }}>
          <button 
            className="nav-btn" 
            onClick={handleInternalBack} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff', 
              color: '#0f172a',
              border: '1px solid #e2e8f0', 
              padding: 0, 
              marginRight: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }}
          >
            <Icons.Back />
          </button>
          
          {/* Search Bar in Navbar if search active */}
          {activeTab === 'search' && !focusedTrack && (
            <div className="search-container" style={{ margin: 0, width: '100%', maxWidth: '400px', background: '#ffffff', borderRadius: '500px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ color: '#9ca3af' }}><Icons.Search /></div>
              <input 
                type="text" 
                placeholder="What do you want to play?" 
                className="search-input-glass"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                style={{ border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', width: '100%' }}
              />
            </div>
          )}
        </div>

        {/* View Router */}
        {focusedTrack ? (
          // Spotify-like Track Detail View
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2rem' }}>
              <img src={focusedTrack.img} alt={focusedTrack.title} style={{ width: '232px', height: '232px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', objectFit: 'cover', borderRadius: '8px' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: '#334155' }}>Single</p>
                <h1 style={{ margin: '0.5rem 0', fontSize: '5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#0f172a' }}>{focusedTrack.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>
                  <span>{focusedTrack.artist}</span>
                  <span>•</span>
                  <span>{focusedTrack.added.split(',')[1]?.trim() || '2024'}</span>
                  <span>•</span>
                  <span>1 song, {focusedTrack.duration} sec</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem 0 2rem 0' }}>
              <button 
                onClick={() => playTrack(focusedTrack)}
                style={{ 
                  width: '56px', height: '56px', borderRadius: '50%', background: '#0ea5e9', color: '#ffffff', 
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  transform: 'scale(1)', transition: 'transform 0.1s',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {currentTrack && currentTrack.id === focusedTrack.id && isPlaying ? (
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              
              <button onClick={(e) => toggleLike(focusedTrack, e)} style={{ background: 'transparent', border: 'none', color: isLiked(focusedTrack.id) ? '#ef4444' : '#94a3b8', cursor: 'pointer', padding: 0 }}>
                <Icons.Heart solid={isLiked(focusedTrack.id)} />
              </button>
              
              <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
                <Icons.Dots />
              </button>
            </div>

            {/* Track List Header */}
            <div className="track-list-header track-list-row" style={{ color: '#64748b', borderBottom: '1px solid #cbd5e1', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
              <div>#</div>
              <div>Title</div>
              <div>Album</div>
              <div style={{ textAlign: 'right', paddingRight: '3rem' }}><Icons.Clock /></div>
            </div>

            {/* The single track in the list */}
            {renderTrackListRows([focusedTrack])}
            
            <div style={{ marginTop: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>More by {focusedTrack.artist}</h2>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Explore more tracks in the Home or Search tabs.
              </div>
            </div>
          </div>
        ) : (
          // Normal List Views (Home, Search, Liked, Playlist)
          <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <div className="music-main-header" style={{ paddingBottom: '1rem' }}>
              {activeTab === 'home' && (
                <div>
                  <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Meditation Tracks</h1>
                </div>
              )}
              {activeTab === 'liked' && <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Liked Songs</h1>}
              {activeTab !== 'home' && activeTab !== 'search' && activeTab !== 'liked' && (
                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  {albums.find(a => a.id === activeTab)?.name}
                </h1>
              )}
            </div>

            {/* Track List Header */}
            <div className="track-list-header track-list-row" style={{ color: '#64748b', borderBottom: '1px solid #cbd5e1', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
              <div>#</div>
              <div>Title</div>
              <div>Album</div>
              <div style={{ textAlign: 'right', paddingRight: '3rem' }}><Icons.Clock /></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {visibleTracks.length > 0 ? (
                 renderTrackListRows(visibleTracks)
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  No tracks found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Player - Light Theme */}
      <div className="music-bottom-player" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', height: '90px', padding: '0 1rem', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)' }}>
        {/* Now Playing Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '30%' }}>
          {currentTrack && (
            <>
              <img src={currentTrack.img} alt="Current" style={{ width: '56px', height: '56px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span 
                  onClick={() => setFocusedTrack(currentTrack)}
                  style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {currentTrack.title}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentTrack.artist}</span>
              </div>
              <button className={`track-icon-btn ${isLiked(currentTrack.id) ? 'liked' : ''}`} onClick={(e) => toggleLike(currentTrack, e)} style={{ marginLeft: '1rem', color: isLiked(currentTrack.id) ? '#ef4444' : '#94a3b8' }}>
                 <Icons.Heart solid={isLiked(currentTrack.id)} />
              </button>
            </>
          )}
        </div>

        {/* Controls Center */}
        <div className="player-controls" style={{ width: '40%', maxWidth: '722px' }}>
          <div className="player-buttons" style={{ gap: '1.5rem', marginBottom: '0.5rem' }}>
            <button className="player-btn" onClick={handlePrevTrack} style={{ color: '#64748b' }} onMouseEnter={e=>e.currentTarget.style.color='#0ea5e9'} onMouseLeave={e=>e.currentTarget.style.color='#64748b'}><Icons.SkipBack /></button>
            <button 
              className="player-btn play-circle" 
              onClick={togglePlayPause}
              style={{ background: '#0f172a', color: '#ffffff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button className="player-btn" onClick={handleNextTrack} style={{ color: '#64748b' }} onMouseEnter={e=>e.currentTarget.style.color='#0ea5e9'} onMouseLeave={e=>e.currentTarget.style.color='#64748b'}><Icons.SkipFwd /></button>
          </div>
          <div className="progress-container" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ minWidth: '40px', textAlign: 'right' }}>{currentTimeFormatted}</span>
            <div className="progress-bar" onClick={handleSeek} style={{ background: '#e2e8f0', height: '4px', borderRadius: '2px', flex: 1, cursor: 'pointer', position: 'relative' }}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: '#0ea5e9', height: '100%', borderRadius: '2px' }}></div>
            </div>
            <span style={{ minWidth: '40px' }}>{currentTrack ? currentTrack.duration : '0:00'}</span>
          </div>
        </div>

        {/* Volume Right */}
        <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div className="volume-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', width: '125px' }}>
            <Icons.Volume />
            <div className="volume-slider" onClick={handleVolumeSeek} style={{ background: '#e2e8f0', height: '4px', borderRadius: '2px', flex: 1, cursor: 'pointer' }}>
              <div className="progress-fill" style={{ width: `${volume * 100}%`, background: '#0ea5e9', height: '100%', borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationTracks;
