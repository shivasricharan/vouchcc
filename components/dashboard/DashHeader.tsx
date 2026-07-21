'use client';

import { useDashboard } from '@/context/DashboardContext';
import { MoreHorizontal, RotateCcw, Upload } from 'lucide-react';

export default function DashHeader(){
  const {view,setShowUpload,setShowGuide,dataMode,fileName,leads,refreshAnalysis}=useDashboard();
  return <header className="demo-header">
    <a href="https://yourvouch.com" className="demo-brand" aria-label="Vouch website"><span>V</span><b>Vouch</b></a>
    {view==='dashboard'&&<div className="dataset-context"><b>{dataMode==='demo'?'Sample pipeline':fileName||'Uploaded data'}</b><span>•</span><span>{leads.length} records</span><div className="analysis-trail"><i>✓</i> Uploaded <em/><i>✓</i> Analysed <em/><i className="ready"/> Decisions ready</div></div>}
    <div className="demo-header-actions">{dataMode==='demo'&&view==='dashboard'&&<button className="header-quiet" onClick={refreshAnalysis}><RotateCcw size={14}/><span>Replay</span></button>}<button className="header-upload" onClick={()=>setShowUpload(true)}><Upload size={15}/><span>Upload new data</span></button><button className="header-menu" onClick={()=>setShowGuide(true)} aria-label="Open demo guide"><MoreHorizontal size={18}/></button></div>
  </header>;
}
