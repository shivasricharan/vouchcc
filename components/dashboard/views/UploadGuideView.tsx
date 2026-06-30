'use client';

import { useDashboard } from '@/context/DashboardContext';
import { Download, Info, ArrowLeft } from 'lucide-react';

const UPLOAD_TYPES = [
  'CRM export', 'Google Sheet export', 'Excel saved as CSV', 'Lead tracker',
  'Customer enquiry sheet', 'Sales pipeline sheet', 'Quotation tracker',
  'Follow-up register', 'Booking data', 'Service request data',
];

const MIN_FIELDS = ['Name', 'Phone or Email', 'Date', 'Status'];

const BETTER_FIELDS = [
  'Lead Source', 'Stage', 'Assigned To', 'Last Follow-up Date',
  'Next Follow-up Date', 'Deal Value / Quote Value', 'Notes / Remarks',
];

const EXAMPLES: { type: string; csv: string }[] = [
  { type: 'EV / Mobility', csv: 'Vehicle enquiries, bookings, corporate leads' },
  { type: 'SaaS', csv: 'Demo requests, trial users, sales pipeline' },
  { type: 'Agency', csv: 'Proposal tracker, inbound leads, follow-ups' },
  { type: 'Clinic', csv: 'Appointment enquiries, patient requests' },
  { type: 'Real Estate', csv: 'Buyer leads, site visits, property enquiries' },
  { type: 'Interiors', csv: 'Site visits, quotation tracker, project leads' },
  { type: 'Education', csv: 'Student enquiries, counselling follow-ups' },
  { type: 'Events', csv: 'Registrations, sponsors, attendee enquiries' },
  { type: 'Retail', csv: 'Customer enquiries, bulk orders, service requests' },
];

const SAMPLE_FILES = [
  { label: 'Generic Sample CSV', file: '/samples/generic-sample.csv' },
  { label: 'Sales Pipeline Sample CSV', file: '/samples/sales-pipeline-sample.csv' },
  { label: 'Customer Enquiry Sample CSV', file: '/samples/customer-enquiry-sample.csv' },
  { label: 'EV / Mobility Sample CSV', file: '/samples/ev-mobility-sample.csv' },
];

export default function UploadGuideView() {
  const { setView } = useDashboard();

  return (
    <div className="p-6 pb-12 max-w-3xl mx-auto">
      {/* Back + Title */}
      <button
        onClick={() => setView('upload')}
        className="flex items-center gap-1.5 text-th-muted hover:text-th-body text-xs mb-4 transition-colors"
      >
        <ArrowLeft size={12} /> Back to Upload
      </button>

      <h1 className="text-th-heading font-bold text-2xl mb-2">What can I upload?</h1>
      <p className="text-th-body text-sm max-w-xl leading-relaxed mb-8">
        Upload any CSV exported from your business data. Vouch will try to understand your columns and turn them into insights.
      </p>

      {/* Section 1: You can upload */}
      <section className="mb-8">
        <h2 className="text-th-heading font-semibold text-sm mb-3">You can upload</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {UPLOAD_TYPES.map(t => (
            <div key={t} className="bg-th-surface border border-th-border rounded-lg px-3 py-2.5 text-th-body text-xs">
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Minimum columns */}
      <section className="mb-8">
        <h2 className="text-th-heading font-semibold text-sm mb-1">Minimum columns</h2>
        <p className="text-th-muted text-xs mb-3">Vouch can start with just a few basic fields.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {MIN_FIELDS.map(f => (
            <span key={f} className="bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-medium px-3 py-1.5 rounded-lg">
              {f}
            </span>
          ))}
        </div>
        <div className="bg-th-surface border border-th-border rounded-lg px-4 py-3 flex items-start gap-2.5">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <span className="text-th-body text-xs leading-relaxed">
            Even if your column names are different, Vouch will try to map them automatically.
          </span>
        </div>
      </section>

      {/* Section 3: Better insights */}
      <section className="mb-8">
        <h2 className="text-th-heading font-semibold text-sm mb-1">Better insights if your file includes</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {BETTER_FIELDS.map(f => (
            <span key={f} className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium px-3 py-1.5 rounded-lg">
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Section 4: Common business examples */}
      <section className="mb-8">
        <h2 className="text-th-heading font-semibold text-sm mb-3">Common business examples</h2>
        <div className="bg-th-surface border border-th-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-th-border bg-th-hover">
                <th className="px-4 py-2.5 text-left text-th-muted font-semibold uppercase tracking-wide">Business Type</th>
                <th className="px-4 py-2.5 text-left text-th-muted font-semibold uppercase tracking-wide">Example CSV</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((ex, i) => (
                <tr key={ex.type} className={`border-b border-th-border last:border-0 ${i % 2 === 1 ? 'bg-th-hover/50' : ''}`}>
                  <td className="px-4 py-2.5 text-th-heading font-medium whitespace-nowrap">{ex.type}</td>
                  <td className="px-4 py-2.5 text-th-body">{ex.csv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Don't worry about perfect format */}
      <section className="mb-8">
        <h2 className="text-th-heading font-semibold text-sm mb-2">Your file does not need to be perfect.</h2>
        <p className="text-th-body text-xs leading-relaxed mb-3">
          Vouch can work with messy business data. If some fields are missing, it will still show available insights and tell you what could improve the analysis.
        </p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 flex items-start gap-2.5">
          <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <span className="text-th-body text-xs leading-relaxed">
            If lead value is missing, Vouch shows missed opportunity counts instead of revenue values.
          </span>
        </div>
      </section>

      {/* Section 6: Download sample CSVs */}
      <section className="mb-8">
        <h2 className="text-th-heading font-semibold text-sm mb-3">Download sample CSV</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_FILES.map(s => (
            <a
              key={s.file}
              href={s.file}
              download
              className="bg-th-surface border border-th-border rounded-lg px-4 py-3 flex items-center gap-2.5 hover:border-blue-500/30 transition-colors"
            >
              <Download size={14} className="text-blue-500 shrink-0" />
              <span className="text-th-body text-xs font-medium">{s.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Section 8: Auto-mapping reminder */}
      <section className="mb-8">
        <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
          <span className="text-th-body text-xs leading-relaxed">
            Vouch automatically maps common column names like Name, Phone, Source, Status, Stage, Date, Follow-up, Value, and Notes.
          </span>
        </div>
      </section>

      {/* Footer nav */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-th-border">
        <button
          onClick={() => setView('upload')}
          className="flex items-center gap-2 bg-th-hover border border-th-border text-th-body text-sm font-medium px-4 py-2.5 rounded-lg transition-colors hover:text-th-heading"
        >
          <ArrowLeft size={14} /> Back to Upload
        </button>
        <button
          onClick={() => setView('upload')}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          Upload My CSV
        </button>
      </div>
    </div>
  );
}
