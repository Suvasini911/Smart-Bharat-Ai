import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePlatform } from '../context/PlatformContext';
import { Bookmark, AlertCircle, Clock, Trash2, Search, ArrowRight, Bot, TriangleAlert, Sparkles, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { 
    savedServices, 
    toggleSaveService, 
    recentSearches, 
    clearRecentSearches, 
    submittedComplaints 
  } = usePlatform();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('services');

  // Hardcoded reference services map to translate IDs back to names
  const servicesMap = {
    'aadhaar': 'Aadhaar Card',
    'pan': 'PAN Card',
    'passport': 'Indian Passport',
    'birth_certificate': 'Birth Certificate',
    'driving_licence': 'Driving Licence',
    'voter_id': 'Voter ID Card',
    'ration_card': 'Ration Card'
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'review':
        return 'bg-saffron-50 text-saffron-700 border-saffron-100';
      case 'assigned':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'resolved':
        return 'bg-tricolor-green-50 text-tricolor-green-700 border-tricolor-green-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'submitted': return t('statusSubmitted');
      case 'review': return t('statusReview');
      case 'assigned': return t('statusAssigned');
      case 'resolved': return t('statusResolved');
      default: return status;
    }
  };

  return (
    <div className="flex-1 bg-ash-light pb-16 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xs border border-navy-700 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center md:justify-start space-x-2">
            <Sparkles className="w-7 h-7 text-saffron-500 animate-pulse" />
            <span>{t('dashboardTitle')}</span>
          </h2>
          <p className="text-sm text-slate-300 font-semibold">{t('dashboardSubtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/assistant')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover-btn-effect"
          >
            <Bot className="w-4 h-4 text-saffron-500" />
            <span>{t('askAIQuick')}</span>
          </button>
          <button
            onClick={() => navigate('/report')}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-saffron-500 hover:bg-saffron-600 px-4 py-2.5 rounded-xl text-xs font-bold text-navy-950 transition-all shadow-xs cursor-pointer hover-btn-effect"
          >
            <TriangleAlert className="w-4 h-4" />
            <span>{t('reportIssueQuick')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Recent Searches & Quick Stats */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Stats */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 uppercase tracking-wider">Account Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-navy-800">{savedServices.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Saved</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-navy-800">{submittedComplaints.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Complaints</p>
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t('recentSearches')}</h3>
              {recentSearches.length > 0 && (
                <button
                  onClick={clearRecentSearches}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(`/services?search=${encodeURIComponent(search)}`)}
                    className="w-full text-left flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 px-2.5 py-2 rounded-lg transition-colors group cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-navy-600" />
                    <span className="truncate flex-1">{search}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-navy-600 transition-all" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-semibold py-2">No recent searches.</p>
            )}
          </div>
        </div>

        {/* Right Side: Main Saved & Filed Tabs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tab bar header */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'border-navy-600 text-navy-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('savedServicesTab')} ({savedServices.length})
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`pb-3.5 px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'complaints'
                  ? 'border-navy-600 text-navy-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t('submittedComplaintsTab')} ({submittedComplaints.length})
            </button>
          </div>

          {/* Tab Contents: Saved Services */}
          {activeTab === 'services' && (
            <div className="space-y-4 animate-slide-up">
              {savedServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedServices.map((serviceId) => (
                    <div
                      key={serviceId}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start justify-between group hover-card-effect"
                    >
                      <div className="space-y-1 pr-6">
                        <h4 className="font-bold text-base text-slate-800">
                          {servicesMap[serviceId] || serviceId}
                        </h4>
                        <p className="text-xs text-slate-400 font-semibold capitalize">Civic Scheme Checklist</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSaveService(serviceId)}
                          className="p-1.5 rounded-lg border border-slate-200 text-saffron-600 bg-saffron-50 hover:bg-slate-50 hover:text-slate-400 transition-colors cursor-pointer hover-btn-effect"
                          title="Remove bookmark"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={() => navigate(`/services?search=${encodeURIComponent(servicesMap[serviceId] || serviceId)}`)}
                          className="bg-navy-600 hover:bg-navy-700 text-white p-1.5 rounded-lg transition-colors cursor-pointer hover-btn-effect"
                        >
                          <ArrowRight className="w-4 h-4 text-saffron-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-xs px-4">
                  <p className="text-slate-500 font-semibold mb-4">{t('noSavedServices')}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center space-x-1.5 bg-navy-600 hover:bg-navy-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <span>Browse Services</span>
                    <ArrowRight className="w-3.5 h-3.5 text-saffron-500" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab Contents: Complaints */}
          {activeTab === 'complaints' && (
            <div className="space-y-4 animate-slide-up">
              {submittedComplaints.length > 0 ? (
                <div className="space-y-3">
                  {submittedComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover-card-effect"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold font-mono text-navy-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                            {complaint.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold border px-2 py-0.5 rounded-full capitalize ${getStatusBadgeColor(
                              complaint.status
                            )}`}
                          >
                            {getStatusLabel(complaint.status)}
                          </span>
                          {complaint.isOffline && (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-150">
                              Demo Local Mode
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-800 text-base truncate">{complaint.title}</h4>
                        <div className="flex items-center space-x-1 text-xs text-slate-400 font-semibold">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{complaint.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/tracker?id=${complaint.id}`)}
                        className="w-full sm:w-auto text-center bg-slate-50 border border-slate-200 hover:border-slate-300 text-navy-800 hover:bg-slate-100 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 hover-btn-effect"
                      >
                        <span>{t('viewDetails')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-navy-600" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-xs px-4">
                  <p className="text-slate-500 font-semibold mb-4">{t('noComplaintsFiled')}</p>
                  <Link
                    to="/report"
                    className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    <span>Report Grievance</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
