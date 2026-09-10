'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './QuickDemo.module.css';

type DemoKind = 'problem' | 'data';
type Row = Record<string, string>;

function Shell({ children, label }: { children: React.ReactNode; label: string }) {
  return <main className={styles.page}><header className={styles.header}>
    <Link href="https://yourvouch.com" className={styles.brand}>Vouch</Link>
    <nav><Link href="/" className={label === 'Problem Lab' ? styles.current : ''}>Problem Lab</Link><Link href="/data-lab" className={label === 'Data Lab' ? styles.current : ''}>Data Lab</Link></nav>
  </header>{children}</main>;
}

function ProblemLab() {
  const [stage, setStage] = useState('After a quote');
  const [pattern, setPattern] = useState('Customers go quiet');
  const [owner, setOwner] = useState('It is unclear');
  const [shown, setShown] = useState(false);
  const finding = stage === 'After a quote' ? 'The journey is most likely slowing after the quote.' : `The journey needs a clearer next step at ${stage.toLowerCase()}.`;
  return <Shell label="Problem Lab"><section className={styles.hero}><h1>Trace one customer journey.</h1><p>Answer three quick questions. Vouch will turn the pattern into a working question to test.</p></section>
    <section className={styles.problemGrid}><form className={styles.trace} onSubmit={e => { e.preventDefault(); setShown(true); }}>
      <Field label="Where does progress usually slow down?" value={stage} setValue={setStage} options={['After an enquiry','After a quote','During handover']} />
      <Field label="What do you notice?" value={pattern} setValue={setPattern} options={['Customers go quiet','Details get lost','The founder keeps chasing']} />
      <Field label="Who takes the next action?" value={owner} setValue={setOwner} options={['One named person','It is unclear','Different people each time']} />
      <button className={styles.primary} type="submit">Show the working question</button>
    </form>
    <aside className={styles.result} aria-live="polite"><p className={styles.resultLabel}>A possible place to start</p>
      {shown ? <><h2>{finding}</h2><dl><div><dt>Pattern</dt><dd>{pattern}</dd></div><div><dt>Working question</dt><dd>How can we make the next action clear when {owner.toLowerCase()}?</dd></div></dl><p className={styles.test}>Try this: agree one owner and one follow-up moment for the next seven days.</p></> : <><h2>Your result will appear here.</h2><p>There is no diagnosis yet—only a small hypothesis to test with your team.</p></>}
    </aside></section>
    <Footer cta="Bring the problem you keep coming back to." /></Shell>;
}

function Field({label,value,setValue,options}:{label:string;value:string;setValue:(value:string)=>void;options:string[]}) {
 return <fieldset className={styles.field}><legend>{label}</legend>{options.map(option => <label key={option}><input type="radio" checked={value===option} onChange={() => setValue(option)} />{option}</label>)}</fieldset>;
}

function parseCsv(text:string): Row[] {
  const lines=text.trim().split(/\r?\n/).filter(Boolean); if(lines.length<2) return [];
  const split=(line:string) => line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(cell=>cell.replace(/^"|"$/g,'').trim()) || [];
  const headers=split(lines[0]); return lines.slice(1).map(line=>{const cells=split(line);return Object.fromEntries(headers.map((h,i)=>[h,cells[i]||'']));});
}
function matchHeader(headers:string[], words:string[]) { return headers.find(h=>words.some(word=>h.toLowerCase().includes(word))) || ''; }
function DataLab() {
 const [rows,setRows]=useState<Row[]>([]); const [fileName,setFileName]=useState(''); const [error,setError]=useState('');
 const headers=useMemo(()=>rows[0]?Object.keys(rows[0]):[],[rows]);
 const [mapping,setMapping]=useState({stage:'',last:'',owner:'',next:''});
 const mapped={...mapping,stage:mapping.stage||matchHeader(headers,['stage','status']),last:mapping.last||matchHeader(headers,['last','date','activity']),owner:mapping.owner||matchHeader(headers,['owner','assignee']),next:mapping.next||matchHeader(headers,['next','follow'])};
 const onFile=(event:ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];if(!file)return; if(!file.name.toLowerCase().endsWith('.csv')){setError('Please choose a CSV file.');return;}const reader=new FileReader();reader.onload=()=>{const parsed=parseCsv(String(reader.result));if(!parsed.length){setError('This file needs a header row and at least one record.');return;}setRows(parsed);setFileName(file.name);setError('');setMapping({stage:matchHeader(Object.keys(parsed[0]),['stage','status']),last:matchHeader(Object.keys(parsed[0]),['last','date','activity']),owner:matchHeader(Object.keys(parsed[0]),['owner','assignee']),next:matchHeader(Object.keys(parsed[0]),['next','follow'])});};reader.readAsText(file);};
 const gaps=useMemo(()=>{if(!rows.length)return null;const missingNext=mapped.next?rows.filter(r=>!r[mapped.next]?.trim()):[];const missingOwner=mapped.owner?rows.filter(r=>!r[mapped.owner]?.trim()):[];const stalled=mapped.stage?rows.filter(r=>/quote|proposal|follow|pending|open/i.test(r[mapped.stage]||'')):[];return {missingNext,missingOwner,stalled};},[rows,mapped]);
 return <Shell label="Data Lab"><section className={styles.hero}><h1>See what your existing data is missing.</h1><p>Upload a CSV from a spreadsheet or CRM export. Vouch checks it locally in your browser; your file is not sent anywhere.</p></section>
 <section className={styles.dataGrid}><section className={styles.uploader}><label className={styles.drop}><input type="file" accept=".csv,text/csv" onChange={onFile}/><strong>{fileName || 'Choose a CSV file'}</strong><span>{fileName ? `${rows.length} records ready to inspect` : 'Enquiry, lead, CRM or spreadsheet export'}</span></label>{error && <p className={styles.error}>{error}</p>}
 {headers.length>0 && <div className={styles.mapping}><h2>Check the columns</h2><p>These mappings stay in this browser tab.</p>{(['stage','last','owner','next'] as const).map(key=><label key={key}>{({stage:'Status or stage',last:'Last activity',owner:'Owner',next:'Next step'}[key])}<select value={mapping[key]} onChange={e=>setMapping({...mapping,[key]:e.target.value})}><option value="">Not available</option>{headers.map(h=><option value={h} key={h}>{h}</option>)}</select></label>)}</div>}</section>
 <aside className={styles.result} aria-live="polite"><p className={styles.resultLabel}>What Vouch found</p>{gaps?<><h2>Start with the gaps that keep work waiting.</h2><div className={styles.findings}><Finding count={gaps.stalled.length} label="records at an open or waiting stage" /><Finding count={gaps.missingNext.length} label="records without a next step" /><Finding count={gaps.missingOwner.length} label="records without an owner" /></div><p className={styles.test}>Smallest useful fix: review the flagged cases and agree one owner plus one next action.</p></>:<><h2>Your quick gap report will appear here.</h2><p>For the clearest result, include a status, owner, next step or last activity column.</p></>}</aside></section>
 <Footer cta="Want help turning the pattern into a workable change?" /></Shell>;
}
function Finding({count,label}:{count:number;label:string}){return <div><b>{count}</b><span>{label}</span></div>;}
function Footer({cta}:{cta:string}){return <footer className={styles.footer}><p>{cta}</p><Link href="https://yourvouch.com/contact" className={styles.primary}>Talk to Shiva</Link></footer>;}
export default function QuickDemo({kind}:{kind:DemoKind}){return kind==='data'?<DataLab/>:<ProblemLab/>;}
