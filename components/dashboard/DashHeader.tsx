'use client';

import { useDashboard } from '@/context/DashboardContext';

export default function DashHeader() {
  const { setShowUpload, dataMode, fileName, uploadedAt } = useDashboard();

  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const uploadTimeStr = uploadedAt?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="h-14 bg-[#0a0f1e] border-b border-white/6 flex items-center px-5 gap-4 shrink-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-sm">Vouch Command Center</h1>
          <span className="hidden sm:inline text-slate-600 text-sm">·</span>
          <span className="hidden sm:inline text-slate-400 text-sm">DzineHome Lead Journey Dashboard</span>
        </div>
        <p className="text-slate-500 text-xs mt-0.5 hidden md:block">
          Know what happens between inquiry and conversion.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-2 bg-white/4 border border-white/8 rounded-lg px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-slate-300 text-xs font-medium">{dateStr}</span>
        </div>

        {dataMode === 'demo' ? (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5">
            <span className="text-amber-400 text-xs font-bold">DEMO</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-green-400 text-xs font-bold">LIVE</span>
            {fileName && (
              <span className="text-green-400/70 text-[10px] hidden sm:inline">
                {fileName.length > 20 ? fileName.slice(0, 20) + '…' : fileName}
                {uploadTimeStr && <> · {uploadTimeStr}</>}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <span className="text-sm leading-none">↑</span>
          <span className="hidden sm:inline">Upload Data</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          RK
        </div>
      </div>
    </header>
  );
}
