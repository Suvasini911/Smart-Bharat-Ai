import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePlatform } from '../context/PlatformContext';
import { Search, Bookmark, BookmarkCheck, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function Services() {
  const { t } = useLanguage();
  const { savedServices, toggleSaveService } = usePlatform();
  const [searchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  // Read search URL param if any (e.g. from Home page search redirect)
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) {
      setSearchVal(q);
    }
  }, [searchParams]);

  // Government services data
  const servicesList = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      desc: '12-digit unique identity number issued by UIDAI, acting as proof of identity and address across India.',
      eligibility: 'All Indian residents (including infants and foreigners residing in India for > 182 days).',
      documents: [
        'Proof of Identity (e.g., Passport, PAN Card, Voter ID)',
        'Proof of Address (e.g., Bank Statement, Electricity Bill, Ration Card)',
        'Proof of Date of Birth (e.g., Birth Certificate, SSLC Book)'
      ],
      steps: [
        'Visit nearest authorized Aadhaar Enrollment Centre.',
        'Fill up the Aadhaar Enrollment Form.',
        'Submit the form along with identity and address proofs.',
        'Provide biometrics (fingerprints, iris scans) and photograph.',
        'Receive the acknowledgement slip with the 14-digit Enrollment ID.',
        'Track and download e-Aadhaar card online from UIDAI portal.'
      ],
      officialLink: 'https://uidai.gov.in/'
    },
    {
      id: 'pan',
      name: 'PAN Card',
      desc: '10-digit alphanumeric identifier issued by the Income Tax Department to track financial transactions.',
      eligibility: 'All Indian citizens, companies, and non-resident individuals liable to tax.',
      documents: [
        'Proof of Identity (Aadhaar, Passport, Voter ID)',
        'Proof of Address (Aadhaar, Driving Licence, Utility Bills)',
        'Date of Birth Proof (Birth Certificate, Matriculation Certificate)'
      ],
      steps: [
        'Open NSDL (Protean) or UTITSL website.',
        'Fill Form 49A (for Indian Citizens).',
        'Submit documents via e-KYC (using Aadhaar and OTP) or physical submission.',
        'Pay the processing fee (approx. ₹107).',
        'Receive PAN number by email (e-PAN) and physical card by speed post.'
      ],
      officialLink: 'https://www.tin-nsdl.com/'
    },
    {
      id: 'passport',
      name: 'Indian Passport',
      desc: 'Official travel document issued by the Ministry of External Affairs certifying nationality and identity.',
      eligibility: 'All Indian citizens by birth or naturalization.',
      documents: [
        'Proof of Address (Water/Electricity bill, Aadhaar, Bank passbook)',
        'Proof of Date of Birth (Birth Certificate, Transfer certificate)',
        'Non-ECR documents (Matriculation Certificate/Degree)'
      ],
      steps: [
        'Register and login to the Passport Seva Online Portal.',
        'Fill out the online application form.',
        'Pay the fee online and book an appointment slot at a Passport Seva Kendra (PSK).',
        'Print application receipt and visit PSK with original documents.',
        'Undergo local police verification.',
        'Receive passport via Speed Post.'
      ],
      officialLink: 'https://www.passportindia.gov.in/'
    },
    {
      id: 'birth_certificate',
      name: 'Birth Certificate',
      desc: 'Official record of birth registration issued by local municipalities, mandatory for age proof and schooling.',
      eligibility: 'Any individual born in India (must be registered within 21 days of birth).',
      documents: [
        'Hospital discharge slip or birth record letter',
        'Aadhaar cards of parents',
        'Marriage certificate of parents (optional)',
        'Affidavit specifying time/place of birth if registering after 21 days'
      ],
      steps: [
        'Register the birth within 21 days at the hospital or municipal office.',
        'Submit the application form at the local RTO/Municipal Corporation or Civil Registry portal.',
        'Provide hospital records and parental identification proofs.',
        'Pay the nominal registry fee.',
        'Receive and download the birth certificate once verified.'
      ],
      officialLink: 'https://crsorgi.gov.in/'
    },
    {
      id: 'driving_licence',
      name: 'Driving Licence',
      desc: 'Official permit issued by the regional RTO permitting individuals to drive motor vehicles on public roads.',
      eligibility: 'Age 16 for gearless motorcycles (below 50cc), age 18 for light motor vehicles (LMV).',
      documents: [
        'Learner\'s Licence (LL) - minimum 30 days old',
        'Address Proof (Voter ID, Aadhaar, Ration Card)',
        'Age Proof (PAN Card, Birth Certificate, School TC)',
        'Form 1 (Self-declaration) and Form 1A (Medical Certificate for >40 age)'
      ],
      steps: [
        'Apply for Learner\'s Licence via Sarathi Parivahan portal.',
        'Pass the online Learner\'s Test at RTO/home.',
        'After 30 days (and before 180 days), apply for Permanent Driving Licence online.',
        'Book driving test slot at local RTO.',
        'Pass the driving test with the RTO inspector.',
        'Receive licence card by post or download via DigiLocker.'
      ],
      officialLink: 'https://sarathi.parivahan.gov.in/'
    },
    {
      id: 'voter_id',
      name: 'Voter ID Card (EPIC)',
      desc: 'Electoral Photo Identity Card issued by the Election Commission of India for voting eligibility.',
      eligibility: 'Indian citizens aged 18 or above on the qualifying date.',
      documents: [
        'Proof of Age (Birth Certificate, PAN Card, Class 10 Certificate)',
        'Proof of Address (Utility bill, Aadhaar, Bank book)',
        'Recent passport size color photograph'
      ],
      steps: [
        'Visit the Voters\' Service Portal (VSP) or download Voter Helpline App.',
        'Fill Form 6 for registration of new voter.',
        'Upload photograph and supporting age/address documents.',
        'Verification will be conducted by the Booth Level Officer (BLO).',
        'Once approved, download e-EPIC online; the physical card is sent by post.'
      ],
      officialLink: 'https://voters.eci.gov.in/'
    },
    {
      id: 'ration_card',
      name: 'Ration Card',
      desc: 'State-issued document allowing purchase of subsidized food grains and fuel under public distribution.',
      eligibility: 'Indian citizen head of household, classified under APL, BPL, or AAY welfare categories.',
      documents: [
        'Aadhaar cards of all family members',
        'Income Certificate of the family',
        'Electricity/Gas bill as address proof',
        'Passport size photograph of Head of Family'
      ],
      steps: [
        'Visit the State Food and Civil Supplies portal or local food office.',
        'Fill the application form specifying family details and income categorization.',
        'Attach Aadhaar numbers of all family members for de-duplication.',
        'Submit the application and get the token receipt.',
        'Inspection by food inspector to verify household details.',
        'Download or collect the printed Ration Card.'
      ],
      officialLink: 'https://nfsa.gov.in/'
    }
  ];

  // Filtering based on search query
  const filteredServices = servicesList.filter(service =>
    service.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchVal.toLowerCase())
  );

  const toggleExpandCard = (id) => {
    setExpandedCard(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 bg-ash-light pb-16 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-extrabold text-navy-800">{t('servicesTitle')}</h2>
        <p className="text-slate-500 font-semibold mt-2">{t('servicesSubtitle')}</p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-white text-slate-800 pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-navy-500 focus:border-navy-500 shadow-xs placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isSaved = savedServices.includes(service.id);
            const isExpanded = expandedCard === service.id;

            return (
              <div
                key={service.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group hover-card-effect"
              >
                {/* Save Bookmark button */}
                <button
                  onClick={() => toggleSaveService(service.id)}
                  className={`absolute right-4 top-4 p-2 rounded-xl border transition-colors cursor-pointer hover-btn-effect ${
                    isSaved
                      ? 'bg-saffron-50 border-saffron-200 text-saffron-600'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                  title={isSaved ? t('unsaveService') : t('saveService')}
                >
                  {isSaved ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                </button>

                <div className="space-y-4">
                  <div className="pr-10">
                    <h3 className="text-xl font-bold text-slate-800">{service.name}</h3>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Expanded Accordion Details */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 space-y-4 text-xs animate-slide-up">
                      <div>
                        <h4 className="font-bold text-navy-800 uppercase tracking-wider mb-1">
                          {t('eligibility')}:
                        </h4>
                        <p className="text-slate-600 leading-relaxed font-semibold">{service.eligibility}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-navy-800 uppercase tracking-wider mb-1">
                          {t('reqDocs')}:
                        </h4>
                        <ul className="list-disc pl-4 text-slate-600 space-y-1 font-semibold">
                          {service.documents.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-navy-800 uppercase tracking-wider mb-1">
                          {t('steps')}:
                        </h4>
                        <ol className="list-decimal pl-4 text-slate-600 space-y-1 font-semibold">
                          {service.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Row - CTA Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <button
                    onClick={() => toggleExpandCard(service.id)}
                    className="text-navy-600 hover:text-navy-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Full Details'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <a
                    href={service.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700 flex items-center space-x-1 group"
                  >
                    <span>{t('officialLink')}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto shadow-xs">
          <p className="text-slate-500 font-semibold">{t('noServicesFound')}</p>
        </div>
      )}
    </div>
  );
}
