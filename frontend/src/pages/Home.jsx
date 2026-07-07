import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePlatform } from '../context/PlatformContext';
import { Bot, FileText, TriangleAlert, Search, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const { addRecentSearch } = usePlatform();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      addRecentSearch(searchVal);
      navigate(`/services?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const featureCards = [
    {
      title: t('navAssistant'),
      desc: t('assistantSubtitle'),
      icon: Bot,
      color: 'bg-saffron-500',
      textColor: 'text-saffron-700',
      bgColor: 'bg-saffron-50/70',
      link: '/assistant',
    },
    {
      title: t('navServices'),
      desc: t('servicesSubtitle'),
      icon: FileText,
      color: 'bg-navy-500',
      textColor: 'text-navy-700',
      bgColor: 'bg-navy-50/70',
      link: '/services',
    },
    {
      title: t('navReport'),
      desc: t('reportSubtitle'),
      icon: TriangleAlert,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50/70',
      link: '/report',
    },
  ];

  return (
    <div className="flex-1 bg-ash-light pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy-900 via-navy-950 to-slate-900 text-white py-24 sm:py-28 px-4 overflow-hidden border-b border-slate-800">
        {/* Modern tricolor radial glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-tricolor-green-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        {/* Visual digital grid background */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-saffron-500/10 text-saffron-500 border border-saffron-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 animate-ping"></span>
            <span>Digital India Hackathon Edition</span>
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('heroTitle')}
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            {t('heroSubtitle')}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 px-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-white text-slate-800 pl-12 pr-4 py-3.5 rounded-xl text-base border-0 focus:ring-3 focus:ring-saffron-500/50 shadow-lg placeholder-slate-400 font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-saffron-500 hover:bg-saffron-600 text-navy-950 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-saffron-500/20 transition-all text-base hover-btn-effect"
            >
              {t('searchButton')}
            </button>
          </form>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group hover-card-effect`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${feat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${feat.textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="pt-6">
                  <Link
                    to={feat.link}
                    className={`inline-flex items-center space-x-2 text-sm font-bold ${feat.textColor} group-hover:translate-x-1 transition-transform`}
                  >
                    <span>{t('getStarted')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-center text-navy-800 mb-10">{t('howItWorks')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4 space-y-3">
            <h4 className="text-lg font-bold text-navy-600">{t('step1Title')}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{t('step1Desc')}</p>
          </div>
          <div className="p-4 space-y-3 border-t md:border-t-0 md:border-l border-slate-200">
            <h4 className="text-lg font-bold text-navy-600">{t('step2Title')}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{t('step2Desc')}</p>
          </div>
          <div className="p-4 space-y-3 border-t md:border-t-0 md:border-l border-slate-200">
            <h4 className="text-lg font-bold text-navy-600">{t('step3Title')}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{t('step3Desc')}</p>
          </div>
        </div>
      </section>

      {/* Stats Widgets */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-navy-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-navy-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-saffron-500">1,240+</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t('activeComplaints')}</p>
            </div>
            <div className="space-y-2 border-l border-navy-700">
              <p className="text-3xl sm:text-4xl font-extrabold text-tricolor-green-500">4,910+</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t('resolvedComplaints')}</p>
            </div>
            <div className="space-y-2 border-l border-navy-700">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">7</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t('availableSchemes')}</p>
            </div>
            <div className="space-y-2 border-l border-navy-700">
              <p className="text-3xl sm:text-4xl font-extrabold text-saffron-500">98.4%</p>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{t('citizenSatisfaction')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
