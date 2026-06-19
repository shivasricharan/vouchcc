'use client';

import { useState, useCallback } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { detectColumns, mapRowsToLeads, getMappingConfidence, FIELD_DEFS, detectTemplate } from '@/lib/fieldMapping';
import { TEMPLATES } from '@/lib/leadTypes';
import type { ColumnMap } from '@/lib/fieldMapping';
import type { UniversalLead, TemplateId } from '@/lib/leadTypes';
import { Upload, FileSpreadsheet, CheckCircle2, ArrowRight, Database, Sparkles } from 'lucide-react';

type ParsedRow = Record<string, string>;
type Step = 'select' | 'mapping' | 'preview';

export default function UploadCSVView() {
  const { loadLiveData, loadDemoData, setView, dataMode, fileName: currentFile, mappingConfidence: currentConf, templateId, setTemplateId } = useDashboard();
  const [step, setStep] = useState<Step>('select');
  const [rawRows, setRawRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [colMap, setColMap] = useState<ColumnMap>({});
  const [mapped, setMapped] = useState<UniversalLead[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);

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
        throw new Error('Only CSV and Excel files are supported.');
      }
      if (rows.length === 0) throw new Error('File appears empty.');

      const detected = detectColumns(hdrs);
      setHeaders(hdrs);
      setRawRows(rows);
      setColMap(detected);
      setConfidence(getMappingConfidence(hdrs, detected));
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
    setConfidence(getMappingConfidence(headers, colMap));
    setMapped(result);
    setStep('preview');
  }

  function confirm() {
    loadLiveData(mapped, fileName, confidence);
    setView('dashboard');
  }

  function resetToDemo() {
    loadDemoData();
    setView('dashboard');
  }

  const mappedCount = Object.values(colMap).filter(Boolean).length;

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-th-heading font-bold text-lg">Upload CSV</h2>
        <p className="text-th-muted text-sm mt-0.5">
          Upload any lead, sales, or customer journey CSV. Vouch understands messy columns and maps them into a clean dashboard.
        </p>
      </div>

      {/* Current data status */}
      {dataMode === 'live' && currentFile && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
          <Database size={18} className="text-green-500 shrink-0" />
          <div className="flex-1">
            <div className="text-green-500 font-semibold text-sm">Live data loaded: {currentFile}</div>
            <div className="text-th-muted text-xs mt-0.5">Confidence: {currentConf}% · Template: {TEMPLATES[templateId]?.name || 'Auto'}</div>
          </div>
        </div>
      )}

      {/* Template selector */}
      <div className="bg-th-surface border border-th-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-th-heading text-sm font-semibold">Journey Template</span>
          <span className="text-th-faint text-[10px]">Auto-detected from CSV or select manually</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TEMPLATES) as TemplateId[]).map(id => (
            <button
              key={id}
              onClick={() => setTemplateId(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                templateId === id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-th-hover text-th-body border-th-border hover:border-blue-500/30'
              }`}
            >
              {TEMPLATES[id].name}
            </button>
          ))}
        </div>
      </div>

      {/* Upload area */}
      {step === 'select' && (
        <div className="space-y-4">
          <div
            onDrop={handleDrop} onDragOver={e => e.preventDefault()}
            className="border-2 border-dashed border-th-border rounded-xl p-10 text-center hover:border-blue-500/50 transition-colors cursor-pointer bg-th-hover/50"
            onClick={() => document.getElementById('csv-input')?.click()}
          >
            <Upload size={36} className="mx-auto text-th-muted mb-3" />
            <div className="text-th-heading font-semibold text-sm mb-1">Drop your file here or click to browse</div>
            <div className="text-th-muted text-xs mb-3">Supports .csv, .xlsx, .xls — any lead/sales/customer data</div>
            <div className="text-th-faint text-[10px]">Interior design · SaaS · Agency · Education · Real estate · Healthcare · Events · Consulting · Any service business</div>
            {loading && <div className="text-blue-500 text-xs mt-4 animate-pulse">Parsing file…</div>}
            {error && <div className="text-red-500 text-xs mt-4">{error}</div>}
            <input id="csv-input" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-th-border" />
            <span className="text-th-faint text-xs">or</span>
            <div className="flex-1 h-px bg-th-border" />
          </div>

          <button onClick={resetToDemo} className="w-full py-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 text-sm font-semibold hover:bg-amber-500/20 transition-colors">
            Load Sample Demo Data (Interior Design — 100 leads)
          </button>
        </div>
      )}

      {/* Mapping */}
      {step === 'mapping' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet size={16} className="text-blue-500" />
              <span className="text-blue-500 text-sm font-semibold">Smart CSV Mapping</span>
            </div>
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

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep('select')} className="px-4 py-2 rounded-lg bg-th-hover text-th-body text-sm">Back</button>
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

          <div className="overflow-x-auto rounded-xl border border-th-border">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-th-hover border-b border-th-border">
                  {['ID', 'Client', 'Source', 'Stage', 'Owner', 'Value', 'Days'].map(h => (
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
                    <td className="px-3 py-2 text-th-body">₹{row.value}L</td>
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
              <CheckCircle2 size={14} /> Use This Data — Build My Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
