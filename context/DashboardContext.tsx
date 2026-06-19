'use client';

import { createContext, useContext, useState, useMemo, useCallback, useEffect, type ReactNode } from 'react';
import { leads as demoLeads } from '@/data/dzinehome';
import { computeStats } from '@/lib/computeStats';
import { detectTemplate } from '@/lib/fieldMapping';
import type { UniversalLead, ComputedStats, TemplateId } from '@/lib/leadTypes';

export type ViewId = 'dashboard' | 'upload' | 'leads' | 'funnel' | 'teams' | 'insights' | 'settings' | 'guide';

interface DashboardState {
  view: ViewId;
  setView: (v: ViewId) => void;
  leads: UniversalLead[];
  stats: ComputedStats;
  dataMode: 'demo' | 'live';
  fileName?: string;
  uploadedAt?: Date;
  loadLiveData: (rows: UniversalLead[], fileName: string, confidence: number) => void;
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
}

const DashboardContext = createContext<DashboardState | null>(null);

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}

const DEMO_LEADS: UniversalLead[] = (demoLeads as unknown as UniversalLead[]).map(l => ({
  ...l,
  phone: l.phone ?? '—',
  email: l.email ?? '—',
  status: l.status ?? 'active',
  ownerTeam: l.ownerTeam ?? '—',
  createdAt: l.createdAt ?? '—',
  daysSinceUpdate: l.daysSinceUpdate ?? (l as unknown as UniversalLead).daysInStage ?? 0,
  probability: l.probability ?? 50,
}));

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>('dashboard');
  const [leads, setLeads] = useState<UniversalLead[]>(DEMO_LEADS);
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');
  const [fileName, setFileName] = useState<string | undefined>();
  const [uploadedAt, setUploadedAt] = useState<Date | undefined>();
  const [showUpload, setShowUpload] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateId>('interior');
  const [mappingConfidence, setMappingConfidence] = useState(100);
  const [mappedFields, setMappedFields] = useState(0);
  const [autoFilledFields, setAutoFilledFields] = useState(0);
  const [detectedColumns, setDetectedColumns] = useState(0);

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

  const loadLiveData = useCallback((rows: UniversalLead[], name: string, confidence: number) => {
    setLeads(rows);
    setDataMode('live');
    setFileName(name);
    setUploadedAt(new Date());
    setShowUpload(false);
    setMappingConfidence(confidence);

    const detected = detectTemplate(rows);
    setTemplateId(detected);
  }, []);

  const loadDemoData = useCallback(() => {
    setLeads(DEMO_LEADS);
    setDataMode('demo');
    setFileName(undefined);
    setUploadedAt(undefined);
    setTemplateId('interior');
    setMappingConfidence(100);
    setMappedFields(0);
    setAutoFilledFields(0);
    setDetectedColumns(0);
  }, []);

  return (
    <DashboardContext.Provider value={{
      view, setView,
      leads, stats,
      dataMode, fileName, uploadedAt,
      loadLiveData, loadDemoData,
      showUpload, setShowUpload,
      templateId, setTemplateId,
      theme, toggleTheme,
      mappingConfidence, mappedFields, autoFilledFields, detectedColumns,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
