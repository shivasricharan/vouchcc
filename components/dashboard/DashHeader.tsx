'use client';

import { useDashboard } from '@/context/DashboardContext';
import { Upload, Sun, Moon, ExternalLink, ArrowLeft, BookOpen, FileQuestion } from 'lucide-react';

function GithubIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export default function DashHeader() {
  const { view, setView, setShowGuide, dataMode, fileName, uploadedAt, theme, toggleTheme } = useDashboard();

  const uploadTimeStr = uploadedAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const showBackToTemplates = view === 'dashboard' || view === 'guide';

  return (
    <header className="h-14 bg-th-elevated border-b border-th-border flex items-center px-5 gap-3 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
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

      <div className="flex-1" />

      <div className="flex items-center gap-2 shrink-0">
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

        <button
          onClick={() => setView('guide')}
          className="hidden lg:flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          <BookOpen size={13} />
          <span>How Vouch Works</span>
        </button>

        <a
          href="https://github.com/yourvouch/vouch-starter-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          <GithubIcon size={13} />
          <span>Open Source</span>
        </a>

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
