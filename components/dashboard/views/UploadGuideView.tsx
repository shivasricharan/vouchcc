'use client';

import { useDashboard } from '@/context/DashboardContext';
import {
  ArrowLeft, Download,
  Upload, CheckCircle2, Wand2, Gauge, Lightbulb, ListChecks,
  Database, Sheet, FileSpreadsheet, Server, Globe, BarChart3, Users, FileText,
} from 'lucide-react';

const CARDS = [
  { icon: Upload, title: 'Choose a CSV', body: 'Upload any structured CSV from your CRM, Excel, ERP, Google Sheets or website enquiries.' },
  { icon: CheckCircle2, title: 'No Perfect Format Needed', body: "Don't worry if your column names are different. Vouch automatically understands common business fields." },
  { icon: Wand2, title: 'AI Mapping', body: 'Vouch maps your columns into a standard business structure.' },
  { icon: Gauge, title: 'Opportunity Score', body: 'Your business receives an Opportunity Score based on the uploaded data.' },
  { icon: Lightbulb, title: 'Vouch Insights', body: 'Discover missed revenue opportunities, follow-up gaps and customer journey signals.' },
  { icon: ListChecks, title: 'Suggested Actions', body: 'Receive practical recommendations on what deserves attention first.' },
];

const WORKS_WITH = [
  { icon: Database, label: 'CRM Exports' },
  { icon: Sheet, label: 'Google Sheets' },
  { icon: FileSpreadsheet, label: 'Excel' },
  { icon: Server, label: 'ERP Exports' },
  { icon: Globe, label: 'Website Enquiries' },
  { icon: BarChart3, label: 'Sales Reports' },
  { icon: Users, label: 'Lead Management Tools' },
  { icon: FileText, label: 'Any Structured CSV' },
];

export default function UploadGuideView() {
  const { setView } = useDashboard();

  return (
    <div className="p-6 pb-12 max-w-4xl mx-auto">
      {/* Back + Title */}
      <button
        onClick={() => setView('upload')}
        className="flex items-center gap-1.5 text-th-muted hover:text-th-body text-xs mb-4 transition-colors"
      >
        <ArrowLeft size={12} /> Back to Upload
      </button>

      <h1 className="text-th-heading font-bold text-2xl mb-2">Before You Upload</h1>
      <p className="text-th-body text-sm max-w-xl leading-relaxed mb-8">
        Here&apos;s what happens when you upload your business data — from raw CSV to clear opportunity insights.
      </p>

      {/* Six cards */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CARDS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-th-surface border border-th-border rounded-xl p-5 hover:border-blue-500/20 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Icon size={16} className="text-blue-500" />
              </div>
              <div className="text-th-heading font-semibold text-sm mb-1">{title}</div>
              <div className="text-th-body text-xs leading-relaxed">{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Works With */}
      <section className="mb-10">
        <h2 className="text-th-heading font-semibold text-sm mb-3">Works With</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {WORKS_WITH.map(({ icon: Icon, label }) => (
            <div key={label} className="bg-th-surface border border-th-border rounded-lg px-3 py-3.5 flex flex-col items-center text-center gap-2 hover:border-blue-500/20 transition-colors">
              <Icon size={16} className="text-blue-500 shrink-0" />
              <span className="text-th-body text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Download sample dataset */}
      <section className="mb-10">
        <h2 className="text-th-heading font-semibold text-sm mb-1">Download Sample CSV</h2>
        <p className="text-th-muted text-xs mb-3">Perfect if you want to explore Vouch before uploading your own business data.</p>
        <a
          href="/samples/generic-sample.csv"
          download
          className="inline-flex items-center gap-2.5 bg-th-surface border border-th-border rounded-lg px-4 py-3 hover:border-blue-500/30 transition-colors"
        >
          <Download size={14} className="text-blue-500 shrink-0" />
          <span className="text-th-body text-xs font-medium">Download Sample Dataset</span>
        </a>
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
