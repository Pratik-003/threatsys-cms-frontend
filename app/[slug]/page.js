"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { API_BASE_URL } from '../../src/utils/api';

export default function DynamicPage() {
  const params = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    // If user tries to go to /home here, redirect or just don't fetch (handled by root page.js)
    if (params.slug === 'home') return; 

    fetch(`${API_BASE_URL}/api/content/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, [params.slug]);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">Loading...</div>;

  // =========================================================
  // LAYOUT 1: BLOG PAGE
  // =========================================================
  if (params.slug === 'blog') {
    return (
      <main className="min-h-screen bg-white text-gray-900 font-sans">
        <Navbar />
        <div className="container mx-auto px-6 pt-16 pb-12 text-center">
          <h1 className="text-5xl font-black text-[#1e1b4b] mb-4">{data.title}</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{data.sections.hero_heading}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {data.sections.posts?.map((post, index) => (
              <div key={index} className="group bg-white rounded-xl shadow-lg hover:-translate-y-2 transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden">
                <div className="h-56 relative">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-all duration-300"></div>
                </div>
                <div className="p-6 text-left">
                  <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">{post.category}</div>
                  <h3 className="font-bold text-lg mb-2 leading-tight text-[#1e1b4b]">{post.title}</h3>
                  <Link href={`/blog/${post.slug}`} className="text-yellow-600 font-bold text-sm hover:underline">Read Article →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // LAYOUT 2: ABOUT US (Mission, Values, Team)
  // =========================================================
  if (params.slug === 'about') {
    return (
      <main className="min-h-screen bg-white text-gray-900 font-sans">
        <Navbar />
        {/* Hero */}
        <div className="bg-[#1e1b4b] text-white py-20 px-6 text-center">
            <h1 className="text-5xl font-bold mb-6">{data.sections.hero_heading}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{data.sections.hero_subtext}</p>
        </div>

        {/* Mission Statement */}
        {data.sections.mission && (
            <div className="container mx-auto px-6 py-16 text-center border-b">
                <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Our Mission</span>
                <h2 className="text-3xl md:text-4xl font-black mt-4 max-w-4xl mx-auto leading-tight text-[#1e1b4b]">
                    "{data.sections.mission}"
                </h2>
            </div>
        )}

        {/* Values Grid */}
        {data.sections.values && (
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-6">
                    <h3 className="text-2xl font-bold mb-10 text-center">Core Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.sections.values.map((val, i) => (
                            <div key={i} className="bg-white p-8 rounded-lg shadow border-l-4 border-yellow-500">
                                <h4 className="text-xl font-bold text-[#1e1b4b] mb-2">{val.title}</h4>
                                <p className="text-gray-600">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Team Section */}
        {data.sections.team && (
            <div className="container mx-auto px-6 py-16">
                <h3 className="text-2xl font-bold mb-10 text-center">Meet The Leadership</h3>
                <div className="flex flex-wrap justify-center gap-10">
                    {data.sections.team.map((member, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-100 group-hover:border-yellow-400 transition-colors">
                                <img src={member.image} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-xl font-bold">{member.name}</h4>
                            <p className="text-blue-600 font-medium text-sm">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </main>
    );
  }

  // =========================================================
  // LAYOUT 3: SERVICES (Process, Categories)
  // =========================================================
  if (params.slug === 'services') {
    return (
      <main className="min-h-screen bg-white text-gray-900 font-sans">
        <Navbar />
        {/* Hero */}
        <div className="bg-[#1e1b4b] text-white py-20 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 opacity-10 rounded-full blur-3xl"></div>
            <div className="container mx-auto relative z-10">
                <h1 className="text-5xl font-bold mb-6">{data.sections.hero_heading}</h1>
                <p className="text-xl text-gray-300 max-w-2xl">{data.sections.hero_subtext}</p>
            </div>
        </div>

        {/* Process Steps (01, 02, 03) */}
        {data.sections.process_steps && (
            <div className="container mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-16">How We Secure You</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {data.sections.process_steps.map((step, i) => (
                        <div key={i} className="relative p-6 border rounded-lg hover:shadow-lg transition bg-white z-10">
                            <div className="text-6xl font-black text-gray-100 absolute -top-4 -right-2 z-0">{step.step}</div>
                            <h3 className="text-xl font-bold text-[#1e1b4b] mb-2 relative z-10">{step.title}</h3>
                            <p className="text-gray-600 text-sm relative z-10">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Categories List */}
        {data.sections.service_categories && (
            <div className="bg-gray-900 text-white py-16">
                 <div className="container mx-auto px-6 text-center">
                    <h3 className="text-2xl font-bold mb-8 text-yellow-500">Our Expertise Includes</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.sections.service_categories.map((cat, i) => (
                            <span key={i} className="px-6 py-3 bg-white/10 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/20 transition cursor-default">
                                ✅ {cat}
                            </span>
                        ))}
                    </div>
                 </div>
            </div>
        )}
      </main>
    );
  }

  // =========================================================
  // LAYOUT 4: CONTACT US (Map, Locations)
  // =========================================================
  if (params.slug === 'contact') {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        {/* Header */}
        <div className="bg-white py-16 px-6 text-center border-b">
            <h1 className="text-4xl font-black text-[#1e1b4b] mb-4">{data.sections.hero_heading}</h1>
            <p className="text-gray-500">{data.sections.hero_subtext}</p>
        </div>

        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Contact Info */}
                <div>
                    <h2 className="text-2xl font-bold mb-8">Visit Our Offices</h2>
                    <div className="space-y-6">
                        {data.sections.locations?.map((loc, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                                <div className="bg-yellow-100 text-yellow-700 w-12 h-12 flex items-center justify-center rounded-full font-bold">📍</div>
                                <div>
                                    <h3 className="font-bold text-lg">{loc.city}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{loc.address}</p>
                                    <p className="text-[#1e1b4b] font-bold">{loc.phone}</p>
                                    <p className="text-blue-600 text-sm">{loc.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Social Links */}
                    {data.sections.social_links && (
                        <div className="mt-10 flex gap-4">
                            {Object.entries(data.sections.social_links).map(([platform, url], i) => (
                                <a key={i} href={url} target="_blank" className="px-4 py-2 bg-[#1e1b4b] text-white rounded text-sm capitalize hover:opacity-80">
                                    {platform}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Static Map Image (Placeholder) */}
                <div className="h-full min-h-[400px] bg-gray-200 rounded-xl overflow-hidden relative shadow-inner">
                     <img 
                       src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop" 
                       className="w-full h-full object-cover opacity-80"
                       alt="Map"
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white px-6 py-3 rounded-full shadow font-bold text-[#1e1b4b]">
                            Global HQ: Odisha, India
                        </span>
                     </div>
                </div>
            </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // FALLBACK GENERIC PAGE
  // =========================================================
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-6">{data.title}</h1>
        <div className="bg-gray-100 p-8 rounded-lg">
            {data.sections.banner_image && <img src={data.sections.banner_image} className="w-full h-64 object-cover rounded mb-6" />}
            <h2 className="text-2xl font-bold mb-4">{data.sections.hero_heading}</h2>
            <p>{data.sections.hero_subtext}</p>
        </div>
      </div>
    </main>
  );
}