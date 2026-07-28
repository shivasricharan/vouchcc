'use client';

import { useMemo, useState } from 'react';
import styles from './JourneyTrace.module.css';

type AnswerMap = Record<string,string>;

const questions=[
  {id:'business',title:'What type of business do you run?',options:['Interiors or architecture','Agency or professional service','Clinic or wellness','Education or training','Real estate','Retail or local business','Other']},
  {id:'source',title:'Where do most customer enquiries arrive?',options:['WhatsApp','Phone calls','Meta or Instagram','Website','Referrals','Walk-ins','Multiple sources']},
  {id:'responder',title:'Who usually responds first?',options:['Owner','Salesperson','Reception or support','Multiple team members','No fixed person']},
  {id:'next',title:'What usually needs to happen after the first conversation?',options:['Follow-up call','Meeting or consultation','Site visit','Requirement collection','Quotation or proposal','Demo','Payment','Other']},
  {id:'record',title:'Where is that next step recorded?',options:['WhatsApp chat','Individual notebook','Spreadsheet','CRM','Team group','It depends on the person','It is not consistently recorded']},
  {id:'owner',title:'Who checks whether the next step happened?',options:['Owner','Team manager','Assigned employee','Customer reminds us','Discussed during meetings','No one consistently checks']},
  {id:'break',title:'Where do customers most often slow down or disappear?',options:['After the first enquiry','Before a meeting or visit','After requirements are discussed','After quotation','Before payment','During delivery or execution','We do not know']},
  {id:'visibility',title:'When does the owner usually learn that something is stuck?',options:['Immediately','At the end of the day','During a weekly review','When the customer complains','When someone manually checks','Often too late']},
];

function diagnose(a:AnswerMap){
  if(a.owner==='No one consistently checks'||a.record==='It is not consistently recorded'||a.record==='It depends on the person')return {title:'Next actions depend on individual memory',type:'Follow-up gap',why:'A next step may be promised, but it is not consistently visible with one owner and due date.',experiment:'For seven days, record every promised customer action in one shared view with: customer, next action, owner, due date and status.'};
  if(a.responder==='Multiple team members'||a.responder==='No fixed person')return {title:'The first response has no clear owner',type:'Response gap',why:'Enquiries may be seen by several people without one person being accountable for moving the customer forward.',experiment:'For seven days, assign every new enquiry to one named person within 15 minutes and record the first response time.'};
  if(a.break==='After requirements are discussed'||a.break==='During delivery or execution')return {title:'Customer context may be getting lost during handover',type:'Context gap',why:'Requirements are discussed, but the next team may not receive the complete context or latest customer expectation.',experiment:'For seven days, use one handover note containing requirement, promise, owner and next milestone before work changes hands.'};
  if(a.break==='After quotation')return {title:'The quotation is being treated as the end of the process',type:'Decision gap',why:'A proposal may be sent without agreeing when and how the next decision conversation will happen.',experiment:'For seven days, every quotation must include a confirmed follow-up date and the person responsible for that conversation.'};
  if(a.visibility==='Often too late'||a.visibility==='When the customer complains'||a.visibility==='During a weekly review')return {title:'The owner sees stalled journeys too late',type:'Visibility gap',why:'Work may be happening, but exceptions become visible only after delay, escalation or customer frustration.',experiment:'For seven days, review only three exceptions each morning: overdue next steps, unowned actions and customers waiting longest.'};
  return {title:'The next customer action is not consistently closed',type:'Ownership gap',why:'The journey has activity, but responsibility and completion are not always visible from one step to the next.',experiment:'For seven days, close every customer interaction by recording one next action, one owner and one due date.'};
}

export default function JourneyTrace(){
  const [step,setStep]=useState(-1);
  const [answers,setAnswers]=useState<AnswerMap>({});
  const result=useMemo(()=>diagnose(answers),[answers]);
  const choose=(value:string)=>{const q=questions[step];setAnswers(a=>({...a,[q.id]:value}));setTimeout(()=>setStep(s=>s+1),120)};
  const restart=()=>{setAnswers({});setStep(0)};

  if(step===-1)return <main className={styles.shell}><header><a href="https://yourvouch.com">Vouch</a><a href="/data-lab">I already have enquiry data</a></header><section className={styles.intro}><div><h1>Trace where your customer journey may be breaking.</h1><p>Answer a few questions about what happens after a customer enquires. Vouch will identify a possible break point and suggest one experiment to test.</p><button onClick={()=>setStep(0)}>Start tracing →</button><small>No signup required. Takes about 60–90 seconds.</small></div><div className={styles.preview}>{['Enquiry arrives','Someone responds','A next step is promised','The journey slows down','The owner learns later'].map((x,i)=><div key={x}><span>0{i+1}</span><b>{x}</b>{i===3&&<em>Possible break</em>}</div>)}</div></section></main>;

  if(step<questions.length){const q=questions[step];return <main className={styles.shell}><header><a href="https://yourvouch.com">Vouch</a><span>{step+1} of {questions.length}</span></header><section className={styles.question}><div className={styles.progress}><i style={{width:`${((step+1)/questions.length)*100}%`}}/></div><p>Customer journey trace</p><h1>{q.title}</h1><div className={styles.options}>{q.options.map(option=><button key={option} className={answers[q.id]===option?styles.selected:''} onClick={()=>choose(option)}>{option}<span>→</span></button>)}</div>{step>0&&<button className={styles.back} onClick={()=>setStep(s=>s-1)}>← Back</button>}</section></main>}

  return <main className={styles.shell}><header><a href="https://yourvouch.com">Vouch</a><a href="/data-lab">Open Data Lab</a></header><section className={styles.result}><div className={styles.resultTop}><span>{result.type}</span><h1>{result.title}</h1><p>This is an indicative result based on your answers—not a final diagnosis.</p></div><div className={styles.resultGrid}><article><small>What may be happening</small><p>{result.why}</p><ul><li>A customer interaction happens.</li><li>A next step is expected.</li><li>Ownership or visibility weakens.</li><li>The delay is discovered after momentum drops.</li></ul></article><article className={styles.experiment}><small>One experiment to test</small><h2>{result.experiment}</h2><p>Observe whether fewer customer actions become overdue and whether the owner can see problems earlier.</p></article></div><div className={styles.resultActions}><a href="mailto:shiva@yourvouch.com?subject=Discuss%20my%20Vouch%20break%20point">Discuss this break point →</a><button onClick={restart}>Trace another journey</button></div></section></main>;
}
