import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { PlatformProvider } from './context/PlatformContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AIAssistant from './pages/AIAssistant';
import Services from './pages/Services';
import ReportIssue from './pages/ReportIssue';
import ComplaintTracker from './pages/ComplaintTracker';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <LanguageProvider>
      <PlatformProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Top Navigation */}
            <Navbar />

            {/* Main view container */}
            <main className="flex-1 flex flex-col page-fade-in">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/assistant" element={<AIAssistant />} />
                <Route path="/services" element={<Services />} />
                <Route path="/report" element={<ReportIssue />} />
                <Route path="/tracker" element={<ComplaintTracker />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>

            {/* Bottom Footer */}
            <Footer />
          </div>
        </Router>
      </PlatformProvider>
    </LanguageProvider>
  );
}
