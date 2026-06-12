'use client';

import { useState, useCallback } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { detectColumns, mapRowsToLeads } from '@/lib/fieldMapping';
import type { ColumnMap } from '@/lib/fieldMapping';
import type { UniversalLead } from '@/lib/leadTypes';

type ParsedRow = Record<string, string>;

type Step = 'select' | 'mapping' | 'preview' | 'done';

export default function UploadModal() {
  const { setShowUpload, loadLiveData, loadDemoData } = useDashboard();
  const [step, setStep] = useState<Step>('select');
  const [rawRows, setRawRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [colMap, setColMap] = useState<ColumnMap>({});
  const [mapped, setMapped] = useState<UniversalLead[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setHeaders(hdrs);
      setRawRows(rows);
      setColMap(detected);
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
    setMapped(result);
    setStep('preview');
  }

  function confirm() {
    loadLiveData(mapped, fileName);
  }

  function resetToDemo() {
    loadDemoData();
    setShowUpload(false);
  }

  const FIELD_LABELS: { key: keyof ColumnMap; label: string; required?: boolean }[] = [
    { key: 'client',       label: 'Client Name', required: true },
    { key: 'stage',        label: 'Stage / Status', required: true },
    { key: 'source',       label: 'Lead Source' },
    { key: 'owner',        label: 'Assigned To' },
    { key: 'value',        label: 'Deal Value (₹L)' },
    { key: 'location',     label: 'Location / City' },
    { key: 'requirement',  label: 'Requirement / Project' },
    { key: 'daysInStage',  label: 'Days in Stage' },
    { key: 'lastContacted',label: 'Last Contacted' },
    { key: 'nextAction',   label: 'Next Action' },
    { key: 'id',           label: 'Lead ID' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d1530] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <div className="text-white font-bold text-base">Upload Your Lead Data</div>
            <div className="text-slate-500 text-xs mt-0.5">CSV or Excel · your data never leaves your browser</div>
          </div>
          <button onClick={() => setShowUpload(false)} className="text-slate-500 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        <div className="p-6">
          {/* ── Step 1: File Select ── */}
          {step === 'select' && (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="text-3xl mb-3">📂</div>
                <div className="text-white font-semibold text-sm mb-1">Drop your file here or click to browse</div>
                <div className="text-slate-500 text-xs">Supports .csv, .xlsx, .xls</div>
                {loading && <div className="text-blue-400 text-xs mt-3 animate-pulse">Parsing file…</div>}
                {error && <div className="text-red-400 text-xs mt-3">{error}</div>}
                <input
                  id="file-input"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-slate-600 text-xs">or</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <button
                onClick={resetToDemo}
                className="w-full py-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-colors"
              >
                Load Demo Data (DzineHome — 100 leads)
              </button>
            </div>
          )}

          {/* ── Step 2: Column Mapping ── */}
          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2.5 text-blue-300 text-xs">
                We detected <strong>{rawRows.length} rows</strong> from <strong>{fileName}</strong>. Map your columns below.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FIELD_LABELS.map(({ key, label, required }) => (
                  <div key={key}>
                    <label className="block text-slate-400 text-[11px] mb-1 font-medium">
                      {label}{required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <select
                      value={colMap[key] || ''}
                      onChange={(e) => setColMap((m) => ({ ...m, [key]: e.target.value || undefined }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500/50"
                    >
                      <option value="">— not mapped —</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('select')}
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  disabled={!colMap.client && !colMap.stage}
                  onClick={applyMapping}
                  className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Preview Data →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Preview ── */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5 text-green-300 text-xs">
                Mapped <strong>{mapped.length} leads</strong> from {fileName}. Showing first 10 rows.
              </div>

              <div className="overflow-x-auto rounded-lg border border-white/8">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/8">
                      {['ID', 'Client', 'Source', 'Stage', 'Owner', 'Value', 'Days'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-slate-500 font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mapped.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap">{row.id}</td>
                        <td className="px-3 py-2 text-white whitespace-nowrap">{row.client}</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{row.source}</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{row.stage}</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{row.owner}</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">₹{row.value}L</td>
                        <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{row.daysInStage}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {mapped.length > 10 && (
                <div className="text-slate-600 text-xs text-center">+{mapped.length - 10} more rows not shown</div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep('mapping')}
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={confirm}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors"
                >
                  Use This Data — Build My Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
