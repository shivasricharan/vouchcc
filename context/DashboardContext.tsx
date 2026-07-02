'use client';

import { createContext, useContext, useState, useMemo, useCallback, useEffect, type ReactNode } from 'react';
import { computeStats } from '@/lib/computeStats';
import { detectTemplate } from '@/lib/fieldMapping';
import type { UniversalLead, ComputedStats, TemplateId } from '@/lib/leadTypes';

export type ViewId = 'dashboard' | 'upload' | 'guide';

export interface MappingMeta {
  columns: number;
  mapped: number;
  confidence: number;
  examples: { from: string; to: string }[];
}

interface DashboardState {
  view: ViewId;
  setView: (v: ViewId) => void;
  showGuide: boolean;
  setShowGuide: (v: boolean) => void;
  leads: UniversalLead[];
  stats: ComputedStats;
  dataMode: 'demo' | 'live';
  fileName?: string;
  uploadedAt?: Date;
  loadLiveData: (rows: UniversalLead[], fileName: string, confidence: number, meta?: MappingMeta) => void;
  loadSampleData: (leads: UniversalLead[], templateName: string, templateId: TemplateId) => void;
  loadDemoData: () => void;
  showUpload: boolean;
  setShowUpload: (v: boolean) => void;
  templateId: TemplateId;
  setTemplateId: (t: TemplateId) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  mappingConfidence: number;
  mappedFields: number;
  autoFilledFields: number;
  detectedColumns: number;
  missingFieldsWarning: string;
  mappingMeta: MappingMeta | null;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>('upload');
  const [showGuide, setShowGuide] = useState(false);
  const [leads, setLeads] = useState<UniversalLead[]>([]);
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');
  const [fileName, setFileName] = useState<string | undefined>();
  const [uploadedAt, setUploadedAt] = useState<Date | undefined>();
  const [showUpload, setShowUpload] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateId>('auto');
  const [mappingConfidence, setMappingConfidence] = useState(100);
  const [mappedFields, setMappedFields] = useState(0);
  const [autoFilledFields, setAutoFilledFields] = useState(0);
  const [detectedColumns, setDetectedColumns] = useState(0);
  const [missingFieldsWarning, setMissingFieldsWarning] = useState('');
  const [mappingMeta, setMappingMeta] = useState<MappingMeta | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('vouch-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('vouch-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const stats = useMemo(() => computeStats(leads, templateId), [leads, templateId]);

  const loadLiveData = useCallback((rows: UniversalLead[], name: string, confidence: number, meta?: MappingMeta) => {
    setLeads(rows);
    setDataMode('live');
    setFileName(name);
    setUploadedAt(new Date());
    setShowUpload(false);
    setMappingConfidence(confidence);
    setMappingMeta(meta ?? null);
    setView('dashboard');

    const hasEmptyFields = rows.some(r => r.client === `Lead 1` || r.stage === 'New Inquiry');
    if (confidence < 70 || hasEmptyFields) {
      setMissingFieldsWarning('Some fields were missing, so Vouch estimated insights from available columns.');
    } else {
      setMissingFieldsWarning('');
    }

    const detected = detectTemplate(rows);
    setTemplateId(detected);
  }, []);

  const loadSampleData = useCallback((sampleLeads: UniversalLead[], templateName: string, tid: TemplateId) => {
    setLeads(sampleLeads);
    setDataMode('demo');
    setFileName(templateName);
    setUploadedAt(undefined);
    setTemplateId(tid);
    setMappingConfidence(100);
    setMappingMeta(null);
    setMissingFieldsWarning('');
    setView('dashboard');
  }, []);

  const loadDemoData = useCallback(() => {
    setLeads([]);
    setDataMode('demo');
    setFileName(undefined);
    setUploadedAt(undefined);
    setTemplateId('auto');
    setMappingConfidence(100);
    setMappedFields(0);
    setAutoFilledFields(0);
    setDetectedColumns(0);
    setMissingFieldsWarning('');
    setMappingMeta(null);
    setView('upload');
  }, []);

  return (
    <DashboardContext.Provider value={{
      view, setView,
      showGuide, setShowGuide,
      leads, stats,
      dataMode, fileName, uploadedAt,
      loadLiveData, loadSampleData, loadDemoData,
      showUpload, setShowUpload,
      templateId, setTemplateId,
      theme, toggleTheme,
      mappingConfidence, mappedFields, autoFilledFields, detectedColumns,
      missingFieldsWarning,
      mappingMeta,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
