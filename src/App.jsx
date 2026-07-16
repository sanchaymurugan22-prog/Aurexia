import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Route-level lazy imports — each page becomes its own JS chunk
const SplashScreen       = lazy(() => import('./components/SplashScreen'));
const LanguageSelection  = lazy(() => import('./components/LanguageSelection'));
const LoginPage          = lazy(() => import('./components/LoginPage'));
const SignupPage         = lazy(() => import('./components/SignupPage'));
const MainPage           = lazy(() => import('./components/MainPage'));
const MainPage2          = lazy(() => import('./components/MainPage2'));
const MainPage3          = lazy(() => import('./components/MainPage3'));
const MainPage4          = lazy(() => import('./components/MainPage4'));
const WelcomePage        = lazy(() => import('./components/WelcomePage'));
const ProfilePage        = lazy(() => import('./components/ProfilePage'));
const ProfilePage2       = lazy(() => import('./components/ProfilePage2'));
const PeerForumPage      = lazy(() => import('./components/PeerForumPage'));
const BookACounsellor    = lazy(() => import('./components/BookACounsellor'));
const VideosPage         = lazy(() => import('./components/VideosPage'));
const BooksPage          = lazy(() => import('./components/BooksPage'));
const ClassesPage        = lazy(() => import('./components/ClassesPage'));
const SoundSanctuary     = lazy(() => import('./components/SoundSanctuary'));
const MeditationTracks   = lazy(() => import('./components/MeditationTracks'));
const AICompanion        = lazy(() => import('./components/AICompanion'));
const TutorClasses       = lazy(() => import('./components/TutorClasses'));
const PublicUsers        = lazy(() => import('./components/PublicUsers'));
const ComplaintsReports  = lazy(() => import('./components/ComplaintsReports'));
const ManageCounsellors  = lazy(() => import('./components/ManageCounsellors'));
const ManageTutors       = lazy(() => import('./components/ManageTutors'));

// Minimal full-screen loader shown while a page chunk is being fetched
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f0f1a',
      color: '#fff',
      fontSize: '1.1rem',
      letterSpacing: '0.05em',
    }}>
      Loading…
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                    element={<SplashScreen />} />
          <Route path="/language"            element={<LanguageSelection />} />
          <Route path="/login"               element={<LoginPage />} />
          <Route path="/signup"              element={<SignupPage />} />
          <Route path="/main"                element={<MainPage />} />
          <Route path="/main2"               element={<MainPage2 />} />
          <Route path="/main3"               element={<MainPage3 />} />
          <Route path="/main4"               element={<MainPage4 />} />
          <Route path="/about"               element={<WelcomePage />} />
          <Route path="/profile"             element={<ProfilePage />} />
          <Route path="/profile2"            element={<ProfilePage2 />} />
          <Route path="/peer-forum"          element={<PeerForumPage />} />
          <Route path="/book-counsellor"     element={<BookACounsellor />} />
          <Route path="/videos"              element={<VideosPage />} />
          <Route path="/books"               element={<BooksPage />} />
          <Route path="/sound-sanctuary"     element={<SoundSanctuary />} />
          <Route path="/meditation_tracks"   element={<MeditationTracks />} />
          <Route path="/classes"             element={<ClassesPage />} />
          <Route path="/ai-companion"        element={<AICompanion />} />
          <Route path="/tutor-classes"       element={<TutorClasses />} />
          <Route path="/public-users"        element={<PublicUsers />} />
          <Route path="/complaints-reports"  element={<ComplaintsReports />} />
          <Route path="/manage-counsellors"  element={<ManageCounsellors />} />
          <Route path="/manage-tutors"       element={<ManageTutors />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
