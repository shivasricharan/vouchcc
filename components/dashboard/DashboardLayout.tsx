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
import LeadsView from './views/LeadsView';
import FunnelView from './views/FunnelView';
import TeamsView from './views/TeamsView';
import InsightsView from './views/InsightsView';
import SettingsView from './views/SettingsView';
import GuideView from './views/GuideView';
import UploadCSVView from './views/UploadCSVView';

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
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2"><AIInsights /></div>
                <div className="xl:col-span-1"><RecentActivity /></div>
              </div>
              <LeadTable />
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
