'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { MappingMeta } from '@/context/DashboardContext';
import { detectColumns, mapRowsToLeads, getMappingConfidence, FIELD_DEFS } from '@/lib/fieldMapping';
import type { ColumnMap } from '@/lib/fieldMapping';
import type { UniversalLead } from '@/lib/leadTypes';
import { Upload, FileSpreadsheet, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';

type ParsedRow = Record<string, string>;
type Step = 'landing' | 'processing' | 'mapping' | 'preview';

const PROCESSING_ITEMS = [
  'Reading data and understanding your pipeline...',
  'Finding follow-up gaps and stuck deals...',
  'Identifying opportunities at risk...',
  'Generating recommendations...',
];

const DATA_SOURCES = [
  { icon: '📊', label: 'CSV / Excel', available: true },
  { icon: '📋', label: 'Google Sheets', available: true },
  { icon: '🔗', label: 'CRM exports', available: true },
  { icon: '💬', label: 'WhatsApp / DMs', available: false },
  { icon: '📧', label: 'Email / Inbox', available: false },
  { icon: '🏢', label: 'Direct CRM sync', available: false },
];

const HERO_NODES = [
  { type: 'SIGNAL',   value: '₹42L',     label: 'Revenue at risk',       sub: '14 deals inactive 7d+',   color: '#ef4444' },
  { type: 'PRIORITY', value: '18 leads',  label: 'Need follow-up now',    sub: 'Top urgency this week',   color: '#f59e0b' },
  { type: 'ACTION',   value: 'Assigned',  label: 'Sales team notified',   sub: 'Due: Thursday',           color: '#3b82f6' },
  { type: 'OUTCOME',  value: '+₹28L',     label: 'Pipeline progressed',   sub: 'Demo projection',         color: '#22c55e' },
];

function HeroCanvas() {
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % HERO_NODES.length), 1700);
    return () => clearInterval(t);
  }, [key]);

  function replay() {
    setActive(0);
    setKey(k => k + 1);
  }

  return (
    <div className="bg-th-surface border border-th-border rounded-2xl p-5 overflow-hidden">
      <div className="text-th-faint text-[10px] font-semibold uppercase tracking-widest mb-4 text-center">
        Sample business · interactive demo
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {HERO_NODES.map((n, i) => {
          const isActive = active === i;
          const isDone   = active > i;
          return (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div
                className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl border transition-all duration-500"
                style={{
                  borderColor: isActive ? n.color + '55' : isDone ? n.color + '25' : 'var(--th-border)',
                  background:  isActive ? n.color + '14' : isDone ? n.color + '08' : 'var(--th-hover)',
                  minWidth: 90,
                  boxShadow: isActive ? `0 0 18px ${n.color}20` : 'none',
                }}
              >
                <div className="text-[8px] font-bold uppercase tracking-widest"
                  style={{ color: isActive ? n.color : 'var(--th-faint)' }}>
                  {n.type}
                </div>
                <div className="font-black text-sm leading-none transition-colors duration-300"
                  style={{ color: isActive ? n.color : isDone ? n.color + 'aa' : 'var(--th-muted)' }}>
                  {n.value}
                </div>
                <div className="text-[9px] leading-tight" style={{ color: 'var(--th-body)' }}>{n.label}</div>
                <div className="text-[8px] leading-tight" style={{ color: 'var(--th-faint)' }}>{n.sub}</div>
              </div>
              {i < HERO_NODES.length - 1 && (
                <div className="shrink-0 flex flex-col items-center gap-0.5">
                  <div className="w-6 h-px" style={{ background: active > i ? HERO_NODES[i].color + '60' : 'var(--th-border)' }} />
                  <span className="text-[10px] transition-colors duration-300"
                    style={{ color: active > i ? HERO_NODES[i].color + 'aa' : 'var(--th-faint)' }}>›</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1.5">
          {HERO_NODES.map((n, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-1 rounded-full transition-all duration-300"
              style={{ width: active === i ? 20 : 6, background: active === i ? n.color : 'var(--th-faint)' }}
              aria-label={`Go to ${n.type}`}
            />
          ))}
        </div>
        <button
          onClick={replay}
          className="text-[10px] text-th-faint hover:text-th-muted transition-colors flex items-center gap-1"
        >
          <span>↺</span> Replay
        </button>
      </div>
    </div>
  );
}

export default function UploadCSVView() {
  const { loadLiveData, loadSampleData, missingFieldsWarning, setShowGuide } = useDashboard();
  const [step, setStep] = useState<Step>('landing');
  const [processingStep, setProcessingStep] = useState(0);
  const [rawRows, setRawRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [colMap, setColMap] = useState<ColumnMap>({});
  const [mapped, setMapped] = useState<UniversalLead[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [sampleDataModule, setSampleDataModule] = useState<typeof import('@/data/sampleData') | null>(null);

  useEffect(() => {
    import('@/data/sampleData').then(mod => setSampleDataModule(mod)).catch(() => {});
  }, []);

  useEffect(() => {
    if (step !== 'processing') return;
    if (processingStep >= PROCESSING_ITEMS.length - 1) {
      const t = setTimeout(() => setStep('mapping'), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProcessingStep(s => s + 1), 450);
    return () => clearTimeout(t);
  }, [step, processingStep]);

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setLoading(true);
    setFileName(file.name);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let rows: ParsedRow[] = [];
      let hdrs: string[] = [];

      if (ext === 'csv') {
        const Papa = (await import('papaparse')).default;
        const text = await file.text();
        const result = Papa.parse<ParsedRow>(text, { header: true, skipEmptyLines: true });
        hdrs = result.meta.fields || [];
        rows = result.data as ParsedRow[];
      } else if (ext === 'xlsx' || ext === 'xls') {
        const XLSX = await import('xlsx');
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const arr = XLSX.utils.sheet_to_json<ParsedRow>(ws, { defval: '' });
        if (arr.length > 0) { hdrs = Object.keys(arr[0]); rows = arr; }
      } else {
        throw new Error('We could not read this file. Please upload a valid CSV file exported from Excel, Google Sheets, or your CRM.');
      }
      if (rows.length === 0) throw new Error('File appears empty. Please check the file and try again.');

      const detected = detectColumns(hdrs);
      setHeaders(hdrs);
      setRawRows(rows);
      setColMap(detected);
      setConfidence(getMappingConfidence(hdrs, detected));
      setProcessingStep(0);
      setStep('processing');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to parse file.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  function loadSample() {
    if (!sampleDataModule) return;
    const leads = sampleDataModule.getSampleLeads('generic');
    if (leads.length > 0) {
      loadSampleData(leads, 'Sample Dataset', 'service');
    }
  }

  function applyMapping() {
    const result = mapRowsToLeads(rawRows, colMap);
    setConfidence(getMappingConfidence(headers, colMap));
    setMapped(result);
    setStep('preview');
  }

  function confirm() {
    const mappedCount = Object.values(colMap).filter(Boolean).length;
    const examples: MappingMeta['examples'] = Object.entries(colMap)
      .filter(([, v]) => v)
      .slice(0, 5)
      .map(([key, csvCol]) => {
        const def = FIELD_DEFS.find(f => f.key === key);
        return { from: csvCol as string, to: def?.label || key };
      })
      .filter(ex => ex.from.toLowerCase() !== ex.to.toLowerCase());

    const meta: MappingMeta = { columns: headers.length, mapped: mappedCount, confidence, examples };
    loadLiveData(mapped, fileName, confidence, meta);
  }

  const mappedCount = Object.values(colMap).filter(Boolean).length;

  return (
    <div className="p-5 max-w-5xl mx-auto space-y-10 pb-12">
      {missingFieldsWarning && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <span className="text-amber-500 text-sm">{missingFieldsWarning}</span>
        </div>
      )}

      {step === 'landing' && (
        <>
          {/* Hero */}
          <div className="text-center pt-10 pb-2 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-soft" />
              Interactive Demo
            </div>
            <h1 className="text-th-heading font-black text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight max-w-3xl mx-auto tracking-tight">
              Turn business signals into decisions that move.
            </h1>
            <p className="text-th-muted text-base max-w-xl mx-auto leading-relaxed mb-8">
              Vouch connects risks, actions and outcomes—then shows how the business responds.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <button
                onClick={loadSample}
                disabled={!sampleDataModule}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
              >
                Explore the living demo <ArrowRight size={14} />
              </button>
              <div
                className="flex items-center gap-2 bg-th-surface border border-th-border hover:border-blue-500/30 text-th-heading font-semibold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
                onClick={() => document.getElementById('csv-input')?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <Upload size={14} className="text-th-muted" /> Upload your data
                {loading && <span className="text-blue-500 text-xs animate-pulse">Parsing…</span>}
              </div>
              <input id="csv-input" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          </div>

          {/* Hero canvas — causal flow animation */}
          <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <HeroCanvas />
          </div>

          {/* Decision Loop */}
          <div className="max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center mb-5">
              <div className="text-th-muted text-xs font-semibold uppercase tracking-widest">How it works</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { step: '01', label: 'Connect data', icon: '📊', color: 'text-blue-400' },
                { step: '02', label: 'Detect priorities', icon: '🔍', color: 'text-violet-400' },
                { step: '03', label: 'Take action', icon: '⚡', color: 'text-amber-400' },
                { step: '04', label: 'Track execution', icon: '✓', color: 'text-green-400' },
                { step: '05', label: 'Measure outcomes', icon: '📈', color: 'text-blue-400' },
                { step: '06', label: 'Decide next', icon: '↻', color: 'text-violet-400' },
              ].map((s, i) => (
                <div key={s.step} className="relative flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: `${0.3 + i * 0.07}s` }}>
                  <div className="w-10 h-10 rounded-xl bg-th-surface border border-th-border flex items-center justify-center text-lg mb-2">
                    {s.icon}
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-wide ${s.color} mb-0.5`}>{s.step}</div>
                  <div className="text-th-body text-[11px] font-medium leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust footer */}
          <div className="text-center text-th-faint text-[10px] pt-4">
            Your data stays in your browser — nothing is stored or sent to a server.
          </div>
        </>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="max-w-sm mx-auto py-20 space-y-6">
          <div className="text-center">
            <div className="text-th-heading font-bold text-base mb-1">Analysing your data…</div>
            <div className="text-th-muted text-xs">{PROCESSING_ITEMS[Math.min(processingStep, PROCESSING_ITEMS.length - 1)]}</div>
          </div>
          <div className="w-full bg-th-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.round(((processingStep + 1) / PROCESSING_ITEMS.length) * 100)}%` }}
            />
          </div>
          <div className="space-y-2">
            {PROCESSING_ITEMS.map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-2.5 transition-all duration-400 ${i <= processingStep ? 'opacity-100' : 'opacity-30'}`}
              >
                <CheckCircle2 size={14} className={i <= processingStep ? 'text-green-500' : 'text-th-faint'} />
                <span className="text-th-body text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mapping */}
      {step === 'mapping' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet size={16} className="text-blue-500" />
              <span className="text-blue-500 text-sm font-semibold">How Vouch Understood Your Data</span>
            </div>
            <p className="text-th-muted text-xs mb-3">
              Vouch automatically standardized similar business fields from your data.
            </p>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: 'Columns detected', value: String(headers.length) },
                { label: 'Fields mapped', value: String(mappedCount) },
                { label: 'Auto-filled', value: String(FIELD_DEFS.length - mappedCount) },
                { label: 'Confidence', value: `${confidence}%` },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-th-heading font-bold text-lg">{s.value}</div>
                  <div className="text-th-muted text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-th-body text-xs"><strong>{rawRows.length} rows</strong> from <strong>{fileName}</strong></div>

          {(confidence < 50 || (mappedCount <= 2 && headers.length > 0)) && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 flex items-start gap-2">
              <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="text-amber-500 text-[11px] leading-relaxed">
                We couldn&apos;t confidently understand some columns. Please review the suggested mappings below.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELD_DEFS.map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-th-muted text-[11px] mb-1 font-medium">
                  {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  value={colMap[key] || ''}
                  onChange={e => setColMap(m => ({ ...m, [key]: e.target.value || undefined }))}
                  className="w-full bg-th-input border border-th-border rounded-lg px-3 py-1.5 text-xs text-th-heading outline-none focus:border-blue-500/50"
                >
                  <option value="">— not mapped —</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="bg-blue-500/8 border border-blue-500/15 rounded-lg px-3 py-2 text-th-body text-[11px] leading-relaxed">
            Vouch automatically maps common column names like Name, Phone, Source, Status, Stage, Date, Follow-up, Value, and Notes.
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep('landing')} className="px-4 py-2 rounded-lg bg-th-hover text-th-body text-sm">Back</button>
            <button disabled={!colMap.client && !colMap.stage} onClick={applyMapping}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
              Preview Data <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <span className="text-green-500 text-xs">
              Mapped <strong>{mapped.length} leads</strong> · Confidence: <strong>{confidence}%</strong>
            </span>
          </div>

          {confidence < 70 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500 shrink-0" />
              <span className="text-amber-500 text-xs">Some fields were missing, so Vouch estimated insights from available columns.</span>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-th-border">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-th-hover border-b border-th-border">
                  {['ID', 'Lead Name', 'Source', 'Stage', 'Assigned To', 'Value', 'Days'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-th-muted font-semibold text-[10px] uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mapped.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b border-th-border hover:bg-th-hover">
                    <td className="px-3 py-2 font-mono text-th-muted">{row.id}</td>
                    <td className="px-3 py-2 text-th-heading">{row.client}</td>
                    <td className="px-3 py-2 text-th-body">{row.source}</td>
                    <td className="px-3 py-2 text-th-body">{row.stage}</td>
                    <td className="px-3 py-2 text-th-body">{row.owner}</td>
                    <td className="px-3 py-2 text-th-body">{row.value > 0 ? `₹${row.value}L` : '—'}</td>
                    <td className="px-3 py-2 text-th-body">{row.daysInStage}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {mapped.length > 10 && <div className="text-th-faint text-xs text-center">+{mapped.length - 10} more rows</div>}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep('mapping')} className="px-4 py-2 rounded-lg bg-th-hover text-th-body text-sm">Back</button>
            <button onClick={confirm} className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 size={14} /> Build My Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
