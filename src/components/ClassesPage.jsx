import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.jpg';
import mainBg from '../assets/classes.jpg';
import meditationImg from '../assets/aboutpage.jpg';
import yogaImg from '../assets/q8imle.jpg';
import wellnessImg from '../assets/videos.jpg';

const ClassesPage = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showResults, setShowResults] = useState(false);

    // Booking States
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedClassItem, setSelectedClassItem] = useState(null);
    const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Success
    const [bookingData, setBookingData] = useState({
        participantName: '',
        age: '',
        phoneNumber: ''
    });

    // Cancellation States
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [classToCancel, setClassToCancel] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User', education: 'Student', email: 'guest@aurexia.com' };

    const [allBookings, setAllBookings] = useState(() => {
        const saved = localStorage.getItem('booked_classes');
        return saved ? JSON.parse(saved) : [];
    });

    const [bookedClasses, setBookedClasses] = useState(() => {
        return allBookings.filter(a => a.userEmail === currentUser.email);
    });

    const cancelledEvents = useMemo(() => {
        const cancelled = JSON.parse(localStorage.getItem('cancelled_classes') || '[]');
        return cancelled.filter(event => Array.isArray(event.participants) && event.participants.some(p => p.userEmail === currentUser.email));
    }, [currentUser.email, allBookings.length]);

    React.useEffect(() => {
        if (window.location.hash === '#my-classes') {
            const element = document.getElementById('my-classes');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    const locationData = {
        'India': {
            'Delhi': ['Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
            'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane'],
            'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
            'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
            'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
            'West Bengal': ['Kolkata', 'Howrah', 'Durgapur'],
            'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara']
        },
        'USA': {
            'New York': ['New York City', 'Buffalo', 'Rochester'],
            'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'],
            'Illinois': ['Chicago', 'Aurora', 'Naperville'],
            'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin'],
            'Arizona': ['Phoenix', 'Tucson', 'Mesa'],
            'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown']
        },
        'UK': {
            'England': ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Bristol'],
            'Scotland': ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee'],
            'Wales': ['Cardiff', 'Swansea', 'Newport'],
            'Northern Ireland': ['Belfast', 'Derry', 'Lisburn']
        },
        'Australia': {
            'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
            'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
            'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast'],
            'Western Australia': ['Perth', 'Rockingham', 'Mandurah'],
            'South Australia': ['Adelaide', 'Mount Gambier', 'Gawler']
        },
        'Canada': {
            'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Brampton'],
            'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
            'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
            'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge']
        }
    };

    const mockClasses = [];
    const classTypes = [
        { title: 'Morning Yoga Flow', desc: 'Start your day with energy and flexibility.', type: 'Yoga' },
        { title: 'Deep Meditation', desc: 'Explore the depths of your consciousness.', type: 'Meditation' },
        { title: 'Stress Relief Workshop', desc: 'Techniques to manage daily stress and anxiety.', type: 'Mental Wellness' },
        { title: 'Mindful Breathing', desc: 'Unlock the power of your breath for inner peace.', type: 'Calmness' },
        { title: 'Yoga for Beginners', desc: 'Core basics for a balanced life.', type: 'Yoga' },
        { title: 'Zen Living Seminar', desc: 'Principles of calmness in a chaotic world.', type: 'Peace' },
        { title: 'Nature Connection', desc: 'Outdoor sessions to ground your spirit.', type: 'Holistic' },
        { title: 'Emotional Intelligence', desc: 'Understanding and managing your emotions.', type: 'Wellness' },
        { title: 'Vinyasa Strength', desc: 'Power through poses to build muscle and focus.', type: 'Yoga' },
        { title: 'Sound Healing Bath', desc: 'Harmonize your body with therapeutic sound frequencies.', type: 'Therapy' },
        { title: 'Sleep Hygiene Class', desc: 'Learn the rituals for a restorative night sleep.', type: 'Health' },
        { title: 'Art Therapy Session', desc: 'Express your inner self through creative colors.', type: 'Creativity' },
        { title: 'Guided Visualization', desc: 'Journey through your mind to achieve goals.', type: 'Mental Focus' },
        { title: 'Forest Bathing (Shinrin-yoku)', desc: 'Reconnect with nature for stress reduction.', type: 'Eco-Wellness' },
        { title: 'Tai Chi Fundamentals', desc: 'Slow, graceful movements for balance.', type: 'Martial Arts' },
        { title: 'Pilates for Core', desc: 'Strengthen your center for better posture.', type: 'Fitness' },
        { title: 'Digital Detox Hour', desc: 'Unplug and rediscover offline peace.', type: 'Lifestyle' },
        { title: 'Gratitude Journaling', desc: 'Cultivate a positive mindset through writing.', type: 'Positivity' },
        { title: 'Ayurveda Basics', desc: 'Ancient wisdom for modern nutrition.', type: 'Herbal' },
        { title: 'Laughter Yoga', desc: 'Spontaneous joy and deep rib-breathing.', type: 'Joy' }
    ];
    const instructors = [
        'Master Ravi', 'Elena Grace', 'Dr. David Smith', 'Sarah Wilson', 'Michael Chen',
        'Priya Sharma', 'Aman Gupta', 'Jessica Brown', 'Marcus Thorne', 'Liam O\'Brien',
        'Sophia Lin', 'Yuki Tanaka', 'Oliver Scott', 'Maya Patel', 'Isabella Rossi'
    ];

    const classTypeImages = {
        'Yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
        'Meditation': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        'Mental Wellness': 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1',
        'Calmness': 'https://images.unsplash.com/photo-1499209974431-9dac3adaf477',
        'Peace': 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5',
        'Holistic': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
        'Wellness': 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7',
        'Therapy': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
        'Health': 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539',
        'Creativity': 'https://images.unsplash.com/photo-1545208393-216c7ad81035',
        'Mental Focus': 'https://images.unsplash.com/photo-1536622432211-7bc28da85743',
        'Eco-Wellness': 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3',
        'Martial Arts': 'https://images.unsplash.com/photo-1528319725582-ddc096101511',
        'Fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
        'Lifestyle': 'https://images.unsplash.com/photo-1499209974431-9dac3adaf477',
        'Positivity': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        'Herbal': 'https://images.unsplash.com/photo-1599447421416-3414500d18a5',
        'Joy': 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539'
    };

    const currencyMap = {
        'India': { symbol: '₹', rate: 80, base: 1200 },
        'USA': { symbol: '$', rate: 1, base: 15 },
        'UK': { symbol: '£', rate: 0.8, base: 12 },
        'Australia': { symbol: 'A$', rate: 1.5, base: 25 },
        'Canada': { symbol: 'C$', rate: 1.4, base: 22 }
    };

    let classId = 1;
    Object.entries(locationData).forEach(([country, states]) => {
        const currency = currencyMap[country] || { symbol: '$', rate: 1, base: 15 };
        Object.entries(states).forEach(([state, cities]) => {
            cities.forEach(city => {
                const cityKey = city.toLowerCase();
                for (let i = 0; i < 5; i++) {
                    const template = classTypes[(classId + i) % classTypes.length];
                    const daysAhead = (classId % 7) + 1;
                    const date = new Date();
                    date.setDate(date.getDate() + daysAhead);
                    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const times = ['07:00 AM', '09:30 AM', '11:00 AM', '04:30 PM', '06:00 PM'];

                    const priceValue = currency.base + (i * 5 * (currency.rate > 10 ? 10 : 1));
                    const typeImage = classTypeImages[template.type] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b';

                    mockClasses.push({
                        id: classId++,
                        title: template.title,
                        description: template.desc,
                        instructor: instructors[(classId + i) % instructors.length],
                        duration: `${45 + (i * 15)} mins`,
                        date: formattedDate,
                        time: times[i % times.length],
                        type: template.type,
                        city: cityKey,
                        maxParticipants: 20 + (i * 5),
                        price: i % 2 === 0 ? 'Free' : `${currency.symbol}${priceValue}`,
                        image: `${typeImage}?auto=format&fit=crop&q=80&w=400`
                    });
                }
            });
        });
    });

    // Add Tutor Created Classes
    const tutorCreated = JSON.parse(localStorage.getItem('tutor_created_classes') || '[]');
    tutorCreated.forEach(tc => {
        mockClasses.push({
            id: tc.id,
            title: tc.eventName,
            description: tc.description,
            instructor: tc.tutorName,
            tutorEmail: tc.tutorEmail, // Store tutor email for notifications
            duration: tc.duration || '60 mins',
            date: new Date(tc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: tc.time,
            type: 'Workshop', // Or add type selection in form
            city: tc.city.toLowerCase(),
            maxParticipants: tc.maxParticipants || '0',
            price: tc.feeType === 'Free' ? 'Free' : tc.feeAmount,
            image: tc.eventImage || 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&q=80&w=400'
        });
    });

    const [imgErrors, setImgErrors] = useState(new Set());
    const handleImgError = (id) => {
        setImgErrors(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    const getImageUrl = (item) => {
        if (imgErrors.has(item.id)) {
            if (item.type === 'Yoga') return yogaImg;
            if (item.type === 'Meditation') return meditationImg;
            return wellnessImg;
        }
        return item.image;
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedState('');
        setSelectedCity('');
    };

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
        setSelectedCity('');
    };

    const handleFindClasses = () => {
        if (!selectedCity) {
            alert('Please select a city.');
            return;
        }
        setShowResults(true);
    };

    const handleBack = () => {
        if (showBookingModal) {
            closeBooking();
        } else if (showResults) {
            setShowResults(false);
        } else {
            navigate(-1);
        }
    };

    const openBooking = (item) => {
        setSelectedClassItem(item);
        setShowBookingModal(true);
        setBookingStep(1);
    };

    const closeBooking = () => {
        setShowBookingModal(false);
        setBookingStep(1);
        setBookingData({ participantName: '', age: '', phoneNumber: '' });
    };

    const handleBooking = () => {
        if (!bookingData.participantName || !bookingData.age || !bookingData.phoneNumber) {
            alert('Please fill in all details.');
            return;
        }

        const classBookings = allBookings.filter(b => b.classId === selectedClassItem.id);
        const capacity = Number(selectedClassItem.maxParticipants) || 0;
        if (capacity > 0 && classBookings.length >= capacity) {
            alert('This class is full. Please choose another session.');
            return;
        }

        const alreadyBooked = classBookings.some(b => b.userEmail === currentUser.email);
        if (alreadyBooked) {
            alert('You have already booked this class.');
            return;
        }

        const newBookedClass = {
            id: Date.now(),
            classId: selectedClassItem.id,
            title: selectedClassItem.title,
            instructor: selectedClassItem.instructor,
            date: selectedClassItem.date,
            time: selectedClassItem.time,
            duration: selectedClassItem.duration,
            type: selectedClassItem.type,
            image: selectedClassItem.image,
            price: selectedClassItem.price,
            maxParticipants: selectedClassItem.maxParticipants,
            ...bookingData,
            userEmail: currentUser.email,
            timestamp: new Date().toISOString()
        };

        const updatedBooked = [newBookedClass, ...allBookings];
        localStorage.setItem('booked_classes', JSON.stringify(updatedBooked));
        setAllBookings(updatedBooked);
        setBookedClasses(updatedBooked.filter(a => a.userEmail === currentUser.email));

        // Notification for the user (student)
        const userNotification = {
            id: Date.now(),
            type: 'class_booking',
            className: selectedClassItem.title,
            tutorName: selectedClassItem.instructor,
            date: selectedClassItem.date,
            time: selectedClassItem.time,
            participant: bookingData.participantName,
            timestamp: new Date().toISOString(),
            unread: true
        };

        const userNotificationKey = `notifications_${currentUser.email}`;
        const existingUserNotifications = JSON.parse(localStorage.getItem(userNotificationKey) || '[]');
        localStorage.setItem(userNotificationKey, JSON.stringify([userNotification, ...existingUserNotifications]));

        // Notification for the tutor
        if (selectedClassItem.tutorEmail) {
            const tutorNotification = {
                id: Date.now() + 1,
                type: 'class_joining',
                className: selectedClassItem.title,
                studentName: bookingData.participantName,
                studentAge: bookingData.age,
                studentPhone: bookingData.phoneNumber,
                date: selectedClassItem.date,
                time: selectedClassItem.time,
                timestamp: new Date().toISOString(),
                unread: true
            };

            const tutorNotificationKey = `notifications_${selectedClassItem.tutorEmail}`;
            const existingTutorNotifications = JSON.parse(localStorage.getItem(tutorNotificationKey) || '[]');
            localStorage.setItem(tutorNotificationKey, JSON.stringify([tutorNotification, ...existingTutorNotifications]));
        }

        setBookingStep(2);
    };

    const handleCancelBooking = () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }

        const updated = bookedClasses.filter(a => a.id !== classToCancel.id);
        setBookedClasses(updated);

        const all = JSON.parse(localStorage.getItem('booked_classes') || '[]');
        const filteredAll = all.filter(a => a.id !== classToCancel.id);
        localStorage.setItem('booked_classes', JSON.stringify(filteredAll));
        setAllBookings(filteredAll);
        setBookedClasses(filteredAll.filter(a => a.userEmail === currentUser.email));

        // Find the tutorEmail from mockClasses or tc
        const classInfo = mockClasses.find(c => c.title === classToCancel.title && c.instructor === classToCancel.instructor);

        // Notification for the tutor
        if (classInfo && classInfo.tutorEmail) {
            const tutorNotification = {
                id: Date.now(),
                type: 'class_cancellation',
                className: classToCancel.title,
                studentName: classToCancel.participantName,
                reason: cancelReason,
                date: classToCancel.date,
                timestamp: new Date().toISOString(),
                unread: true
            };

            const tutorNotificationKey = `notifications_${classInfo.tutorEmail}`;
            const existingTutorNotifications = JSON.parse(localStorage.getItem(tutorNotificationKey) || '[]');
            localStorage.setItem(tutorNotificationKey, JSON.stringify([tutorNotification, ...existingTutorNotifications]));
        }

        setToast({ show: true, message: 'Class or event cancelled successfully' });
        setShowCancelModal(false);
        setCancelReason('');
        setClassToCancel(null);
        setTimeout(() => setToast({ show: false, message: '' }), 4000);
    };

    const openCancelModal = (item) => {
        setClassToCancel(item);
        setShowCancelModal(true);
    };

    const filteredClasses = mockClasses.filter(c => c.city === selectedCity.toLowerCase());
    const getSeatsInfo = (item) => {
        const booked = allBookings.filter(b => b.classId === item.id).length;
        const capacity = Number(item.maxParticipants) || 0;
        if (!capacity) return null;
        const remaining = Math.max(capacity - booked, 0);
        return `${booked} / ${capacity} seats booked · ${remaining} remaining`;
    };

    return (
        <div className="app-container" style={{
            background: 'transparent',
            height: 'auto',
            minHeight: '100vh',
            overflow: 'visible',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '5.5rem',
            paddingBottom: '0',
            flexDirection: 'column'
        }}>
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

            <button className="nav-btn" onClick={handleBack} style={{
                position: 'fixed',
                top: '2rem',
                left: '2rem',
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
            </button>

            <div className="animate-fade-in" style={{
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3rem',
                padding: '0 2rem 0'
            }}>
                <h1 className="title gradient-text" style={{ fontSize: '4.5rem', fontWeight: '900', margin: 0, letterSpacing: '-2px', lineHeight: '1.2' }}>Classes & Events</h1>

                {!showResults ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '400px'
                    }}>
                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <label style={{ color: '#ffffff', display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '1.1rem' }}>Select your Country</label>
                            <select
                                className="glass-input"
                                style={{ width: '100%', marginBottom: '0', background: '#ffffff', color: '#000000', opacity: 1, height: '50px', borderRadius: '12px', padding: '0 1rem' }}
                                value={selectedCountry}
                                onChange={handleCountryChange}
                            >
                                <option value="">Choose your country...</option>
                                {Object.keys(locationData).map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <label style={{ color: '#ffffff', display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '1.1rem' }}>Select your State</label>
                            <select
                                className="glass-input"
                                style={{ width: '100%', marginBottom: '0', background: '#ffffff', color: '#000000', opacity: 1, height: '50px', borderRadius: '12px', padding: '0 1rem' }}
                                value={selectedState}
                                onChange={handleStateChange}
                                disabled={!selectedCountry}
                            >
                                <option value="">
                                    {!selectedCountry ? 'Select a country first...' : 'Choose your state...'}
                                </option>
                                {selectedCountry && Object.keys(locationData[selectedCountry]).map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ width: '100%', textAlign: 'left' }}>
                            <label style={{ color: '#ffffff', display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '1.1rem' }}>Select your City</label>
                            <select
                                className="glass-input"
                                style={{ width: '100%', marginBottom: '0', background: '#ffffff', color: '#000000', opacity: 1, height: '50px', borderRadius: '12px', padding: '0 1rem' }}
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                disabled={!selectedState}
                            >
                                <option value="">
                                    {!selectedState ? 'Select a state first...' : 'Choose your city...'}
                                </option>
                                {selectedState && locationData[selectedCountry][selectedState].map(city => (
                                    <option key={city} value={city.toLowerCase()}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="nav-btn logout-primary-btn"
                            onClick={handleFindClasses}
                            style={{
                                padding: '1.2rem 4rem',
                                fontSize: '1.3rem',
                                fontWeight: '800',
                                borderRadius: '50px',
                                marginTop: '0.5rem',
                                cursor: selectedCity ? 'pointer' : 'not-allowed',
                                opacity: selectedCity ? 1 : 0.7,
                                width: '100%'
                            }}
                            disabled={!selectedCity}
                        >
                            Find Classes
                        </button>
                    </div>
                ) : (
                    <div className="results-grid" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '2.5rem',
                        width: '100%',
                        maxWidth: '1300px',
                        animation: 'fadeIn 0.5s ease'
                    }}>
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map(item => (
                                <div key={item.id} className="glass-panel" style={{
                                    textAlign: 'left',
                                    padding: '0',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    width: '350px'
                                }}>
                                    <div style={{
                                        height: '240px',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={getImageUrl(item)}
                                            alt={item.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                            onError={() => handleImgError(item.id)}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            background: 'rgba(0, 102, 255, 0.8)',
                                            color: '#fff',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '50px',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            backdropFilter: 'blur(5px)'
                                        }}>
                                            {item.type}
                                        </div>
                                    </div>
                                    <div style={{ padding: '2rem' }}>
                                        <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: '800' }}>{item.title}</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{item.description}</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                <span style={{ fontWeight: '600' }}>{item.instructor}</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                    <span style={{ fontSize: '0.9rem' }}>{item.duration}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                    <span style={{ fontSize: '0.9rem' }}>{item.date}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 10"></polyline></svg>
                                                <span style={{ fontSize: '0.9rem' }}>{item.time}</span>
                                            </div>
                                        </div>
                                        {getSeatsInfo(item) && (
                                            <p style={{ margin: '0 0 1rem 0', color: '#a5f3fc', fontSize: '0.95rem', fontWeight: '600' }}>{getSeatsInfo(item)}</p>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#00c864', fontSize: '1.4rem', fontWeight: '900' }}>{item.price}</span>
                                            <button
                                                className="nav-btn logout-primary-btn"
                                                onClick={() => openBooking(item)}
                                                style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: '12px' }}
                                            >
                                                Join Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', padding: '4rem', color: '#fff', fontSize: '1.5rem' }}>
                                No classes found for the selected city.
                            </div>
                        )}
                    </div>
                )}

                <div id="my-classes" style={{ marginTop: '5rem', width: '100%', maxWidth: '1200px', textAlign: 'left', paddingBottom: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', borderLeft: '5px solid var(--color-blue)', paddingLeft: '1.5rem' }}>
                        <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>My Classes & Events</h2>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: 'var(--color-blue)',
                            padding: '4px 15px',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                            {bookedClasses.length} Bookings
                        </div>
                    </div>

                    {bookedClasses.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                            {bookedClasses.map(item => (
                                <div key={item.id} className="glass-panel animate-fade-in" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '180px', position: 'relative' }}>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0, 200, 100, 0.9)', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Confirmed</div>
                                    </div>
                                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: 'white' }}>{item.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-blue)', fontWeight: '600' }}>by {item.instructor}</p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Date & Time</p>
                                                <p style={{ margin: '0 0 2px 0', fontSize: '0.95rem', color: 'white', fontWeight: '600' }}>{item.date}</p>
                                                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-blue)', fontWeight: '700' }}>{item.time}</p>
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Participant</p>
                                                <p style={{ margin: '0 0 2px 0', fontSize: '0.95rem', color: 'white', fontWeight: '600' }}>{item.participantName}</p>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.age} Years • {item.price}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Booked on {new Date(item.timestamp).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => openCancelModal(item)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                Cancel Spot
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>Your class schedule is empty.</p>
                            <p style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.7 }}>Join upcoming sessions to start your wellness journey.</p>
                        </div>
                    )}

                    {cancelledEvents.length > 0 && (
                        <div style={{ marginTop: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderLeft: '5px solid #ef4444', paddingLeft: '1.5rem' }}>
                                <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>Cancelled Classes & Events</h2>
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    padding: '4px 15px',
                                    borderRadius: '50px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}>
                                    {cancelledEvents.length} Cancelled
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                                {cancelledEvents.map(event => (
                                    <div key={event.id} className="glass-panel animate-fade-in" style={{ padding: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        {event.eventImage && (
                                            <div style={{ height: '180px', width: '100%' }}>
                                                <img src={event.eventImage} alt={event.eventName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, color: 'white', fontSize: '1.4rem' }}>{event.eventName}</h4>
                                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#ef4444', fontWeight: '700' }}>Cancelled on {new Date(event.cancelledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                                <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700' }}>Cancelled</span>
                                            </div>
                                            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{event.description}</p>
                                            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}><strong>Reason:</strong> {event.cancellationReason || 'No reason provided.'}</p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Location: {event.city || event.location || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showBookingModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{
                        maxWidth: '500px',
                        width: '100%',
                        padding: '3rem',
                        position: 'relative',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center'
                    }}>
                        <button onClick={closeBooking} style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        {bookingStep === 1 ? (
                            <>
                                <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Join Class</h2>
                                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem' }}>Enter participant details to secure your spot in <strong>{selectedClassItem.title}</strong>.</p>
                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                                        <input
                                            type="text"
                                            className="glass-input"
                                            placeholder="John Doe"
                                            value={bookingData.participantName}
                                            onChange={(e) => setBookingData({ ...bookingData, participantName: e.target.value })}
                                            style={{ background: 'white', color: 'black', marginBottom: 0 }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Age</label>
                                            <input
                                                type="number"
                                                className="glass-input"
                                                placeholder="25"
                                                value={bookingData.age}
                                                onChange={(e) => setBookingData({ ...bookingData, age: e.target.value })}
                                                style={{ background: 'white', color: 'black', marginBottom: 0 }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Phone Number</label>
                                            <input
                                                type="tel"
                                                className="glass-input"
                                                placeholder="+1 234 567 890"
                                                value={bookingData.phoneNumber}
                                                onChange={(e) => setBookingData({ ...bookingData, phoneNumber: e.target.value })}
                                                style={{ background: 'white', color: 'black', marginBottom: 0 }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="nav-btn logout-primary-btn"
                                        onClick={handleBooking}
                                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', borderRadius: '12px', marginTop: '1rem' }}
                                    >Confirm Booking</button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '2rem 0' }}>
                                <div style={{ width: '80px', height: '80px', background: '#00c864', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 0 30px rgba(0, 200, 100, 0.4)' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Booking Success!</h2>
                                <p style={{ color: 'white', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>Your spot in <strong>{selectedClassItem.title}</strong> has been secured for <br /><strong>{selectedClassItem.date}</strong> at <strong>{selectedClassItem.time}</strong>.</p>
                                <button className="nav-btn logout-primary-btn" onClick={closeBooking} style={{ padding: '1rem 3rem', borderRadius: '12px' }}>Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{
                        maxWidth: '450px',
                        width: '100%',
                        padding: '2.5rem',
                        position: 'relative',
                        border: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center'
                    }}>
                        <button onClick={() => setShowCancelModal(false)} style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Cancel Spot</h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>We're sorry to see you go. Please tell us why you're cancelling your spot in <strong>{classToCancel?.title}</strong>.</p>

                        <div style={{ textAlign: 'left' }}>
                            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Reason for Cancellation</label>
                            <textarea
                                className="glass-input"
                                placeholder="E.g. Scheduling conflict, health reasons..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                style={{ background: 'white', color: 'black', minHeight: '100px', resize: 'none', marginBottom: '1.5rem', padding: '1rem' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                            <button
                                className="nav-btn"
                                onClick={() => setShowCancelModal(false)}
                                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                            >Back</button>
                            <button
                                className="nav-btn logout-primary-btn"
                                onClick={handleCancelBooking}
                                style={{ background: '#ef4444', borderColor: '#ef4444' }}
                            >Confirm Cancellation</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>

            {/* Toast Notification */}
            {toast.show && (
                <div className="toast-container">
                    <div className="toast-message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        {toast.message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassesPage;
