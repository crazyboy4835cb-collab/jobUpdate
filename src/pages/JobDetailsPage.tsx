import React, { useEffect, useState } from 'react';
import { IJob } from '../types';
import { api } from '../services/api';
import { AdPlaceholder } from '../components/AdPlaceholder';
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Banknote,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Calendar,
  CheckCircle2,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface JobDetailsPageProps {
  jobId: string;
  onBack: () => void;
}

export const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId, onBack }) => {
  const [job, setJob] = useState<IJob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getJobById(jobId);
      setJob(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  const getFormattedApplyUrl = () => {
    if (!job?.applyUrl) return '#';
    let url = job.applyUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  };

  const formatDate = (dateValue?: string | Date) => {
    if (!dateValue) return 'Recently Posted';
    try {
      const d = new Date(dateValue);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently Posted';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Loading job information...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50/80 border border-red-200 rounded-3xl p-8">
          <p className="text-sm font-semibold text-red-800">{error || 'Job posting not found'}</p>
          <button
            onClick={onBack}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top element: Back to Home */}
      <button
        id="btn-back-to-home"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 px-4 py-2 rounded-xl transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Top Header Section: Company logo, Job title, Company name, Basic job information */}
      <div className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-8 shadow-2xs mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-5 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            {/* Company Logo Badge */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-xs shrink-0">
              {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 mb-1">
                <Building2 className="w-4 h-4" />
                <span>{job.company}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {job.title}
              </h1>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 ${
              job.status === 'active'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {job.status === 'active' ? 'Active Opportunity' : 'Expired'}
          </span>
        </div>

        {/* Basic Job Information */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          {job.location && (
            <div className="bg-emerald-50/40 border border-emerald-100/70 rounded-xl p-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Location
              </span>
              <p className="text-sm font-bold text-slate-800 truncate">{job.location}</p>
            </div>
          )}

          {job.experience && (
            <div className="bg-emerald-50/40 border border-emerald-100/70 rounded-xl p-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Experience
              </span>
              <p className="text-sm font-bold text-slate-800 truncate">{job.experience}</p>
            </div>
          )}

          {job.salary && (
            <div className="bg-emerald-50/40 border border-emerald-100/70 rounded-xl p-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1">
                <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Salary / CTC
              </span>
              <p className="text-sm font-bold text-emerald-700 truncate">{job.salary}</p>
            </div>
          )}

          {job.batch && (
            <div className="bg-emerald-50/40 border border-emerald-100/70 rounded-xl p-3">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Eligible Batch
              </span>
              <p className="text-sm font-bold text-slate-800 truncate">{job.batch}</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Posted on {formatDate(job.createdAt)}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Job Update
          </span>
        </div>
      </div>

      {/* Structured Content Sections in EXACT REQUIRED ORDER */}
      <div className="space-y-6">
        {/* 1. Advertisement placeholder */}
        <AdPlaceholder format="banner" label="Advertisement Placeholder 1" />

        {/* 2. About Company */}
        <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>About Company</span>
          </h2>
          <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {job.companyAbout || `${job.company} is actively seeking qualified talent for this opportunity.`}
          </div>
        </section>

        {/* 3. Advertisement placeholder */}
        <AdPlaceholder format="banner" label="Advertisement Placeholder 2" />

        {/* 4. About the Role */}
        <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>About the Role</span>
          </h2>
          <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {job.roleOverview || 'Detailed role responsibilities and project expectations.'}
          </div>
        </section>

        {/* 5. Eligibility */}
        <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Eligibility</span>
          </h2>
          <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {job.eligibility || 'Academic criteria, eligible degree programs, and required foundational skills.'}
          </div>
        </section>

        {/* 6. Other Information */}
        <section className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <Info className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Other Information</span>
          </h2>
          <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
            {job.additionalInfo || 'Selection procedure, online assessment rounds, work location, and benefits.'}
          </div>
        </section>

        {/* 7. Advertisement placeholder */}
        <AdPlaceholder format="banner" label="Advertisement Placeholder 3" />

        {/* 8. Final Apply section (MUST BE AT THE VERY BOTTOM OF THE PAGE) */}
        <section className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-4 pt-8 pb-10">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Ready to Apply for {job.title}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You will continue to the official <span className="font-semibold text-emerald-800">{job.company}</span> application website. JobUpdate only provides direct links to verified employer career portals and never asks for application fees or sensitive account passwords.
            </p>
          </div>

          <div className="pt-2">
            <a
              id="btn-apply-now"
              href={getFormattedApplyUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-decoration-none"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-5 h-5 stroke-[2.2]" />
            </a>

            <p className="text-xs text-slate-500 mt-3">
              Opens the official company portal in a new browser tab
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

