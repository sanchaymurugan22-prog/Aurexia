import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import mainBg from '../assets/bookacounsellor.jpg';

const BookACounsellor = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredCounsellors, setFilteredCounsellors] = useState([]);

    // Booking States
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Slot, 3: Success
    const [imgErrors, setImgErrors] = useState(new Set());
    const [toast, setToast] = useState({ show: false, message: '' });
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const [cancellationReason, setCancellationReason] = useState('');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest User', education: 'Student', email: 'guest@aurexia.com' };

    // Review States
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedReviewCounsellor, setSelectedReviewCounsellor] = useState(null);
    const [counsellorReviews, setCounsellorReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const [appointments, setAppointments] = useState(() => {
        const saved = localStorage.getItem('appointments');
        return saved ? JSON.parse(saved).filter(a => a.userEmail === currentUser.email) : [];
    });

    const handleImgError = (id) => {
        setImgErrors(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    React.useEffect(() => {
        if (window.location.hash === '#my-appointments') {
            const element = document.getElementById('my-appointments');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    const fallbackImage = 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=200';
    const [bookingData, setBookingData] = useState({
        patientName: '',
        age: '',
        phoneNumber: '',
        date: '',
        timeSlot: ''
    });

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

    const handleCountryChange = (e) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setSelectedState('');
        setSelectedCity('');
    };

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setSelectedCity('');
    };

    const mockCounsellors = [];
    const specs = ['Clinical Psychologist', 'CBT Specialist', 'Child Psychologist', 'Family Therapist', 'Anxiety Specialist', 'Trauma Specialist', 'Grief Counselor', 'Holistic Wellness Coach'];
    const names = ['James Wilson', 'Sarah Smith', 'Michael Chen', 'Priya Sharma', 'David Miller', 'Elena Garcia', 'Rahul Verma', 'Jessica Taylor', 'Amit Patel', 'Sunita Das', 'Robert Jones', 'Lisa White', 'Kevin Lee', 'Anita Gupta', 'Sanjay Singh', 'Maria Hernandez'];
    const hospitals = ['City Wellness Center', 'Metro General Hospital', 'Little Hearts Clinic', 'Mindful Care Institute', 'The Healing Space', 'Amani Mental Health', 'Hope Psychiatric Center'];
    const images = [
        'https://images.unsplash.com/photo-1559839734-2b71f1e3c770', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        'https://images.unsplash.com/photo-1566753323558-f4e0952af115', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f'
    ];

    let counsellorId = 1;
    Object.entries(locationData).forEach(([country, states]) => {
        Object.entries(states).forEach(([state, cities]) => {
            cities.forEach(city => {
                const cityKey = city.toLowerCase();
                for (let i = 0; i < 3; i++) {
                    mockCounsellors.push({
                        id: counsellorId++,
                        name: 'Dr. ' + names[(counsellorId + i) % names.length],
                        specialization: specs[(counsellorId + i) % specs.length],
                        education: i % 2 === 0 ? 'Ph.D. in Clinical Psychology' : 'MBBS, MD (Psychiatry)',
                        hospital: hospitals[(counsellorId + i) % hospitals.length],
                        experience: `${8 + (counsellorId % 12)} years`,
                        rating: (4.5 + (counsellorId % 5) / 10).toFixed(1),
                        city: cityKey,
                        image: images[(counsellorId + i) % images.length] + '?auto=format&fit=crop&q=80&w=200'
                    });
                }
            });
        });
    });

    const handleBack = () => {
        if (showBookingModal) {
            if (bookingStep === 2) {
                setBookingStep(1);
            } else {
                setShowBookingModal(false);
                setBookingStep(1);
            }
            return;
        }
        if (showResults) {
            setShowResults(false);
        } else {
            navigate(-1);
        }
    };

    const handleOpenBooking = (doctor) => {
        setSelectedDoctor(doctor);
        setShowBookingModal(true);
        setBookingStep(1);
    };

    const handleBookingInput = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
        if (bookingStep === 1) {
            if (!bookingData.patientName || !bookingData.age || !bookingData.phoneNumber) {
                alert('Please fill in all patient details.');
                return;
            }
            setBookingStep(2);
        }
    };

    const handleBookAppointment = () => {
        if (!bookingData.date || !bookingData.timeSlot) {
            alert('Please select a date and time slot.');
            return;
        }

        // Extract doctorEmail for registered practitioners
        const isRegistered = selectedDoctor.id.toString().startsWith('reg_');
        const doctorEmail = isRegistered ? selectedDoctor.id.split('reg_')[1] : null;

        // Save Appointment to dedicated storage for history tracking
        const newAppointment = {
            id: Date.now(),
            doctorName: selectedDoctor.name,
            doctorSpecialization: selectedDoctor.specialization,
            doctorImage: selectedDoctor.image,
            doctorHospital: selectedDoctor.hospital,
            doctorEmail: doctorEmail, // Added doctorEmail
            ...bookingData,
            userEmail: currentUser.email,
            userName: currentUser.name, // Added userName for doctor view
            status: 'booked',
            timestamp: new Date().toISOString()
        };

        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAppointments = [newAppointment, ...existingAppointments];
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        setAppointments(updatedAppointments.filter(a => a.userEmail === currentUser.email));

        // 1. Save Notification to Patient
        const patientNotification = {
            id: Date.now() + 1,
            type: 'appointment',
            doctorName: selectedDoctor.name,
            date: bookingData.date,
            time: bookingData.timeSlot,
            participant: bookingData.patientName,
            timestamp: new Date().toISOString(),
            unread: true
        };

        const patientKey = `notifications_${currentUser.email}`;
        const existingPatientNotifs = JSON.parse(localStorage.getItem(patientKey) || '[]');
        localStorage.setItem(patientKey, JSON.stringify([patientNotification, ...existingPatientNotifs]));

        // 2. Save Notification to Doctor (if registered)
        if (doctorEmail) {
            const doctorNotification = {
                id: Date.now() + 2,
                type: 'new_booking',
                patientName: bookingData.patientName,
                patientAge: bookingData.age,
                patientPhone: bookingData.phoneNumber,
                date: bookingData.date,
                time: bookingData.timeSlot,
                timestamp: new Date().toISOString(),
                unread: true,
                message: `New booking from ${currentUser.name}`
            };

            const doctorKey = `notifications_${doctorEmail}`;
            const existingDoctorNotifs = JSON.parse(localStorage.getItem(doctorKey) || '[]');
            localStorage.setItem(doctorKey, JSON.stringify([doctorNotification, ...existingDoctorNotifs]));
        }

        // Trigger Success
        setBookingStep(3);
    };


    const closeBooking = () => {
        setShowBookingModal(false);
        setBookingStep(1);
        setBookingData({ patientName: '', age: '', phoneNumber: '', date: '', timeSlot: '' });
    };

    const handleCancelClick = (apt) => {
        setAppointmentToCancel(apt);
        setShowCancelModal(true);
    };

    const confirmCancellation = () => {
        if (!cancellationReason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }

        const all = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAll = all.map(a => {
            if (a.id === appointmentToCancel.id) {
                return {
                    ...a,
                    status: 'cancelled',
                    cancelledBy: 'user',
                    cancellationReason: cancellationReason,
                    cancelledAt: new Date().toISOString()
                };
            }
            return a;
        });

        localStorage.setItem('appointments', JSON.stringify(updatedAll));
        setAppointments(updatedAll.filter(a => a.userEmail === currentUser.email));

        // Notify Doctor
        if (appointmentToCancel.doctorEmail) {
            const doctorNotification = {
                id: Date.now(),
                type: 'appointment_cancelled',
                cancelledBy: currentUser.name,
                patientName: appointmentToCancel.patientName,
                date: appointmentToCancel.date,
                time: appointmentToCancel.timeSlot,
                reason: cancellationReason,
                timestamp: new Date().toISOString(),
                unread: true,
                message: `Appointment cancelled by ${currentUser.name}`
            };

            const doctorKey = `notifications_${appointmentToCancel.doctorEmail}`;
            const existingDoctorNotifs = JSON.parse(localStorage.getItem(doctorKey) || '[]');
            localStorage.setItem(doctorKey, JSON.stringify([doctorNotification, ...existingDoctorNotifs]));
        }

        setToast({ show: true, message: 'Appointment cancelled successfully' });
        setTimeout(() => setToast({ show: false, message: '' }), 4000);

        setShowCancelModal(false);
        setAppointmentToCancel(null);
        setCancellationReason('');
    };


    const handleFindCounsellors = () => {
        if (!selectedCity) return;

        // 1. Fetch registered practitioners from localStorage
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const registeredCounsellors = allUsers
            .filter(u => u.role === 'counsellor' && u.isRegisteredPractitioner && u.city?.toLowerCase() === selectedCity.toLowerCase())
            .map(u => ({
                id: `reg_${u.email}`,
                name: `Dr. ${u.name}`,
                specialization: u.designation || u.specialization || 'Mental Health Professional', // Use designation from Profile
                education: u.education || 'Practitioner',
                hospital: u.hospital || 'Private Clinic',
                experience: u.experience || 'Experienced',
                rating: '5.0', // Default rating for new registrations
                city: u.city.toLowerCase(),
                image: u.image || 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=200'
            }));


        // 2. Filter mock counsellors
        const mockResults = mockCounsellors.filter(c => c.city === selectedCity);

        // 3. Combine results and calculate dynamic ratings
        const combined = [...registeredCounsellors, ...mockResults];
        
        const withDynamicRatings = combined.map(c => {
            const allReviews = JSON.parse(localStorage.getItem(`reviews_${c.id}`)) || [];
            let dynamicRating = c.rating;
            // Rating is ALWAYS based on ALL reviews (including deleted ones)
            if (allReviews.length > 0) {
                const sum = allReviews.reduce((acc, rev) => acc + rev.rating, 0);
                dynamicRating = (sum / allReviews.length).toFixed(1);
            }
            const visibleReviews = allReviews.filter(r => !r.isDeleted);
            return {
                ...c,
                dynamicRating: dynamicRating,
                reviewCount: visibleReviews.length
            };
        });

        setFilteredCounsellors(withDynamicRatings);
        setShowResults(true);
    };

    const handleOpenReviews = (counsellor) => {
        setSelectedReviewCounsellor(counsellor);
        const allReviews = JSON.parse(localStorage.getItem(`reviews_${counsellor.id}`)) || [];
        // Only show non-deleted reviews to users
        const visibleReviews = allReviews.filter(r => !r.isDeleted);
        setCounsellorReviews(visibleReviews);
        setShowReviewModal(true);
        setShowReviewForm(false);
        setNewReviewText('');
        setNewReviewRating(5);
    };

    const handleSubmitReview = () => {
        if (!newReviewText.trim()) return;
        
        const newReview = {
            id: Date.now(),
            patientName: currentUser.name,
            rating: newReviewRating,
            text: newReviewText,
            date: new Date().toLocaleDateString()
        };
        
        const updatedReviews = [newReview, ...counsellorReviews];
        localStorage.setItem(`reviews_${selectedReviewCounsellor.id}`, JSON.stringify(updatedReviews));
        setCounsellorReviews(updatedReviews);
        
        // Update the filteredCounsellors array so the UI rating updates immediately
        const updatedCounsellors = filteredCounsellors.map(c => {
            if (c.id === selectedReviewCounsellor.id) {
                const sum = updatedReviews.reduce((acc, rev) => acc + rev.rating, 0);
                return {
                    ...c,
                    dynamicRating: (sum / updatedReviews.length).toFixed(1),
                    reviewCount: updatedReviews.length
                };
            }
            return c;
        });
        setFilteredCounsellors(updatedCounsellors);
        
        setShowReviewForm(false);
        setNewReviewText('');
        setNewReviewRating(5);
        setToast({ show: true, message: 'Review submitted successfully!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };


    return (
        <div className="app-container" style={{
            background: 'transparent',
            height: 'auto',
            minHeight: 'auto',
            overflow: 'visible',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '3rem',
            paddingBottom: '0',
            flexDirection: 'column'
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
            {/* Back Button */}
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
                {showResults ? 'Back to Search' : 'Back'}
            </button>

            <div className="animate-fade-in" style={{ textAlign: 'center', width: '90%', maxWidth: showResults ? '1000px' : '800px', padding: '1rem 4rem 0', marginBottom: '0' }}>
                <h1 className="gradient-text" style={{ fontSize: showResults ? '4rem' : '5rem', fontWeight: '900', marginBottom: '0.75rem', marginTop: '0.5rem', letterSpacing: '-2px', lineHeight: '1.1' }}>
                    {showResults ? `Counsellors in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}` : 'Book A Counsellor'}
                </h1>

                {!showResults ? (
                    <>
                        <p style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '2.5rem', fontWeight: '500' }}>
                            Find professional support tailored to your location.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                            {/* Country Selector */}
                            <div style={{ width: '100%', maxWidth: '400px', textAlign: 'left' }}>
                                <label style={{ color: '#ffffff', display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>Select your Country</label>
                                <select
                                    className="glass-input"
                                    style={{ width: '100%', marginBottom: '0', background: '#ffffff', color: '#000000', opacity: 1 }}
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                >
                                    <option value="">Choose your country...</option>
                                    {Object.keys(locationData).map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>

                            {/* State Selector - Dependent on Country */}
                            <div style={{
                                width: '100%',
                                maxWidth: '400px',
                                textAlign: 'left',
                                transition: 'all 0.3s ease'
                            }}>
                                <label style={{ color: '#ffffff', display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>Select your State</label>
                                <select
                                    className="glass-input"
                                    style={{ width: '100%', marginBottom: '0', background: '#ffffff', color: '#000000', opacity: 1 }}
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

                            {/* City Selector - Dependent on State */}
                            <div style={{
                                width: '100%',
                                maxWidth: '400px',
                                textAlign: 'left',
                                transition: 'all 0.3s ease'
                            }}>
                                <label style={{ color: '#ffffff', display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>Select your City</label>
                                <select
                                    className="glass-input"
                                    style={{ width: '100%', marginBottom: '0', background: '#ffffff', color: '#000000', opacity: 1 }}
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
                                onClick={handleFindCounsellors}
                                style={{
                                    padding: '1.2rem 4rem',
                                    fontSize: '1.3rem',
                                    fontWeight: '800',
                                    borderRadius: '50px',
                                    marginTop: '0.5rem',
                                    cursor: selectedCity ? 'pointer' : 'not-allowed',
                                    opacity: selectedCity ? 1 : 0.7
                                }}
                                disabled={!selectedCity}
                            >
                                Find Counsellors
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '3rem', justifyContent: 'center' }}>
                        {filteredCounsellors.length > 0 ? (
                            filteredCounsellors.map(counsellor => (
                                <div key={counsellor.id} className="glass-panel" style={{
                                    padding: '2rem',
                                    textAlign: 'left',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    animationDelay: `${counsellor.id * 0.1}s`,
                                    width: '100%',
                                    maxWidth: '350px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                                        <img
                                            src={imgErrors.has(counsellor.id) ? fallbackImage : counsellor.image}
                                            alt={counsellor.name}
                                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-blue)' }}
                                            onError={() => handleImgError(counsellor.id)}
                                        />
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{counsellor.name}</h3>
                                            <p style={{ margin: 0, color: 'var(--color-blue)', fontWeight: '700', fontSize: '0.9rem' }}>{counsellor.specialization}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
                                            <span>{counsellor.education || 'Expert Professional'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"></path><path d="M5 21V10.85"></path><path d="M19 21V10.85"></path><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path></svg>
                                            <span>{counsellor.hospital || 'Private Practice'}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Exp: <strong style={{ color: 'var(--text-primary)' }}>{counsellor.experience}</strong></span>
                                        <div 
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '4px 8px', background: 'rgba(255,165,0,0.1)', borderRadius: '12px' }}
                                            onClick={() => handleOpenReviews(counsellor)}
                                            title="Click to view reviews"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="var(--color-orange)" stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--color-orange)' }}>{counsellor.dynamicRating || counsellor.rating}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({counsellor.reviewCount || 0})</span>
                                        </div>
                                    </div>

                                    <button
                                        className="nav-btn logout-primary-btn"
                                        style={{ width: '100%', marginTop: 'auto', padding: '1rem' }}
                                        onClick={() => handleOpenBooking(counsellor)}
                                    >
                                        Book Session
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '4rem', color: 'var(--text-primary)' }}>
                                <h2 style={{ marginBottom: '1rem' }}>No Counsellors Found</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>We currently don't have available counsellors in this city. Try selecting another city like Delhi or Mumbai.</p>
                                <button className="nav-btn" onClick={() => setShowResults(false)} style={{ marginTop: '2rem' }}>Back to Search</button>
                            </div>
                        )}
                    </div>
                )}

                {/* My Appointments Section */}
                <div id="my-appointments" style={{ marginTop: '5rem', width: '100%', maxWidth: '1000px', textAlign: 'left', paddingBottom: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderLeft: '5px solid var(--color-blue)', paddingLeft: '1.5rem' }}>
                        <h2 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>My Appointments</h2>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: 'var(--color-blue)',
                            padding: '4px 15px',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                            {appointments.length} Bookings
                        </div>
                    </div>

                    {appointments.filter(a => a.status !== 'cancelled').length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.5rem' }}>
                            {appointments.filter(a => a.status !== 'cancelled').map(apt => (
                                <div key={apt.id} className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                            <img
                                                src={apt.doctorImage}
                                                alt={apt.doctorName}
                                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-blue)' }}
                                            />
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{apt.doctorName}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-blue)', fontWeight: '600' }}>{apt.doctorSpecialization}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ background: 'rgba(0, 200, 100, 0.1)', color: '#00c864', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Confirmed</div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: #{apt.id.toString().slice(-6)}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div>
                                            <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Patient</p>
                                            <p style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: '600' }}>{apt.patientName}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{apt.age} Years • {apt.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Schedule</p>
                                            <p style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: '600' }}>{new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '1rem', color: 'var(--color-blue)', fontWeight: '700' }}>{apt.timeSlot}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Booked on {new Date(apt.timestamp).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => handleCancelClick(apt)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <p style={{ fontSize: '1.2rem' }}>No active appointments found.</p>
                        </div>
                    )}

                    {/* Cancelled Appointments Section */}
                    {appointments.filter(a => a.status === 'cancelled').length > 0 && (
                        <div style={{ marginTop: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderLeft: '5px solid #ef4444', paddingLeft: '1.5rem' }}>
                                <h2 style={{ color: 'black', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>Cancelled Appointments</h2>
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    padding: '4px 15px',
                                    borderRadius: '50px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}>
                                    {appointments.filter(a => a.status === 'cancelled').length} Cancelled
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.5rem' }}>
                                {appointments.filter(a => a.status === 'cancelled').map(apt => (
                                    <div key={apt.id} className="glass-panel animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', opacity: 0.8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                                <img
                                                    src={apt.doctorImage}
                                                    alt={apt.doctorName}
                                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ef4444', filter: 'grayscale(100%)' }}
                                                />
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'black' }}>{apt.doctorName}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#ef4444', fontWeight: '600' }}>{apt.doctorSpecialization}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Cancelled</div>
                                            </div>
                                        </div>

                                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                            <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: '800' }}>Reason for Cancellation</p>
                                            <p style={{ margin: 0, fontSize: '0.95rem', color: 'black', fontStyle: 'italic' }}>"{apt.cancellationReason}"</p>
                                            <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'rgba(0,0,0,0.6)' }}>
                                                Cancelled by {apt.cancelledBy === 'user' ? 'You' : 'Doctor'} on {new Date(apt.cancelledAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'black', textTransform: 'uppercase', fontWeight: '700', opacity: 0.7 }}>Patient</p>
                                                <p style={{ margin: 0, fontSize: '1rem', color: 'black', fontWeight: '600' }}>{apt.patientName}</p>
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'black', textTransform: 'uppercase', fontWeight: '700', opacity: 0.7 }}>Schedule</p>
                                                <p style={{ margin: 0, fontSize: '1rem', color: 'black', fontWeight: '600' }}>{new Date(apt.date).toLocaleDateString()}</p>
                                                <p style={{ margin: '2px 0 0', fontSize: '1rem', color: 'rgba(0,0,0,0.6)', fontWeight: '700' }}>{apt.timeSlot}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2.5rem',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={closeBooking}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '5px'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {bookingStep === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem', marginTop: 0 }}>Patient Details</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Booking session with {selectedDoctor?.name}</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                                        <input
                                            type="text"
                                            name="patientName"
                                            className="glass-input"
                                            placeholder="Enter patient name"
                                            value={bookingData.patientName}
                                            onChange={handleBookingInput}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600' }}>Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                className="glass-input"
                                                placeholder="Age"
                                                value={bookingData.age}
                                                onChange={handleBookingInput}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600' }}>Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                className="glass-input"
                                                placeholder="Contact number"
                                                value={bookingData.phoneNumber}
                                                onChange={handleBookingInput}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className="nav-btn logout-primary-btn"
                                        style={{ width: '100%', padding: '1.2rem', marginTop: '1rem', fontSize: '1.1rem' }}
                                        onClick={handleNextStep}
                                    >
                                        Next: Select Slot
                                    </button>
                                </div>
                            </div>
                        )}

                        {bookingStep === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem', marginTop: 0 }}>Select Slot</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Choose your preferred date and time</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600' }}>Select Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            className="glass-input"
                                            value={bookingData.date}
                                            onChange={handleBookingInput}
                                            min={new Date().toISOString().split('T')[0]}
                                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                                        />
                                    </div>

                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: '600' }}>Available Time Slots</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                            {['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'].map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setBookingData(prev => ({ ...prev, timeSlot: slot }))}
                                                    style={{
                                                        padding: '0.75rem 0.5rem',
                                                        borderRadius: '12px',
                                                        border: bookingData.timeSlot === slot ? '2px solid var(--color-blue)' : '1px solid rgba(255,255,255,0.1)',
                                                        background: bookingData.timeSlot === slot ? 'rgba(0, 102, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                                                        color: bookingData.timeSlot === slot ? 'var(--color-blue)' : 'var(--text-secondary)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginTop: '1rem' }}>
                                        <button
                                            className="nav-btn"
                                            onClick={() => setBookingStep(1)}
                                            style={{ padding: '1rem' }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            className="nav-btn logout-primary-btn"
                                            style={{ padding: '1rem', fontSize: '1.1rem' }}
                                            onClick={handleBookAppointment}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {bookingStep === 3 && (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(0, 200, 100, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: '0 auto 2rem'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00c864" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: 0 }}>Success!</h2>
                                <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Appointment Booked Successfully</p>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                                    Your session with <strong>{selectedDoctor?.name}</strong> is confirmed for <strong>{bookingData.date}</strong> at <strong>{bookingData.timeSlot}</strong>.
                                </p>
                                <button
                                    className="nav-btn logout-primary-btn"
                                    style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
                                    onClick={closeBooking}
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reviews Modal */}
            {showReviewModal && selectedReviewCounsellor && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1100,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem'
                }} onClick={() => setShowReviewModal(false)}>
                    <div className="glass-panel animate-fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Reviews for {selectedReviewCounsellor.name}</h2>
                            <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        
                        {!showReviewForm ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-orange)' }}>
                                        {selectedReviewCounsellor.dynamicRating || selectedReviewCounsellor.rating}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {[1,2,3,4,5].map(star => (
                                                <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={star <= Math.round(selectedReviewCounsellor.dynamicRating || selectedReviewCounsellor.rating) ? "var(--color-orange)" : "none"} stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Based on {counsellorReviews.length} reviews</span>
                                    </div>
                                    <button 
                                        className="nav-btn primary-btn" 
                                        style={{ marginLeft: 'auto', padding: '0.5rem 1rem' }}
                                        onClick={() => setShowReviewForm(true)}
                                    >
                                        Write a Review
                                    </button>
                                </div>
                                
                                <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                                    {counsellorReviews.length > 0 ? (
                                        counsellorReviews.map(rev => {
                                            const getRelDate = (dateString) => {
                                                const date = new Date(dateString);
                                                if (isNaN(date.getTime())) return 'Recently';
                                                const diffDays = Math.floor(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
                                                if (diffDays === 0) return 'Today';
                                                if (diffDays === 1) return '1 day ago';
                                                return `${diffDays} days ago`;
                                            };
                                            return (
                                            <div key={rev.id} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{rev.patientName || rev.userName || 'Anonymous'}</span>
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{getRelDate(rev.date)}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                                                    {[1,2,3,4,5].map(star => (
                                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={star <= rev.rating ? "var(--color-orange)" : "none"} stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                    ))}
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{rev.text || rev.comment || ''}</p>
                                            </div>
                                            );
                                        })
                                    ) : (
                                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No reviews yet. Be the first to review!</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Rating</label>
                                    <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                                        {[1,2,3,4,5].map(star => (
                                            <svg 
                                                key={star} 
                                                onClick={() => setNewReviewRating(star)}
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                                                fill={star <= newReviewRating ? "var(--color-orange)" : "none"} 
                                                stroke="var(--color-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                style={{ transition: 'all 0.2s' }}
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Your Review</label>
                                    <textarea 
                                        className="glass-input"
                                        value={newReviewText}
                                        onChange={(e) => setNewReviewText(e.target.value)}
                                        placeholder="Share your experience..."
                                        style={{ minHeight: '100px', resize: 'vertical' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button className="nav-btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowReviewForm(false)}>Cancel</button>
                                    <button className="nav-btn primary-btn" style={{ flex: 1 }} onClick={handleSubmitReview} disabled={!newReviewText.trim()}>Submit Review</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1100,
                    padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '2.5rem',
                        position: 'relative'
                    }}>
                        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem', marginTop: 0 }}>Cancel Appointment</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Please tell us why you need to cancel your appointment with <strong>{appointmentToCancel?.doctorName}</strong>.
                        </p>

                        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '600' }}>Reason for Cancellation</label>
                            <textarea
                                className="glass-input"
                                placeholder="Enter reason here..."
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    padding: '1rem',
                                    resize: 'none',
                                    borderRadius: '16px'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                className="nav-btn"
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setAppointmentToCancel(null);
                                    setCancellationReason('');
                                }}
                                style={{ padding: '1rem' }}
                            >
                                Not Now
                            </button>
                            <button
                                className="nav-btn logout-primary-btn"
                                style={{ padding: '1rem', background: '#ef4444', borderColor: '#ef4444' }}
                                onClick={confirmCancellation}
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Decorative background elements */}
            <div className="glow-orb orb-1" style={{ position: 'fixed' }}></div>
            <div className="glow-orb orb-2" style={{ position: 'fixed' }}></div>

            {/* Toast Notification */}
            {toast.show && (
                <div className="toast-container">
                    <div className="toast-message">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))' }}>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        {toast.message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookACounsellor;
