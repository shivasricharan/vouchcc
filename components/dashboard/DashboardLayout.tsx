'use client';

import { useState } from 'react';
import { AlertCircle, ArrowRight, Clock3, Mail, ShieldCheck, Sparkles, Upload, Users } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashHeader from './DashHeader';
import UploadModal from './UploadModal';
import PriorityHero from './PriorityHero';
import AnalysisAnimation from './AnalysisAnimation';
import GuideView from './views/GuideView';
import UploadGuideView from './views/UploadGuideView';
import UploadCSVView from './views/UploadCSVView';
import EmailDecisionBriefModal from './EmailDecisionBriefModal';
import PilotDetailsModal from './PilotDetailsModal';

function money(value: number): string {
  if (value >= 100) return `₹${(value / 100).toFixed(1)}Cr`;
  if (value >= 10) return `₹${Math.round(value)}L`;
  if (value > 0) return `₹${value.toFixed(1)}L`;
  return 'Not calculated';
}

function Snapshot() {
  const { stats } = useDashboard();
  const items = [
    { value: stats.followUpCount, label: 'need attention' },
    { value: money(stats.atRiskValue), label: 'value exposed' },
    { value: stats.stuckCount, label: 'stalled 7+ days' },
  ];
  return <section className="decision-snapshot" aria-label="Decision snapshot">
    {items.map(item=><div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
  </section>;
}

function SignalConvergence() {
  const { stats, dataMode, fileName, leads } = useDashboard();
  const signals = [
    { icon: Clock3, title: 'No recent activity', detail: `${stats.stuckCount} records inactive 7+ days` },
    { icon: AlertCircle, title: 'Follow-up pressure', detail: `${stats.followUpCount} records need attention` },
    { icon: Users, title: 'Ownership and movement', detail: `${leads.length} records analysed together` },
  ];
  return <div className="signal-convergence" aria-label="Signals used for the top decision">
    <div className="csv-source"><span>CSV</span><div><b>{dataMode==='demo'?'sample_pipeline.csv':fileName||'uploaded_data.csv'}</b><small>{leads.length} records</small></div></div>
    <div className="signal-list">{signals.map(({icon:Icon,title,detail},index)=><div className="signal-item" key={title} style={{animationDelay:`${index*.12}s`}}><Icon size={15}/><div><b>{title}</b><small>{detail}</small></div><i/></div>)}</div>
  </div>;
}

function NextTwoActions() {
  const { actions, updateActionStatus } = useDashboard();
  const active = actions.filter(action=>!['completed','dismissed'].includes(action.status));
  const top = active.find(action=>action.urgency==='critical')??active[0];
  const next = active.filter(action=>action.id!==top?.id).slice(0,2);
  if(!next.length) return <section className="next-actions"><h2>Next actions</h2><p className="all-clear">No additional actions need attention.</p></section>;
  return <section className="next-actions"><h2>Next actions</h2>{next.map((action,index)=><article key={action.id}>
    <span>0{index+1}</span><div><h3>{action.title}</h3><p>{action.businessImpact}</p></div>
    {action.status==='recommended'?<button onClick={()=>updateActionStatus(action.id,'assigned')} aria-label={`Assign ${action.title}`}><ArrowRight size={16}/></button>:<small>{action.status.replace('_',' ')}</small>}
  </article>)}</section>;
}

function ConversionBar() {
  const { dataMode, setShowUpload } = useDashboard();
  const [email,setEmail]=useState(false);
  const [pilot,setPilot]=useState(false);
  return <>
    <section className="conversion-bar">
      <div><Sparkles size={18}/><span>{dataMode==='demo'?'Explore freely, then email this sample brief to your team.':'Share this decision with your team.'}</span></div>
      <div>
        {dataMode==='demo'&&<button className="conversion-secondary" onClick={()=>setShowUpload(true)}><Upload size={16}/> Upload my data</button>}
        <button className="conversion-secondary" onClick={()=>setEmail(true)}><Mail size={16}/> Email this brief</button>
        <button className="conversion-primary" onClick={()=>setPilot(true)}>Request ₹9,999 pilot <ArrowRight size={15}/></button>
      </div>
    </section>
    {email&&<EmailDecisionBriefModal onClose={()=>setEmail(false)}/>} {pilot&&<PilotDetailsModal onClose={()=>setPilot(false)}/>} 
  </>;
}

function DashboardContent(){
  const { view,showUpload,showGuide,dataMode,leads,mappingConfidence,fileName }=useDashboard();
  return <div className="demo-shell">
    <DashHeader/>
    <main className="demo-main">
      {view==='dashboard'&&<div className="decision-review-shell">
        <section className="decision-opening animate-fade-up">
          <div><h1>{dataMode==='demo'?'See what needs your attention.':'Here is what needs your attention.'}</h1><p>{dataMode==='demo'?'Explore a sample result without sharing any details. Upload your own CSV when ready, or email the brief to discuss it with your team.':`Vouch analysed ${leads.length} records and found the decisions most likely to move your business.`}</p></div>
          <div className="analysis-context"><ShieldCheck size={13}/>{dataMode==='demo'?`Sample professional-services pipeline · ${leads.length} records`:`${fileName||'Uploaded file'} · ${mappingConfidence}% mapping confidence`}</div>
        </section>
        <Snapshot/>
        <section className="decision-stage">
          <SignalConvergence/>
          <PriorityHero/>
          <NextTwoActions/>
        </section>
        <ConversionBar/>
        <p className="privacy-note">No sign-up is required to explore. Raw uploaded data stays in this browser session; only aggregated insights are included when you request an email brief.</p>
      </div>}
      {view==='upload'&&<UploadCSVView/>}{view==='guide'&&<GuideView/>}
    </main>
    {showUpload&&view!=='upload'&&<UploadModal/>}{showGuide&&<UploadGuideView/>}<AnalysisAnimation/>
  </div>;
}

export default function DashboardLayout(){return <DashboardProvider><DashboardContent/></DashboardProvider>}