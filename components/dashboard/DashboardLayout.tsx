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
      <div className="text-th-heading font-bold text-sm mb-1">Want this for your real business?</div>
      <p className="text-th-muted text-xs mb-3 max-w-md mx-auto">
        Start with a 14-Day Revenue Leak Audit. Share a CSV, Google Sheet, or sample business flow and Vouch will show where leads are leaking.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <a
          href="https://yourvouch.com/#audit"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Start 14-Day Audit
        </a>
        <a
          href="https://yourvouch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-th-muted hover:text-th-heading text-xs transition-colors"
        >
          Back to Vouch Website
        </a>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { view, showUpload } = useDashboard();

  return (
    <div className="flex flex-col h-screen bg-th-page overflow-hidden">
      <DashHeader />
      <main className="flex-1 overflow-y-auto bg-th-page">
        {view === 'dashboard' && (
          <div className="p-6 max-w-6xl mx-auto space-y-8">
            <KPICards />
            <AIInsights />
            <Recommendations />
            <PriorityFollowups />
            <FunnelChart />
            <AuditCTA />
            <div className="text-center py-3">
              <span className="text-th-faint text-xs">Powered by Vouch</span>
            </div>
          </div>
        )}
        {view === 'upload' && <UploadCSVView />}
        {view === 'guide'  && <GuideView />}
        {view === 'upload-guide' && <UploadGuideView />}
      </main>
      {showUpload && view !== 'upload' && <UploadModal />}
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
