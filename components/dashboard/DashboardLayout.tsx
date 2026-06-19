'use client';

import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import Sidebar from './Sidebar';
import DashHeader from './DashHeader';
import UploadModal from './UploadModal';
import KPICards from './KPICards';
import MorningFocus from './MorningFocus';
import FunnelChart from './FunnelChart';
import StuckLeads from './StuckLeads';
import TeamWorkload from './TeamWorkload';
import LeadTable from './LeadTable';
import RecentActivity from './RecentActivity';
import AIInsights from './AIInsights';
import PriorityFollowups from './PriorityFollowups';
import Recommendations from './Recommendations';
import LeadsView from './views/LeadsView';
import FunnelView from './views/FunnelView';
import TeamsView from './views/TeamsView';
import InsightsView from './views/InsightsView';
import SettingsView from './views/SettingsView';
import GuideView from './views/GuideView';
import UploadCSVView from './views/UploadCSVView';

function AuditCTA() {
  return (
    <div className="bg-th-surface border border-blue-500/20 rounded-xl p-6 text-center">
      <div className="text-th-heading font-bold text-base mb-2">Want this for your real business?</div>
      <p className="text-th-body text-sm max-w-lg mx-auto mb-4">
        Start with a 14-Day Revenue Leak Audit. Share a CSV, Google Sheet, or sample business flow and Vouch will show where leads are leaking.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <a
          href="https://yourvouch.com/#audit"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Start 14-Day Audit
        </a>
        <a
          href="https://yourvouch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-th-muted hover:text-th-heading text-sm transition-colors"
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
    <div className="flex h-screen bg-th-page overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashHeader />
        <main className="flex-1 overflow-y-auto bg-th-page">
          {view === 'dashboard' && (
            <div className="p-5 space-y-5">
              <KPICards />
              <MorningFocus />
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                <div className="xl:col-span-3"><FunnelChart /></div>
                <div className="xl:col-span-2"><TeamWorkload /></div>
              </div>
              <StuckLeads />
              <PriorityFollowups />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-1"><AIInsights /></div>
                <div className="xl:col-span-1"><Recommendations /></div>
                <div className="xl:col-span-1"><RecentActivity /></div>
              </div>
              <LeadTable />
              <AuditCTA />
              <div className="text-center py-3 border-t border-th-border">
                <span className="text-th-faint text-xs">Powered by Vouch</span>
              </div>
            </div>
          )}
          {view === 'upload'   && <UploadCSVView />}
          {view === 'leads'    && <LeadsView />}
          {view === 'funnel'   && <FunnelView />}
          {view === 'teams'    && <TeamsView />}
          {view === 'insights' && <InsightsView />}
          {view === 'settings' && <SettingsView />}
          {view === 'guide'    && <GuideView />}
        </main>
      </div>
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
