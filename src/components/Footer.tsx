import React from 'react';
import { Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-50 border-t border-emerald-100/90 text-slate-600 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Job<span className="text-emerald-700">Update</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
              JobUpdate is a simple, verified career notification portal providing real-time
              job opportunities, off-campus drive notifications, and direct official application links.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-800 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Direct Company Links
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Zero Middlemen & No Fees
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Administration
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="text-slate-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Admin Login
                </button>
              </li>
              <li className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                Authorized moderators only. Allows creating and updating verified career postings.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobUpdate. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            Independent career notification service. Not affiliated with any listed company.
          </p>
        </div>
      </div>
    </footer>
  );
};

