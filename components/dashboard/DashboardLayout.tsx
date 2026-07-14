'use client';

import { useState } from 'react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashHeader from './DashHeader';
import UploadModal from './UploadModal';
import RoleSwitcher from './RoleSwitcher';
import ExecutiveSummary from './ExecutiveSummary';
import PriorityHero from './PriorityHero';
import DecisionFeed from './DecisionFeed';
import DecisionImpactMap from './DecisionImpactMap';
import PipelineFlow from './PipelineFlow';
import OpportunityBubbleMap from './OpportunityBubbleMap';
import StageDistribution from './StageDistribution';
import PriorityMatrix from './PriorityMatrix';
import ActionCentre from './ActionCentre';
import OutcomeComparison from './OutcomeComparison';
import GuideView from './views/GuideView';
import UploadGuideView from './views/UploadGuideView';
import UploadCSVView from './views/UploadCSVView';

function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="shrink-0 bg-blue-600/10 border-b border-blue-500/20 flex items-center justify-center gap-2 px-4 py-2 text-xs">
      <span className="text-blue-400 font-medium">
        See what Vouch finds in your business data →
      </span>
      <a
        href="https://demo.yourvouch.com"
        className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
      >
        Try Demo
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
          <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
            <RoleSwitcher />
            <ExecutiveSummary />

            {/* Decision Impact Map — causal flow (Phase 4) */}
            <DecisionImpactMap />

            {/* Top priority + signals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PriorityHero />
              </div>
              <div className="lg:col-span-1">
                <DecisionFeed />
              </div>
            </div>

            {/* Pipeline visualization */}
            <div className="bg-th-surface border border-th-border rounded-xl p-5">
              <PipelineFlow />
            </div>

            {/* Opportunity Bubble Map + Stage Distribution (Phase 7) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <OpportunityBubbleMap />
              </div>
              <div className="lg:col-span-1">
                <StageDistribution />
              </div>
            </div>

            {/* Priority matrix */}
            <div className="bg-th-surface border border-th-border rounded-xl p-5">
              <PriorityMatrix />
            </div>

            {/* Action centre (Phase 8 — Kanban on desktop) */}
            <ActionCentre />

            {/* Outcome story (Phase 9) */}
            <OutcomeComparison />

            <MappingCard />
            <FinalCTA />
            <div className="text-center py-3 space-y-1.5">
              <div className="text-th-faint text-[10px]">Your uploaded data stays private during this session.</div>
              <div className="flex items-center justify-center gap-3 text-[10px]">
                <span className="text-th-faint">Powered by <a href="https://yourvouch.com" target="_blank" rel="noopener noreferrer" className="hover:text-th-muted transition-colors">Vouch</a></span>
                <span className="text-th-faint/30">·</span>
                <span className="text-th-faint">For developers: <a href="https://github.com/yourvouch/vouch-starter-kit" target="_blank" rel="noopener noreferrer" className="hover:text-th-muted transition-colors">Explore the Vouch Starter Kit on GitHub</a></span>
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
