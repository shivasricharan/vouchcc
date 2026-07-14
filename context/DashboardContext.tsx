'use client';

import { createContext, useContext, useState, useMemo, useCallback, useEffect, type ReactNode } from 'react';
import { computeStats } from '@/lib/computeStats';
import { detectTemplate } from '@/lib/fieldMapping';
import type { UniversalLead, ComputedStats, TemplateId } from '@/lib/leadTypes';
import type { DemoAction, ActionStatus, RoleId } from '@/lib/actionTypes';
import { generateActions } from '@/lib/generateActions';

export type ViewId = 'dashboard' | 'upload' | 'guide';
export type PeriodId = 'all' | 'month' | 'prev_month' | 'quarter';

export interface MappingMeta {
  columns: number;
  mapped: number;
  confidence: number;
  examples: { from: string; to: string }[];
}

export interface DecisionFeedEvent {
  id: string;
  type: 'action_complete' | 'action_assign' | 'action_start' | 'action_dismiss' | 'data_load' | 'refresh';
  timestamp: number;
  message: string;
  detail?: string;
}

export interface ProjectedMetrics {
  recoveredValue: number;
  healthBoost: number;
  winRateBoost: number;
}

export interface RippleEvent {
  actionId: string;
  actionTitle: string;
  targetType: 'risk' | 'health' | 'pipeline' | 'general';
  timestamp: number;
}

function formatFeedMessage(status: ActionStatus, action: DemoAction): string {
  switch (status) {
    case 'completed': return `Completed: ${action.title}`;
    case 'assigned': return `Assigned to ${action.owner}: ${action.title}`;
    case 'in_progress': return `Started: ${action.title}`;
    case 'dismissed': return `Dismissed: ${action.title}`;
    default: return action.title;
  }
}

function filterLeadsByPeriod(leads: UniversalLead[], period: PeriodId): UniversalLead[] {
  if (period === 'all') return leads;
  const now = Date.now();
  const DAY = 86_400_000;
  const ranges: Record<PeriodId, [number, number]> = {
    all: [0, now],
    month: [now - 30 * DAY, now],
    prev_month: [now - 60 * DAY, now - 30 * DAY],
    quarter: [now - 90 * DAY, now],
  };
  const [from, to] = ranges[period];
  return leads.filter(l => {
    const d = Date.parse(l.lastContacted);
    if (isNaN(d)) return true; // demo data with non-ISO dates — always include
    return d >= from && d <= to;
  });
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
  // Action tracking
  actions: DemoAction[];
  updateActionStatus: (id: string, status: ActionStatus) => void;
  lastAnalyzed: Date | null;
  refreshAnalysis: () => void;
  // Role / view
  role: RoleId;
  setRole: (r: RoleId) => void;
  // Phase 2: central decision state
  feedEvents: DecisionFeedEvent[];
  addFeedEvent: (e: Omit<DecisionFeedEvent, 'id' | 'timestamp'>) => void;
  projectedMetrics: ProjectedMetrics;
  period: PeriodId;
  setPeriod: (p: PeriodId) => void;
  // Phase 3: ripple effect + analysis animation
  ripple: RippleEvent | null;
  analysisAnimPlayed: boolean;
  markAnalysisPlayed: () => void;
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
  const [role, setRole] = useState<RoleId>('executive');
  const [actionStatuses, setActionStatuses] = useState<Record<string, ActionStatus>>({});
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);
  const [feedEvents, setFeedEvents] = useState<DecisionFeedEvent[]>([]);
  const [period, setPeriod] = useState<PeriodId>('all');
  const [ripple, setRipple] = useState<RippleEvent | null>(null);
  const [analysisAnimPlayed, setAnalysisAnimPlayed] = useState(false);

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

  // Period-filtered leads → stats
  const filteredLeads = useMemo(() => filterLeadsByPeriod(leads, period), [leads, period]);
  const stats = useMemo(() => computeStats(filteredLeads, templateId), [filteredLeads, templateId]);

  const dataFingerprint = useMemo(
    () => `${leads.length}-${leads[0]?.id ?? 'empty'}`,
    [leads]
  );

  // Load persisted action statuses when dataset changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(`vouch-action-statuses-${dataFingerprint}`);
    setActionStatuses(stored ? (JSON.parse(stored) as Record<string, ActionStatus>) : {});
  }, [dataFingerprint]);

  // Load persisted feed events when dataset changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(`vouch-feed-events-${dataFingerprint}`);
    setFeedEvents(stored ? (JSON.parse(stored) as DecisionFeedEvent[]) : []);
  }, [dataFingerprint]);

  useEffect(() => {
    if (leads.length > 0) setLastAnalyzed(new Date());
  }, [leads]);

  const baseActions = useMemo(() => generateActions(filteredLeads, stats), [filteredLeads, stats]);

  const actions = useMemo(
    () => baseActions.map(a => ({ ...a, status: actionStatuses[a.id] ?? a.status })),
    [baseActions, actionStatuses]
  );

  const markAnalysisPlayed = useCallback(() => {
    setAnalysisAnimPlayed(true);
  }, []);

  const updateActionStatus = useCallback((id: string, status: ActionStatus) => {
    setActionStatuses(prev => {
      const next = { ...prev, [id]: status };
      localStorage.setItem(`vouch-action-statuses-${dataFingerprint}`, JSON.stringify(next));
      return next;
    });

    const action = baseActions.find(a => a.id === id);
    if (action) {
      const evt: DecisionFeedEvent = {
        id: `feed-${Date.now()}`,
        type: status === 'completed' ? 'action_complete'
            : status === 'assigned' ? 'action_assign'
            : status === 'in_progress' ? 'action_start'
            : 'action_dismiss',
        timestamp: Date.now(),
        message: formatFeedMessage(status, action),
        detail: status === 'completed' ? action.expectedOutcome : undefined,
      };
      setFeedEvents(prev => {
        const next = [evt, ...prev].slice(0, 30);
        localStorage.setItem(`vouch-feed-events-${dataFingerprint}`, JSON.stringify(next));
        return next;
      });

      // Trigger ripple effect
      if (status === 'completed' || status === 'assigned' || status === 'in_progress') {
        const targetType =
          action.department === 'Finance' ? 'risk'
          : action.urgency === 'critical' ? 'health'
          : action.department === 'Operations' ? 'pipeline'
          : 'general';
        setRipple({ actionId: id, actionTitle: action.title, targetType, timestamp: Date.now() });
        setTimeout(() => setRipple(null), 1600);
      }
    }
  }, [dataFingerprint, baseActions]);

  const addFeedEvent = useCallback((e: Omit<DecisionFeedEvent, 'id' | 'timestamp'>) => {
    const evt: DecisionFeedEvent = { ...e, id: `feed-${Date.now()}`, timestamp: Date.now() };
    setFeedEvents(prev => {
      const next = [evt, ...prev].slice(0, 30);
      localStorage.setItem(`vouch-feed-events-${dataFingerprint}`, JSON.stringify(next));
      return next;
    });
  }, [dataFingerprint]);

  const projectedMetrics = useMemo((): ProjectedMetrics => {
    const completed = actions.filter(a => a.status === 'completed');
    if (completed.length === 0) return { recoveredValue: 0, healthBoost: 0, winRateBoost: 0 };

    const recoveredValue = Math.round(Math.min(
      stats.atRiskValue * 0.65,
      completed.reduce((s, a) => s + (a.impactScore / 10) * stats.atRiskValue * 0.14, 0)
    ));

    const healthBoost = Math.min(20, completed.reduce((s, a) =>
      s + (a.urgency === 'critical' ? 6 : a.urgency === 'high' ? 3 : 1), 0
    ));

    const winRateBoost = Math.min(8, Math.round(
      completed.reduce((s, a) => s + a.impactScore * 0.35, 0) * 10
    ) / 10);

    return { recoveredValue, healthBoost, winRateBoost };
  }, [actions, stats.atRiskValue]);

  const refreshAnalysis = useCallback(() => {
    setLastAnalyzed(new Date());
    addFeedEvent({ type: 'refresh', message: 'Analysis refreshed' });
  }, [addFeedEvent]);

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
      actions, updateActionStatus,
      lastAnalyzed, refreshAnalysis,
      role, setRole,
      feedEvents, addFeedEvent, projectedMetrics,
      period, setPeriod,
      ripple, analysisAnimPlayed, markAnalysisPlayed,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}
