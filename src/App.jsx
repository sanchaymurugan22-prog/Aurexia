import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LanguageSelection from './components/LanguageSelection';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import MainPage2 from './components/MainPage2';
import MainPage3 from './components/MainPage3';
import MainPage4 from './components/MainPage4';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import ProfilePage2 from './components/ProfilePage2';
import PeerForumPage from './components/PeerForumPage';
import BookACounsellor from './components/BookACounsellor';
import VideosPage from './components/VideosPage';
import BooksPage from './components/BooksPage';
import ClassesPage from './components/ClassesPage';
import AICompanion from './components/AICompanion';
import TutorClasses from './components/TutorClasses';
import PublicUsers from './components/PublicUsers';
import ComplaintsReports from './components/ComplaintsReports';
import ManageCounsellors from './components/ManageCounsellors';
import ManageTutors from './components/ManageTutors';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/language" element={<LanguageSelection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/main2" element={<MainPage2 />} />
        <Route path="/main3" element={<MainPage3 />} />
        <Route path="/main4" element={<MainPage4 />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile2" element={<ProfilePage2 />} />
        <Route path="/peer-forum" element={<PeerForumPage />} />
        <Route path="/book-counsellor" element={<BookACounsellor />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/ai-companion" element={<AICompanion />} />
        <Route path="/tutor-classes" element={<TutorClasses />} />
        <Route path="/public-users" element={<PublicUsers />} />
        <Route path="/complaints-reports" element={<ComplaintsReports />} />
        <Route path="/manage-counsellors" element={<ManageCounsellors />} />
        <Route path="/manage-tutors" element={<ManageTutors />} />
      </Routes>

    </Router>
  );
}

export default App;
