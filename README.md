# Aurexia - Lightness for the Mind

## App Description

**Aurexia** is a holistic, state-of-the-art mental wellness and emotional support web application designed to serve as a peaceful, digital sanctuary. Grounded in empathetic design principles, Aurexia aims to reduce stress, manage anxiety, foster self-care, and bring clarity to everyday life. 

Whether users are seeking an intelligent, active listener through an AI companion, searching for community connection in peer forums, booking professional therapy sessions, or indulging in relaxing soundscapes and wisdom literature, Aurexia provides a comprehensive, serene ecosystem for mental well-being.

---

## App Features

### 🤖 Aurexia AI Companion (Voice & Text)
- **Empathetic AI Persona**: Powered by advanced Large Language Models to offer warm, supportive, and human-like conversational therapy and emotional check-ins.
- **Hands-Free Voice Mode**: Integrated Web Speech API for accurate speech-to-text recognition and browser-native Speech Synthesis (Text-to-Speech) for natural spoken dialogue.
- **Live Pitch Visualizer**: Built with the Web Audio API (`AudioContext` & `AnalyserNode`) to display real-time audio wave frequencies and pitch oscillations while the user speaks.
- **Unified Communication Pipeline**: Typing a text message automatically speaks the response aloud and opens the microphone for hands-free voice replies.
- **Safety & Crisis Interventions**: Detects high-risk distress keywords and immediately provides emergency helpline resources and comforting support.

### 👥 Peer Forum Community
- **Shared Wellness Journeys**: A supportive social space where users can post thoughts, share wellness stories, and connect with others.
- **Interactive Engagement**: Features like upvoting, commenting, and category filtering to foster meaningful community discussions.

### 🩺 Professional Counselling & Tutor Sessions
- **Counsellor Directory & Booking**: Browse verified mental health professionals, view credentials, and book confidential 1-on-1 counseling appointments.
- **Tutor Classes & Events**: Schedule and attend mindfulness workshops, meditation classes, and educational wellness events.

### 🧘 Sound Sanctuary & Meditation Tracks
- **Calming Ambient Audio**: Built-in audio player featuring relaxing nature sounds, binaural beats, and guided meditation tracks for focus, anxiety relief, and sleep.

### 📚 Library of Wisdom
- **Curated Reading**: Collection of classic literature, self-help books, and inspirational philosophy excerpts curated to promote mental clarity and inner peace.

### 🔐 Multi-Role User Management & Authentication
- **Role-Based Portals**: Customized user experience and navigation for **Public Users**, **Counsellors**, **Tutors**, and **Admins**.
- **Secure Authentication**: Email and password user registration, authentication, and session handling backed by Firebase Auth.

### 🌐 Internationalization & Accessibility
- **Multi-Language Support**: Seamless language switching (English, Tamil, Hindi, etc.) powered by a custom React Language Context.
- **Glassmorphism UI**: Beautiful, calm visual aesthetics utilizing soft blur filters, soothing dark gradients, and responsive layouts.

---

## Full Tech Stack & Technical Details

### 🎨 Frontend Framework & Routing
- **React (v19.2)**: Core library powering component-based design, stateful dynamic UI rendering, and reactive updates.
- **React Router DOM (v7)**: Client-side Single Page Application (SPA) routing managing seamless transitions across 20+ distinct views.
- **React Lazy & Suspense**: Implements route-level code-splitting to dynamically load pages on demand, keeping initial bundle sizes minimal.
- **React Context API & Hooks**: Global state management for user language preferences, active chat histories, and local component states (`useState`, `useEffect`, `useRef`, `useMemo`).

### ⚡ Build Tooling & Performance Optimization
- **Vite (v7)**: Next-generation frontend build engine providing instant Hot Module Replacement (HMR) during development.
- **Rollup Manual Chunking**: Advanced build optimization configured via `vite.config.js` to split vendor dependencies (`vendor-react`, `vendor-firebase`, `vendor-misc`) for efficient browser caching.

### ☁️ Backend, Database & Cloud Infrastructure
- **Firebase Authentication (v12)**: Secure, token-based user identity management supporting Email/Password sign-up, sign-in, and session persistence.
- **Firebase Cloud Firestore (v12)**: Scalable NoSQL cloud database storing real-time user profiles, appointment bookings, tutor schedules, and forum posts.
- **Firebase Hosting**: Production web hosting deployed on Firebase's global Content Delivery Network (CDN) with automatic SSL certificate management and SPA rewrites.

### 🧠 Artificial Intelligence & Language Models
- **NVIDIA NIM API**: High-performance inference endpoint running state-of-the-art open-source LLMs (`meta/llama-3.1-8b-instruct` / `deepseek-ai/deepseek-v4-pro`).
- **RESTful Fetch Architecture**: Custom async request pipeline handling conversation context windowing and streaming response formatting.

### 🎙️ Audio, Voice & Speech Processing
- **Web Speech API (`SpeechRecognition`)**: Native browser speech recognition engine configured for continuous transcript assembly.
- **Web Audio API (`AudioContext`, `AnalyserNode`)**: Real-time microphone audio processing extracting frequency arrays for dynamic pitch visualization.
- **Web Speech Synthesis API (`SpeechSynthesisUtterance`)**: Text-to-speech engine configured with custom pitch, rate, and voice profile selection.

### 💻 Languages & Styling
- **JavaScript (ES6+)**: Core logic language powering API integrations, state operations, and routing.
- **JSX**: XML-like template syntax for constructing React component hierarchies.
- **Vanilla CSS3 & HTML5**: Pure custom CSS (`App.css`, `index.css`) featuring glassmorphism effects, flexbox, CSS grid, custom scrollbars, keyframe animations, and full mobile responsiveness.

### 🛠️ Developer Tools & Version Control
- **Firebase CLI (`firebase-tools`)**: Command-line tool used for configuring rules, indexes, and deploying builds to Firebase Hosting.
- **Git & GitHub**: Distributed version control and repository hosting.
- **Node.js & npm**: JavaScript runtime environment and package management.
- **ESLint (v9)**: Code quality enforcement with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.
