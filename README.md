# Aurexia

Aurexia is a comprehensive mental wellness and health application that acts as a peaceful digital sanctuary. It offers features like an AI companion for emotional support, peer forums, professional counselling bookings, a sound sanctuary, and a library of wisdom to help users find balance, mindfulness, and inner peace.

## Tech Stack & Architecture

### Frontend Technologies
- **React (v19.2)** - The core library used to build a component-based, highly interactive user interface.
- **React Router DOM (v7)** - Enables seamless, single-page application (SPA) client-side routing across 20+ distinct views (e.g., Peer Forum, AI Companion, Profile) without page reloads.
- **React Lazy & Suspense** - Implements route-level code splitting, ensuring each page is loaded dynamically as a separate JavaScript chunk to drastically reduce the initial load time.
- **React Context API & Hooks** - Utilized (`useState`, `useEffect`, `useRef`) for robust local state management and passing global configurations (like Language preferences).
- **Vite (v7)** - A next-generation frontend tooling ecosystem that provides lightning-fast hot module replacement (HMR) during development and highly optimized Rollup-based builds for production.
- **Rollup Manual Chunks** - Configured via `vite.config.js` to isolate vendor libraries (`vendor-react`, `vendor-firebase`) for optimal browser caching and performance.

### Backend & Cloud Infrastructure (Firebase v12)
- **Firebase Authentication** - Provides secure, password-based identity management and session handling for Users, Tutors, Counsellors, and Admins.
- **Firebase Firestore** - A scalable NoSQL cloud database used to store persistent app data like user profiles, peer forum posts, appointments, and role-based access configurations.
- **Firebase Hosting** - Delivers the production build of the application via a global CDN with SSL out-of-the-box, configured as a Single Page App (`rewrites` to `/index.html`).

### State & Data Synchronization
- **Local Storage API** - Serves as a client-side cache to instantly load previously fetched data (like user profiles and mocked AI chat histories) offline, while seamlessly syncing with Firestore in the background.

### Languages & Core Web Technologies
- **JavaScript (ES6+)** - The primary programming language powering all application logic, API integrations, routing, and dynamic data rendering.
- **JSX (JavaScript XML)** - A syntax extension allowing HTML-like markup to be written cohesively within React JavaScript components.
- **HTML5 & CSS3** - Provides semantic document structure and bespoke styling. Custom styling uses vanilla CSS (`App.css`, `index.css`) featuring modern design paradigms like glassmorphism, flexbox, CSS grid, and responsive media queries to ensure a calming, premium user experience.

### Developer Tools & Quality Assurance
- **ESLint (v9)** - Configured with specific React plugins (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) to enforce strict code quality and maintainability standards.
- **Node.js Environment** - Powers the local development server, package management (npm), and build pipelines.
