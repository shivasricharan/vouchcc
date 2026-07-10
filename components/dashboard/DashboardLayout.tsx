'use client';

import { useState } from 'react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashHeader from './DashHeader';
import UploadModal from './UploadModal';
import KPICards from './KPICards';
import FunnelChart from './FunnelChart';
import AIInsights from './AIInsights';
import PriorityFollowups from './PriorityFollowups';
import NextActionsPanel from './NextActionsPanel';
import GuideView from './views/GuideView';
import UploadGuideView from './views/UploadGuideView';
import UploadCSVView from './views/UploadCSVView';

function GithubIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="shrink-0 bg-blue-600/10 border-b border-blue-500/20 flex items-center justify-center gap-2 px-4 py-2 text-xs">
      <span className="text-blue-400 font-medium">
        📣 The Vouch Starter Kit is now open source — build your own version
      </span>
      <a
        href="https://github.com/yourvouch/vouch-starter-kit"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
      >
        <GithubIcon size={11} /> GitHub →
      </a>
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 text-blue-400/60 hover:text-blue-400 transition-colors leading-none"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

function FinalCTA() {
  return (
    <div className="bg-th-surface border border-blue-500/20 rounded-xl p-6 text-center">
      <div className="text-th-heading font-bold text-base mb-1">Ready to analyse your own business?</div>
      <p className="text-th-muted text-sm mb-4 max-w-md mx-auto">
        Upload your own CSV and Vouch will map your columns automatically, score your pipeline, and surface what&apos;s silently costing you revenue.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <a
          href="https://yourvouch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Talk to Us
        </a>
        <a
          href="https://yourvouch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-th-muted hover:text-th-heading text-sm transition-colors"
        >
          Back to Vouch →
        </a>
      </div>
    </div>
  );
}

function MappingCard() {
  const { mappingMeta, mappingConfidence } = useDashboard();
  if (!mappingMeta) return null;

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-th-heading font-semibold text-sm">How Vouch Understood Your Data</span>
        <span className="text-green-500 text-[10px] font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-full">
          {mappingConfidence}% confidence
        </span>
      </div>
      <p className="text-th-muted text-xs mb-4">
        Vouch automatically standardized similar business fields from your upload.
      </p>
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        {[
          { label: 'Columns detected', value: String(mappingMeta.columns) },
          { label: 'Fields mapped', value: String(mappingMeta.mapped) },
          { label: 'Confidence', value: `${mappingMeta.confidence}%` },
        ].map(s => (
          <div key={s.label}>
            <div className="text-th-heading font-bold text-lg">{s.value}</div>
            <div className="text-th-muted text-[10px]">{s.label}</div>
          </div>
        ))}
      </div>
      {mappingMeta.examples.length > 0 && (
        <div className="space-y-1.5 pt-3 border-t border-th-border">
          {mappingMeta.examples.map((ex, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-th-faint font-mono">{ex.from}</span>
              <span className="text-th-faint">→</span>
              <span className="text-th-body">{ex.to}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const { view, showUpload, showGuide } = useDashboard();

  return (
    <div className="flex flex-col h-screen bg-th-page overflow-hidden">
      <AnnouncementBanner />
      <DashHeader />
      <main className="flex-1 overflow-y-auto bg-th-page">
        {view === 'dashboard' && (
          <div className="p-6 max-w-6xl mx-auto space-y-8">
            <KPICards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AIInsights />
                <PriorityFollowups />
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <NextActionsPanel />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-th-border" />
              <span className="text-th-faint text-[10px] font-semibold uppercase tracking-widest">Detailed Breakdown</span>
              <div className="h-px flex-1 bg-th-border" />
            </div>

            <FunnelChart />
            <MappingCard />
            <FinalCTA />
            <div className="text-center py-3 space-y-2">
              <div className="text-th-faint text-[10px] space-y-0.5">
                <div>Your uploaded data stays private during this session.</div>
                <div>For best results, upload sample or non-sensitive business data.</div>
              </div>
              <div className="flex items-center justify-center gap-4 flex-wrap text-[11px]">
                <span className="text-th-faint">Powered by <a href="https://yourvouch.com" target="_blank" rel="noopener noreferrer" className="hover:text-th-muted transition-colors">Vouch</a></span>
                <span className="text-th-faint/30">·</span>
                <a
                  href="https://github.com/yourvouch/vouch-starter-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-th-faint hover:text-th-muted transition-colors"
                >
                  <GithubIcon size={11} /> Open Source on GitHub
                </a>
                <span className="text-th-faint/30">·</span>
                <span className="text-th-faint">Want to customise this?{' '}
                  <a href="https://github.com/yourvouch/vouch-starter-kit" target="_blank" rel="noopener noreferrer" className="text-blue-500/70 hover:text-blue-400 transition-colors">
                    Fork the Starter Kit →
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
        {view === 'upload' && <UploadCSVView />}
        {view === 'guide'  && <GuideView />}
      </main>
      {showUpload && view !== 'upload' && <UploadModal />}
      {showGuide && <UploadGuideView />}
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
