'use client';

import { useDashboard } from '@/context/DashboardContext';

export default function SettingsView() {
  const { dataMode, fileName, uploadedAt, loadDemoData, setShowUpload, stats } = useDashboard();

  return (
    <div className="p-5 space-y-5 max-w-2xl">
      <div>
        <h2 className="text-white font-bold text-lg">Settings</h2>
        <p className="text-slate-500 text-sm mt-0.5">Data source and dashboard configuration</p>
      </div>

      {/* Data Source */}
      <div className="bg-[#0d1530] border border-white/6 rounded-xl p-5">
        <div className="text-white font-semibold text-sm mb-4">Data Source</div>

        <div className={`flex items-center gap-3 p-3 rounded-lg border mb-4 ${
          dataMode === 'live'
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${dataMode === 'live' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
          <div>
            <div className={`font-bold text-sm ${dataMode === 'live' ? 'text-green-300' : 'text-amber-300'}`}>
              {dataMode === 'live' ? 'LIVE DATA' : 'DEMO MODE'}
            </div>
            <div className="text-slate-500 text-xs mt-0.5">
              {dataMode === 'live'
                ? `${fileName} · Uploaded ${uploadedAt?.toLocaleString('en-IN')} · ${stats.total} leads`
                : 'DzineHome sample — 100 leads · June 2026'}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowUpload(true)}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Upload New Data
          </button>
          {dataMode === 'live' && (
            <button
              onClick={loadDemoData}
              className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-sm transition-colors"
            >
              Reset to Demo
            </button>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-[#0d1530] border border-white/6 rounded-xl p-5">
        <div className="text-white font-semibold text-sm mb-3">About Vouch Command Center</div>
        <div className="space-y-2 text-slate-400 text-xs leading-relaxed">
          <p>Vouch Command Center is a sales-forensics dashboard for service businesses. Upload your lead data to get instant visibility into your pipeline, stuck leads, team workload, and conversion patterns.</p>
          <p>Your data never leaves your browser — all processing happens locally.</p>
          <p className="text-slate-600">Powered by Vouch · vouchcc.netlify.app</p>
        </div>
      </div>
    </div>
  );
}
