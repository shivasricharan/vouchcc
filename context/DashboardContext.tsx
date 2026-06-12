'use client';

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import { leads as demoLeads } from '@/data/dzinehome';
import { computeStats } from '@/lib/computeStats';
import type { UniversalLead, ComputedStats } from '@/lib/leadTypes';

export type ViewId = 'dashboard' | 'leads' | 'funnel' | 'teams' | 'insights' | 'settings' | 'guide';

interface DashboardState {
  view: ViewId;
  setView: (v: ViewId) => void;
  leads: UniversalLead[];
  stats: ComputedStats;
  dataMode: 'demo' | 'live';
  fileName?: string;
  uploadedAt?: Date;
  loadLiveData: (rows: UniversalLead[], fileName: string) => void;
  loadDemoData: () => void;
  showUpload: boolean;
  setShowUpload: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}

// Cast demo leads to UniversalLead — shapes are compatible
const DEMO_LEADS = demoLeads as unknown as UniversalLead[];
const DEMO_STATS = computeStats(DEMO_LEADS);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>('dashboard');
  const [leads, setLeads] = useState<UniversalLead[]>(DEMO_LEADS);
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');
  const [fileName, setFileName] = useState<string | undefined>();
  const [uploadedAt, setUploadedAt] = useState<Date | undefined>();
  const [showUpload, setShowUpload] = useState(false);

  const stats = useMemo(() => computeStats(leads), [leads]);

  const loadLiveData = useCallback((rows: UniversalLead[], name: string) => {
    setLeads(rows);
    setDataMode('live');
    setFileName(name);
    setUploadedAt(new Date());
    setShowUpload(false);
  }, []);

  const loadDemoData = useCallback(() => {
    setLeads(DEMO_LEADS);
    setDataMode('demo');
    setFileName(undefined);
    setUploadedAt(undefined);
  }, []);

  return (
    <DashboardContext.Provider value={{
      view, setView,
      leads, stats,
      dataMode, fileName, uploadedAt,
      loadLiveData, loadDemoData,
      showUpload, setShowUpload,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
