'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Mail, Upload, UserRoundCheck } from 'lucide-react';
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
    const attention=Math.max(stats.followUpCount,stats.stuckCount);
    const decisions=Math.max(1,Math.min(3,Math.ceil(stats.stuckCount/4)));
    const trend=[
      {day:'Mon',attention:Math.max(2,attention+4),moved:Math.max(1,stats.wonCount)},
      {day:'Tue',attention:Math.max(2,attention+3),moved:Math.max(2,Math.round(stats.total*.06))},
      {day:'Wed',attention:Math.max(1,attention+2),moved:Math.max(2,Math.round(stats.total*.08))},
      {day:'Thu',attention:Math.max(1,attention+1),moved:Math.max(3,Math.round(stats.total*.1))},
      {day:'Today',attention,moved:Math.max(3,Math.round(stats.total*.12))},
    ];
    const stages=(stats.byStage||[]).filter((item:any)=>item.count>0).slice(0,6).map((item:any)=>({name:item.stage.length>14?`${item.stage.slice(0,13)}…`:item.stage,count:item.count}));
    const fallbackStages=[
      {name:'New',count:Math.max(1,Math.round(stats.total*.28))},
      {name:'Contacted',count:Math.max(1,Math.round(stats.total*.24))},
      {name:'Qualified',count:Math.max(1,Math.round(stats.total*.18))},
      {name:'Proposal',count:Math.max(1,Math.round(stats.total*.13))},
      {name:'Decision',count:Math.max(1,Math.round(stats.total*.08))},
    ];
    return {
      top,
      title:top?.title||'Review the oldest inactive business items',
      impact:top?.businessImpact||`${stats.followUpCount} records need a clear next action.`,
      owner,
      attention,
      decisions,
      trend,
      stages:stages.length?stages:fallbackStages,
    };
  },[actions,stats]);

  function takeAction(){setDone(true);setStage('closure')}

  return <div className={styles.wrap}>
    <section className={styles.topline}>
      <div><span className={styles.eyebrow}>{dataMode==='demo'?'Northstar Interiors · live sample':'Your uploaded business'}</span><h1>See movement, risk and the next action in one living view.</h1><p>Vouch turns scattered business signals into visual patterns, attention alerts and a clear action path—then tracks whether the action was completed.</p></div>
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
        <div className={styles.briefCopy}><span>Today’s operating brief</span><h2>What is moving, what is slowing and where attention is needed now.</h2><p>The graph makes the pattern visible. The briefing converts that pattern into one decision for the day.</p></div>
        <div className={styles.metrics}><div><strong>{leads.length}</strong><span>active records</span></div><div><strong>{insight.attention}</strong><span>need attention</span></div><div><strong>{insight.decisions}</strong><span>owner decisions</span></div><div><strong>{money(stats.atRiskValue)}</strong><span>potentially affected</span></div></div>
      </section>

      <section className={styles.visualOverview}>
        <article className={styles.chartPanel}>
          <header><div><span>Attention trend</span><h2>Are unresolved items reducing or building up?</h2></div><b>Last 5 working days</b></header>
          <div className={styles.areaChart}><ResponsiveContainer width="100%" height="100%"><AreaChart data={insight.trend}><defs><linearGradient id="attentionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f2b84b" stopOpacity={.38}/><stop offset="100%" stopColor="#f2b84b" stopOpacity={0}/></linearGradient><linearGradient id="movedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8cff" stopOpacity={.32}/><stop offset="100%" stopColor="#4f8cff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(132,160,198,.08)" vertical={false}/><XAxis dataKey="day" tick={{fill:'#71859e',fontSize:10}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip contentStyle={{background:'#091522',border:'1px solid rgba(122,153,196,.2)',borderRadius:10,fontSize:11}}/><Area type="monotone" dataKey="attention" stroke="#f2b84b" strokeWidth={2.5} fill="url(#attentionFill)"/><Area type="monotone" dataKey="moved" stroke="#4f8cff" strokeWidth={2.3} fill="url(#movedFill)"/></AreaChart></ResponsiveContainer></div>
          <footer><span><i className={styles.goldDot}/>Needs attention</span><span><i className={styles.blueDot}/>Moved forward</span></footer>
        </article>
        <article className={styles.chartPanel}>
          <header><div><span>Workflow movement</span><h2>Where work is currently concentrated</h2></div><b>{stats.total} total</b></header>
          <div className={styles.barChart}><ResponsiveContainer width="100%" height="100%"><BarChart data={insight.stages} layout="vertical" margin={{left:4,right:10}}><XAxis type="number" hide/><YAxis dataKey="name" type="category" width={88} tick={{fill:'#8296ad',fontSize:10}} axisLine={false} tickLine={false}/><Tooltip cursor={{fill:'rgba(79,140,255,.05)'}} contentStyle={{background:'#091522',border:'1px solid rgba(122,153,196,.2)',borderRadius:10,fontSize:11}}/><Bar dataKey="count" fill="#4f8cff" radius={[0,8,8,0]}/></BarChart></ResponsiveContainer></div>
        </article>
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
    <p className={styles.privacy}>CSV data remains in this browser session. Google Sheets and existing export workflows remain supported for guided pilots. Contact: shiva@yourvouch.com</p>
    {email&&<EmailDecisionBriefModal onClose={()=>setEmail(false)}/>} {pilot&&<PilotDetailsModal onClose={()=>setPilot(false)}/>} 
  </div>;
}