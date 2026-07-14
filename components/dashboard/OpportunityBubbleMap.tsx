'use client';

import { useMemo, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from '@/context/DashboardContext';
import type { UniversalLead } from '@/lib/leadTypes';

interface BubblePoint {
  x: number;       // probability 0–100
  y: number;       // value ₹L
  z: number;       // bubble size
  label: string;
  stage: string;
  owner: string;
  daysInStage: number;
  urgency: 'critical' | 'high' | 'active';
  lead: UniversalLead;
}

const URGENCY_COLOR: Record<BubblePoint['urgency'], string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  active: '#3b82f6',
};

const URGENCY_LABEL: Record<BubblePoint['urgency'], string> = {
  critical: '7d+ inactive',
  high: '3–6d inactive',
  active: 'Active',
};

function fmt(v: number): string {
  if (v >= 100) return `₹${(v / 100).toFixed(1)}Cr`;
  if (v > 0) return `₹${Math.round(v)}L`;
  return '—';
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: BubblePoint;
  onClick?: (p: BubblePoint) => void;
  selectedId?: string;
}

function CustomDot({ cx = 0, cy = 0, payload, onClick, selectedId }: CustomDotProps) {
  if (!payload) return null;
  const r = Math.max(5, Math.min(20, Math.sqrt(payload.z || 1) * 2.2));
  const color = URGENCY_COLOR[payload.urgency];
  const isSelected = selectedId === payload.lead.id;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isSelected ? r + 3 : r}
      fill={color}
      fillOpacity={0.65}
      stroke={color}
      strokeWidth={isSelected ? 2 : 1}
      strokeOpacity={0.9}
      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      onClick={() => onClick?.(payload)}
    />
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: BubblePoint }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-th-elevated border border-th-border rounded-lg p-3 text-xs shadow-lg max-w-[200px]">
      <p className="text-th-heading font-semibold mb-1 leading-snug">{p.label}</p>
      <div className="space-y-0.5 text-th-muted">
        <p>Stage: {p.stage}</p>
        <p>Value: {fmt(p.y)}</p>
        <p>Probability: {p.x}%</p>
        <p>Owner: {p.owner}</p>
        <p className={p.urgency === 'critical' ? 'text-red-400' : p.urgency === 'high' ? 'text-amber-400' : 'text-blue-400'}>
          {URGENCY_LABEL[p.urgency]}
        </p>
      </div>
    </div>
  );
}

export default function OpportunityBubbleMap() {
  const { leads, stats } = useDashboard();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const points = useMemo((): BubblePoint[] => {
    const TERMINAL = new Set(['Lost', 'Completed', 'Closed Won', 'Closed Lost']);
    return leads
      .filter(l => !TERMINAL.has(l.stage) && (l.probability > 0 || l.value > 0))
      .slice(0, 40)
      .map(l => ({
        x: l.probability || 30,
        y: l.value || 1,
        z: Math.max(1, l.value),
        label: l.client,
        stage: l.stage,
        owner: l.owner,
        daysInStage: l.daysInStage,
        urgency: l.daysInStage >= 7 ? 'critical' : l.daysInStage >= 3 ? 'high' : 'active',
        lead: l,
      }));
  }, [leads]);

  const selected = points.find(p => p.lead.id === selectedId) ?? null;

  if (points.length === 0) {
    return (
      <div className="bg-th-surface border border-th-border rounded-xl p-5 flex items-center justify-center min-h-[220px]">
        <p className="text-th-muted text-sm">Load data to see the opportunity map.</p>
      </div>
    );
  }

  const hasValues = stats.hasValues;

  return (
    <div className="bg-th-surface border border-th-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
        <h2 className="text-th-heading font-bold text-base">Opportunity Map</h2>
        <div className="flex items-center gap-2">
          {(['critical', 'high', 'active'] as const).map(u => (
            <span key={u} className="flex items-center gap-1 text-[9px] text-th-faint">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: URGENCY_COLOR[u] }} />
              {URGENCY_LABEL[u]}
            </span>
          ))}
        </div>
      </div>
      <p className="text-th-faint text-[10px] mb-3">
        {hasValues ? 'Value (₹L) vs Probability — bubble size = deal value' : 'Probability vs Inactivity — bubble size = lead score'}
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            tick={{ fill: 'var(--th-faint)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Probability %', position: 'insideBottom', offset: -2, fill: 'var(--th-faint)', fontSize: 9 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            tick={{ fill: 'var(--th-faint)', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v >= 100 ? `${(v / 100).toFixed(0)}Cr` : v > 0 ? `${v}L` : '0'}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={points}
            shape={(props: CustomDotProps) => (
              <CustomDot
                {...props}
                onClick={p => setSelectedId(prev => prev === p.lead.id ? null : p.lead.id)}
                selectedId={selectedId ?? undefined}
              />
            )}
          >
            {points.map((p, i) => (
              <Cell key={i} fill={URGENCY_COLOR[p.urgency]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Detail panel on click */}
      {selected && (
        <div className="mt-3 bg-th-hover border border-th-border rounded-lg p-3 animate-fade-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-th-heading font-semibold text-sm">{selected.label}</p>
              <p className="text-th-faint text-[10px]">{selected.stage}</p>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="text-th-faint hover:text-th-muted text-xs"
              aria-label="Close"
            >✕</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Value', value: fmt(selected.y) },
              { label: 'Probability', value: `${selected.x}%` },
              { label: 'Days inactive', value: `${selected.daysInStage}d` },
            ].map(m => (
              <div key={m.label}>
                <div className="text-th-heading font-bold text-base">{m.value}</div>
                <div className="text-th-faint text-[9px]">{m.label}</div>
              </div>
            ))}
          </div>
          <p className="text-th-faint text-[10px] mt-2">Owner: {selected.owner}</p>
        </div>
      )}
    </div>
  );
}
