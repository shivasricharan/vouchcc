import Sidebar from '@/components/dashboard/Sidebar';
import DashHeader from '@/components/dashboard/DashHeader';
import KPICards from '@/components/dashboard/KPICards';
import MorningFocus from '@/components/dashboard/MorningFocus';
import FunnelChart from '@/components/dashboard/FunnelChart';
import StuckLeads from '@/components/dashboard/StuckLeads';
import TeamWorkload from '@/components/dashboard/TeamWorkload';
import LeadTable from '@/components/dashboard/LeadTable';
import RecentActivity from '@/components/dashboard/RecentActivity';
import AIInsights from '@/components/dashboard/AIInsights';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#070c18] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashHeader />
        <main className="flex-1 overflow-y-auto bg-[#070c18]">
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
            <div className="text-center py-3 border-t border-white/5">
              <span className="text-slate-600 text-xs">Powered by Vouch</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
