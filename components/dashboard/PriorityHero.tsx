'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { CheckCircle2, ChevronDown, Play, UserPlus } from 'lucide-react';

export default function PriorityHero(){
  const {actions,updateActionStatus}=useDashboard();
  const [why,setWhy]=useState(false);
  const topAction=useMemo(()=>{
    const active=actions.filter(a=>!['completed','dismissed'].includes(a.status));
    return active.find(a=>a.urgency==='critical')??active[0]??null;
  },[actions]);
  if(!topAction)return <section className="priority-decision healthy"><span>#1 decision</span><h2>Keep the current follow-up rhythm.</h2><p>No urgent priority was detected in this analysis.</p></section>;
  const confidence=Math.min(95,60+topAction.impactScore*3);
  return <section className="priority-wrap">
    <div className="priority-decision">
      <span>#1 decision</span>
      <h2>{topAction.title}</h2>
      <p className="priority-impact">{topAction.businessImpact}</p>
      <div className="priority-meta"><div><small>Assign to</small><b>{topAction.owner}</b></div><div><small>Due</small><b>{topAction.dueDate}</b></div></div>
      {topAction.status==='recommended'&&<button className="priority-action" onClick={()=>updateActionStatus(topAction.id,'assigned')}><UserPlus size={15}/>Assign action</button>}
      {topAction.status==='assigned'&&<button className="priority-action" onClick={()=>updateActionStatus(topAction.id,'in_progress')}><Play size={15}/>Start action</button>}
      {topAction.status==='in_progress'&&<button className="priority-action complete" onClick={()=>updateActionStatus(topAction.id,'completed')}><CheckCircle2 size={15}/>Mark complete</button>}
    </div>
    <button className="why-decision" onClick={()=>setWhy(v=>!v)} aria-expanded={why}>Why this decision? <ChevronDown size={14} className={why?'rotate-180':''}/></button>
    {why&&<div className="decision-evidence"><p><b>Evidence:</b> {topAction.sourceInsight}</p><p><b>Expected result:</b> {topAction.expectedOutcome}</p><span>{confidence}% confidence from the available mapped fields</span></div>}
  </section>;
}
