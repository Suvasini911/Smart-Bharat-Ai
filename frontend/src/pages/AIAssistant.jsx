import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { Bot, Send, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function AIAssistant() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    { id: 'welcome', sender: 'ai', text: t('welcomeChat'), time: new Date() }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQueries = [
    "How to apply for Aadhaar?",
    "How to get a birth certificate?",
    "Passport application process",
    "PM Kisan Scheme",
    "Ayushman Bharat eligibility",
    "Driving Licence documents"
  ];

  // Helper offline chatbot database for instant feedback when backend/Gemini is offline
  const offlineBotDb = {
    "how to apply for aadhaar?": `To apply for an Aadhaar Card, follow these steps:
1. **Locate Enrollment Centre**: Find an authorized Aadhaar Enrollment Centre near you.
2. **Book an Appointment**: You can book an appointment online at the UIDAI website or walk-in.
3. **Fill the Form**: Fill the Aadhaar Enrollment Form.
4. **Submit Documents**: Provide Proof of Identity (POI) (like Passport, PAN, Voter ID) and Proof of Address (POA) (like Electricity Bill, Bank Statement).
5. **Biometrics**: Submit your biometrics (iris scan, fingerprints) and photo.
6. **Acknowledgement Slip**: Collect the acknowledgement slip containing the 14-digit Enrollment ID.
Your Aadhaar card will be delivered to your address in 60-90 days, or you can download the e-Aadhaar online.`,
    
    "how to get a birth certificate?": `To obtain a birth certificate in India:
1. **Registration**: Ensure the birth is registered within 21 days with the local authorities (Municipality/Panchayat).
2. **Visit Office**: Visit the Registrar of Births and Deaths in your municipality/panchayat.
3. **Form Submissions**: Fill in the Birth Certificate Application Form.
4. **Required Documents**: Submit hospital birth record receipt, Aadhaar cards of both parents, and an affidavit if registered after 21 days.
5. **Fee payment**: Pay the minimal application fee.
6. **Processing**: Once verified, the certificate is issued within 7-15 working days. You can also download it from your state's Civil Registration Portal.`,
    
    "passport application process": `To apply for an Indian Passport:
1. **Register online**: Visit the official Passport Seva portal (passportindia.gov.in) and register.
2. **Apply Online**: Fill out the online application form.
3. **Pay & Book Slot**: Pay the processing fee online and book an appointment slot at the nearest PSK (Passport Seva Kendra) or Post Office PSK.
4. **Visit PSK**: Go to the PSK at your scheduled date/time. Take original documents and self-attested photocopies.
5. **Documents Needed**: Proof of Date of Birth (Birth Certificate, Matriculation Certificate) and Proof of Address (Aadhaar, Utility Bill, Bank statement).
6. **Police Verification**: Local police will conduct a background check at your residence.
7. **Delivery**: Upon successful verification, the passport will be dispatched via Speed Post.`,

    "pm kisan scheme": `The **Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)** is a central sector scheme that provides financial assistance to farmer families across India:
* **Benefit**: Under the scheme, an income support of ₹6,000 per year is provided in three equal installments of ₹2,000 directly into the bank accounts of land-holding farmers.
* **Eligibility**: All land-holding farmer families having cultivable landholding in their names are eligible.
* **Exclusions**: Institutional landowners, income tax payers, retired pensioners receiving >₹10,000/month, and professionals (Doctors, Engineers, CA) are excluded.
* **How to register**: Apply on the PM-Kisan portal (pmkisan.gov.in) under "Farmers Corner" or through Common Service Centres (CSC).`,

    "ayushman bharat": `**Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)** is the world's largest health assurance scheme:
* **Coverage**: It provides a health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization.
* **Eligibility**: Based on Socio-Economic Caste Census (SECC 2011) database. Covers poor, rural families and identified occupational categories of urban workers.
* **Process**: Check your eligibility online (pmjay.gov.in) using your mobile number or ration card number. If eligible, visit an empaneled hospital or CSC to generate your Ayushman Golden Card.
* **Benefits**: Cashless treatment at all government and empaneled private hospitals.`,

    "ayushman bharat eligibility": `**Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)** is the world's largest health assurance scheme:
* **Coverage**: It provides a health cover of ₹5 Lakh per family per year for secondary and tertiary care hospitalization.
* **Eligibility**: Based on Socio-Economic Caste Census (SECC 2011) database. Covers poor, rural families and identified occupational categories of urban workers.
* **Process**: Check your eligibility online (pmjay.gov.in) using your mobile number or ration card number. If eligible, visit an empaneled hospital or CSC to generate your Ayushman Golden Card.
* **Benefits**: Cashless treatment at all government and empaneled private hospitals.`,

    "driving licence": `To get a Driving Licence (DL) in India:
1. **Learner's Licence (LL)**: Apply online via Sarathi Parivahan portal. Upload documents, pay fee, and take the online traffic rules test.
2. **Documents Required**: Age proof (PAN, Birth Cert), Address proof (Aadhaar, Voter ID), Form 1 (Self-declaration physical fitness).
3. **DL Application**: After 30 days of holding the LL (and within 180 days), apply online for the permanent Driving Licence.
4. **Driving Test**: Book a slot and appear for the practical driving test at the RTO.
5. **Issue**: Once you pass the test, your driving licence is sent to your address or can be downloaded digitally via DigiLocker.`,

    "driving licence documents": `To get a Driving Licence (DL) in India:
1. **Learner's Licence (LL)**: Apply online via Sarathi Parivahan portal. Upload documents, pay fee, and take the online traffic rules test.
2. **Documents Required**: Age proof (PAN, Birth Cert), Address proof (Aadhaar, Voter ID), Form 1 (Self-declaration physical fitness).
3. **DL Application**: After 30 days of holding the LL (and within 180 days), apply online for the permanent Driving Licence.
4. **Driving Test**: Book a slot and appear for the practical driving test at the RTO.
5. **Issue**: Once you pass the test, your driving licence is sent to your address or can be downloaded digitally via DigiLocker.`
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const userMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setIsTyping(true);

    try {
      // Trigger API Call
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: queryText,
        language: language
      });
      
      const reply = response.data.reply;
      setMessages(prev => [...prev, {
        id: 'reply-' + Date.now(),
        sender: 'ai',
        text: reply,
        time: new Date()
      }]);
    } catch (err) {
      console.warn('Gemini chat backend error. Relying on offline civic database fallback.', err.message);
      
      // Implement offline fallback
      setTimeout(() => {
        const cleanQuery = queryText.toLowerCase().replace(/[^a-z0-9? ]/g, '').trim();
        let fallbackReply = `I am currently in offline simulation mode, but I can help you with default services. \n\nTo see this powered by real-time LLM feedback, configure your Gemini API Key in the backend .env file. \n\nHere is what I found on the topic:\n\n`;

        // Check if there is a match in the offline database
        let foundMatch = false;
        for (const [key, val] of Object.entries(offlineBotDb)) {
          if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
            fallbackReply += val;
            foundMatch = true;
            break;
          }
        }

        if (!foundMatch) {
          fallbackReply += `For information regarding "${queryText}", you can check the **Services** tab in the main navigation, which details Aadhaar Card, PAN Card, Birth Certificates, Passports, and Voter IDs. If you need immediate assistance, please verify that the Express backend is running and the Gemini API is configured!`;
        }

        setMessages(prev => [...prev, {
          id: 'reply-' + Date.now(),
          sender: 'ai',
          text: fallbackReply,
          time: new Date()
        }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 bg-ash-light flex flex-col h-[calc(100vh-64px-1.5px)] max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 overflow-hidden">
      {/* Page Header */}
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-extrabold text-navy-800 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-saffron-500 animate-pulse" />
          <span>{t('assistantTitle')}</span>
        </h2>
        <p className="text-sm text-slate-500 font-semibold">{t('assistantSubtitle')}</p>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 chat-scrollbar bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[70%]`}>
                {msg.sender === 'ai' && (
                  <div className="w-10 h-10 rounded-full border-2 border-navy-100 bg-navy-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-saffron-500" />
                  </div>
                )}
                
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} min-w-0`}>
                  <div
                    className={`rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-navy-600 to-navy-700 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-navy-800 mt-3 mb-1.5" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold text-navy-800 mt-2.5 mb-1" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-navy-800 mt-2 mb-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed whitespace-pre-wrap font-medium text-slate-700" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2.5 space-y-1 font-medium text-slate-700" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2.5 space-y-1 font-medium text-slate-700" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                          a: ({ node, ...props }) => <a className="text-navy-600 hover:text-navy-700 underline font-bold break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-extrabold text-navy-900 bg-navy-50/50 px-1 rounded-xs" {...props} />,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1.5 px-2">
                    {new Date(msg.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full border-2 border-saffron-100 bg-saffron-500 flex items-center justify-center text-navy-950 font-bold shrink-0 shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start items-start space-x-3 animate-slide-up">
              <div className="w-10 h-10 rounded-full border-2 border-navy-100 bg-navy-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-saffron-500" />
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none px-5 py-3.5 flex items-center space-x-3 shadow-xs">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-slate-400 font-bold">{t('typingIndicator')}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="border-t border-slate-100 p-3 shrink-0 bg-white">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t('suggestedQuestions')}
          </p>
          <div className="flex flex-wrap gap-2 overflow-x-auto max-h-24 py-1">
            {suggestedQueries.map((query) => (
              <button
                key={query}
                aria-label={query}
                onClick={() => handleSend(query)}
                className="text-xs font-semibold text-navy-600 bg-navy-50 hover:bg-navy-100 border border-navy-100 hover:border-navy-200 px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="border-t border-slate-200 p-4 flex items-center space-x-3 bg-white shrink-0"
        >
          <input
          aria-label="Ask AI Assistant"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
            placeholder={t('assistantInputPlaceholder')}
            className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-navy-500 focus:bg-white text-slate-800 placeholder-slate-400 font-medium"
          />
          <button
          aria-label="Send Message"
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="bg-navy-600 hover:bg-navy-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Send className={`w-5 h-5 ${(!inputVal.trim() || isTyping) ? 'text-slate-300' : 'text-saffron-500'}`} />
          </button>
        </form>
      </div>
    </div>
  );
}
