import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePlatform } from '../context/PlatformContext';
import { TriangleAlert, Upload, CheckCircle2, Copy, Check, MapPin, Eye, FileImage } from 'lucide-react';

export default function ReportIssue() {
  const { t } = useLanguage();
  const { registerComplaint } = usePlatform();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('garbage');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // App UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [copied, setCopied] = useState(false);

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastId, setToastId] = useState('');
  const [toastCopied, setToastCopied] = useState(false);

  const categories = [
    { value: 'garbage', label: t('catGarbage') },
    { value: 'road', label: t('catRoad') },
    { value: 'streetlight', label: t('catStreetlight') },
    { value: 'water', label: t('catWater') },
    { value: 'sewage', label: t('catSewage') },
    { value: 'other', label: t('catOther') }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    setIsSubmitting(true);

    const complaintPayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      image: imagePreview || null, // send base64 data url or null
    };

    try {
      const result = await registerComplaint(complaintPayload);
      if (result && result.id) {
        setSubmittedId(result.id);
        setToastId(result.id);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToastCopy = () => {
    if (toastId) {
      navigator.clipboard.writeText(toastId);
      setToastCopied(true);
      setTimeout(() => setToastCopied(false), 2000);
    }
  };

  const handleCopy = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 bg-ash-light pb-16 pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-navy-800 flex items-center justify-center space-x-2">
          <TriangleAlert className="w-8 h-8 text-rose-500 animate-bounce" />
          <span>{t('reportTitle')}</span>
        </h2>
        <p className="text-slate-500 font-semibold mt-2 max-w-xl mx-auto">
          {t('reportSubtitle')}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="sm:col-span-2">
              <label htmlFor="issue-title" className="block text-sm font-bold text-navy-800 mb-1.5">
                {t('issueTitle')} <span className="text-rose-500">*</span>
              </label>
              <input
                id="issue-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('issueTitlePlaceholder')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-navy-500 focus:bg-white text-slate-800 placeholder-slate-400 font-semibold"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="issue-category" className="block text-sm font-bold text-navy-800 mb-1.5">
                {t('category')} <span className="text-rose-500">*</span>
              </label>
              <select
                id="issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-navy-500 focus:bg-white text-slate-800 font-semibold cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="font-semibold">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="issue-location" className="block text-sm font-bold text-navy-800 mb-1.5">
                {t('location')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="issue-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('locationPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-navy-500 focus:bg-white text-slate-800 placeholder-slate-400 font-semibold"
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="issue-desc" className="block text-sm font-bold text-navy-800 mb-1.5">
                {t('issueDesc')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="issue-desc"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('issueDescPlaceholder')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-navy-500 focus:bg-white text-slate-800 placeholder-slate-400 font-semibold"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-navy-800 mb-1.5">
                {t('uploadImage')}
              </label>
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <label className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer shrink-0 hover-btn-effect">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {imagePreview ? (
                  <div className="flex items-center space-x-3 w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-xs"
                    />
                    <div className="text-xs text-slate-500">
                      <p className="font-bold truncate max-w-xs">{imageFile?.name}</p>
                      <p>{(imageFile?.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                    <FileImage className="w-4 h-4 text-slate-300" />
                    <span>JPG, PNG or WEBP. Max 2MB recommended.</span>
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-navy-600 hover:bg-navy-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-navy-600/10 cursor-pointer flex items-center justify-center space-x-2 hover-btn-effect"
            >
              <span>{isSubmitting ? t('submitting') : t('submitIssue')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup Modal */}
      {submittedId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center border border-slate-100 shadow-2xl animate-slide-up space-y-6">
            <div className="w-16 h-16 bg-tricolor-green-50 rounded-full flex items-center justify-center text-tricolor-green-500 mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-navy-800">{t('successTitle')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                {t('successMsg')}
              </p>
            </div>

            {/* Complaint ID display */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('complaintIdLabel')}</p>
                <p className="text-lg font-mono font-bold text-navy-800">{submittedId}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-600 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-tricolor-green-500" />
                    <span className="text-tricolor-green-600">{t('copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('copyId')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => navigate(`/tracker?id=${submittedId}`)}
                className="bg-navy-600 hover:bg-navy-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                {t('trackBtn')}
              </button>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setTitle('');
                  setDescription('');
                  setLocation('');
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white border border-slate-200 border-l-4 border-tricolor-green-500 rounded-2xl shadow-xl p-4 flex items-center justify-between space-x-4 animate-slide-in-right">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-tricolor-green-50 flex items-center justify-center text-tricolor-green-500 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800">Complaint submitted successfully!</p>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                Complaint ID: <span className="font-mono font-bold text-navy-800">{toastId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToastCopy}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {toastCopied ? (
              <>
                <Check className="w-3 h-3 text-tricolor-green-500" />
                <span className="text-tricolor-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
