'use client';

import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, CalendarClock, CheckCircle2, Eye, Target, TrendingUp } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

const DAY = 86_400_000;
const TERMINAL = ['lost', 'closed lost', 'cancelled', 'dropped', 'completed', 'closed won', 'won', 'converted'];
const AGE_BANDS = [
  { label: '0–2d', min: 0, max: 2 },
  { label: '3–6d', min: 3, max: 6 },
  { label: '7–14d', min: 7, max: 14 },
  { label: '15d+', min: 15, max: Number.POSITIVE_INFINITY },
];

interface Snapshot {
  at: number;
  file: string;
  attention: number;
  risk: number;
  visibility: number;
}

function isOpen(stage: string): boolean {
  const normalized = stage.toLowerCase();
  return !TERMINAL.some(value => normalized.includes(value));
}

function money(value: number): string {
  if (value >= 100) return `₹${(value / 100).toFixed(1)}Cr`;
  if (value >= 10) return `₹${Math.round(value)}L`;
  if (value > 0) return `₹${value.toFixed(1)}L`;
  return '—';
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function DecisionReview() {
  const { leads, stats, actions, dataMode, fileName, role } = useDashboard();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const openLeads = useMemo(() => leads.filter(lead => isOpen(lead.stage)), [leads]);
  const attentionLeads = useMemo(() => openLeads.filter(lead => lead.daysSinceUpdate >= 3), [openLeads]);
  const momentumLeads = useMemo(() => openLeads.filter(lead => lead.daysSinceUpdate <= 3), [openLeads]);
  const averageInactive = useMemo(() => {
    if (openLeads.length === 0) return 0;
    return Math.round((openLeads.reduce((sum, lead) => sum + lead.daysSinceUpdate, 0) / openLeads.length) * 10) / 10;
  }, [openLeads]);

  const visibility = useMemo(() => {
    if (leads.length === 0) return 0;
    const checks = leads.reduce((score, lead) => score + [
      lead.client && !lead.client.startsWith('Lead '),
      lead.stage && lead.stage !== 'New Inquiry',
      lead.owner && lead.owner !== 'Unassigned' && lead.owner !== '—',
      lead.source && lead.source !== 'Other',
      lead.lastContacted && lead.lastContacted !== '—',
      lead.value > 0,
    ].filter(Boolean).length, 0);
    return Math.round((checks / (leads.length * 6)) * 100);
  }, [leads]);

  const momentumData = useMemo(() => {
    const validDates = openLeads
      .map(lead => Date.parse(lead.lastContacted))
      .filter(value => Number.isFinite(value));
    const anchor = validDates.length > 0 ? Math.max(...validDates) : Date.now();
    return Array.from({ length: 8 }, (_, index) => {
      const weeksAgo = 7 - index;
      const start = anchor - (weeksAgo + 1) * 7 * DAY;
      const end = anchor - weeksAgo * 7 * DAY;
      const count = validDates.filter(value => value > start && value <= end).length;
      return {
        label: new Date(end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        activity: count,
      };
    });
  }, [openLeads]);

  const stageColumns = useMemo(() => Object.entries(stats.stageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([stage]) => stage), [stats.stageCounts]);

  const heatmap = useMemo(() => AGE_BANDS.map(band => ({
    ...band,
    values: stageColumns.map(stage => openLeads.filter(lead =>
      lead.stage === stage && lead.daysSinceUpdate >= band.min && lead.daysSinceUpdate <= band.max
    ).length),
  })), [openLeads, stageColumns]);
  const maxHeat = Math.max(1, ...heatmap.flatMap(row => row.values));

  const riskByAge = useMemo(() => AGE_BANDS.map(band => ({
    label: band.label,
    value: Math.round(openLeads.filter(lead =>
      lead.daysSinceUpdate >= band.min && lead.daysSinceUpdate <= band.max
    ).reduce((sum, lead) => sum + lead.value, 0) * 10) / 10,
  })), [openLeads]);

  useEffect(() => {
    if (dataMode !== 'live' || leads.length === 0) return;
    const key = 'vouch-analysis-snapshots-v1';
    const stored = localStorage.getItem(key);
    const previous = stored ? JSON.parse(stored) as Snapshot[] : [];
    const current: Snapshot = {
      at: Date.now(), file: fileName ?? 'Uploaded data', attention: attentionLeads.length,
      risk: stats.atRiskValue, visibility,
    };
    const last = previous[previous.length - 1];
    const isDuplicate = last && last.file === current.file && last.attention === current.attention && last.risk === current.risk;
    const next = isDuplicate ? previous : [...previous, current].slice(-12);
    localStorage.setItem(key, JSON.stringify(next));
    setSnapshots(next);
  }, [dataMode, fileName, leads.length, attentionLeads.length, stats.atRiskValue, visibility]);

  useEffect(() => {
    const stored = localStorage.getItem('vouch-analysis-snapshots-v1');
    if (stored) setSnapshots(JSON.parse(stored) as Snapshot[]);
  }, []);

  const relevantSnapshots = snapshots.filter(snapshot => snapshot.file === (fileName ?? 'Uploaded data'));
  const riskTrend = relevantSnapshots.map(snapshot => ({
    label: new Date(snapshot.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    value: snapshot.risk,
  }));

  const topAction = actions.find(action => action.status !== 'completed' && action.status !== 'dismissed');
  const roleLead = role === 'finance' ? 'value exposure' : role === 'operations' ? 'execution gaps' : role === 'marketing' ? 'demand quality' : role === 'sales' ? 'pipeline momentum' : 'business priorities';

  const kpis = [
    { label: 'Needs attention', value: attentionLeads.length, detail: `${stats.stuckCount} inactive 7+ days`, icon: Target, target: 'action-centre' },
    { label: 'Follow-ups overdue', value: stats.followUpCount, detail: '3+ days without activity', icon: CalendarClock, target: 'action-centre' },
    { label: 'Avg. days inactive', value: averageInactive, detail: 'across open pipeline', icon: TrendingUp, target: 'pipeline-flow' },
    { label: 'Maintaining momentum', value: momentumLeads.length, detail: 'updated in last 3 days', icon: CheckCircle2, target: 'pipeline-flow' },
    { label: 'Pipeline visibility', value: `${visibility}/100`, detail: visibility >= 80 ? 'strong data coverage' : 'more complete fields needed', icon: Eye, target: 'data-understanding' },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-th-border bg-th-surface" aria-labelledby="decision-review-title">
      <div className="border-b border-th-border px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-500">Decision review</div>
            <h2 id="decision-review-title" className="text-lg font-bold tracking-tight text-th-heading sm:text-xl">
              {attentionLeads.length} opportunities need attention now.
            </h2>
            <p className="mt-1 max-w-3xl text-xs text-th-muted">
              Vouch reviewed {leads.length} records for {roleLead}. {stats.stuckCount > 0 ? `${stats.stuckCount} have been inactive for at least seven days${stats.atRiskValue > 0 ? `, representing ${money(stats.atRiskValue)} in potential value` : ''}.` : 'No seven-day pipeline stalls were detected.'}
            </p>
          </div>
          {topAction && (
            <button onClick={() => scrollTo('action-centre')} className="group flex max-w-md items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-left transition-colors hover:bg-blue-500/10">
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-blue-500">Recommended now</span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-th-heading">{topAction.title}</span>
                <span className="block text-[10px] text-th-muted">Owner: {topAction.owner} · {topAction.dueDate}</span>
              </span>
              <ArrowRight size={15} className="shrink-0 text-blue-500 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-th-border sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <button key={kpi.label} onClick={() => scrollTo(kpi.target)} className={`min-h-32 p-4 text-left transition-colors hover:bg-th-hover sm:p-5 ${index < kpis.length - 1 ? 'border-r border-th-border' : ''} ${index < 4 ? 'max-lg:border-b max-lg:border-th-border' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium text-th-muted sm:text-[11px]">{kpi.label}</span>
                <Icon size={13} className="text-th-faint" />
              </div>
              <div className="mt-4 text-2xl font-bold tracking-tight text-th-heading">{kpi.value}</div>
              <div className="mt-1 text-[10px] text-th-muted">{kpi.detail}</div>
              <div className="mt-3 text-[10px] font-semibold text-blue-500">Inspect →</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-px bg-th-border lg:grid-cols-3">
        <div className="min-h-64 bg-th-surface p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div><h3 className="text-xs font-bold text-th-heading">Momentum over time</h3><p className="text-[10px] text-th-muted">Recorded activity by week</p></div>
            <span className="text-[9px] text-th-faint">From activity dates</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={momentumData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
              <defs><linearGradient id="momentumFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.24}/><stop offset="100%" stopColor="#22c55e" stopOpacity={0.02}/></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--th-border)" strokeDasharray="2 3" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="activity" stroke="#22c55e" strokeWidth={2} fill="url(#momentumFill)" animationDuration={600} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="min-h-64 bg-th-surface p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div><h3 className="text-xs font-bold text-th-heading">Attention heatmap</h3><p className="text-[10px] text-th-muted">Where inactivity clusters</p></div>
            <span className="text-[9px] text-th-faint">Stage × ageing</span>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[360px]">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: `44px repeat(${Math.max(stageColumns.length, 1)}, minmax(38px, 1fr))` }}>
                <span />
                {stageColumns.map(stage => <span key={stage} className="truncate text-center text-[8px] text-th-faint" title={stage}>{stage}</span>)}
                {heatmap.flatMap(row => [
                  <span key={`${row.label}-label`} className="flex items-center text-[9px] text-th-muted">{row.label}</span>,
                  ...row.values.map((value, index) => {
                    const intensity = value / maxHeat;
                    const color = row.min >= 7 ? `rgba(239,68,68,${0.10 + intensity * 0.72})` : row.min >= 3 ? `rgba(245,158,11,${0.08 + intensity * 0.58})` : `rgba(34,197,94,${0.06 + intensity * 0.35})`;
                    return <button key={`${row.label}-${index}`} onClick={() => scrollTo('pipeline-flow')} className="flex h-8 items-center justify-center rounded-md text-[9px] font-semibold text-th-body transition-transform hover:scale-105" style={{ background: color }} title={`${value} records · ${stageColumns[index]} · ${row.label}`}>{value || ''}</button>;
                  }),
                ])}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-64 bg-th-surface p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-th-heading">{riskTrend.length > 1 ? 'Value at risk trend' : 'Value exposure by inactivity'}</h3>
              <p className="text-[10px] text-th-muted">{riskTrend.length > 1 ? 'Across analysis snapshots' : 'Current uploaded snapshot'}</p>
            </div>
            <span className="text-[9px] text-th-faint">{riskTrend.length > 1 ? `${riskTrend.length} reviews` : 'Trend starts next review'}</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            {riskTrend.length > 1 ? (
              <AreaChart data={riskTrend} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <defs><linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.22}/><stop offset="100%" stopColor="#ef4444" stopOpacity={0.02}/></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="var(--th-border)" strokeDasharray="2 3" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={value => money(value)} tick={{ fontSize: 9, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={value => money(Number(value ?? 0))} contentStyle={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fill="url(#riskFill)" animationDuration={600} />
              </AreaChart>
            ) : (
              <BarChart data={riskByAge} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--th-border)" strokeDasharray="2 3" />
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={value => money(value)} tick={{ fontSize: 9, fill: 'var(--th-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={value => money(Number(value ?? 0))} contentStyle={{ background: 'var(--th-surface)', border: '1px solid var(--th-border)', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="value" fill="#ef4444" radius={[5, 5, 0, 0]} animationDuration={600} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
