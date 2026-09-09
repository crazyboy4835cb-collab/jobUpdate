import React, { useState } from 'react';
import { Briefcase, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: string, param?: string) => {
    onNavigate(page, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/90 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="btn-header-logo"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Briefcase className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              Job<span className="text-emerald-600">Update</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              Careers & Opportunities
            </span>
          </div>
        </button>

        {/* Desktop Navigation: Home, About, Contact */}
        <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
          <button
            id="nav-link-home"
            onClick={() => handleNav('home')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentPage === 'home' || currentPage === 'job-details'
                ? 'text-emerald-700 bg-emerald-50 font-semibold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
          >
            Home
          </button>
          <button
            id="nav-link-about"
            onClick={() => handleNav('about')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentPage === 'about'
                ? 'text-emerald-700 bg-emerald-50 font-semibold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
          >
            About
          </button>
          <button
            id="nav-link-contact"
            onClick={() => handleNav('contact')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              currentPage === 'contact'
                ? 'text-emerald-700 bg-emerald-50 font-semibold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Mobile menu toggle button */}
        <div className="md:hidden flex items-center">
          <button
            id="btn-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-4 space-y-1 shadow-md">
          <button
            id="mobile-nav-link-home"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-base font-medium ${
              currentPage === 'home' || currentPage === 'job-details'
                ? 'text-emerald-700 bg-emerald-50 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            id="mobile-nav-link-about"
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-base font-medium ${
              currentPage === 'about'
                ? 'text-emerald-700 bg-emerald-50 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            About
          </button>
          <button
            id="mobile-nav-link-contact"
            onClick={() => handleNav('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-base font-medium ${
              currentPage === 'contact'
                ? 'text-emerald-700 bg-emerald-50 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};

