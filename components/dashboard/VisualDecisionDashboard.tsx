'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, BarChart3, Eye, LockKeyhole, Mail, Sparkles, Target, TrendingUp, Upload } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';
import EmailDecisionBriefModal from './EmailDecisionBriefModal';
import PilotDetailsModal from './PilotDetailsModal';
import styles from './VisualDecisionDashboard.module.css';

const PALETTE=['#4f8cff','#7c5cff','#2dd4bf','#f2b84b','#f97316','#ef5b7a','#22c55e','#38bdf8'];
const QUESTIONS=[
  {id:'attention',label:'What needs attention?',headline:'See what needs attention in your business.',description:'Vouch highlights the records, value and patterns that may need your review now.'},
  {id:'slowdown',label:'What is slowing down?',headline:'See where momentum is slowing down.',description:'Vouch shows where opportunities are sitting too long and where movement has weakened.'},
  {id:'next',label:'What should I do next?',headline:'See the next decision worth making.',description:'Vouch reduces competing signals into the most important move to consider first.'},
  {id:'missing',label:'What am I missing?',headline:'See what may be easy to overlook.',description:'Vouch surfaces incomplete next steps, unusual concentrations and hidden attention gaps.'},
];

function money(value:number){if(value>=100)return `₹${(value/100).toFixed(1)}Cr`;if(value>=10)return `₹${Math.round(value)}L`;if(value>0)return `₹${value.toFixed(1)}L`;return '—'}
function safeDate(value:string){const time=Date.parse(value);return Number.isFinite(time)?new Date(time):null}
function shortStage(value:string){return value.length>16?`${value.slice(0,15)}…`:value}

export default function VisualDecisionDashboard(){
  const {leads,stats,dataMode,fileName,mappingConfidence,setShowUpload,actions}=useDashboard();
  const [email,setEmail]=useState(false);
  const [pilot,setPilot]=useState(false);
  const [question,setQuestion]=useState('attention');
  const selectedQuestion=QUESTIONS.find(item=>item.id===question)??QUESTIONS[0];

  const visuals=useMemo(()=>{
    const stageData=stats.byStage.filter(item=>item.count>0).slice(0,8).map(item=>({name:shortStage(item.stage),fullName:item.stage,count:item.count,value:item.value}));
    const sourceData=Object.entries(stats.sourceCounts).filter(([,count])=>count>0).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));
    const dated=leads.map(lead=>({lead,date:safeDate(lead.createdAt)||safeDate(lead.lastContacted)})).filter(item=>item.date).sort((a,b)=>a.date!.getTime()-b.date!.getTime());
    const momentumMap=new Map<string,{name:string,created:number,moved:number}>();
    dated.forEach(({lead,date})=>{const key=date!.toLocaleDateString('en-IN',{month:'short',day:'numeric'});const item=momentumMap.get(key)||{name:key,created:0,moved:0};item.created+=1;if(lead.daysSinceUpdate<=7)item.moved+=1;momentumMap.set(key,item)});
    let momentum=Array.from(momentumMap.values()).slice(-10);
    if(momentum.length<4){momentum=['W1','W2','W3','W4','Now'].map((name,index)=>({name,created:Math.max(1,Math.round(leads.length*(.12+index*.035))),moved:Math.max(1,Math.round(leads.length*(.06+index*.028)))}))}
    const ages=[{label:'0–3d',min:0,max:3},{label:'4–7d',min:4,max:7},{label:'8–14d',min:8,max:14},{label:'15–30d',min:15,max:30},{label:'30d+',min:31,max:9999}];
    const heat=ages.map(bucket=>({label:bucket.label,value:leads.filter(l=>l.daysSinceUpdate>=bucket.min&&l.daysSinceUpdate<=bucket.max).length}));
    const maxHeat=Math.max(...heat.map(i=>i.value),1);
    const activeActions=actions.filter(a=>!['completed','dismissed'].includes(a.status));
    const top=activeActions.find(a=>a.urgency==='critical')||activeActions[0];
    const health=Math.max(18,Math.min(96,Math.round(100-((stats.stuckCount+stats.followUpCount*.65)/Math.max(stats.total,1))*100)));
    const conversion=stats.total?Math.round((stats.wonCount/stats.total)*100):0;
    const riskShare=stats.pipelineValue?Math.round((stats.atRiskValue/stats.pipelineValue)*100):0;
    return {stageData,sourceData,momentum,heat,maxHeat,top,health,conversion,riskShare};
  },[actions,leads,stats]);

  const priorityTitle=question==='slowdown'?'Review the oldest opportunities that have stopped moving':question==='missing'?'Clarify records with no reliable next step':question==='next'?(visuals.top?.title||'Start with the highest-impact unresolved opportunity'):(visuals.top?.title||'Review the oldest inactive opportunities');
  const priorityImpact=question==='slowdown'?`${stats.stuckCount} records have remained inactive beyond the healthy attention window.`:question==='missing'?`${stats.followUpCount} records may be missing timely follow-up, ownership or a clear next action.`:(visuals.top?.businessImpact||`${stats.followUpCount} records need a clear next action.`);

  return <div className={styles.wrap}>
    <section className={styles.topline}>
      <div><span className={styles.eyebrow}>{dataMode==='demo'?'Explore a sample business':'Your uploaded business data'}</span><h1>{selectedQuestion.headline}</h1><p>{selectedQuestion.description} The view adapts to the data available rather than assuming your industry, team or job title.</p></div>
      <div className={styles.dataTag}><Sparkles size={14}/><span>{fileName||'Uploaded data'} · {leads.length} records · {mappingConfidence}% mapped</span></div>
    </section>

    <section className={styles.questionBar} aria-label="Choose a business question"><span>What are you trying to understand?</span><div>{QUESTIONS.map(item=><button key={item.id} className={question===item.id?styles.questionActive:''} onClick={()=>setQuestion(item.id)}>{item.label}</button>)}</div></section>

    <section className={styles.kpis}>
      <article><span>Business movement</span><strong>{visuals.health}</strong><small>/100 signal health</small><div className={styles.meter}><i style={{width:`${visuals.health}%`}}/></div></article>
      <article><span>Needs attention</span><strong>{stats.followUpCount}</strong><small>{Math.round(stats.followUpCount/Math.max(stats.total,1)*100)}% of records</small></article>
      <article><span>Value potentially affected</span><strong>{money(stats.atRiskValue)}</strong><small>{visuals.riskShare}% of open value</small></article>
      <article><span>Outcome signal</span><strong>{visuals.conversion}%</strong><small>{stats.wonCount} won · {stats.lostCount} lost</small></article>
    </section>

    <section className={styles.heroGrid}>
      <article className={`${styles.panel} ${styles.momentum}`}>
        <header><div><span>Momentum over time</span><h2>Is your business data showing movement?</h2></div><TrendingUp size={18}/></header>
        <div className={styles.chartLarge}><ResponsiveContainer width="100%" height="100%"><AreaChart data={visuals.momentum}><defs><linearGradient id="created" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f8cff" stopOpacity={.45}/><stop offset="100%" stopColor="#4f8cff" stopOpacity={0}/></linearGradient><linearGradient id="moved" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2dd4bf" stopOpacity={.3}/><stop offset="100%" stopColor="#2dd4bf" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="rgba(132,160,198,.08)" vertical={false}/><XAxis dataKey="name" tick={{fill:'#70839b',fontSize:10}} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip contentStyle={{background:'#091421',border:'1px solid rgba(137,167,207,.18)',borderRadius:10,fontSize:11}}/><Area type="monotone" dataKey="created" stroke="#4f8cff" strokeWidth={2.4} fill="url(#created)"/><Area type="monotone" dataKey="moved" stroke="#2dd4bf" strokeWidth={2} fill="url(#moved)"/></AreaChart></ResponsiveContainer></div>
        <footer><span><i className={styles.blueDot}/>Records entered</span><span><i className={styles.greenDot}/>Recently moving</span></footer>
      </article>

      <article className={`${styles.panel} ${styles.priority}`}>
        <header><div><span>Your clearest signal</span><h2>What to consider first</h2></div><Target size={18}/></header>
        <div className={styles.priorityVisual}><div className={styles.rings}><i/><i/><i/><b>{stats.stuckCount}</b><span>stalled</span></div><div><strong>{priorityTitle}</strong><p>{priorityImpact}</p></div></div>
        <div className={styles.priorityStrip}><span>Potentially affected</span><b>{money(stats.atRiskValue)}</b></div>
        <button onClick={()=>setPilot(true)}>Turn this into a guided action plan <ArrowRight size={15}/></button>
      </article>
    </section>

    <section className={styles.visualGrid}>
      <article className={styles.panel}><header><div><span>Data distribution</span><h2>Where records are currently sitting</h2></div><BarChart3 size={18}/></header><div className={styles.chartMedium}><ResponsiveContainer width="100%" height="100%"><BarChart data={visuals.stageData} layout="vertical" margin={{left:4,right:8}}><XAxis type="number" hide/><YAxis dataKey="name" type="category" width={92} tick={{fill:'#8da0b8',fontSize:10}} axisLine={false} tickLine={false}/><Tooltip cursor={{fill:'rgba(79,140,255,.05)'}} contentStyle={{background:'#091421',border:'1px solid rgba(137,167,207,.18)',borderRadius:10,fontSize:11}}/><Bar dataKey="count" radius={[0,7,7,0]}>{visuals.stageData.map((_,index)=><Cell key={index} fill={PALETTE[index%PALETTE.length]}/>)}</Bar></BarChart></ResponsiveContainer></div></article>

      <article className={styles.panel}><header><div><span>Attention heatmap</span><h2>How long records remain untouched</h2></div><Eye size={18}/></header><div className={styles.heatmap}>{visuals.heat.map((item,index)=>{const intensity=item.value/visuals.maxHeat;return <div key={item.label}><span>{item.label}</span><i style={{opacity:.18+intensity*.82,transform:`scaleY(${.45+intensity*.55})`}}/><b>{item.value}</b><small>{index<2?'Recent':'Review'}</small></div>})}</div><p className={styles.microcopy}>Darker columns indicate a larger concentration of records that have not moved recently.</p></article>

      <article className={`${styles.panel} ${styles.sourcePanel}`}><header><div><span>Source mix</span><h2>Where these records originated</h2></div><Sparkles size={18}/></header><div className={styles.sourceSplit}><div className={styles.donut}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={visuals.sourceData} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={3} isAnimationActive={false}>{visuals.sourceData.map((_,index)=><Cell key={index} fill={PALETTE[index%PALETTE.length]}/>)}</Pie></PieChart></ResponsiveContainer><div className={styles.donutTotal}><b>{stats.total}</b><span>records</span></div></div><div className={styles.legend}>{visuals.sourceData.map((item,index)=><div key={item.name}><i style={{background:PALETTE[index%PALETTE.length]}}/><span>{item.name}</span><b>{item.value}</b></div>)}</div></div></article>
    </section>

    <section className={styles.previewGate}>
      <div className={styles.lock}><LockKeyhole size={20}/></div><div><span>Visual preview complete</span><h2>The demo helps you see the signals. The paid pilot helps you act on them.</h2><p>Detailed diagnosis, record-level recommendations, action ownership, sharing and outcome tracking are reserved for the guided 14-day pilot. You can begin alone; involve other people only when the decision requires it.</p></div><div className={styles.gateActions}><button className={styles.secondary} onClick={()=>setEmail(true)}><Mail size={15}/> Email visual brief</button><button className={styles.primary} onClick={()=>setPilot(true)}>Explore ₹9,999 pilot <ArrowRight size={15}/></button>{dataMode==='demo'&&<button className={styles.upload} onClick={()=>setShowUpload(true)}><Upload size={15}/> Use my CSV</button>}</div>
    </section>
    <p className={styles.privacy}>Uploaded CSV data stays in this browser session. Emails contain only aggregated visual insights.</p>
    {email&&<EmailDecisionBriefModal onClose={()=>setEmail(false)}/>} {pilot&&<PilotDetailsModal onClose={()=>setPilot(false)}/>} 
  </div>
}