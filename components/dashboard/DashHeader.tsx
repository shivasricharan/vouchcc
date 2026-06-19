'use client';

import { useDashboard } from '@/context/DashboardContext';
import { Upload, Sun, Moon } from 'lucide-react';

export default function DashHeader() {
  const { setShowUpload, setView, dataMode, fileName, uploadedAt, theme, toggleTheme } = useDashboard();

  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const uploadTimeStr = uploadedAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="h-14 bg-th-elevated border-b border-th-border flex items-center px-5 gap-4 shrink-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-th-heading font-bold text-sm">Vouch Command Center</h1>
          <span className="hidden sm:inline text-th-muted text-sm">·</span>
          <span className="hidden sm:inline text-th-body text-sm">Know what happens between inquiry and conversion</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="hidden md:inline bg-blue-500/10 text-blue-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            CSV-powered journey intelligence
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-2 bg-th-hover border border-th-border rounded-lg px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-th-body text-xs font-medium">{dateStr}</span>
        </div>

        {dataMode === 'demo' ? (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5">
            <span className="text-amber-500 text-xs font-bold">DEMO</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-green-500 text-xs font-bold">LIVE</span>
            {fileName && (
              <span className="text-green-500/70 text-[10px] hidden sm:inline">
                {fileName.length > 16 ? fileName.slice(0, 16) + '…' : fileName}
                {uploadTimeStr && <> · {uploadTimeStr}</>}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => { setShowUpload(true); setView('upload'); }}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Upload CSV</span>
        </button>

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
