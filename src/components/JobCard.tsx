import React from 'react';
import {
  Building2,
  MapPin,
  GraduationCap,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { IJob } from '../types';

interface JobCardProps {
  job: IJob;
  onSelect: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const jobId = job._id || job.id || '';

  // Format date nicely
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

  return (
    <div
      id={`job-card-${jobId}`}
      onClick={() => onSelect(jobId)}
      className="group bg-white rounded-2xl border border-emerald-100/90 p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(jobId);
        }
      }}
    >
      <div>
        {/* Top Header: Company Logo & Company Name */}
        <div className="flex items-center gap-3.5 mb-3.5">
          {/* Company Logo Badge */}
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-700 font-bold text-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors shadow-2xs">
            {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 truncate">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              {job.company}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mt-0.5">
              {job.title}
            </h3>
          </div>
        </div>

        {/* Useful Basic Information: Location & Batch */}
        <div className="flex flex-wrap items-center gap-2 my-3 text-xs text-slate-600">
          {job.location && (
            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100/80 px-2.5 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700">{job.location}</span>
            </div>
          )}

          {job.batch && (
            <div className="inline-flex items-center gap-1.5 bg-emerald-50/60 border border-emerald-100/80 px-2.5 py-1.5 rounded-lg text-emerald-800">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">{job.batch}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Posted date and clean click cue */}
      <div className="pt-3.5 mt-2 border-t border-slate-100/90 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(job.createdAt)}</span>
        </span>

        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

