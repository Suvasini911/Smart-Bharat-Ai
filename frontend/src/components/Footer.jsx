import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, ShieldAlert, Cpu } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 border-b-[3.5px] border-b-tricolor-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center text-navy-900 font-bold">
                SB
              </div>
              <span className="text-lg font-bold text-white tracking-wide">{t('logoTitle')}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An AI-powered civic platform assisting Indian citizens in discovering welfare schemes, filing complaints, and getting real-time support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Platform Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/assistant" className="hover:text-white transition-colors">{t('navAssistant')}</a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors">{t('navServices')}</a>
              </li>
              <li>
                <a href="/report" className="hover:text-white transition-colors">{t('navReport')}</a>
              </li>
              <li>
                <a href="/tracker" className="hover:text-white transition-colors">{t('navTracker')}</a>
              </li>
            </ul>
          </div>

          {/* Tech Stack Info */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Developer & Platform</h3>
            <div className="flex flex-col space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-saffron-500" />
                <span>Powered by Google Gemini AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Landmark className="w-4 h-4 text-white" />
                <span>Smart Bharat Initiative</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-tricolor-green-500" />
                <span>Secured JSON Civic Storage</span>
              </div>
            </div>
          </div>

        </div>

        <hr className="border-navy-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} Smart Bharat – AI Civic Companion. Developed for Digital India Civic hackathon.</p>
          <p className="mt-2 sm:mt-0">This is a demonstration MVP and does not represent an official government website.</p>
        </div>
      </div>
    </footer>
  );
}
