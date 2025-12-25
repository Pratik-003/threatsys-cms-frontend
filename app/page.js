"use client";
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { API_BASE_URL } from '../src/utils/api';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/content/home`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading Experience...</div>;

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* --- SECTION 1: MODERN HERO (With Glow) --- */}
      <section className="relative bg-[#0f172a] text-white py-32 px-6 overflow-hidden">
        {/* Animated Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500 opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto relative z-10 text-center max-w-5xl">
          <div className="inline-block bg-blue-900/30 text-blue-300 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-blue-800">
             🚀 Trusted by 500+ Enterprises Globally
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            {data.sections.hero_heading}
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {data.sections.hero_subtext}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
              Get A Free Audit
            </button>
            <button className="border border-gray-600 hover:border-white hover:text-white text-gray-300 font-semibold py-4 px-10 rounded-full transition-colors">
              View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: CLIENT LOGOS (From DB) --- */}
      {data.sections.clients && (
        <div className="py-10 bg-gray-50 border-b">
           <p className="text-center text-gray-400 font-bold text-sm uppercase tracking-widest mb-6">Trusted By Industry Leaders</p>
           <div className="container mx-auto flex justify-center flex-wrap gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {data.sections.clients.map((logo, i) => (
                  <img key={i} src={logo} className="h-8 md:h-10 object-contain hover:scale-110 transition-transform" alt="Client Logo" />
              ))}
           </div>
        </div>
      )}

      {/* --- SECTION 3: STATS BAR --- */}
      {data.sections.stats && (
        <section className="bg-yellow-500 py-8">
          <div className="container mx-auto flex flex-wrap justify-around text-center text-black">
            {data.sections.stats.map((stat, idx) => (
              <div key={idx} className="w-1/3 md:w-auto p-4">
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-wider opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- SECTION 4: SERVICES GRID (3D Cards) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1b4b] mb-4">360° Cybersecurity Services</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.sections.services_grid?.map((service, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-yellow-500 relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1e1b4b] transition-colors duration-300">
                  <span className="text-2xl group-hover:text-yellow-400">
                    {service.icon === 'globe' && '🌐'} {service.icon === 'smartphone' && '📱'}
                    {service.icon === 'wifi' && '📡'} {service.icon === 'cloud' && '☁️'}
                    {service.icon === 'cpu' && '🖥️'} {service.icon === 'shield' && '🛡️'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1e1b4b]">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{service.desc}</p>
                <div className="flex items-center text-yellow-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                  Explore <span className="ml-2">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: AWARDS (Glassmorphism) --- */}
      {data.sections.awards && (
          <section className="py-24 bg-[#1e1b4b] text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Award-Winning <br/> <span className="text-yellow-400">Excellence.</span>
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            We don't just secure companies; we set the standard. Our team has been recognized globally for identifying zero-day vulnerabilities in critical infrastructure.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.sections.awards.map((award, i) => (
                                <div key={i} className="bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition duration-300">
                                    <h4 className="font-bold text-xl text-yellow-400 mb-2">{award.title}</h4>
                                    <p className="text-sm text-gray-400 leading-snug">{award.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg transform rotate-2 opacity-30 group-hover:rotate-1 transition duration-500"></div>
                        <img 
                            src={data.sections.awards[0].image} 
                            alt="Awards Ceremony" 
                            className="relative rounded-lg shadow-2xl w-full object-cover transform transition hover:scale-[1.01]" 
                        />
                    </div>
                </div>
            </div>
          </section>
      )}

      {/* --- SECTION 6: TESTIMONIALS --- */}
      {data.sections.testimonials && (
          <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-[#1e1b4b] mb-12">What Our Clients Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.sections.testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-left border-t-4 border-yellow-400">
                            <div className="flex items-center gap-4 mb-6">
                                <img src={t.image} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" alt={t.name} />
                                <div>
                                    <div className="font-bold text-gray-900">{t.name}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">{t.role}</div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic leading-relaxed">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
          </section>
      )}

      {/* --- SECTION 7: CALL TO ACTION --- */}
      <section className="py-20 bg-yellow-500 text-black text-center">
          <div className="container mx-auto px-6">
              <h2 className="text-4xl font-black mb-6">Ready to Secure Your Business?</h2>
              <p className="text-lg font-medium mb-8 max-w-2xl mx-auto opacity-80">
                  Don't wait for a breach. Get a comprehensive security audit today.
              </p>
              <button className="bg-[#1e1b4b] text-white font-bold py-4 px-12 rounded-full hover:bg-black transition-transform hover:scale-105 shadow-xl">
                  Contact Us Now
              </button>
          </div>
      </section>

    </main>
  );
}