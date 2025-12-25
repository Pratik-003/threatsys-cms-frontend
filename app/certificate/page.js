"use client";
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../../src/utils/api';

export default function CertificateSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  // --- THE DEBOUNCER LOGIC ---
  useEffect(() => {
    // 1. Set a timer to run the search after 500ms
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        performSearch(query);
      } else {
        setResults([]); // Clear results if input is empty
      }
    }, 500); // 500ms delay

    // 2. Cleanup function: If the user types again before 500ms, 
    // this cancels the previous timer and starts a new one.
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Separate function for the API call
  const performSearch = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/search?q=${searchTerm}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Validity Check Helper
  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-black text-center text-[#1e1b4b] mb-4">Certificate Verification</h1>
        <p className="text-center text-gray-500 mb-10">
          Real-time verification of Threatsys issued certificates.
        </p>

        {/* --- SEARCH BAR (Auto-Search) --- */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="flex shadow-lg rounded-full overflow-hidden border border-gray-200 bg-white">
            <span className="pl-6 flex items-center text-gray-400">
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Start typing Company Name, Cert ID, or Address..." 
              className="w-full px-4 py-4 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)} // This triggers the useEffect
            />
            {loading && (
              <div className="pr-6 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1e1b4b]"></div>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            *Search happens automatically as you type
          </p>
        </div>

        {/* --- RESULTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((cert) => (
            <div 
              key={cert.cert_id} 
              onClick={() => setSelectedCert(cert)}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition-all cursor-pointer border-l-4 border-[#1e1b4b] hover:border-yellow-500 group"
            >
              <div className="flex justify-between items-start">
                 <h3 className="font-bold text-lg text-[#1e1b4b] group-hover:text-blue-700">{cert.company_name}</h3>
                 {isExpired(cert.expiry_date) ? (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">EXPIRED</span>
                 ) : (
                    <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded font-bold">VALID</span>
                 )}
              </div>
              <p className="text-sm text-gray-500 mb-2 font-mono mt-1">{cert.cert_id}</p>
              <p className="text-xs bg-gray-100 p-2 rounded truncate text-gray-600">📍 {cert.address}</p>
            </div>
          ))}
          
          {results.length === 0 && query && !loading && (
             <div className="col-span-3 text-center py-10">
                <p className="text-gray-400 text-lg">No certificates found matching "{query}"</p>
                <p className="text-sm text-gray-300">Try searching by ID (e.g., TS-2025...) or City Name</p>
             </div>
          )}
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full relative overflow-hidden transform transition-all scale-100">
            
            {/* Close Button */}
            <button onClick={() => setSelectedCert(null)} className="absolute top-4 right-4 text-white hover:text-yellow-400 font-bold text-xl z-10">✕</button>
            
            {/* Header */}
            <div className="bg-[#1e1b4b] text-white p-6 text-center relative">
              <h2 className="text-2xl font-bold tracking-wide">Certificate Details</h2>
              <p className="opacity-80 text-sm font-mono mt-1">{selectedCert.cert_id}</p>
              {/* Decorative circle */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-white">
                 <span className="text-xl">🛡️</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-10 space-y-5 relative">
              
              {/* STATUS STAMP ANIMATION */}
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] border-4 border-dashed rounded px-6 py-2 text-5xl font-black opacity-15 pointer-events-none select-none ${isExpired(selectedCert.expiry_date) ? "text-red-600 border-red-600" : "text-green-600 border-green-600"}`}>
                 {isExpired(selectedCert.expiry_date) ? "EXPIRED" : "VALID"}
              </div>

              <div className="text-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Issued To</label>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{selectedCert.company_name}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedCert.address}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded border border-blue-100 text-center">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Scope</label>
                <p className="font-bold text-[#1e1b4b] text-sm mt-1">{selectedCert.scope}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="text-center border-r">
                   <label className="text-xs font-bold text-gray-400 uppercase">Issue Date</label>
                   <p className="font-bold text-gray-700">{selectedCert.issue_date}</p>
                </div>
                <div className="text-center">
                   <label className="text-xs font-bold text-gray-400 uppercase">Expiry Date</label>
                   <p className={`font-bold ${isExpired(selectedCert.expiry_date) ? "text-red-500" : "text-green-600"}`}>
                     {selectedCert.expiry_date}
                   </p>
                </div>
              </div>

              {/* Status Bar */}
              <div className={`mt-2 py-3 text-center rounded font-bold text-white text-sm shadow-md ${isExpired(selectedCert.expiry_date) ? "bg-red-500" : "bg-green-600"}`}>
                 {isExpired(selectedCert.expiry_date) 
                   ? "⚠️ Certificate Expired / Not Valid" 
                   : "✅ Certificate is Active & Verified"
                 }
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}