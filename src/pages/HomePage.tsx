import React, { useEffect, useState } from 'react';
import { IJob } from '../types';
import { api } from '../services/api';
import { JobCard } from '../components/JobCard';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { Sparkles, Loader2, Briefcase } from 'lucide-react';

interface HomePageProps {
  onSelectJob: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getJobs();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section with Soft Light-Green Background */}
      <section className="bg-emerald-50/70 border-b border-emerald-100/80 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white border border-emerald-200/90 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-2xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Career Alerts</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Latest <span className="text-emerald-700">Opportunities</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            JobUpdate provides verified job and opportunity updates for graduates, students, and professionals, with direct links to official company application portals.
          </p>
        </div>
      </section>

      {/* Main Job Feed Section on Clean White Canvas */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>Current Openings</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any listing to view complete eligibility criteria and official application details
            </p>
          </div>

          {!loading && jobs.length > 0 && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80 shrink-0">
              {jobs.length} Active {jobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading latest opportunities...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 bg-red-50/80 border border-red-200 rounded-2xl text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-red-800">{error}</p>
            <button
              onClick={loadJobs}
              className="mt-4 px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.slice(0, 4).map((job) => (
                <JobCard key={job._id || job.id} job={job} onSelect={onSelectJob} />
              ))}
            </div>

            {/* In-feed subtle ad placeholder */}
            <AdPlaceholder format="banner" />

            {jobs.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.slice(4).map((job) => (
                  <JobCard key={job._id || job.id} job={job} onSelect={onSelectJob} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="py-16 text-center bg-slate-50/80 rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-800">No Job Updates Currently Listed</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Check back soon for new hiring notifications or reach out to our team.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

