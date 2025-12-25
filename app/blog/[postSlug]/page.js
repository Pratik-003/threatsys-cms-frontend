"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { API_BASE_URL } from '../../../src/utils/api';

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch the single post using the slug from the URL
    fetch(`${API_BASE_URL}/api/blog/post/${params.postSlug}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error(err));
  }, [params.postSlug]);

  if (!post) return <div className="min-h-screen flex justify-center items-center">Loading Article...</div>;

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Category & Date */}
        <div className="flex items-center gap-4 text-sm font-bold text-gray-500 mb-6">
          <span className="text-blue-600 uppercase tracking-widest">{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-[#1e1b4b] mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Featured Image */}
        <div className="w-full h-96 overflow-hidden rounded-xl mb-10 shadow-lg">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* The Content (Rendering HTML safely) */}
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* Back Button */}
        <div className="mt-12 pt-8 border-t">
          <a href="/blog" className="text-blue-600 font-bold hover:underline">← Back to Blog</a>
        </div>
      </article>
    </main>
  );
}