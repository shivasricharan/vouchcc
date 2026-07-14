'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/context/DashboardContext';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316', '#ec4899'];

const TERMINAL_STAGES = new Set(['Lost', 'Completed', 'Closed Won', 'Closed Lost']);

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { stage: string; count: number; value: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { stage, count } = payload[0].payload;
  const total = payload[0].payload.value;
  return (
    <div
      style={{
        background: 'var(--th-surface)',
        border: '1px solid var(--th-border)',
        borderRadius: 6,
        padding: '6px 10px',
      }}
    >
      <p style={{ color: 'var(--th-heading)', fontSize: 12, fontWeight: 600, margin: 0 }}>{stage}</p>
      <p style={{ color: 'var(--th-body)', fontSize: 11, margin: '2px 0 0' }}>
        {count} lead{count !== 1 ? 's' : ''} &middot; {total}%
      </p>
    </div>
  );
}

export default function StageDistribution() {
  const { stats } = useDashboard();

  const { activeData, activeCount, totalForPct } = useMemo(() => {
    const active = (stats.byStage ?? []).filter(
      (s) => !TERMINAL_STAGES.has(s.stage) && s.count > 0
    );
    const count = active.reduce((sum, s) => sum + s.count, 0);
    return { activeData: active, activeCount: count, totalForPct: count || 1 };
  }, [stats.byStage]);

  const pieData = useMemo(
    () =>
      activeData.map((s) => ({
        stage: s.stage,
        count: s.count,
        value: Math.round((s.count / totalForPct) * 100),
      })),
    [activeData, totalForPct]
  );

  const isEmpty = pieData.length === 0;

  const emptyPieData = [{ stage: 'No data', count: 0, value: 1 }];

  return (
    <div
      style={{
        background: 'var(--th-surface)',
        border: '1px solid var(--th-border)',
        borderRadius: 12,
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ color: 'var(--th-heading)', fontSize: 13, fontWeight: 700 }}>
          Pipeline Distribution
        </span>
        <span style={{ color: 'var(--th-muted)', fontSize: 11 }}>
          {activeData.length} stage{activeData.length !== 1 ? 's' : ''}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          {isEmpty ? (
            <Pie
              data={emptyPieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              paddingAngle={0}
              stroke="none"
            >
              <Cell fill="var(--th-faint)" />
              <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as { cx: number; cy: number };
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 6}
                        textAnchor="middle"
                        fill="var(--th-muted)"
                        fontSize={13}
                        fontWeight={600}
                      >
                        No data
                      </text>
                    </g>
                  );
                }}
                position="center"
              />
            </Pie>
          ) : (
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              paddingAngle={2}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
              ))}
              <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as { cx: number; cy: number };
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 6}
                        textAnchor="middle"
                        fill="var(--th-heading)"
                        fontSize={22}
                        fontWeight={800}
                      >
                        {activeCount}
                      </text>
                      <text
                        x={cx}
                        y={cy + 12}
                        textAnchor="middle"
                        fill="var(--th-muted)"
                        fontSize={10}
                      >
                        Active
                      </text>
                    </g>
                  );
                }}
                position="center"
              />
            </Pie>
          )}
          {!isEmpty && <Tooltip content={<CustomTooltip />} />}
        </PieChart>
      </ResponsiveContainer>

      {!isEmpty && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 12px',
            marginTop: 8,
          }}
        >
          {activeData.map((s, i) => (
            <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: COLORS[i % COLORS.length],
                  flexShrink: 0,
                }}
              />
              <span
                className="text-[10px]"
                style={{
                  color: 'var(--th-muted)',
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.stage}
              </span>
              <span
                className="text-[10px]"
                style={{ color: 'var(--th-muted)', fontVariantNumeric: 'tabular-nums' }}
              >
                {s.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
