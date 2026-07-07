import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe, Bot, FileText, TriangleAlert, SearchCheck, LayoutDashboard, House } from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  const navigation = [
    { name: t('navHome'), href: '/', icon: House },
    { name: t('navAssistant'), href: '/assistant', icon: Bot },
    { name: t('navServices'), href: '/services', icon: FileText },
    { name: t('navReport'), href: '/report', icon: TriangleAlert },
    { name: t('navTracker'), href: '/tracker', icon: SearchCheck },
    { name: t('navDashboard'), href: '/dashboard', icon: LayoutDashboard },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'kn', name: 'ಕನ್ನಡ' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/50 shadow-xs">
      {/* Saffron Top Accent Line */}
      <div className="h-[3.5px] w-full bg-saffron-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-600 to-navy-800 flex items-center justify-center text-white shadow-md transform group-hover:scale-105 transition-all">
                <span className="font-bold text-lg tracking-wider text-saffron-500">SB</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-navy-800 leading-none group-hover:text-navy-600 transition-colors">
                  {t('logoTitle')}
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {t('logoSub')}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative group flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-250 ${
                    active
                      ? 'text-navy-800'
                      : 'text-slate-600 hover:text-navy-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors duration-250 ${active ? 'text-navy-600' : 'text-slate-400 group-hover:text-navy-500'}`} />
                  <span>{item.name}</span>
                  {/* Active/Hover sliding underline indicator */}
                  <span className={`absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-navy-600 transition-transform duration-250 origin-left ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </Link>
              );
            })}

            {/* Language Selector */}
            <div className="relative ml-4">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-hidden"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>{languages.find(l => l.code === language)?.name}</span>
              </button>

              {langDropdown && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-slate-200 shadow-lg py-1 z-50 animate-slide-up">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-saffron-50 text-saffron-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Quick language toggle on mobile (Globe icon) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="p-2 rounded-lg border border-slate-200 text-slate-700 bg-white"
              >
                <Globe className="w-5 h-5" />
              </button>
              {langDropdown && (
                <div className="absolute right-0 mt-2 w-32 rounded-lg bg-white border border-slate-200 shadow-lg py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs ${
                        language === lang.code ? 'bg-saffron-50 text-saffron-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-2 pt-2 pb-4 space-y-1 shadow-inner animate-slide-up">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  active
                    ? 'bg-navy-50 text-navy-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-navy-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
