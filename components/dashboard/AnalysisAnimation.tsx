'use client';

import { useEffect, useState, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

const PHASES = [
  { label: 'Reading business data', sub: 'Scanning records and columns' },
  { label: 'Detecting structure', sub: 'Grouping by stage and owner' },
  { label: 'Connecting signals', sub: 'Finding relationships in your pipeline' },
  { label: 'Ranking priorities', sub: 'Risk cluster detected' },
  { label: 'Creating actions', sub: 'Surfacing the top priority' },
];

const PHASE_MS = 620;

// Pre-defined dot positions (initial scattered, then grouped)
const DOTS = [
  // Group A — healthy (will cluster left)
  { id: 0, group: 'a', ix: 38,  iy: 58,  gx: 112, gy: 92 },
  { id: 1, group: 'a', ix: 82,  iy: 22,  gx: 132, gy: 80 },
  { id: 2, group: 'a', ix: 22,  iy: 132, gx: 102, gy: 110 },
  { id: 3, group: 'a', ix: 128, iy: 148, gx: 122, gy: 100 },
  { id: 4, group: 'a', ix: 168, iy: 52,  gx:  96, gy: 106 },
  { id: 5, group: 'a', ix: 52,  iy: 168, gx: 116, gy: 84 },
  // Group B — pipeline (will cluster center)
  { id: 6, group: 'b', ix: 222, iy: 32,  gx: 294, gy: 86 },
  { id: 7, group: 'b', ix: 262, iy: 158, gx: 314, gy: 106 },
  { id: 8, group: 'b', ix: 308, iy: 18,  gx: 306, gy: 96 },
  { id: 9, group: 'b', ix: 352, iy: 132, gx: 284, gy: 116 },
  { id: 10, group: 'b', ix: 388, iy: 72,  gx: 310, gy: 80 },
  { id: 11, group: 'b', ix: 242, iy: 102, gx: 298, gy: 112 },
  // Group C — risk (will cluster right, turns red)
  { id: 12, group: 'c', ix: 422, iy: 42,  gx: 494, gy: 90 },
  { id: 13, group: 'c', ix: 472, iy: 162, gx: 514, gy: 106 },
  { id: 14, group: 'c', ix: 532, iy: 28,  gx: 502, gy: 80 },
  { id: 15, group: 'c', ix: 562, iy: 142, gx: 480, gy: 112 },
  { id: 16, group: 'c', ix: 588, iy: 78,  gx: 512, gy: 96 },
  { id: 17, group: 'c', ix: 442, iy: 122, gx: 492, gy: 102 },
];

// Group centroid positions for drawing paths
const GA = { x: 112, y: 96 };
const GB = { x: 301, y: 96 };
const GC = { x: 499, y: 96 };

function AnalysisSVG({ phase }: { phase: number }) {
  const grouped      = phase >= 1;
  const linesVisible = phase >= 2;
  const riskActive   = phase >= 3;
  const actionVisible = phase >= 4;

  const pathABLen = Math.round(Math.hypot(GB.x - GA.x, GB.y - GA.y));
  const pathBCLen = Math.round(Math.hypot(GC.x - GB.x, GC.y - GB.y));

  return (
    <svg
      viewBox="0 0 624 180"
      className="w-full max-w-[540px] h-auto overflow-visible"
      aria-hidden
    >
      {/* Connection lines — appear at phase 2 */}
      {linesVisible && (
        <g>
          <path
            d={`M ${GA.x} ${GA.y} L ${GB.x} ${GB.y}`}
            stroke="#3b82f6"
            strokeWidth={1.5}
            fill="none"
            className="canvas-path-active"
            style={{ '--path-length': String(pathABLen), animationDelay: '0ms' } as React.CSSProperties}
          />
          <path
            d={`M ${GB.x} ${GB.y} L ${GC.x} ${GC.y}`}
            stroke={riskActive ? '#ef4444' : '#3b82f6'}
            strokeWidth={1.5}
            fill="none"
            className="canvas-path-active"
            style={{ '--path-length': String(pathBCLen), animationDelay: '150ms' } as React.CSSProperties}
          />
        </g>
      )}

      {/* Risk cluster pulse ring */}
      {riskActive && (
        <circle
          cx={GC.x}
          cy={GC.y}
          r={26}
          fill="none"
          stroke="#ef4444"
          strokeWidth={1.5}
          opacity={0.35}
          style={{ animation: 'rippleRing 1.3s ease-out infinite' }}
        />
      )}

      {/* Dots — each inside a <g> for translate, circle for scale/opacity */}
      {DOTS.map((dot, i) => {
        const dx = grouped ? dot.gx - dot.ix : 0;
        const dy = grouped ? dot.gy - dot.iy : 0;
        const isRisk  = dot.group === 'c' && riskActive;
        const isGreen = dot.group === 'a';
        const color   = isRisk ? '#ef4444' : isGreen ? '#22c55e' : '#60a5fa';
        const r       = isRisk ? 4.5 : 3;

        return (
          <g
            key={dot.id}
            style={{
              transform: `translate(${dx}px, ${dy}px)`,
              transition: `transform 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 18}ms`,
            }}
          >
            <circle
              cx={dot.ix}
              cy={dot.iy}
              r={r}
              fill={color}
              opacity={isRisk ? 0.95 : 0.75}
              style={{
                transition: `fill 0.5s ease ${Math.abs(3 - i) * 40}ms, r 0.3s ease`,
                animation: `dotScatter 0.45s ease-out ${i * 28}ms both`,
              }}
            />
          </g>
        );
      })}

      {/* Phase 4: Priority node */}
      {actionVisible && (
        <g>
          {/* Line from priority center up */}
          <line
            x1={GB.x} y1={GB.y - 10}
            x2={GB.x} y2={46}
            stroke="#3b82f6" strokeWidth={1} strokeOpacity={0.4} strokeDasharray="3 3"
          />
          {/* Priority card */}
          <rect
            x={GB.x - 58} y={18} width={116} height={38} rx={7}
            fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth={1.5} strokeOpacity={0.45}
            style={{ animation: 'nodeEnter 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
          />
          <text x={GB.x} y={35} textAnchor="middle" fill="#93c5fd" fontSize={8.5} fontWeight="700"
            style={{ animation: 'fadeIn 0.3s 0.1s both' }}>
            TOP PRIORITY
          </text>
          <text x={GB.x} y={48} textAnchor="middle" fill="#cbd5e1" fontSize={7.5}
            style={{ animation: 'fadeIn 0.3s 0.18s both' }}>
            Follow-up overdue · 18 deals
          </text>
        </g>
      )}
    </svg>
  );
}

export default function AnalysisAnimation() {
  const { leads, analysisAnimPlayed, markAnalysisPlayed } = useDashboard();
  const [phase, setPhase] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const prefersReduced = useRef(false);
  const leadsLen = leads.length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  useEffect(() => {
    if (leadsLen === 0) return;
    if (analysisAnimPlayed) return;
    if (prefersReduced.current) {
      markAnalysisPlayed();
      return;
    }
    setPhase(0);
    setVisible(true);
    setExiting(false);
  }, [leadsLen, analysisAnimPlayed, markAnalysisPlayed]);

  useEffect(() => {
    if (!visible || phase < 0) return;
    if (phase >= PHASES.length - 1) {
      const t = setTimeout(() => {
        setExiting(true);
        const t2 = setTimeout(() => {
          setVisible(false);
          markAnalysisPlayed();
        }, 500);
        return () => clearTimeout(t2);
      }, 480);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase(p => p + 1), PHASE_MS);
    return () => clearTimeout(t);
  }, [visible, phase, markAnalysisPlayed]);

  if (!visible) return null;

  const idx = Math.max(0, Math.min(phase, PHASES.length - 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-th-page/90 backdrop-blur-sm"
      style={{ transition: 'opacity 0.5s ease', opacity: exiting ? 0 : 1, pointerEvents: exiting ? 'none' : 'auto' }}
      aria-live="polite"
      aria-label="Analysing your data"
    >
      <div className="w-full max-w-xl mx-4 text-center space-y-8">
        {/* SVG dots animation */}
        <div className="flex justify-center px-4">
          <AnalysisSVG phase={phase} />
        </div>

        {/* Phase label */}
        <div className="space-y-1.5 animate-fade-in" key={idx}>
          <div className="text-th-heading font-bold text-base">
            {PHASES[idx].label}
          </div>
          <div className="text-th-muted text-sm">
            {PHASES[idx].sub}
          </div>
        </div>

        {/* Progress segments */}
        <div className="flex justify-center gap-2">
          {PHASES.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full bg-th-faint"
              style={{
                width: i <= phase ? 28 : 8,
                background: i <= phase ? '#3b82f6' : undefined,
                transition: 'width 0.4s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
