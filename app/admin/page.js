"use client";
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { API_BASE_URL } from '../../src/utils/api';

export default function AdminPanel() {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' or 'certificates'
  const [message, setMessage] = useState('');

  // ==========================================================
  // 1. PAGES & BLOG STATE
  // ==========================================================
  const [pages, setPages] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [pageData, setPageData] = useState(null); 
  
  // Blog Mode
  const [isBlogMode, setIsBlogMode] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]); 
  const [editingPostIndex, setEditingPostIndex] = useState(-1);
  const [postForm, setPostForm] = useState({
    title: '', slug: '', category: 'CYBER SECURITY', date: '', image: '', summary: '', content: ''
  });

  // Standard Page Form
  const [simpleForm, setSimpleForm] = useState({
    title: '', hero_heading: '', hero_subtext: '', banner_image: '', json_sections: ''
  });

  // ==========================================================
  // 2. CERTIFICATES STATE
  // ==========================================================
  const [certificates, setCertificates] = useState([]);
  const [certForm, setCertForm] = useState({
     cert_id: '', company_name: '', address: '', scope: '', issue_date: '', expiry_date: ''
  });

  // ==========================================================
  // AUTH & INITIAL FETCH
  // ==========================================================
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchPages();
      fetchCertificates();
    } else {
      alert("Wrong Password!");
    }
  };

  const fetchPages = () => {
    fetch(`${API_BASE_URL}/api/pages`)
      .then(res => res.json())
      .then(data => {
        setPages(data);
        if (data.length > 0) handlePageSelect(data[0].slug);
      });
  };

  const fetchCertificates = () => {
    fetch(`${API_BASE_URL}/api/admin/certificates`)
      .then(res => res.json())
      .then(data => setCertificates(data));
  };

  // ==========================================================
  // LOGIC: PAGES & BLOG
  // ==========================================================
  const handlePageSelect = (slug) => {
    setSelectedSlug(slug);
    setMessage('');
    
    fetch(`${API_BASE_URL}/api/content/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPageData(data);
        
        if (slug === 'blog') {
          setIsBlogMode(true);
          setBlogPosts(data.sections.posts || []);
          resetPostForm();
        } else {
          setIsBlogMode(false);
          const { hero_heading, hero_subtext, banner_image, ...rest } = data.sections;
          setSimpleForm({
            title: data.title || '',
            hero_heading: hero_heading || '',
            hero_subtext: hero_subtext || '',
            banner_image: banner_image || '',
            json_sections: JSON.stringify(rest, null, 4)
          });
        }
      });
  };

  // Blog Helpers
  const resetPostForm = () => {
    setEditingPostIndex(-1);
    setPostForm({
      title: '', slug: '', category: 'CYBER SECURITY', 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: '', summary: '', content: ''
    });
  };

  const handleEditPost = (index) => {
    setEditingPostIndex(index);
    setPostForm(blogPosts[index]);
  };

  const handleDeletePost = (index) => {
    if(!confirm("Delete this post?")) return;
    const updatedPosts = blogPosts.filter((_, i) => i !== index);
    setBlogPosts(updatedPosts);
    saveBlogPage(updatedPosts);
  };

  const saveBlogPost = () => {
    let updatedPosts = [...blogPosts];
    if (editingPostIndex === -1) updatedPosts.unshift(postForm);
    else updatedPosts[editingPostIndex] = postForm;
    setBlogPosts(updatedPosts);
    saveBlogPage(updatedPosts);
  };

  // Saving Logic
  const saveBlogPage = (postsToSave) => {
    const payload = {
      title: pageData.title,
      sections: { hero_heading: pageData.sections.hero_heading, posts: postsToSave }
    };
    sendUpdate(payload);
  };

  const saveStandardPage = () => {
    try {
      const advancedData = JSON.parse(simpleForm.json_sections);
      const payload = {
        title: simpleForm.title,
        sections: {
          hero_heading: simpleForm.hero_heading,
          hero_subtext: simpleForm.hero_subtext,
          banner_image: simpleForm.banner_image,
          ...advancedData
        }
      };
      sendUpdate(payload);
    } catch(e) {
      alert("Invalid JSON. Check commas and quotes.");
    }
  };

  const sendUpdate = (payload) => {
    fetch(`${API_BASE_URL}/api/admin/update/${selectedSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
      setMessage('✅ Content Saved Successfully!');
      setTimeout(() => setMessage(''), 3000);
      if(isBlogMode) resetPostForm();
    });
  };

  // ==========================================================
  // LOGIC: CERTIFICATES
  // ==========================================================
  const saveCertificate = () => {
    // Determine if CREATE or UPDATE based on if ID exists in list
    const isUpdate = certificates.some(c => c.cert_id === certForm.cert_id);
    const method = isUpdate ? 'PUT' : 'POST';
    const url = isUpdate 
       ? `${API_BASE_URL}/api/admin/certificates?id=${certForm.cert_id}`
       : `${API_BASE_URL}/api/admin/certificates`;

    fetch(url, {
       method: method,
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(certForm)
    }).then(() => {
       setMessage("✅ Certificate Saved!");
       setTimeout(() => setMessage(''), 3000);
       fetchCertificates();
       setCertForm({ cert_id: '', company_name: '', address: '', scope: '', issue_date: '', expiry_date: '' });
    });
  };

  const deleteCertificate = (id) => {
    if(!confirm("Delete this certificate?")) return;
    fetch(`${API_BASE_URL}/api/admin/certificates?id=${id}`, { method: 'DELETE' })
      .then(() => fetchCertificates());
  };

  const editCertificate = (cert) => {
    setCertForm(cert);
  };

  // ==========================================================
  // RENDER
  // ==========================================================
  if (!isAuthenticated) return <LoginScreen setPass={setPassword} doLogin={handleLogin} pass={password} />;

  return (
    <div className="min-h-screen bg-gray-100 pb-20 font-sans">
      <Navbar /> 

      <div className="container mx-auto px-6 py-8">
        
        {/* --- DASHBOARD HEADER & TABS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#1e1b4b]">CMS Dashboard</h1>
          
          <div className="flex bg-white rounded-lg shadow p-1">
             <button 
               onClick={() => setActiveTab('pages')} 
               className={`px-6 py-2 rounded font-bold transition-all ${activeTab==='pages' ? 'bg-[#1e1b4b] text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
             >
               Website Content
             </button>
             <button 
               onClick={() => setActiveTab('certificates')} 
               className={`px-6 py-2 rounded font-bold transition-all ${activeTab==='certificates' ? 'bg-[#1e1b4b] text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
             >
               Certificates
             </button>
          </div>

          <a href={`/${selectedSlug}`} target="_blank" className="text-blue-600 font-bold hover:underline">View Live Site ↗</a>
        </div>

        {message && <div className="bg-green-100 text-green-800 p-3 rounded mb-6 text-center font-bold shadow-sm">{message}</div>}

        {/* =====================================================
            TAB 1: WEBSITE CONTENT (Pages & Blog)
           ===================================================== */}
        {activeTab === 'pages' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR */}
            <div className="bg-white p-4 rounded-lg shadow h-fit">
              <h3 className="font-bold text-gray-400 text-xs uppercase mb-3">Pages</h3>
              {pages.map(page => (
                <button
                  key={page.slug}
                  onClick={() => handlePageSelect(page.slug)}
                  className={`w-full text-left px-3 py-2 rounded font-medium text-sm mb-1 ${
                    selectedSlug === page.slug ? 'bg-[#1e1b4b] text-white' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </div>

            {/* MAIN EDITOR */}
            <div className="lg:col-span-3">
              
              {isBlogMode ? (
                // BLOG EDITOR UI
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-[#1e1b4b]">Manage Blog Posts</h2>
                    <button onClick={resetPostForm} className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600">+ New Post</button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="border-r pr-6 h-[600px] overflow-y-auto">
                      {blogPosts.map((post, idx) => (
                        <div key={idx} onClick={() => handleEditPost(idx)} className={`p-3 border rounded mb-3 cursor-pointer hover:shadow-md transition ${editingPostIndex === idx ? 'border-blue-500 bg-blue-50' : 'bg-gray-50'}`}>
                          <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{post.title}</h4>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>{post.date}</span>
                            <span onClick={(e) => { e.stopPropagation(); handleDeletePost(idx); }} className="text-red-500 font-bold hover:underline">Delete</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        <input type="text" placeholder="Title" className="w-full border p-2 rounded font-bold" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="Slug" className="border p-2 rounded text-sm" value={postForm.slug} onChange={e => setPostForm({...postForm, slug: e.target.value})} />
                          <input type="text" placeholder="Category" className="border p-2 rounded text-sm" value={postForm.category} onChange={e => setPostForm({...postForm, category: e.target.value})} />
                        </div>
                        <input type="text" placeholder="Image URL" className="w-full border p-2 rounded text-sm" value={postForm.image} onChange={e => setPostForm({...postForm, image: e.target.value})} />
                        <textarea placeholder="Summary" className="w-full border p-2 rounded text-sm h-20" value={postForm.summary} onChange={e => setPostForm({...postForm, summary: e.target.value})} />
                        <textarea className="w-full border p-2 rounded text-sm h-64 font-mono bg-gray-50" value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} />
                        <button onClick={saveBlogPost} className="w-full bg-[#1e1b4b] text-white py-3 rounded font-bold hover:bg-blue-900 shadow-lg">
                          {editingPostIndex === -1 ? 'Publish Post' : 'Update Post'}
                        </button>
                    </div>
                  </div>
                </div>
              ) : (
                // STANDARD PAGE EDITOR UI
                <div className="bg-white p-6 rounded-lg shadow space-y-6">
                  <div className="border-b pb-4">
                     <h2 className="text-xl font-bold text-[#1e1b4b]">Edit Page Content</h2>
                     <p className="text-sm text-gray-500">Editing: <span className="font-mono bg-gray-100 px-1 rounded">{selectedSlug}</span></p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold text-gray-700">Page Title</label><input type="text" className="w-full border p-2 rounded" value={simpleForm.title} onChange={e => setSimpleForm({...simpleForm, title: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold text-gray-700">Banner Image URL</label><input type="text" className="w-full border p-2 rounded" value={simpleForm.banner_image} onChange={e => setSimpleForm({...simpleForm, banner_image: e.target.value})} /></div>
                  </div>
                  <div><label className="block text-sm font-bold text-gray-700">Hero Heading</label><input type="text" className="w-full border p-2 rounded font-lg" value={simpleForm.hero_heading} onChange={e => setSimpleForm({...simpleForm, hero_heading: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold text-gray-700">Hero Subtext</label><textarea className="w-full border p-2 rounded h-24" value={simpleForm.hero_subtext} onChange={e => setSimpleForm({...simpleForm, hero_subtext: e.target.value})} /></div>
                  <div className="border-t pt-6 mt-4">
                     <label className="flex justify-between items-center text-sm font-bold text-gray-700 mb-2">
                        <span>Detailed Sections (JSON)</span>
                        {selectedSlug === 'home' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200">💡 Edit Clients, Awards, Testimonials</span>}
                     </label>
                     <textarea className="w-full border p-4 rounded h-96 font-mono bg-[#1e1b4b] text-green-400 text-xs leading-relaxed" value={simpleForm.json_sections} onChange={e => setSimpleForm({...simpleForm, json_sections: e.target.value})} />
                  </div>
                  <button onClick={saveStandardPage} className="w-full bg-[#1e1b4b] text-white py-4 rounded font-bold hover:bg-blue-900 shadow-lg">Save All Changes</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAB 2: CERTIFICATE MANAGER
           ===================================================== */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* LEFT: CERTIFICATE LIST */}
             <div className="bg-white p-4 rounded shadow h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-500 uppercase text-xs">Existing Certificates</h3>
                  <button onClick={() => setCertForm({ cert_id: '', company_name: '', address: '', scope: '', issue_date: '', expiry_date: '' })} className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Clear Form</button>
                </div>
                {certificates.map(c => (
                  <div key={c.cert_id} className="border-b py-3 flex justify-between items-center group">
                    <div onClick={() => editCertificate(c)} className="cursor-pointer">
                      <div className="font-bold text-sm text-[#1e1b4b] group-hover:text-blue-600">{c.company_name}</div>
                      <div className="text-xs text-gray-500">{c.cert_id}</div>
                    </div>
                    <button onClick={() => deleteCertificate(c.cert_id)} className="text-red-400 hover:text-red-600 text-xs font-bold px-2">✕</button>
                  </div>
                ))}
             </div>

             {/* RIGHT: CERTIFICATE FORM */}
             <div className="lg:col-span-2 bg-white p-8 rounded shadow">
                <h2 className="text-xl font-bold mb-6 text-[#1e1b4b] border-b pb-4">
                   {certificates.some(c => c.cert_id === certForm.cert_id && certForm.cert_id !== '') ? 'Edit Certificate' : 'Add New Certificate'}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-400 mb-1">Cert ID (Unique)</label>
                     <input type="text" className="w-full border p-2 rounded" placeholder="e.g. TS-2025-001" value={certForm.cert_id} onChange={e => setCertForm({...certForm, cert_id: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 mb-1">Company Name</label>
                     <input type="text" className="w-full border p-2 rounded" placeholder="Company Name" value={certForm.company_name} onChange={e => setCertForm({...certForm, company_name: e.target.value})} />
                   </div>
                </div>
                
                <div className="mb-4">
                     <label className="block text-xs font-bold text-gray-400 mb-1">Address</label>
                     <input type="text" className="w-full border p-2 rounded" placeholder="Full Address" value={certForm.address} onChange={e => setCertForm({...certForm, address: e.target.value})} />
                </div>
                
                <div className="mb-4">
                     <label className="block text-xs font-bold text-gray-400 mb-1">Scope of Certification</label>
                     <input type="text" className="w-full border p-2 rounded" placeholder="e.g. ISO 27001 Audit" value={certForm.scope} onChange={e => setCertForm({...certForm, scope: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div>
                     <label className="block text-xs font-bold text-gray-400 mb-1">Issue Date</label>
                     <input type="date" className="w-full border p-2 rounded" value={certForm.issue_date} onChange={e => setCertForm({...certForm, issue_date: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 mb-1">Expiry Date</label>
                     <input type="date" className="w-full border p-2 rounded" value={certForm.expiry_date} onChange={e => setCertForm({...certForm, expiry_date: e.target.value})} />
                   </div>
                </div>

                <button onClick={saveCertificate} className="w-full bg-[#1e1b4b] text-white py-3 rounded font-bold hover:bg-blue-900 shadow-lg transition-transform hover:scale-[1.01]">
                   {certificates.some(c => c.cert_id === certForm.cert_id && certForm.cert_id !== '') ? 'Update Certificate' : 'Create Certificate'}
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Simple Login Component
function LoginScreen({ setPass, doLogin, pass }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded shadow-xl w-80">
        <h2 className="text-xl font-bold text-center mb-4 text-[#1e1b4b]">CMS Login</h2>
        <form onSubmit={doLogin}>
          <input type="password" placeholder="admin123" className="w-full border p-2 mb-4 rounded" value={pass} onChange={e => setPass(e.target.value)} />
          <button className="w-full bg-[#1e1b4b] text-white py-2 rounded font-bold hover:bg-blue-900">Login</button>
        </form>
      </div>
    </div>
  );
}