"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const NavItem = ({ href, label, hasDropdown = false }) => (
    <Link href={href} className="relative group flex items-center gap-1 py-2">
      <span 
        className={`transition-colors duration-300 ${
          isActive(href) ? "text-[#1e1b4b] font-bold" : "text-gray-600 hover:text-[#1e1b4b]"
        }`}
      >
        {label}
      </span>
      {hasDropdown && (
        <svg className={`w-3 h-3 transition-transform duration-300 ${isActive(href) ? "text-[#1e1b4b]" : "text-gray-400 group-hover:text-[#1e1b4b]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      )}
      <span 
        className={`absolute -bottom-1 left-0 h-[3px] bg-yellow-400 rounded-full transition-all duration-300 ease-in-out
        ${isActive(href) ? "w-full" : "w-0 group-hover:w-full"}`}
      ></span>
    </Link>
  );

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* --- 1. LOGO (UPDATED SIZE) --- */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src="/logo.png" 
            alt="Threatsys Logo" 
            // CHANGED from h-10 to h-16 for bigger size
            className="h-16 w-auto object-contain" 
          />
        </Link>

        {/* --- 2. NAVIGATION LINKS --- */}
        <nav className="hidden md:flex items-center space-x-8 font-medium text-[15px]">
          <NavItem href="/" label="Home" />
          <NavItem href="/about" label="Company" hasDropdown={true} />
          <NavItem href="/services" label="Services" hasDropdown={true} />
          <NavItem href="/certificate" label="Certificate" />
          <NavItem href="/blog" label="Blog" />
          <NavItem href="/contact" label="Contact Us" />
        </nav>

        {/* --- 3. RIGHT SIDE --- */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:block text-right">
             <div className="text-xs text-gray-400 font-semibold">Have any questions?</div>
             <div className="text-[#1e1b4b] font-bold group cursor-pointer">
               Call: <span className="border-b border-gray-300 group-hover:border-yellow-500 transition-colors">09668200222</span>
             </div>
          </div>
          <button className="text-[#1e1b4b] hover:text-yellow-500 transition-colors transform hover:scale-110 duration-200">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>

      </div>
    </header>
  );
}