import React, { useEffect, useState } from 'react';
import { IJob } from '../../types';
import { api } from '../../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Shield,
  LogOut,
  Building2,
  Loader2,
  Database,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onAddJob: () => void;
  onEditJob: (jobId: string) => void;
  onViewJob: (jobId: string) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onAddJob,
  onEditJob,
  onViewJob,
  onLogout,
  onViewPublicSite,
}) => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [stats, setStats] = useState<{
    totalJobs: number;
    activeJobs: number;
    closedJobs: number;
    dbStatus: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<IJob | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify active admin session
      const isVerified = await api.verifyAdmin();
      if (!isVerified) {
        onLogout();
        return;
      }

      const [jobsData, statsData] = await Promise.all([
        api.getJobs(),
        api.getAdminStats(),
      ]);
      setJobs(jobsData);
      setStats(statsData);
    } catch (err: any) {
      if (
        err.message?.includes('token') ||
        err.message?.includes('Authentication') ||
        err.message?.includes('expired')
      ) {
        onLogout();
        return;
      }
      setError(err.message || 'Failed to load administrator dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    const id = deleteCandidate._id || deleteCandidate.id;
    if (!id) return;

    try {
      setDeleting(true);
      await api.deleteJob(id);
      setJobs((prev) => prev.filter((j) => (j._id || j.id) !== id));
      setDeleteCandidate(null);
      // Refresh stats
      const newStats = await api.getAdminStats();
      setStats(newStats);
    } catch (err: any) {
      alert(err.message || 'Failed to delete job posting.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Shield className="w-3 h-3" />
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">Authenticated Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Management Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-admin-add-job"
            onClick={onAddJob}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>

          <button
            id="btn-admin-view-public"
            onClick={onViewPublicSite}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Public Site
          </button>

          <button
            id="btn-admin-logout"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Postings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {loading ? '...' : stats?.totalJobs ?? jobs.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Verified active in system</span>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Opportunities</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {loading ? '...' : stats?.activeJobs ?? jobs.filter((j) => j.status === 'active').length}
          </p>
          <span className="text-[11px] text-slate-500">Open for public applications</span>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Database Engine</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-800 mt-2 truncate">
            {loading ? '...' : stats?.dbStatus || 'Connected'}
          </p>
          <span className="text-[11px] text-slate-400">Node.js + Express REST API</span>
        </div>
      </div>

      {/* Main Listings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Manage Job Opportunities</h2>
          <span className="text-xs text-slate-500">{jobs.length} Listings Found</span>
        </div>

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin mb-2" />
            <span className="text-xs font-medium">Loading opportunities...</span>
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-sm text-red-600 bg-red-50 m-6 rounded-2xl">
            {error}
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="py-16 text-center text-slate-500 p-6">
            <p className="text-sm font-semibold text-slate-700">No jobs currently listed.</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Add Job&quot; above to create your first job update.
            </p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Opportunity</th>
                  <th className="px-6 py-3.5">Company & Location</th>
                  <th className="px-6 py-3.5">Batch / Exp</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => {
                  const id = job._id || job.id || '';
                  return (
                    <tr key={id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block leading-tight">
                          {job.title}
                        </span>
                        <span className="text-xs text-emerald-700 font-medium">{job.salary}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {job.company}
                        </div>
                        <span className="text-xs text-slate-500">{job.location}</span>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <span className="block text-slate-700 font-medium">{job.batch}</span>
                        <span className="text-slate-500">{job.experience}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            job.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {job.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            id={`btn-admin-view-${id}`}
                            onClick={() => onViewJob(id)}
                            title="View Public Details"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            id={`btn-admin-edit-${id}`}
                            onClick={() => onEditJob(id)}
                            title="Edit Job"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            id={`btn-admin-delete-${id}`}
                            onClick={() => setDeleteCandidate(job)}
                            title="Delete Job"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">Confirm Removal</h3>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <strong className="text-slate-800">&quot;{deleteCandidate.title}&quot;</strong> at{' '}
              <strong className="text-slate-800">{deleteCandidate.company}</strong>?
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Posting'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
