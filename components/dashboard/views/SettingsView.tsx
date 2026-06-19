'use client';

import { useDashboard } from '@/context/DashboardContext';
import { TEMPLATES } from '@/lib/leadTypes';
import type { TemplateId } from '@/lib/leadTypes';
import { Database, Sun, Moon, Sparkles } from 'lucide-react';

export default function SettingsView() {
  const { dataMode, fileName, uploadedAt, loadDemoData, setView, stats, templateId, setTemplateId, theme, toggleTheme, mappingConfidence } = useDashboard();

  return (
    <div className="p-5 space-y-5 max-w-2xl">
      <div>
        <h2 className="text-th-heading font-bold text-lg">Settings</h2>
        <p className="text-th-muted text-sm mt-0.5">Data source, templates, and preferences</p>
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={14} className="text-th-muted" />
          <span className="text-th-heading font-semibold text-sm">Data Source</span>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-lg border mb-4 ${
          dataMode === 'live' ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${dataMode === 'live' ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
          <div>
            <div className={`font-bold text-sm ${dataMode === 'live' ? 'text-green-500' : 'text-amber-500'}`}>
              {dataMode === 'live' ? 'LIVE DATA' : 'SAMPLE DATA'}
            </div>
            <div className="text-th-muted text-xs mt-0.5">
              {dataMode === 'live'
                ? `${fileName} · Uploaded ${uploadedAt?.toLocaleString('en-IN')} · ${stats.total} leads · ${mappingConfidence}% confidence`
                : 'Exploring sample data'}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setView('upload')} className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
            Upload New Data
          </button>
          {dataMode === 'live' && (
            <button onClick={loadDemoData} className="px-4 py-2.5 rounded-lg bg-th-hover border border-th-border text-th-body text-sm transition-colors">Reset to Sample</button>
          )}
        </div>
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-th-heading font-semibold text-sm">Journey Template</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TEMPLATES) as TemplateId[]).map(id => (
            <button key={id} onClick={() => setTemplateId(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                templateId === id ? 'bg-blue-600 text-white border-blue-600' : 'bg-th-hover text-th-body border-th-border hover:border-blue-500/30'
              }`}
            >{TEMPLATES[id].name}</button>
          ))}
        </div>
        {templateId !== 'auto' && (
          <div className="mt-3 text-th-muted text-xs">
            Stages: {TEMPLATES[templateId].stages.join(' → ')}
          </div>
        )}
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="text-th-heading font-semibold text-sm mb-4">Appearance</div>
        <button onClick={toggleTheme}
          className="flex items-center gap-3 w-full p-3 rounded-lg bg-th-hover border border-th-border hover:border-blue-500/30 transition-colors">
          {theme === 'dark' ? <Moon size={16} className="text-blue-500" /> : <Sun size={16} className="text-amber-500" />}
          <div className="flex-1 text-left">
            <div className="text-th-heading text-sm font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
            <div className="text-th-muted text-xs">Click to switch to {theme === 'dark' ? 'light' : 'dark'} mode</div>
          </div>
        </button>
      </div>

      <div className="bg-th-surface border border-th-border rounded-xl p-5">
        <div className="text-th-heading font-semibold text-sm mb-3">About Vouch Insights</div>
        <div className="space-y-2 text-th-body text-xs leading-relaxed">
          <p>Vouch Insights helps businesses find revenue leaks, stuck leads, missed follow-ups, and conversion opportunities. Upload any CSV with lead, sales, or customer journey data — Vouch auto-detects columns and builds a clean founder dashboard.</p>
          <p>Works for any service business with inquiries, leads, and conversions.</p>
          <p>Your data never leaves your browser — all processing happens locally.</p>
          <p className="text-th-faint">Powered by Vouch · yourvouch.com</p>
        </div>
      </div>
    </div>
  );
}
