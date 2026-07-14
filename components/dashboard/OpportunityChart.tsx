'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDashboard } from '@/context/DashboardContext';
import type { UniversalLead } from '@/lib/leadTypes';

const TERMINAL_STAGES = new Set(['Lost', 'Completed', 'Closed Won', 'Closed Lost', 'Active Customer']);

function score(lead: UniversalLead): number {
  return lead.value * 0.4 + lead.probability * 0.4 - lead.daysInStage * 0.2;
}

function getColor(days: number): string {
  if (days >= 7) return '#ef4444';
  if (days >= 3) return '#f59e0b';
  return '#3b82f6';
}

interface OpportunityEntry {
  name: string;
  displayValue: number;
  value: number;
  days: number;
  probability: number;
  stage: string;
  owner: string;
}

interface TooltipPayload {
  payload: OpportunityEntry;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: 'var(--th-surface)',
        border: '1px solid var(--th-border)',
        color: 'var(--th-body)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        lineHeight: 1.6,
        minWidth: 180,
      }}
    >
      <div style={{ fontWeight: 600, color: 'var(--th-heading)', marginBottom: 4 }}>{d.name}</div>
      {d.value > 0 && <div>Value: <strong>₹{d.value}L</strong></div>}
      <div>Stage: {d.stage}</div>
      <div>Days inactive: <strong>{d.days}</strong></div>
      <div>Probability: {d.probability}%</div>
      {d.owner && <div>Owner: {d.owner}</div>}
    </div>
  );
}

export default function OpportunityChart() {
  const { leads } = useDashboard();

  const data = useMemo<OpportunityEntry[]>(() => {
    return leads
      .filter(l =>
        !TERMINAL_STAGES.has(l.stage) &&
        (l.value > 0 || l.probability >= 50 || l.daysInStage >= 3)
      )
      .sort((a, b) => score(b) - score(a))
      .slice(0, 10)
      .map(l => ({
        name: l.client.length > 16 ? l.client.slice(0, 16) + '…' : l.client,
        displayValue: l.value > 0 ? l.value : l.probability,
        value: l.value,
        days: l.daysInStage,
        probability: l.probability,
        stage: l.stage,
        owner: l.owner,
      }));
  }, [leads]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-th-heading font-bold text-lg leading-tight">
          Opportunities Needing Attention
        </h2>
        <p className="text-th-muted text-xs mt-0.5">
          Top active deals ranked by value, probability, and time in stage.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-th-muted text-sm">
          No active opportunities found in your pipeline.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 11, fill: 'var(--th-body)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--th-hover)' }} />
            <Bar dataKey="displayValue" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {data.map((entry, i) => (
                <Cell key={i} fill={getColor(entry.days)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className="flex items-center gap-4 mt-3">
        <LegendDot color="#ef4444" label="7+ days inactive" />
        <LegendDot color="#f59e0b" label="3–6 days" />
        <LegendDot color="#3b82f6" label="Active" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        style={{ background: color, width: 8, height: 8, borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}
      />
      <span className="text-th-muted text-xs">{label}</span>
    </div>
  );
}
