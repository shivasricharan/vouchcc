'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Mail,
  RotateCcw,
  Upload,
  UserRoundCheck,
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import EmailDecisionBriefModal from './EmailDecisionBriefModal';
import styles from './VisualDecisionDashboard.module.css';

const DAY = 86_400_000;

type Outcome = 'Follow-up' | 'Meeting / visit' | 'Quotation' | 'Payment' | 'Completion';
type RecordState = 'open' | 'assigned' | 'contacted' | 'snoozed' | 'closed';

function money(value:number){
  if(!value) return 'Not provided';
  if(value>=10_000_000) return `₹${(value/10_000_000).toFixed(1)} Cr`;
  if(value>=100_000) return `₹${(value/100_000).toFixed(1)} L`;
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function parseDate(value:string){
  const parsed=Date.parse(value);
  return Number.isNaN(parsed)?null:parsed;
}

export default function VisualDecisionDashboard(){
  const {
    leads,stats,dataMode,fileName,mappingConfidence,setShowUpload,mappingMeta,
  }=useDashboard();
  const [outcome,setOutcome]=useState<Outcome>('Follow-up');
  const [inactiveDays,setInactiveDays]=useState(5);
  const [email,setEmail]=useState(false);
  const [recordStates,setRecordStates]=useState<Record<string,RecordState>>({});
  const [showEvidence,setShowEvidence]=useState(false);

  const analysis=useMemo(()=>{
    const active=leads.filter(lead=>!/(lost|closed lost|completed|won)/i.test(`${lead.stage} ${lead.status}`));
    const missingOwner=active.filter(lead=>!lead.owner||/unassigned|unknown|n\/a/i.test(lead.owner));
    const missingNext=active.filter(lead=>!lead.nextAction||/none|n\/a|unknown/i.test(lead.nextAction));
    const invalidDates=active.filter(lead=>!parseDate(lead.lastContacted));
    const overdue=active.filter(lead=>lead.daysSinceUpdate>=inactiveDays);
    const analysable=active.filter(lead=>Boolean(lead.client&&lead.stage));

    const ranked=active.map(lead=>{
      const noOwner=!lead.owner||/unassigned|unknown|n\/a/i.test(lead.owner);
      const noNext=!lead.nextAction||/none|n\/a|unknown/i.test(lead.nextAction);
      const overdueBy=Math.max(0,lead.daysSinceUpdate-inactiveDays);
      const late=lead.daysSinceUpdate>=inactiveDays;
      const quote=/quote|proposal|negotiation/i.test(lead.stage);
      const score=(late?40+Math.min(overdueBy*3,24):0)+(noNext?28:0)+(noOwner?22:0)+(quote?12:0)+(lead.value?Math.min(lead.value/100_000,10):0);
      const reasons=[
        late?`No update for ${lead.daysSinceUpdate} days`:null,
        noNext?'No clear next action':null,
        noOwner?'Owner is unclear':null,
        quote?'Customer is at a decision stage':null,
      ].filter(Boolean) as string[];
      let recommendation=`Confirm the next ${outcome.toLowerCase()} and record a due date.`;
      if(noOwner) recommendation='Assign one owner before any further follow-up.';
      else if(noNext) recommendation=`Contact the customer and agree the next ${outcome.toLowerCase()}.`;
      else if(quote) recommendation='Ask for the decision timeline and record the customer concern.';
      return {...lead,score,reasons,recommendation};
    }).sort((a,b)=>b.score-a.score);

    return {
      active,
      analysable,
      missingOwner,
      missingNext,
      invalidDates,
      overdue,
      priorities:ranked.slice(0,3),
    };
  },[leads,inactiveDays,outcome]);

  const actionSummary=useMemo(()=>{
    const contacted=Object.values(recordStates).filter(value=>value==='contacted').length;
    const assigned=Object.values(recordStates).filter(value=>value==='assigned').length;
    const snoozed=Object.values(recordStates).filter(value=>value==='snoozed').length;
    const closed=Object.values(recordStates).filter(value=>value==='closed').length;
    return {contacted,assigned,snoozed,closed,total:contacted+assigned+snoozed+closed};
  },[recordStates]);

  const stageData=(stats.byStage||[]).filter(item=>item.count>0).slice(0,7).map(item=>({
    name:item.stage.length>15?`${item.stage.slice(0,14)}…`:item.stage,
    count:item.count,
  }));

  function updateRecord(id:string,state:RecordState){
    setRecordStates(current=>({...current,[id]:state}));
  }

  return <div className={styles.wrap}>
    <section className={styles.topline}>
      <div>
        <span className={styles.eyebrow}>Vouch Data Lab · experimental</span>
        <h1>Decide what needs attention first.</h1>
        <p>Vouch checks whether the data is usable, surfaces the customer records that need action and turns them into a clear operating agenda.</p>
      </div>
      <div className={styles.dataTag}>{dataMode==='demo'?'Sample business':fileName||'Uploaded data'} · {leads.length} records</div>
    </section>

    <section className={styles.contextBar}>
      <label>
        <span>A successful next outcome means</span>
        <select value={outcome} onChange={event=>setOutcome(event.target.value as Outcome)}>
          <option>Follow-up</option><option>Meeting / visit</option><option>Quotation</option><option>Payment</option><option>Completion</option>
        </select>
      </label>
      <label>
        <span>Needs attention after</span>
        <select value={inactiveDays} onChange={event=>setInactiveDays(Number(event.target.value))}>
          <option value={2}>2 inactive days</option><option value={3}>3 inactive days</option><option value={5}>5 inactive days</option><option value={7}>7 inactive days</option><option value={14}>14 inactive days</option>
        </select>
      </label>
      <button onClick={()=>setShowUpload(true)}><Upload size={15}/>{dataMode==='demo'?'Use my data':'Upload new file'}</button>
    </section>

    <section className={styles.trustPanel}>
      <div className={styles.trustIntro}>
        <span>Before the findings</span>
        <h2>How much can Vouch confidently use?</h2>
        <p>Indicative findings become more useful when the customer, stage, owner, last interaction and next action are consistently recorded.</p>
      </div>
      <div className={styles.trustMetrics}>
        <div><strong>{analysis.analysable.length}</strong><span>active records analysable</span></div>
        <div><strong>{analysis.missingNext.length}</strong><span>missing next action</span></div>
        <div><strong>{analysis.missingOwner.length}</strong><span>owner unclear</span></div>
        <div><strong>{analysis.invalidDates.length}</strong><span>dates need review</span></div>
      </div>
      <div className={styles.confidence}>
        <div><span>Field mapping confidence</span><b>{mappingConfidence}%</b></div>
        <div className={styles.confidenceTrack}><i style={{width:`${mappingConfidence}%`}}/></div>
        <small>{mappingMeta?.mapped||0} fields mapped. Results are directional and should be checked against business context.</small>
      </div>
    </section>

    <section className={styles.decisionHead}>
      <div>
        <span>What deserves attention first</span>
        <h2>{analysis.overdue.length} records crossed your {inactiveDays}-day attention limit.</h2>
        <p>Start with these three—not with every row in the spreadsheet.</p>
      </div>
      <div className={styles.decisionCount}><strong>{analysis.priorities.length}</strong><span>priority decisions</span></div>
    </section>

    <section className={styles.priorityList}>
      {analysis.priorities.map((lead,index)=>{
        const state=recordStates[lead.id]||'open';
        return <article className={styles.recordCard} key={lead.id}>
          <div className={styles.recordRank}>0{index+1}</div>
          <div className={styles.recordMain}>
            <div className={styles.recordTitle}>
              <div><span>{lead.stage||'Stage not recorded'}</span><h3>{lead.client||'Unnamed customer'}</h3></div>
              <b>{money(lead.value)}</b>
            </div>
            <div className={styles.reasonRow}>{lead.reasons.length?lead.reasons.map(reason=><span key={reason}><AlertTriangle size={13}/>{reason}</span>):<span><CircleHelp size={13}/>Record needs a clearer next step</span>}</div>
            <div className={styles.recommendation}>
              <ArrowRight size={17}/><div><span>Recommended decision</span><b>{lead.recommendation}</b></div>
            </div>
            <div className={styles.recordMeta}>
              <span><UserRoundCheck size={14}/>{lead.owner||'Unassigned'}</span>
              <span><Clock3 size={14}/>{lead.daysSinceUpdate} days since update</span>
              <span><CalendarClock size={14}/>{lead.nextAction||'No next action recorded'}</span>
            </div>
          </div>
          <div className={styles.recordActions}>
            {state==='open'?<>
              <button className={styles.primaryAction} onClick={()=>updateRecord(lead.id,'contacted')}>Mark contacted</button>
              <button onClick={()=>updateRecord(lead.id,'assigned')}>Assign owner</button>
              <button onClick={()=>updateRecord(lead.id,'snoozed')}>Snooze with reason</button>
              <button onClick={()=>updateRecord(lead.id,'closed')}>Close record</button>
            </>:<div className={styles.recorded}><CheckCircle2 size={20}/><span>Decision recorded</span><b>{state}</b><button onClick={()=>updateRecord(lead.id,'open')}><RotateCcw size={13}/> Undo</button></div>}
          </div>
        </article>;
      })}
    </section>

    <section className={styles.agenda}>
      <div>
        <span>Today’s operating agenda</span>
        <h2>Turn the findings into a small number of decisions.</h2>
      </div>
      <div className={styles.agendaItems}>
        <div><b>{analysis.overdue.length}</b><span>Contact overdue customers</span></div>
        <div><b>{analysis.missingOwner.length}</b><span>Assign clear owners</span></div>
        <div><b>{analysis.missingNext.length}</b><span>Agree and record next actions</span></div>
        <div><b>{actionSummary.total}</b><span>Decisions recorded now</span></div>
      </div>
    </section>

    <section className={styles.experiment}>
      <div className={styles.experimentIcon}><Check size={23}/></div>
      <div><span>Seven-day experiment</span><h2>Every active customer leaves a conversation with an owner, next action and due date.</h2><p>At the end of seven days, compare how many overdue records remain and how many customers moved to the next outcome: <b>{outcome}</b>.</p></div>
      <button onClick={()=>setEmail(true)}><Mail size={15}/> Email this decision brief</button>
    </section>

    <button className={styles.evidenceToggle} onClick={()=>setShowEvidence(value=>!value)}>{showEvidence?'Hide supporting evidence':'Show supporting evidence and dashboard'} <ArrowRight size={15}/></button>

    {showEvidence&&<section className={styles.evidence}>
      <div className={styles.evidenceCopy}><span>Patterns behind the decisions</span><h2>Use the dashboard to understand the pattern—not to decide where to begin.</h2><p>The priority list above remains the operating surface. These views show where records are accumulating and how much work remains.</p></div>
      <div className={styles.evidenceMetrics}><div><strong>{stats.total}</strong><span>total records</span></div><div><strong>{stats.followUpCount}</strong><span>need follow-up</span></div><div><strong>{stats.stuckCount}</strong><span>stuck records</span></div><div><strong>{money(stats.atRiskValue)}</strong><span>recorded value needing review</span></div></div>
      <div className={styles.chartPanel}>
        <header><div><span>Journey distribution</span><h3>Where records are currently sitting</h3></div><b>{stats.total} records</b></header>
        <div className={styles.barChart}><ResponsiveContainer width="100%" height="100%"><BarChart data={stageData} layout="vertical" margin={{left:4,right:16}}><XAxis type="number" hide/><YAxis dataKey="name" type="category" width={105} tick={{fill:'#8296ad',fontSize:10}} axisLine={false} tickLine={false}/><Tooltip cursor={{fill:'rgba(79,140,255,.05)'}} contentStyle={{background:'#091522',border:'1px solid rgba(122,153,196,.2)',borderRadius:10,fontSize:11}}/><Bar dataKey="count" fill="#4f8cff" radius={[0,8,8,0]}/></BarChart></ResponsiveContainer></div>
      </div>
    </section>}

    <p className={styles.privacy}>Files remain in this browser session. Vouch findings are indicative and should be reviewed with the people who own the customer journey. Contact: shiva@yourvouch.com</p>
    {email&&<EmailDecisionBriefModal onClose={()=>setEmail(false)}/>} 
  </div>;
}
