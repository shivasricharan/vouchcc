'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Sun, Moon, Upload, ExternalLink, ArrowRight, ChevronRight,
  TrendingUp, Users, Zap, Activity, DollarSign, AlertTriangle,
} from 'lucide-react';

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('vouch-theme');
    if (stored === 'light' || stored === 'dark') setTheme(stored);
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('vouch-theme', theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}

function CSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'done'>('idle');

  async function handleFile(f: File) {
    setFile(f);
    setStatus('parsing');
    await new Promise(r => setTimeout(r, 800));
    setStatus('done');
  }

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="text-th-heading font-semibold text-sm mb-1">Upload Your SaaS Data</div>
      <p className="text-th-muted text-xs mb-3">
        Upload trial users, signups, CRM exports, subscription exports, activation data, customer lifecycle data, or product usage exports.
      </p>
      <div
        className="border-2 border-dashed border-th-border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/40 transition-colors"
        onClick={() => document.getElementById('saas-csv')?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        <Upload size={20} className="mx-auto text-th-muted mb-2" />
        <div className="text-th-body text-xs">
          {status === 'idle' && 'Drop a .csv or .xlsx file, or click to browse'}
          {status === 'parsing' && <span className="text-blue-500 animate-pulse">Parsing…</span>}
          {status === 'done' && <span className="text-green-500">Parsed {file?.name}</span>}
        </div>
        <input
          id="saas-csv"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>
      <p className="text-th-faint text-[10px] mt-2 text-center">Your data never leaves your browser</p>
    </div>
  );
}

export default function SaaSPage() {
  const { theme, toggle } = useTheme();

  const kpis = [
    { label: 'Active Trials',        value: '248',    color: 'text-blue-500',   dot: 'bg-blue-400' },
    { label: 'Activation Rate',      value: '34%',    color: 'text-amber-500',  dot: 'bg-amber-400' },
    { label: 'Upgrade Opportunities',value: '42',     color: 'text-green-500',  dot: 'bg-green-400' },
    { label: 'Dormant Accounts',     value: '87',     color: 'text-red-500',    dot: 'bg-red-400' },
    { label: 'MRR Opportunity',      value: '$12.4k', color: 'text-violet-500', dot: 'bg-violet-400' },
    { label: 'Churn Risk Signals',   value: '31',     color: 'text-orange-500', dot: 'bg-orange-400' },
  ];

  const insights = [
    { type: 'critical', body: 'Trial users not activated — 163 trials are stuck at signup with no activation event recorded.' },
    { type: 'warning',  body: 'High-intent users without follow-up — 42 accounts with high engagement scores have received no outreach.' },
    { type: 'critical', body: 'Onboarding drop-offs — 71% of trials never reach your core activation step.' },
    { type: 'warning',  body: 'Dormant accounts — 87 accounts have had no activity in 30+ days and are approaching churn risk.' },
    { type: 'positive', body: 'Upgrade opportunities — 42 free or starter accounts show usage patterns typical of pro-tier users.' },
    { type: 'insight',  body: 'Churn risk signals — 31 accounts show declining engagement over the last 14 days.' },
  ];

  const recs = [
    'Re-engage inactive trials — contact trials that have not activated within 72 hours.',
    'Follow up with high-intent users — reach out to high-engagement accounts with no recent outreach.',
    'Review onboarding drop-offs — identify exactly where users exit the onboarding flow.',
    'Prioritise upgrade-ready accounts — surface accounts exceeding free-tier usage limits.',
    'Contact dormant accounts before churn — proactive outreach to accounts silent for 30+ days.',
    'Improve trial-to-paid conversion — reduce time-to-value and clarify your activation criteria.',
  ];

  const funnel = [
    { stage: 'Signups',   count: 1240 },
    { stage: 'Trials',    count: 840 },
    { stage: 'Activated', count: 286 },
    { stage: 'Paid',      count: 132 },
    { stage: 'Expanded',  count: 44 },
  ];

  const understanding = [
    { icon: TrendingUp,    title: 'Trial to Paid Conversion', body: 'Identify where trials stall and what moves them to paid.' },
    { icon: Zap,           title: 'Activation',               body: 'Track which users reach your core activation event and who does not.' },
    { icon: Activity,      title: 'User Engagement',          body: 'Surface accounts with high or declining engagement scores.' },
    { icon: AlertTriangle, title: 'Churn Signals',            body: 'Detect early warning signs before accounts go dark.' },
    { icon: DollarSign,    title: 'Expansion Opportunities',  body: 'Find accounts ready to upgrade or expand their usage.' },
    { icon: Users,         title: 'Follow-up Priorities',     body: 'Know who needs outreach and what to say.' },
  ];

  const insightStyles: Record<string, string> = {
    critical: 'border-red-500/20 bg-red-500/5',
    warning:  'border-orange-500/20 bg-orange-500/5',
    insight:  'border-blue-500/15 bg-blue-500/5',
    positive: 'border-green-500/15 bg-green-500/5',
  };

  const maxFunnel = funnel[0].count;

  return (
    <div className="min-h-screen bg-th-page">
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-th-elevated border-b border-th-border flex items-center px-5 gap-3">
        <h1 className="text-th-heading font-bold text-sm whitespace-nowrap">Vouch Opportunity Analyzer</h1>
        <span className="hidden sm:inline text-blue-500 text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
          SaaS
        </span>
        <div className="flex-1" />

        <Link href="/" className="hidden sm:flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors">
          Generic Analyzer
        </Link>

        <button
          onClick={() => document.getElementById('saas-csv')?.click()}
          className="flex items-center gap-1.5 bg-th-hover border border-th-border text-th-body hover:text-th-heading text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Upload CSV</span>
        </button>

        <a
          href="https://yourvouch.com/#contact"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Start SaaS Opportunity Audit
        </a>

        <a
          href="https://yourvouch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          Back to Website <ExternalLink size={11} />
        </a>

        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg bg-th-hover border border-th-border flex items-center justify-center text-th-body hover:text-th-heading transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-5 py-8 space-y-10">

        {/* Title */}
        <div className="text-center">
          <h2 className="text-th-heading font-bold text-2xl sm:text-3xl mb-3">Vouch Opportunity Analyzer for SaaS</h2>
          <p className="text-th-body text-sm max-w-xl mx-auto leading-relaxed">
            Discover where trials, activations and conversions lose momentum before revenue is affected.
          </p>
        </div>

        {/* SaaS Opportunity Score */}
        <div className="bg-th-surface border border-blue-500/20 rounded-xl p-6 text-center">
          <div className="text-th-muted text-xs font-semibold uppercase tracking-widest mb-2">SaaS Opportunity Score</div>
          <div className="text-6xl font-black text-blue-500 leading-none mb-2">
            68<span className="text-2xl text-th-muted font-semibold">/100</span>
          </div>
          <p className="text-th-muted text-xs max-w-sm mx-auto">
            Significant activation and retention opportunities exist. Addressing trial drop-offs and dormant accounts could recover meaningful MRR.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map(kpi => (
            <div key={kpi.label} className="bg-th-surface border border-th-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`w-2 h-2 rounded-full ${kpi.dot}`} />
                <span className="text-th-muted text-xs font-medium">{kpi.label}</span>
              </div>
              <div className={`text-2xl font-black ${kpi.color} leading-none`}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Vouch Insights */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-4">Vouch Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className={`border rounded-xl px-4 py-3 ${insightStyles[ins.type]}`}>
                <div className="text-th-body text-sm leading-relaxed">{ins.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Actions */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-4">Suggested Actions</h3>
          <div className="space-y-2.5">
            {recs.map((rec, i) => (
              <div key={i} className="bg-th-surface border border-th-border rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-th-body text-sm leading-relaxed flex-1">{rec}</span>
                <ArrowRight size={14} className="text-th-muted shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Trial Funnel */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-4">Trial Funnel</h3>
          <div className="bg-th-surface border border-th-border rounded-xl p-5 space-y-3">
            {funnel.map((step, i) => {
              const pct = Math.round((step.count / maxFunnel) * 100);
              const prevCount = i > 0 ? funnel[i - 1].count : null;
              const dropPct = prevCount ? Math.round(((prevCount - step.count) / prevCount) * 100) : null;
              const isBiggestDrop = i === 2;
              return (
                <div key={step.stage}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1 pl-2">
                      <ChevronRight size={12} className="text-th-faint" />
                      <span className={`text-xs ${isBiggestDrop ? 'text-red-500 font-semibold' : 'text-th-muted'}`}>
                        {dropPct}% drop{isBiggestDrop && ' — activation gap'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-th-body text-xs w-24 shrink-0">{step.stage}</span>
                    <div className="flex-1 h-3 bg-th-hover rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isBiggestDrop ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-th-heading text-xs font-semibold w-16 text-right">{step.count.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CSV Upload */}
        <CSVUpload />

        {/* What Vouch helps SaaS teams understand */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-2">What Vouch helps SaaS teams understand</h3>
          <p className="text-th-muted text-xs mb-5">
            Upload your SaaS data and Vouch surfaces opportunities hidden in your trial, activation and retention pipeline.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {understanding.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-th-surface border border-th-border rounded-xl p-5 hover:border-blue-500/20 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-blue-500" />
                </div>
                <div className="text-th-heading font-semibold text-sm mb-1">{title}</div>
                <div className="text-th-muted text-xs leading-relaxed">{body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-th-surface border border-blue-500/15 rounded-xl p-6 text-center">
          <div className="text-th-heading font-bold text-sm mb-1">Want to see this with your own SaaS data?</div>
          <p className="text-th-muted text-xs mb-4 max-w-md mx-auto">
            Start a SaaS Opportunity Audit. Share your trial, activation and customer data and Vouch will show where momentum is being lost.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://yourvouch.com/#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Start SaaS Opportunity Audit
            </a>
            <a
              href="https://yourvouch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-th-muted hover:text-th-heading text-xs transition-colors"
            >
              Back to Vouch Website
            </a>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-3 space-y-1">
          <div className="text-th-faint text-[10px] space-y-0.5">
            <div>Your uploaded data stays private during this session.</div>
            <div>For best results, upload sample or non-sensitive business data.</div>
          </div>
          <span className="text-th-faint text-xs">Powered by Vouch</span>
        </div>

      </main>
    </div>
  );
}
