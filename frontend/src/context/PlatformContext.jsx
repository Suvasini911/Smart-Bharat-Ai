import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PlatformContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export const PlatformProvider = ({ children }) => {
  const [savedServices, setSavedServices] = useState(() => {
    const saved = localStorage.getItem('sb_saved_services');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('sb_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  const [submittedComplaints, setSubmittedComplaints] = useState(() => {
    const saved = localStorage.getItem('sb_submitted_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sb_saved_services', JSON.stringify(savedServices));
  }, [savedServices]);

  useEffect(() => {
    localStorage.setItem('sb_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('sb_submitted_complaints', JSON.stringify(submittedComplaints));
  }, [submittedComplaints]);

  // Try to sync complaints with backend on mount
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/complaints`);
        if (response.data && Array.isArray(response.data)) {
          // Merge local and backend complaints, prioritizing backend
          const backendMap = new Map(response.data.map(c => [c.id, c]));
          const localComplaints = [...submittedComplaints];
          
          const merged = [];
          // Add backend complaints first
          backendMap.forEach((val) => merged.push(val));
          
          // Add local ones not on backend yet (e.g. backend restarted or offline)
          localComplaints.forEach((c) => {
            if (!backendMap.has(c.id)) {
              merged.push(c);
            }
          });
          
          setSubmittedComplaints(merged);
        }
      } catch (err) {
        console.warn('Backend server not reachable for complaints sync. Using local storage.', err.message);
      }
    };
    syncWithBackend();
  }, []);

  const toggleSaveService = (serviceId) => {
    setSavedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const addRecentSearch = (query) => {
    if (!query || !query.trim()) return;
    const cleanQuery = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== cleanQuery.toLowerCase());
      return [cleanQuery, ...filtered].slice(0, 5); // Keep last 5 searches
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const registerComplaint = async (complaintData) => {

    if (!complaintData.title?.trim()) return;
    if (!complaintData.description?.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/complaints`, complaintData);
      const newComplaint = response.data;
      setSubmittedComplaints(prev => [newComplaint, ...prev]);
      return newComplaint;
    } catch (err) {
      console.warn('Backend unavailable for submitting complaint. Generating mock offline receipt.');
      // Local fallback in case backend is offline
      const mockId = 'SB-' + Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase().substring(0, 6);
      const offlineComplaint = {
        id: mockId,
        ...complaintData,
        status: 'submitted',
        date: new Date().toISOString(),
        isOffline: true
      };
      setSubmittedComplaints(prev => [offlineComplaint, ...prev]);
      return offlineComplaint;
    }
  };

  const getComplaintStatus = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/complaints/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable for tracking complaint. Searching local storage.');
      // Offline local lookup
      const localMatch = submittedComplaints.find(c => c.id === id);
      if (localMatch) {
        return localMatch;
      }
      return null;
    }
  };

  return (
    <PlatformContext.Provider value={{
      savedServices,
      toggleSaveService,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      submittedComplaints,
      registerComplaint,
      getComplaintStatus
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
