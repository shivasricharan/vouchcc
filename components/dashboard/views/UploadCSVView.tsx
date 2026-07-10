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
          <div className="text-center pt-8 pb-2">
            <h1 className="text-th-heading font-bold text-3xl sm:text-4xl mb-3 leading-tight max-w-2xl mx-auto">
              See how Vouch turns business data into decisions.
            </h1>
            <p className="text-th-muted text-sm max-w-lg mx-auto leading-relaxed">
              Upload a CSV or explore the sample business to generate insights.
            </p>
          </div>

          {/* Two CTA cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={loadSample}
              disabled={!sampleDataModule}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl p-6 text-left transition-colors group"
            >
              <div className="text-2xl mb-3">📈</div>
              <div className="font-bold text-base mb-1">Explore Sample Demo</div>
              <p className="text-blue-100/80 text-sm leading-relaxed">
                See a real pipeline analysis — insights, follow-up gaps, and next actions — using sample business data.
              </p>
              <div className="mt-4 text-blue-100 text-xs font-semibold flex items-center gap-1">
                Start instantly <ArrowRight size={12} />
              </div>
            </button>

            <div
              className="bg-th-surface border border-th-border rounded-xl p-6 text-left hover:border-blue-500/30 transition-colors cursor-pointer group"
              onClick={() => document.getElementById('csv-input')?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <div className="text-2xl mb-3">📁</div>
              <div className="text-th-heading font-bold text-base mb-1">Upload My CSV</div>
              <p className="text-th-muted text-sm leading-relaxed">
                Bring your own lead sheet, CRM export, or Google Sheet. Vouch maps your columns automatically.
              </p>
              <div className="mt-4 text-blue-500 text-xs font-semibold flex items-center gap-1">
                Drop file or click to browse <ArrowRight size={12} />
              </div>
              {loading && <div className="text-blue-500 text-xs mt-2 animate-pulse">Parsing file…</div>}
              {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
              <input id="csv-input" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          </div>

          {/* Data sources */}
          <div className="max-w-2xl mx-auto">
            <div className="text-th-muted text-xs font-semibold uppercase tracking-wide mb-3">Start with the data you already have.</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {DATA_SOURCES.map(s => (
                <div key={s.label} className={`bg-th-surface border rounded-lg px-2 py-3 text-center ${s.available ? 'border-th-border' : 'border-th-border opacity-50'}`}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-th-body text-[10px] font-medium leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Available today: CSV, Google Sheets, Excel, CRM exports
              </span>
              <span className="flex items-center gap-1.5 text-th-faint">
                <span className="w-1.5 h-1.5 rounded-full bg-th-faint inline-block" />
                Planned: WhatsApp, Email, Direct CRM sync
              </span>
            </div>
          </div>

          <div className="text-center text-th-faint text-[10px] space-y-0.5">
            <div>Your data stays in your browser — nothing is stored or sent to a server.</div>
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
