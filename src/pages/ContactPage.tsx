import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = () => {
    const errors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message should be at least 10 characters long.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field validation error when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'General Inquiry',
        message: formData.message.trim(),
      });
      setSuccessMessage(res.message || 'Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setValidationErrors({});
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-emerald-50/70 border-b border-emerald-100/80 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-emerald-200/90 text-emerald-800 text-xs font-semibold shadow-2xs mb-4">
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>Support & Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Contact <span className="text-emerald-700">JobUpdate</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or a verified recruitment opportunity notification to report? Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Email Area (Explicit Requirement) */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-7 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                Contact Email
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Official Inquiries</span>
                  <a
                    href="mailto:contact@jobupdate.org"
                    className="text-emerald-700 hover:text-emerald-800 font-medium break-all underline decoration-emerald-300"
                  >
                    contact@jobupdate.org
                  </a>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Support & Feedback</span>
                  <a
                    href="mailto:support@jobupdate.org"
                    className="text-emerald-700 hover:text-emerald-800 font-medium break-all underline decoration-emerald-300"
                  >
                    support@jobupdate.org
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-emerald-900 block mb-1 text-sm">Response Time</span>
              Our moderation team reviews candidate queries and verifies company recruitment requests within 24 to 48 business hours.
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-emerald-100/90 p-6 sm:p-8 shadow-2xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
              <p className="text-xs text-slate-500 mb-6">
                Fill in the details below and we will get back to you.
              </p>

              {successMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Message Sent!</p>
                    <p className="text-xs mt-0.5">{successMessage}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name Field */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      validationErrors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    } focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 transition-colors`}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      validationErrors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    } focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 transition-colors`}
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.email}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message or inquiry here..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      validationErrors.message ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                    } focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-800 transition-colors resize-y`}
                  />
                  {validationErrors.message && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{validationErrors.message}</p>
                  )}
                </div>

                {/* Send Message Button (Green Primary Button) */}
                <div className="pt-2">
                  <button
                    id="btn-send-message"
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

