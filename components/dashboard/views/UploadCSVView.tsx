'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { MappingMeta } from '@/context/DashboardContext';
import { detectColumns, mapRowsToLeads, getMappingConfidence, FIELD_DEFS } from '@/lib/fieldMapping';
import type { ColumnMap } from '@/lib/fieldMapping';
import type { UniversalLead } from '@/lib/leadTypes';
import { Upload, FileSpreadsheet, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';

function GithubIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

type ParsedRow = Record<string, string>;
type Step = 'landing' | 'processing' | 'mapping' | 'preview';

const WORKS_WITH = ['CRM exports', 'Website enquiries', 'Google Sheets', 'Excel', 'ERP exports', 'Lead sheets', 'Sales reports', 'Any structured CSV'];

const PROCESSING_ITEMS = [
  'Understanding your data...',
  'Mapping business fields...',
  'Calculating Opportunity Score...',
  'Generating Vouch Insights...',
  'Preparing Suggested Actions...',
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
          <div className="text-center pt-6">
            <h1 className="text-th-heading font-bold text-3xl sm:text-4xl mb-3 leading-tight max-w-2xl mx-auto">
              Vouch Opportunity Analyzer
            </h1>
            <p className="text-th-body text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-4">
              Upload your business data to discover missed revenue opportunities, follow-up gaps and where your business needs attention.
            </p>
            <p className="text-th-muted text-xs max-w-md mx-auto leading-relaxed mb-7">
              Don&apos;t worry if your data looks different. Vouch automatically understands common business fields and standardizes your data before analysis.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
              <button
                onClick={() => document.getElementById('csv-input')?.click()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload size={16} /> Upload CSV
              </button>
              <button
                onClick={loadSample}
                disabled={!sampleDataModule}
                className="bg-th-hover border border-th-border text-th-body hover:text-th-heading text-sm font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Try Sample Dataset
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap text-xs">
              <button
                onClick={() => setShowGuide(true)}
                className="text-th-muted hover:text-th-heading transition-colors"
              >
                How it Works
              </button>
              <span className="text-th-faint/40">·</span>
              <a
                href="https://github.com/yourvouch/vouch-starter-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-th-muted hover:text-th-heading transition-colors"
              >
                <GithubIcon size={12} /> Open Source on GitHub
              </a>
            </div>
          </div>

          {/* Works with */}
          <div>
            <div className="text-center text-th-muted text-xs font-semibold uppercase tracking-wide mb-3">Works with</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto">
              {WORKS_WITH.map(w => (
                <div key={w} className="bg-th-surface border border-th-border rounded-lg px-3 py-3 text-center text-th-body text-xs font-medium">
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Use It Your Way */}
          <div>
            <div className="text-center text-th-muted text-xs font-semibold uppercase tracking-wide mb-3">Use It Your Way</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-th-surface border border-th-border rounded-xl p-5">
                <div className="text-th-heading font-semibold text-sm mb-1">Try the Live Demo</div>
                <p className="text-th-muted text-xs leading-relaxed mb-3">
                  Upload any business CSV and get an Opportunity Score, Vouch Insights, and Suggested Actions — instantly, in your browser.
                </p>
                <button
                  onClick={() => document.getElementById('csv-input')?.click()}
                  className="text-blue-500 hover:text-blue-400 text-xs font-medium transition-colors"
                >
                  Upload your data →
                </button>
              </div>
              <div className="bg-th-surface border border-th-border rounded-xl p-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <GithubIcon size={13} className="text-th-heading" />
                  <div className="text-th-heading font-semibold text-sm">Use the Open-Source Starter Kit</div>
                </div>
                <p className="text-th-muted text-xs leading-relaxed mb-3">
                  The Vouch Starter Kit is open source. Fork it, customise the scoring logic, and deploy your own version for your business.
                </p>
                <a
                  href="https://github.com/yourvouch/vouch-starter-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400 text-xs font-medium transition-colors"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>

          {/* Upload dropzone */}
          <div className="bg-th-surface border border-th-border rounded-xl p-6 max-w-xl mx-auto w-full">
            <div
              onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-th-border rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer bg-th-hover/30"
              onClick={() => document.getElementById('csv-input')?.click()}
            >
              <Upload size={28} className="mx-auto text-th-muted mb-3" />
              <div className="text-th-heading font-semibold text-sm mb-1">Drop your file here or click to browse</div>
              <div className="text-th-muted text-xs mb-2">Supports .csv, .xlsx, .xls</div>
              <div className="text-th-faint text-[10px]">Your data never leaves your browser</div>
              {loading && <div className="text-blue-500 text-xs mt-3 animate-pulse">Parsing file…</div>}
              {error && <div className="text-red-500 text-xs mt-3">{error}</div>}
              <input id="csv-input" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-th-muted text-[11px] flex-wrap text-center">
              <span>Not sure what to upload? Use any lead sheet, CRM export, or Google Sheet CSV.</span>
              <button onClick={() => setShowGuide(true)} className="text-blue-500 hover:text-blue-400 font-medium whitespace-nowrap transition-colors">
                How it Works
              </button>
            </div>
          </div>

          {/* Opportunity Audit CTA */}
          <div className="bg-th-surface border border-blue-500/15 rounded-xl p-6 text-center">
            <div className="text-th-heading font-bold text-sm mb-1">Ready to discover opportunities in your business?</div>
            <p className="text-th-muted text-xs mb-3 max-w-md mx-auto">
              Start with a free Opportunity Audit. Share a CSV, Google Sheet, or business data and Vouch will show where opportunities need attention.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="https://yourvouch.com/#audit" target="_blank" rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                Start Opportunity Audit
              </a>
              <a href="https://yourvouch.com" target="_blank" rel="noopener noreferrer"
                className="text-th-muted hover:text-th-heading text-xs transition-colors">
                Visit Vouch
              </a>
            </div>
          </div>

          <div className="text-center text-th-faint text-[10px] space-y-0.5">
            <div>Your uploaded data stays private during this session.</div>
            <div>For best results, upload sample or non-sensitive business data.</div>
          </div>
        </>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          {PROCESSING_ITEMS.map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-3 justify-center transition-all duration-500 ease-out ${i <= processingStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'}`}
            >
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              <span className="text-th-heading text-sm font-medium">{item}</span>
            </div>
          ))}
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
