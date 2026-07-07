import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePlatform } from '../context/PlatformContext';
import { SearchCheck, CheckCircle, Clock, ShieldCheck, MapPin, Calendar, FileText } from 'lucide-react';

export default function ComplaintTracker() {
  const { t } = useLanguage();
  const { getComplaintStatus } = usePlatform();
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState('');
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setComplaintId(id);
      handleTrack(id);
    }
  }, [searchParams]);

  const handleTrack = async (idToSearch) => {
    const searchId = idToSearch || complaintId;
    if (!searchId || !searchId.trim()) return;

    setSearchTriggered(true);
    const cleanedId = searchId.trim().toUpperCase();

    // Call state helper
    const details = await getComplaintStatus(cleanedId);
    
    if (details) {
      setComplaintDetails(details);
    } else {
      // For hackathon/demo purposes: if a user types *any* string containing 'SB-' or of length 6+, generate a realistic mock timeline
      if (cleanedId.startsWith('SB-') || cleanedId.length >= 6) {
        // Deterministic status based on the ID hash
        const statuses = ['submitted', 'review', 'assigned', 'resolved'];
        const charSum = cleanedId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const deterministicStatus = statuses[charSum % statuses.length];
        
        setComplaintDetails({
          id: cleanedId,
          title: 'Municipal Grievance (Mock Query)',
          description: 'This is a simulation record generated for ID tracking. No local database record was found matching this key.',
          category: 'other',
          location: 'Ward No. 14, Civic Division',
          date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // 2 days ago
          status: deterministicStatus,
          isMocked: true
        });
      } else {
        setComplaintDetails(null);
      }
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'submitted': return 0;
      case 'review': return 1;
      case 'assigned': return 2;
      case 'resolved': return 3;
      default: return 0;
    }
  };

  const timelineSteps = [
    { key: 'submitted', title: t('statusSubmitted'), desc: t('statusSubmittedDesc'), icon: ShieldCheck },
    { key: 'review', title: t('statusReview'), desc: t('statusReviewDesc'), icon: Clock },
    {key: 'assigned', title: t('statusAssigned'), desc: t('statusAssignedDesc'), icon: SearchCheck},
    { key: 'resolved', title: t('statusResolved'), desc: t('statusResolvedDesc'), icon: CheckCircle }
  ];

  const currentStepIdx = complaintDetails ? getStatusStepIndex(complaintDetails.status) : -1;

  return (
    <div className="flex-1 bg-ash-light pb-16 pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-navy-800 flex items-center justify-center space-x-2">
          <SearchCheck className="w-8 h-8 text-saffron-500" />
          <span>{t('trackerTitle')}</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-2 max-w-xl mx-auto">
          {t('trackerSubtitle')}
        </p>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchParams({ id: complaintId.trim() });
            handleTrack();
          }}
          className="max-w-xl mx-auto mt-6 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            required
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder={t('trackerPlaceholder')}
            className="flex-1 bg-white text-slate-800 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-navy-500 focus:border-navy-500 shadow-xs font-mono font-bold"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-navy-600 hover:bg-navy-700 text-white font-bold px-6 py-3 rounded-xl shadow-xs transition-all text-sm cursor-pointer hover-btn-effect"
          >
            {t('trackSubmit')}
          </button>
        </form>
      </div>

      {/* Tracker Details Container */}
      {searchTriggered && (
        <div className="animate-slide-up">
          {complaintDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Complaint Info Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs h-fit space-y-4 md:col-span-1 hover-card-effect">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Complaint ID: {complaintDetails.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-2 truncate">{complaintDetails.title}</h3>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{complaintDetails.location}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">
                      Filed on: {new Date(complaintDetails.date || Date.now()).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-semibold">{complaintDetails.description}</p>
                  </div>
                </div>

                {complaintDetails.image && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Attached Image</p>
                    <img
                      src={complaintDetails.image}
                      alt="Complaint proof"
                      className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-xs"
                    />
                  </div>
                )}
              </div>

              {/* Progress Timeline Stepper */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs md:col-span-2 space-y-8 hover-card-effect">
                <h3 className="text-xl font-bold text-slate-800">Resolution Progress Timeline</h3>
                
                <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  {timelineSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCompleted = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.key} className="relative flex items-start space-x-4 animate-slide-up">
                        {/* Timeline Bullet Icon Indicator */}
                        <div
                          className={`absolute -left-8 w-7.5 h-7.5 rounded-full flex items-center justify-center text-white border-2 shadow-xs transition-colors duration-300 ${
                            isCompleted
                              ? 'bg-tricolor-green-500 border-tricolor-green-500'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>

                        {/* Text Block */}
                        <div className="space-y-0.5">
                          <h4
                            className={`font-bold text-sm ${
                              isCompleted
                                ? isCurrent
                                  ? 'text-tricolor-green-600 font-extrabold'
                                  : 'text-navy-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.title}
                            {isCurrent && (
                              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-saffron-500 animate-ping"></span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto shadow-xs space-y-2">
              <p className="text-slate-800 font-bold text-base">{t('invalidId')}</p>
              <p className="text-xs text-slate-400 font-semibold">Try typing a valid complaint ID like "SB-29A4D1" or logging a new complaint.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
