'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: string;
  city: string;
  currentLeadSource: string;
  biggestLeadProblem: string;
  interestedInPilot: string;
}

const initialFormData: FormData = {
  name: '',
  businessName: '',
  phone: '',
  email: '',
  businessType: '',
  city: '',
  currentLeadSource: '',
  biggestLeadProblem: '',
  interestedInPilot: '',
};

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');

    const payload = {
      ...formData,
      sourcePage: 'VouchCC Website',
    };

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

      if (scriptUrl) {
        // POST to Google Apps Script web app.
        // mode: no-cors avoids CORS preflight issues with the Google redirect chain;
        // the response is opaque but the data is reliably saved by the script.
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload),
        });
      } else {
        // Fallback for local dev when the env var is not yet configured
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message);
      }

      setStatus('success');
      setFormData(initialFormData);
    } catch {
      setStatus('error');
    }
  }

  const inputClass =
    'w-full bg-navy-900/60 border border-white/10 focus:border-accent/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none transition-colors';

  const labelClass = 'block text-slate-300 text-sm font-medium mb-1.5';

  return (
    <section id="lead-form" className="py-24 bg-navy-800/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1 mb-4">
            <span className="text-blue-400 text-sm font-semibold">Apply for Pilot</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Tell us about your business.
          </h2>
          <p className="text-lg text-slate-400">
            We&apos;ll review your details and get back with next steps.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-white font-black text-2xl mb-3">Application received!</h3>
            <p className="text-slate-400 text-lg">
              Thank you. Your pilot request has been received.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-accent hover:text-accent-light text-sm font-medium underline"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-navy-800/60 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass} htmlFor="name">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Priya Sharma"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="businessName">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Bliss Interiors"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone / WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@blissinteriors.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass} htmlFor="businessType">
                  Business Type <span className="text-red-400">*</span>
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select your type
                  </option>
                  {[
                    'Interior Designer',
                    'Architect',
                    'Design Studio',
                    'Consultant',
                    'Construction / Contractor',
                    'Home Services',
                    'Real Estate',
                    'Other Service Business',
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="city">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bangalore"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="currentLeadSource">
                Where do most of your leads come from?
              </label>
              <select
                id="currentLeadSource"
                name="currentLeadSource"
                value={formData.currentLeadSource}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select primary source</option>
                {[
                  'WhatsApp',
                  'Instagram',
                  'Website / Form',
                  'Referral',
                  'Walk-in',
                  'Phone Call',
                  'Other',
                ].map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="biggestLeadProblem">
                What is your biggest lead management problem?
              </label>
              <textarea
                id="biggestLeadProblem"
                name="biggestLeadProblem"
                rows={3}
                value={formData.biggestLeadProblem}
                onChange={handleChange}
                placeholder="e.g. Leads come in on WhatsApp and we forget to follow up. No one knows which leads are hot..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="interestedInPilot">
                Interested in the Vouch pilot?
              </label>
              <div className="flex flex-wrap gap-4">
                {['Yes, definitely', 'Yes, want to know more', 'Not sure yet'].map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="interestedInPilot"
                      value={option}
                      checked={formData.interestedInPilot === option}
                      onChange={handleChange}
                      className="accent-accent w-4 h-4"
                    />
                    <span className="text-slate-400 group-hover:text-slate-300 text-sm transition-colors">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                Something went wrong. Please try again or contact us directly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {status === 'submitting' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting…
                </span>
              ) : (
                'Submit Application'
              )}
            </button>

            <p className="text-slate-600 text-xs text-center">
              No spam. No commitment. We&apos;ll reach out within 24 hours.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
