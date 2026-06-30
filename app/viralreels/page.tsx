'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Upload, ExternalLink, ArrowRight, ChevronRight } from 'lucide-react';

// ── Theme ──────────────────────────────────────────────────

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('vouch-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('vouch-theme', theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);
  return { theme, toggle };
}

// ── CSV upload (compact) ───────────────────────────────────

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
      <div className="text-th-heading font-semibold text-sm mb-1">Upload ViralReels Funnel CSV</div>
      <p className="text-th-muted text-xs mb-3">Upload ViralReels funnel CSV to generate fresh insights.</p>
      <div
        className="border-2 border-dashed border-th-border rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/40 transition-colors"
        onClick={() => document.getElementById('vr-csv')?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        <Upload size={20} className="mx-auto text-th-muted mb-2" />
        <div className="text-th-body text-xs">
          {status === 'idle' && 'Drop a .csv file or click to browse'}
          {status === 'parsing' && <span className="text-blue-500 animate-pulse">Parsing…</span>}
          {status === 'done' && <span className="text-green-500">Parsed {file?.name}</span>}
        </div>
        <input
          id="vr-csv"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────

export default function ViralReelsPage() {
  const { theme, toggle } = useTheme();

  const kpis = [
    { label: 'Visitors',            value: '12,400', color: 'text-blue-500',   dot: 'bg-blue-400' },
    { label: 'Signups',             value: '1,860',  color: 'text-green-500',  dot: 'bg-green-400' },
    { label: 'First Video Created', value: '430',    color: 'text-violet-500', dot: 'bg-violet-400' },
    { label: 'Paid Users',          value: '86',     color: 'text-amber-500',  dot: 'bg-amber-400' },
  ];

  const insights = [
    { type: 'warning',  body: 'Signup conversion needs attention.' },
    { type: 'critical', body: 'Users drop after signup before creating first video.' },
    { type: 'positive', body: 'YouTube and founder referrals show stronger intent.' },
    { type: 'insight',  body: 'First-video activation is the biggest growth lever.' },
  ];

  const recs = [
    'Improve first-video onboarding.',
    'Add ready-made prompt templates.',
    'Follow up with users who sign up but do not create.',
    'Prioritise high-intent channels like YouTube and referrals.',
  ];

  const funnel = [
    { stage: 'Visitors',    count: 12400 },
    { stage: 'Signups',     count: 1860 },
    { stage: 'First Video', count: 430 },
    { stage: 'Trial',       count: 210 },
    { stage: 'Paid',        count: 86 },
  ];

  const channels = [
    { name: 'YouTube',           users: 4200, paid: '3.8%', insight: 'Highest intent — tutorial viewers convert well' },
    { name: 'Founder Referrals', users: 1800, paid: '5.2%', insight: 'Best conversion rate — warm introductions' },
    { name: 'Instagram',         users: 3600, paid: '0.9%', insight: 'High volume, low conversion — mostly browsing' },
  ];

  const insightStyles: Record<string, string> = {
    critical: 'border-red-500/20 bg-red-500/5',
    warning:  'border-orange-500/20 bg-orange-500/5',
    insight:  'border-blue-500/15 bg-blue-500/5',
    positive: 'border-green-500/15 bg-green-500/5',
  };

  const maxFunnel = funnel[0].count;

  return (
    <div className="min-h-screen bg-th-page overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-th-elevated border-b border-th-border flex items-center px-5 gap-3">
        <h1 className="text-th-heading font-bold text-sm whitespace-nowrap">Vouch Insights</h1>
        <div className="flex-1" />

        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          Switch Template
        </Link>

        <button
          onClick={() => document.getElementById('vr-csv')?.click()}
          className="flex items-center gap-1.5 bg-th-hover border border-th-border text-th-body hover:text-th-heading text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Upload CSV</span>
        </button>

        <a
          href="https://yourvouch.com/#audit"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Start 14-Day Audit
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
          <h2 className="text-th-heading font-bold text-2xl mb-2">ViralReels Sample Analysis</h2>
          <p className="text-th-body text-sm max-w-xl mx-auto leading-relaxed">
            A quick sample showing where ViralReels may be losing users between first interest, activation, trial, and paid conversion.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* What We Found */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-4">What We Found</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className={`border rounded-xl px-4 py-3 ${insightStyles[ins.type]}`}>
                <div className="text-th-body text-sm leading-relaxed">{ins.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What To Do Next */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-4">What To Do Next</h3>
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

        {/* Mini Funnel */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-4">Funnel</h3>
          <div className="bg-th-surface border border-th-border rounded-xl p-5 space-y-3">
            {funnel.map((step, i) => {
              const pct = Math.round((step.count / maxFunnel) * 100);
              const prevCount = i > 0 ? funnel[i - 1].count : null;
              const dropPct = prevCount ? Math.round(((prevCount - step.count) / prevCount) * 100) : null;
              const isBiggestLeak = i === 2;
              return (
                <div key={step.stage}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1 pl-2">
                      <ChevronRight size={12} className="text-th-faint" />
                      <span className={`text-xs ${isBiggestLeak ? 'text-red-500 font-semibold' : 'text-th-muted'}`}>
                        {dropPct}% drop{isBiggestLeak && ' — biggest leak'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-th-body text-xs w-24 shrink-0">{step.stage}</span>
                    <div className="flex-1 h-3 bg-th-hover rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isBiggestLeak ? 'bg-red-500' : 'bg-blue-500'}`}
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

        {/* Top Channels */}
        <section>
          <h3 className="text-th-heading font-bold text-lg mb-4">Top Channels</h3>
          <div className="bg-th-surface border border-th-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-th-border bg-th-hover">
                  {['Channel', 'Users', 'Paid Conversion', 'Insight'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-th-muted font-semibold text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {channels.map((ch, i) => (
                  <tr key={ch.name} className={`border-b border-th-border last:border-0 ${i % 2 === 1 ? 'bg-th-hover/50' : ''}`}>
                    <td className="px-4 py-3 text-th-heading font-medium">{ch.name}</td>
                    <td className="px-4 py-3 text-th-body">{ch.users.toLocaleString()}</td>
                    <td className="px-4 py-3 text-th-body font-medium">{ch.paid}</td>
                    <td className="px-4 py-3 text-th-muted text-xs">{ch.insight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CSV Upload */}
        <CSVUpload />

        {/* CTA */}
        <section className="bg-th-surface border border-blue-500/15 rounded-xl p-6 text-center">
          <div className="text-th-heading font-bold text-sm mb-1">Want this for your real data?</div>
          <p className="text-th-muted text-xs mb-4 max-w-md mx-auto">
            Start with a 14-Day Opportunity Audit. Share your data and Vouch will show where opportunities need attention.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://yourvouch.com/#audit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Start 14-Day Audit
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
        <div className="text-center py-3">
          <span className="text-th-faint text-xs">Powered by Vouch</span>
        </div>
      </main>
    </div>
  );
}
