'use client';

import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashHeader from './DashHeader';
import UploadModal from './UploadModal';
import AnalysisAnimation from './AnalysisAnimation';
import GuideView from './views/GuideView';
import UploadGuideView from './views/UploadGuideView';
import UploadCSVView from './views/UploadCSVView';
import VisualDecisionDashboard from './VisualDecisionDashboard';

function DashboardContent(){
  const {view,showUpload,showGuide}=useDashboard();
  return <div className="demo-shell">
    <DashHeader/>
    <main className="demo-main">
      {view==='dashboard'&&<VisualDecisionDashboard/>}
      {view==='upload'&&<UploadCSVView/>}
      {view==='guide'&&<GuideView/>}
    </main>
    {showUpload&&view!=='upload'&&<UploadModal/>}
    {showGuide&&<UploadGuideView/>}
    <AnalysisAnimation/>
  </div>;
}

export default function DashboardLayout(){
  return <DashboardProvider><DashboardContent/></DashboardProvider>;
}
