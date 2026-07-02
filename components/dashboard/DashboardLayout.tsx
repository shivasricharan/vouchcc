'use client';

import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashHeader from './DashHeader';
import UploadModal from './UploadModal';
import KPICards from './KPICards';
import FunnelChart from './FunnelChart';
import AIInsights from './AIInsights';
import PriorityFollowups from './PriorityFollowups';
import Recommendations from './Recommendations';
import GuideView from './views/GuideView';
import UploadGuideView from './views/UploadGuideView';
import UploadCSVView from './views/UploadCSVView';

function AuditCTA() {
  return (
    <div className="bg-th-surface border border-blue-500/15 rounded-xl p-6 text-center">
      <div className="text-th-heading font-bold text-sm mb-1">Ready to discover opportunities in your business?</div>
      <p className="text-th-muted text-xs mb-3 max-w-md mx-auto">
        Start with a free Opportunity Audit. Share a CSV, Google Sheet, or business data and Vouch will show where opportunities need attention.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <a
          href="https://yourvouch.com/#audit"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Start Opportunity Audit
        </a>
        <a
          href="https://yourvouch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          Visit Vouch
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
      <DashHeader />
      <main className="flex-1 overflow-y-auto bg-th-page">
        {view === 'dashboard' && (
          <div className="p-6 max-w-6xl mx-auto space-y-8">
            <KPICards />
            <AIInsights />
            <Recommendations />
            <MappingCard />

            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-th-border" />
              <span className="text-th-faint text-[10px] font-semibold uppercase tracking-widest">Detailed Breakdown</span>
              <div className="h-px flex-1 bg-th-border" />
            </div>

            <PriorityFollowups />
            <FunnelChart />
            <AuditCTA />
            <div className="text-center py-3 space-y-1">
              <div className="text-th-faint text-[10px] space-y-0.5">
                <div>Your uploaded data stays private during this session.</div>
                <div>For best results, upload sample or non-sensitive business data.</div>
              </div>
              <span className="text-th-faint text-xs">Powered by Vouch</span>
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
