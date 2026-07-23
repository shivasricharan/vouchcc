'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Mail, RefreshCw, Upload, UserRoundCheck } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import EmailDecisionBriefModal from './EmailDecisionBriefModal';
import PilotDetailsModal from './PilotDetailsModal';
import styles from './VisualDecisionDashboard.module.css';

function money(value:number){if(value>=100)return `₹${(value/100).toFixed(1)}Cr`;if(value>=10)return `₹${Math.round(value)}L`;if(value>0)return `₹${value.toFixed(1)}L`;return '—'}

export default function VisualDecisionDashboard(){
  const {leads,stats,dataMode,fileName,mappingConfidence,setShowUpload,actions}=useDashboard();
  const [email,setEmail]=useState(false);
  const [pilot,setPilot]=useState(false);
  const [done,setDone]=useState(false);
  const [stage,setStage]=useState<'morning'|'action'|'closure'>('morning');

  const insight=useMemo(()=>{
    const active=actions.filter(a=>!['completed','dismissed'].includes(a.status));
    const top=active.find(a=>a.urgency==='critical')||active[0];
    const owner=(top as any)?.owner||(top as any)?.assignedTo||'Business owner';
    return {
      top,
      title:top?.title||'Review the oldest inactive business items',
      impact:top?.businessImpact||`${stats.followUpCount} records need a clear next action.`,
      owner,
      attention:Math.max(stats.followUpCount,stats.stuckCount),
      decisions:Math.max(1,Math.min(3,Math.ceil(stats.stuckCount/4))),
    };
  },[actions,stats]);

  function takeAction(){setDone(true);setStage('closure')}

  return <div className={styles.wrap}>
    <section className={styles.topline}>
      <div><span className={styles.eyebrow}>{dataMode==='demo'?'Live sample business':'Your uploaded business'}</span><h1>Vouch shows what needs attention—and helps move the next action.</h1><p>This experience demonstrates the operating loop: observe business signals, detect what is stuck, identify ownership, recommend action and verify completion.</p></div>
      <div className={styles.dataTag}>{fileName||'Sample business'} · {leads.length} records · {mappingConfidence}% mapped</div>
    </section>

    <section className={styles.modeBar}>
      <div className={styles.modeTabs}>{[
        ['morning','Morning brief'],['action','Action view'],['closure','Evening closure']
      ].map(([key,label])=><button key={key} className={stage===key?styles.active:''} onClick={()=>setStage(key as any)}>{label}</button>)}</div>
      {dataMode==='demo'&&<button className={styles.uploadButton} onClick={()=>setShowUpload(true)}><Upload size={15}/> Use my CSV</button>}
    </section>

    {stage==='morning'&&<>
      <section className={styles.briefHero}>
        <div className={styles.briefCopy}><span>Today’s operating brief</span><h2>Your business does not need another dashboard. It needs to know what deserves attention now.</h2><p>Vouch condenses scattered activity into a few signals and one decision that can change the day.</p></div>
        <div className={styles.metrics}><div><strong>{leads.length}</strong><span>active records</span></div><div><strong>{insight.attention}</strong><span>need attention</span></div><div><strong>{insight.decisions}</strong><span>owner decisions</span></div><div><strong>{money(stats.atRiskValue)}</strong><span>potentially affected</span></div></div>
      </section>
      <section className={styles.priorityCard}>
        <div className={styles.priorityIcon}><AlertTriangle size={24}/></div>
        <div><span>Highest-priority signal</span><h2>{insight.title}</h2><p>{insight.impact}</p></div>
        <button onClick={()=>setStage('action')}>Review action <ArrowRight size={16}/></button>
      </section>
      <section className={styles.signalFlow}>{[
        ['Observe',`${leads.length} records read from ${fileName||'the current business view'}`],
        ['Detect',`${insight.attention} items show delay, inactivity or missing next steps`],
        ['Prioritise',`${insight.decisions} items require management attention today`],
      ].map(([title,text],index)=><div key={title}><i>0{index+1}</i><b>{title}</b><span>{text}</span></div>)}</section>
    </>}

    {stage==='action'&&<section className={styles.actionWorkspace}>
      <div className={styles.actionMain}><span>Recommended intervention</span><h2>{insight.title}</h2><p>{insight.impact}</p><div className={styles.actionMeta}><div><UserRoundCheck size={16}/><span>Current owner</span><b>{insight.owner}</b></div><div><Clock3 size={16}/><span>Action due</span><b>Today</b></div></div><div className={styles.actionButtons}><button className={styles.primary} onClick={takeAction}>{done?'Action recorded':'Assign and track'} <ArrowRight size={15}/></button><button className={styles.secondary} onClick={()=>setPilot(true)}>See guided pilot</button></div></div>
      <div className={styles.timeline}><h3>Why Vouch flagged this</h3><div><i/><span>Business item entered the current workflow</span></div><div><i/><span>Activity slowed or the promised next step was not updated</span></div><div className={styles.risk}><i/><span>Delay crossed the attention threshold</span></div><div><i/><span>Vouch recommends ownership and follow-through</span></div></div>
    </section>}

    {stage==='closure'&&<section className={styles.closure}>
      <CheckCircle2 size={34}/><span>Evening closure</span><h2>{done?'The priority action was recorded and moved forward.':'No completion has been recorded yet.'}</h2><p>{done?'Vouch would now watch for the outcome, escalate if the action stalls again and include the result in the next brief.':'Take the recommended action to experience the complete detect → act → verify loop.'}</p><div className={styles.closureGrid}><div><b>{done?'1':'0'}</b><span>priority actions completed</span></div><div><b>{stats.followUpCount}</b><span>remaining attention items</span></div><div><b>{money(stats.atRiskValue)}</b><span>value still being watched</span></div></div>{!done&&<button onClick={()=>setStage('action')}>Return to action view</button>}</section>}

    <section className={styles.pilotGate}>
      <div><span>14-day working pilot · ₹9,999</span><h2>The demo shows the experience. The pilot proves whether it changes real business behaviour.</h2><p>We configure one recurring flow, deliver daily attention briefs, track actions and measure saves, faster movement, clearer ownership and reduced owner chasing.</p></div>
      <div className={styles.gateActions}><button onClick={()=>setEmail(true)}><Mail size={15}/> Email brief</button><button className={styles.pilotButton} onClick={()=>setPilot(true)}>Explore the pilot <ArrowRight size={15}/></button></div>
    </section>
    <p className={styles.privacy}>CSV data remains in this browser session. Google Sheets and existing export workflows remain supported for guided pilots.</p>
    {email&&<EmailDecisionBriefModal onClose={()=>setEmail(false)}/>} {pilot&&<PilotDetailsModal onClose={()=>setPilot(false)}/>} 
  </div>;
}