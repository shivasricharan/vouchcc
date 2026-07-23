'use client';

import { useState, useCallback } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import type { MappingMeta } from '@/context/DashboardContext';
import { detectColumns, mapRowsToLeads, getMappingConfidence, FIELD_DEFS } from '@/lib/fieldMapping';
import type { ColumnMap } from '@/lib/fieldMapping';
import type { UniversalLead } from '@/lib/leadTypes';
import { Upload, FileSpreadsheet, CheckCircle2, ArrowRight, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

type ParsedRow = Record<string, string>;
type Step = 'select' | 'mapping' | 'preview';

const CORE_KEYS: (keyof ColumnMap)[] = ['client', 'stage', 'owner', 'lastContacted', 'nextAction', 'value'];
const CORE_LABELS: Partial<Record<keyof ColumnMap, string>> = {
  client: 'Business item / customer',
  stage: 'Current stage or status',
  owner: 'Current owner',
  lastContacted: 'Last activity date',
  nextAction: 'Next action',
  value: 'Value or amount',
};

export default function UploadModal() {
  const { setShowUpload, loadLiveData, loadDemoData, setView } = useDashboard();
  const [step, setStep] = useState<Step>('select');
  const [rawRows, setRawRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [colMap, setColMap] = useState<ColumnMap>({});
  const [mapped, setMapped] = useState<UniversalLead[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        if (arr.length > 0) {
          hdrs = Object.keys(arr[0]);
          rows = arr;
        }
      } else {
        throw new Error('Only CSV and Excel (.xlsx, .xls) files are supported.');
      }

      if (rows.length === 0) throw new Error('File appears empty — no data rows found.');

      const detected = detectColumns(hdrs);
      const conf = getMappingConfidence(hdrs, detected);
      setHeaders(hdrs);
      setRawRows(rows);
      setColMap(detected);
      setConfidence(conf);
      setShowAdvanced(false);
      setStep('mapping');
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

  function applyMapping() {
    const result = mapRowsToLeads(rawRows, colMap);
    const conf = getMappingConfidence(headers, colMap);
    setConfidence(conf);
    setMapped(result);
    setStep('preview');
  }

  function confirm() {
    const mappedCount = Object.values(colMap).filter(Boolean).length;
    const examples: MappingMeta['examples'] = Object.entries(colMap)
      .filter(([, value]) => value)
      .slice(0, 5)
      .map(([key, csvColumn]) => {
        const definition = FIELD_DEFS.find(field => field.key === key);
        return { from: csvColumn as string, to: definition?.label || key };
      })
      .filter(example => example.from.toLowerCase() !== example.to.toLowerCase());

    loadLiveData(mapped, fileName, confidence, {
      columns: headers.length,
      mapped: mappedCount,
      confidence,
      examples,
    });
    setView('dashboard');
  }

  function resetToDemo() {
    loadDemoData();
    setShowUpload(false);
  }

  function close() {
    setShowUpload(false);
  }

  const mappedCount = Object.values(colMap).filter(Boolean).length;
  const coreMapped = CORE_KEYS.filter(key => Boolean(colMap[key])).length;
  const coreDefs = CORE_KEYS.map(key => FIELD_DEFS.find(def => def.key === key)).filter(Boolean) as typeof FIELD_DEFS;
  const advancedDefs = FIELD_DEFS.filter(def => !CORE_KEYS.includes(def.key));

  const renderField = ({ key, label, required }: (typeof FIELD_DEFS)[number], compact = false) => (
    <div key={key}>
      <label className="block text-th-muted text-[11px] mb-1 font-medium">
        {CORE_LABELS[key] || label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={colMap[key] || ''}
        onChange={e => setColMap(m => ({ ...m, [key]: e.target.value || undefined }))}
        className={`w-full bg-th-input border border-th-border rounded-lg px-3 text-xs text-th-heading outline-none focus:border-blue-500/50 ${compact ? 'py-1.5' : 'py-2.5'}`}
      >
        <option value="">— not available —</option>
        {headers.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="bg-th-surface border border-th-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="upload-dialog-title">
        <div className="flex items-center justify-between px-6 py-4 border-b border-th-border">
          <div>
            <div id="upload-dialog-title" className="text-th-heading font-bold text-base">Upload business data</div>
            <div className="text-th-muted text-xs mt-0.5">CSV or Excel · your data stays in your browser</div>
          </div>
          <button onClick={close} className="text-th-muted hover:text-th-heading transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Close upload dialog">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed border-th-border rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload size={32} className="mx-auto text-th-muted mb-3" />
                <div className="text-th-heading font-semibold text-sm mb-1">Drop your file here or click to browse</div>
                <div className="text-th-muted text-xs">Supports .csv, .xlsx and .xls</div>
                {loading && <div className="text-blue-500 text-xs mt-3 animate-pulse">Reading your file…</div>}
                {error && <div className="text-red-500 text-xs mt-3">{error}</div>}
                <input id="file-input" type="file" accept=".csv,.xlsx,.xls" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-th-border" />
                <span className="text-th-faint text-xs">or</span>
                <div className="flex-1 h-px bg-th-border" />
              </div>

              <button onClick={resetToDemo} className="w-full py-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 text-sm font-semibold hover:bg-amber-500/20 transition-colors">
                Explore Sample Business
              </button>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-5">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-blue-500" />
                  <span className="text-blue-500 text-sm font-semibold">Your file is ready</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><div className="text-th-heading font-bold text-xl">{rawRows.length}</div><div className="text-th-muted text-[10px]">rows found</div></div>
                  <div><div className="text-th-heading font-bold text-xl">{coreMapped}/6</div><div className="text-th-muted text-[10px]">essentials matched</div></div>
                  <div><div className="text-th-heading font-bold text-xl">{confidence}%</div><div className="text-th-muted text-[10px]">mapping confidence</div></div>
                </div>
              </div>

              <div>
                <div className="text-th-heading text-sm font-semibold">Confirm only the essentials</div>
                <p className="text-th-muted text-xs mt-1">Vouch detected the fields below. Missing optional fields will be inferred or left blank.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coreDefs.map(def => renderField(def))}
              </div>

              <button type="button" onClick={() => setShowAdvanced(value => !value)} className="w-full flex items-center justify-between rounded-lg border border-th-border bg-th-hover/40 px-4 py-3 text-xs text-th-body hover:bg-th-hover transition-colors">
                <span>More fields <span className="text-th-muted">({Math.max(0, mappedCount - coreMapped)} detected)</span></span>
                {showAdvanced ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-th-border p-4 bg-th-hover/20">
                  {advancedDefs.map(def => renderField(def, true))}
                </div>
              )}

              {colMap.value && (
                <div className="rounded-lg border border-th-border bg-th-hover px-3 py-2 text-[11px] text-th-muted">
                  Values from <strong className="text-th-body">{colMap.value}</strong> will be normalized to Indian ₹ lakh where applicable.
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep('select')} className="px-4 py-2.5 rounded-lg bg-th-hover text-th-body text-sm hover:bg-th-input transition-colors">Back</button>
                <button disabled={!colMap.client && !colMap.stage} onClick={applyMapping}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                  Continue to preview <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                <span className="text-green-500 text-xs">
                  <strong>{mapped.length} rows</strong> are ready. Showing a quick preview.
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-th-border">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-th-hover border-b border-th-border">
                      {['Item', 'Stage', 'Owner', 'Value', 'Days'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-th-muted font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mapped.slice(0, 8).map((row, i) => (
                      <tr key={i} className="border-b border-th-border hover:bg-th-hover">
                        <td className="px-3 py-2 text-th-heading whitespace-nowrap">{row.client}</td>
                        <td className="px-3 py-2 text-th-body whitespace-nowrap">{row.stage}</td>
                        <td className="px-3 py-2 text-th-body whitespace-nowrap">{row.owner}</td>
                        <td className="px-3 py-2 text-th-body whitespace-nowrap">₹{row.value}L</td>
                        <td className="px-3 py-2 text-th-body whitespace-nowrap">{row.daysInStage}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {mapped.length > 8 && <div className="text-th-faint text-xs text-center">+{mapped.length - 8} more rows</div>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('mapping')} className="px-4 py-2 rounded-lg bg-th-hover text-th-body text-sm hover:bg-th-input transition-colors">Back</button>
                <button onClick={confirm} className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} /> Show what needs attention
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}