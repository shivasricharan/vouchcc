'use client';

import { useDashboard } from '@/context/DashboardContext';
import type { PeriodId } from '@/context/DashboardContext';
import { Upload, Sun, Moon, ExternalLink, ArrowLeft, FileQuestion, RefreshCw } from 'lucide-react';

const PERIOD_OPTIONS: { id: PeriodId; label: string }[] = [
  { id: 'all', label: 'All data' },
  { id: 'month', label: 'This month' },
  { id: 'prev_month', label: 'Last month' },
  { id: 'quarter', label: 'Quarter' },
];

export default function DashHeader() {
  const {
    view, setView, setShowGuide, dataMode, fileName, uploadedAt,
    theme, toggleTheme, lastAnalyzed, refreshAnalysis,
    period, setPeriod,
  } = useDashboard();

  const uploadTimeStr = uploadedAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const analyzedStr = lastAnalyzed?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const showBackToTemplates = view === 'dashboard' || view === 'guide';
  const showPeriod = view === 'dashboard';

  return (
    <header className="h-14 bg-th-elevated border-b border-th-border flex items-center px-5 gap-3 shrink-0 overflow-x-auto">
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <h1 className="text-th-heading font-bold text-sm whitespace-nowrap">Vouch Opportunity Analyzer</h1>
        {dataMode === 'demo' ? (
          <span className="hidden sm:inline text-amber-500 text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
            SAMPLE DATA
          </span>
        ) : (
          <span className="hidden sm:inline text-green-500 text-[10px] font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
            LIVE{fileName && <> · {fileName.length > 14 ? fileName.slice(0, 14) + '…' : fileName}</>}
            {uploadTimeStr && <span className="text-green-500/70"> · {uploadTimeStr}</span>}
          </span>
        )}
      </div>

      {/* Period selector — shown only on dashboard */}
      {showPeriod && (
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setPeriod(opt.id)}
              className={`text-[10px] font-medium px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                period === opt.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'text-th-faint hover:text-th-muted hover:bg-th-hover'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2 shrink-0">
        {/* Last analyzed + refresh */}
        {showPeriod && analyzedStr && (
          <button
            onClick={refreshAnalysis}
            className="hidden md:flex items-center gap-1.5 text-th-faint hover:text-th-muted text-[10px] transition-colors"
            title="Refresh analysis"
          >
            <RefreshCw size={10} />
            <span>Updated {analyzedStr}</span>
          </button>
        )}

        {showBackToTemplates && (
          <button
            onClick={() => setView('upload')}
            className="flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors"
          >
            <ArrowLeft size={12} />
            <span className="hidden md:inline">Back to Start</span>
          </button>
        )}

        <button
          onClick={() => setView('upload')}
          className="flex items-center gap-1.5 bg-th-hover border border-th-border text-th-body hover:text-th-heading text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Upload CSV</span>
        </button>

        <button
          onClick={() => setShowGuide(true)}
          className="hidden lg:flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          <FileQuestion size={13} />
          <span>How it Works</span>
        </button>

        <a
          href="https://yourvouch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          Back to Website <ExternalLink size={11} />
        </a>

        <a
          href="https://yourvouch.com/#audit"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          Start Opportunity Audit
        </a>

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg bg-th-hover border border-th-border flex items-center justify-center text-th-body hover:text-th-heading transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
