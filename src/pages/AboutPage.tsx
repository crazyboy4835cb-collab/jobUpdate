import React from 'react';
import { Briefcase, Target, ShieldCheck, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-emerald-50/70 border-b border-emerald-100/80 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-emerald-200/90 text-emerald-800 text-xs font-semibold shadow-2xs mb-4">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span>About JobUpdate</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            About <span className="text-emerald-700">JobUpdate</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your dedicated source for verified employment updates, fresher opportunities, and direct recruitment notices.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* 1. What JobUpdate Is & Provides */}
        <section className="bg-white rounded-3xl border border-emerald-100/90 p-8 sm:p-10 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-lg pb-3 border-b border-slate-100">
            <Target className="w-5 h-5 text-emerald-600 shrink-0" />
            <h2>What is JobUpdate?</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            <strong className="text-slate-900 font-semibold">JobUpdate</strong> is an online notification and announcement portal established to make finding career opportunities straightforward and trustworthy. We track and publish timely alerts regarding graduate hiring programs, entry-level engineering roles, campus recruitment drives, internships, and off-campus opportunities.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            Our goal is to present candidates with straightforward, essential job information—such as batch eligibility, location, qualifications, and role scope—without requiring unnecessary account registrations, intrusive barriers, or subscription fees.
          </p>
        </section>

        {/* 2. Official Application Links */}
        <section className="bg-white rounded-3xl border border-emerald-100/90 p-8 sm:p-10 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-lg pb-3 border-b border-slate-100">
            <ExternalLink className="w-5 h-5 text-emerald-600 shrink-0" />
            <h2>Direct & Official Application Links</h2>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
            Every job update featured on JobUpdate directs you exclusively to the verified official career portal, applicant tracking system (ATS), or authentic recruiting page of the hiring organization.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Authentic Portals Only</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  We link directly to Workday, Lever, Greenhouse, Taleo, and verified enterprise career pages.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Zero Application Fees</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  JobUpdate does not charge candidates any fees to read updates or access apply links.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Non-Affiliation Disclaimer (Explicit Requirement) */}
        <section className="bg-amber-50/70 border border-amber-200/90 rounded-3xl p-8 sm:p-10 shadow-2xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-lg pb-3 border-b border-amber-200/60">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <h2>Independent Non-Affiliation Disclaimer</h2>
          </div>
          <div className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-3 pt-3">
            <p>
              <strong className="text-amber-950 font-semibold">Important Disclaimer:</strong> JobUpdate is an independent career news aggregation and information service. JobUpdate is <strong>not affiliated with, associated with, authorized by, sponsored by, or endorsed by</strong> any of the listed companies, hiring organizations, or their subsidiaries.
            </p>
            <p>
              All company names, logos, registered marks, and trademarks mentioned on this website are the property of their respective owners. Their reference on JobUpdate is strictly for informational and identification purposes to assist job seekers in finding genuine employment openings.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

