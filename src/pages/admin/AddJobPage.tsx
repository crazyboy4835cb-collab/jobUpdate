import React, { useState } from 'react';
import { api } from '../../services/api';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  GraduationCap,
  Banknote,
  MapPin,
  Link2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
} from 'lucide-react';

interface AddJobPageProps {
  onBack: () => void;
  onJobAdded: () => void;
}

export const AddJobPage: React.FC<AddJobPageProps> = ({ onBack, onJobAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    experience: 'Freshers Eligible (0 - 1 Years)',
    salary: '₹6.0 - ₹8.5 LPA',
    batch: '2024 / 2025 / 2026 Batch',
    companyAbout: '',
    roleOverview: '',
    eligibility: '',
    additionalInfo: '',
    applyUrl: '',
    status: 'active' as 'active' | 'closed',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.location.trim() ||
      !formData.companyAbout.trim() ||
      !formData.roleOverview.trim() ||
      !formData.eligibility.trim() ||
      !formData.applyUrl.trim()
    ) {
      setError('Please fill in all mandatory job information fields.');
      return;
    }

    try {
      setLoading(true);
      await api.createJob(formData);
      onJobAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to publish job update. Please check admin authorization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Publish New Job Update
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add a verified career notification for candidates with official application links
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Role Details */}
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            Basic Role & Company Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Associate Software Engineer"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Microsoft / Cisco / Tata Elxsi"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Job Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore / Remote / Hybrid"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Employment Type *
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800 bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Internship + PPO">Internship + PPO</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Experience Level *
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 0 - 1 Years / Freshers Welcome"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Salary / CTC *
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹6.5 - ₹9.0 LPA or Best in Market"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Eligible Batch *
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g. 2024 / 2025 / 2026 Batch"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Listing Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800 bg-white"
              >
                <option value="active">Active (Open for applications)</option>
                <option value="closed">Closed (Applications ended)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Detailed Descriptions */}
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Detailed Job Specification
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. Company Information *
            </label>
            <textarea
              name="companyAbout"
              rows={3}
              value={formData.companyAbout}
              onChange={handleChange}
              placeholder="Describe the company, its background, industries served, and workplace values..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. About the Role & Responsibilities *
            </label>
            <textarea
              name="roleOverview"
              rows={4}
              value={formData.roleOverview}
              onChange={handleChange}
              placeholder="Key responsibilities, day-to-day deliverables, technologies used..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              3. Eligibility Criteria *
            </label>
            <textarea
              name="eligibility"
              rows={4}
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="• B.Tech/B.E/BCA/MCA (CS/IT/ECE)&#10;• Minimum 60% or 6.5 CGPA&#10;• Good problem-solving and programming skills"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              4. Other Basic Information *
            </label>
            <textarea
              name="additionalInfo"
              rows={3}
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="• Selection rounds: Online test -> Technical -> HR&#10;• Work mode: Hybrid / Onsite&#10;• Perks and medical coverage"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Official Application URL */}
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-emerald-600" />
            Official Application URL
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Company Career / Registration Link *
            </label>
            <input
              type="url"
              name="applyUrl"
              value={formData.applyUrl}
              onChange={handleChange}
              placeholder="https://careers.company.com/jobs/view/12345"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-sm text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              This link is attached to the &quot;Apply Now&quot; button at the very bottom of the public job details page.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="btn-publish-job"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing Update...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Job Update
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
