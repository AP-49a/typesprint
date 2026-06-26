import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { SettingsProvider } from './context/SettingsContext.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';

// Page Imports
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import TypingTest from './pages/TypingTest.js';
import Results from './pages/Results.js';
import Profile from './pages/Profile.js';
import Leaderboard from './pages/Leaderboard.js';
import Certificates from './pages/Certificates.js';
import CertificateDetail from './pages/CertificateDetail.js';
import VerifyCertificate from './pages/VerifyCertificate.js';
import Settings from './pages/Settings.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Privacy from './pages/Privacy.js';
import Terms from './pages/Terms.js';
import NotFound from './pages/NotFound.js';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-theme-sub min-h-screen">
        <p className="animate-pulse">Loading secure session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col justify-center w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<TypingTest />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              }
            />

            {/* Certificate Details & Verification (Public) */}
            <Route path="/certificate/:id" element={<CertificateDetail />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            
            {/* Settings & Info */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </AuthProvider>
  );
}
