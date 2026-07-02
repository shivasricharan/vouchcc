'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { X, Upload, Wand2, Gauge, Lightbulb, ListChecks, BarChart3 } from 'lucide-react';

const CARDS = [
  { icon: Upload, title: 'Upload your data', body: 'Upload a CSV, Excel export or Google Sheet.' },
  { icon: Wand2, title: 'AI understands your data', body: 'Vouch automatically understands common business fields.' },
  { icon: Gauge, title: 'Opportunity Score', body: 'See how healthy your opportunities are.' },
  { icon: Lightbulb, title: 'Vouch Insights', body: 'Understand where opportunities deserve attention.' },
  { icon: ListChecks, title: 'Suggested Actions', body: 'Receive practical recommendations.' },
  { icon: BarChart3, title: 'Opportunity Audit', body: 'If you need deeper analysis, start a 14-day Opportunity Audit.' },
];

export default function UploadGuideView() {
  const { setShowGuide, loadSampleData } = useDashboard();
  const [sampleModule, setSampleModule] = useState<typeof import('@/data/sampleData') | null>(null);

  useEffect(() => {
    import('@/data/sampleData').then(mod => setSampleModule(mod)).catch(() => {});
  }, []);

  function loadSample() {
    if (!sampleModule) return;
    const leads = sampleModule.getSampleLeads('generic');
    if (leads.length > 0) {
      loadSampleData(leads, 'Sample Dataset', 'service');
      setShowGuide(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => setShowGuide(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-th-elevated border-l border-th-border z-50 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-th-border shrink-0">
          <h2 className="text-th-heading font-bold text-base">How it Works</h2>
          <button
            onClick={() => setShowGuide(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-th-muted hover:text-th-heading hover:bg-th-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-th-body text-sm leading-relaxed">
            Upload your business data and Vouch will analyze it to surface missed opportunities — in under a minute.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CARDS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-th-surface border border-th-border rounded-xl p-4 hover:border-blue-500/20 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                  <Icon size={14} className="text-blue-500" />
                </div>
                <div className="text-th-heading font-semibold text-sm mb-1">{title}</div>
                <div className="text-th-body text-xs leading-relaxed">{body}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-th-border pt-5">
            <div className="text-th-heading font-semibold text-sm mb-1">Try Sample Dataset</div>
            <p className="text-th-muted text-xs mb-3">
              Explore the Opportunity Analyzer using a sample business dataset before uploading your own data.
            </p>
            <button
              onClick={loadSample}
              disabled={!sampleModule}
              className="inline-flex items-center gap-2 bg-th-hover border border-th-border rounded-lg px-4 py-2.5 hover:border-blue-500/30 transition-colors text-th-body text-xs font-medium disabled:opacity-50"
            >
              Try Sample Dataset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
