'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, CircleDollarSign, MessageCircle, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import DashHeader from './DashHeader';
import UploadModal from './UploadModal';
import RoleSwitcher from './RoleSwitcher';
import PriorityHero from './PriorityHero';
import DecisionFeed from './DecisionFeed';
import AnalysisAnimation from './AnalysisAnimation';
import PipelineFlow from './PipelineFlow';
import OpportunityBubbleMap from './OpportunityBubbleMap';
import StageDistribution from './StageDistribution';
import PriorityMatrix from './PriorityMatrix';
import ActionCentre from './ActionCentre';
import OutcomeComparison from './OutcomeComparison';
import GuideView from './views/GuideView';
import UploadGuideView from './views/UploadGuideView';
import UploadCSVView from './views/UploadCSVView';
import DecisionLoop from './DecisionLoop';
import DecisionReview from './DecisionReview';

const TALK_URL = 'https://yourvouch.com/#audit-form';

function money(value: number): string {
  if (value >= 100) return `₹${(value / 100).toFixed(1)}Cr`;
  if (value >= 10) return `₹${Math.round(value)}L`;
  if (value > 0) return `₹${value.toFixed(1)}L`;
  return '—';
}

function CompactSnapshot() {
  const { leads, stats, actions } = useDashboard();
  const openActions = actions.filter(action => !['completed', 'dismissed'].includes(action.status));
  const items = [
    { label: 'Needs attention', value: stats.stuckCount, detail: 'inactive for 7+ days', icon: Target },
    { label: 'Open opportunities', value: stats.openCount, detail: `${leads.length} total records`, icon: TrendingUp },
    { label: 'Value at risk', value: money(stats.atRiskValue), detail: 'stalled open value', icon: CircleDollarSign },
    { label: 'Actions ready', value: openActions.length, detail: 'priorities to review', icon: CheckCircle2 },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Executive snapshot">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="rounded-xl border border-th-border bg-th-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-th-muted sm:text-xs">{item.label}</span>
              <Icon size={14} className="text-th-faint" />
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-th-heading">{item.value}</div>
            <div className="mt-1 text-[10px] text-th-muted">{item.detail}</div>
          </div>
        );
      })}
    </section>
  );
}

function ResultsCTA() {
  const { stats, dataMode } = useDashboard();
  return (
    <section className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-500">Your next step</div>
          <h2 className="text-base font-bold text-th-heading sm:text-lg">
            {stats.stuckCount > 0
              ? `Vouch found ${stats.stuckCount} stalled opportunities${stats.atRiskValue > 0 ? ` worth ${money(stats.atRiskValue)}` : ''}.`
              : 'Your pipeline is ready for a focused review.'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-th-muted sm:text-sm">
            Want help deciding what to act on first? Share the result, not your confidential data, and start with a short conversation.
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-th-faint">
            <ShieldCheck size={12} /> {dataMode === 'demo' ? 'This is sample data.' : 'Your uploaded data stays private during this session.'}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <a href={TALK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
            <MessageCircle size={15} /> Discuss my results
          </a>
          <a href="#quick-actions" className="inline-flex items-center gap-2 rounded-lg border border-th-border bg-th-surface px-4 py-2.5 text-sm font-semibold text-th-heading transition-colors hover:bg-th-hover">
            Continue exploring <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

function QuickActions() {
  const { actions, updateActionStatus } = useDashboard();
  const topActions = actions
    .filter(action => !['completed', 'dismissed'].includes(action.status))
    .slice(0, 3);

  if (topActions.length === 0) return null;

  return (
    <section id="quick-actions" className="scroll-mt-20">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-500">Act next</div>
          <h2 className="mt-1 text-base font-bold text-th-heading">Three actions to review first</h2>
        </div>
        <span className="text-[10px] text-th-faint">Prioritised from your data</span>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {topActions.map((action, index) => (
          <article key={action.id} className="rounded-xl border border-th-border bg-th-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-blue-500">0{index + 1}</span>
              <span className="text-[10px] text-th-faint">{action.dueDate}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-snug text-th-heading">{action.title}</h3>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-th-muted">{action.businessImpact}</p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[10px] text-th-faint">Owner: {action.owner}</span>
              {action.status === 'recommended' && (
                <button onClick={() => updateActionStatus(action.id, 'assigned')} className="rounded-md bg-blue-600 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-blue-500">
                  Assign →
                </button>
              )}
              {action.status === 'assigned' && (
                <button onClick={() => updateActionStatus(action.id, 'in_progress')} className="rounded-md bg-amber-500/15 px-2.5 py-1.5 text-[10px] font-semibold text-amber-500 hover:bg-amber-500/25">
                  Start →
                </button>
              )}
              {action.status === 'in_progress' && (
                <button onClick={() => updateActionStatus(action.id, 'completed')} className="rounded-md bg-green-500/15 px-2.5 py-1.5 text-[10px] font-semibold text-green-500 hover:bg-green-500/25">
                  Complete →
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <div className="rounded-xl border border-blue-500/20 bg-th-surface p-6 text-center">
      <div className="mb-1 text-base font-bold text-th-heading">Ready to review your real opportunities?</div>
      <p className="mx-auto mb-4 max-w-md text-sm text-th-muted">
        Start with a short conversation about what Vouch found and whether a 14-day audit makes sense.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href={TALK_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
          Discuss my results
        </a>
        <a href="https://yourvouch.com" target="_blank" rel="noopener noreferrer" className="text-sm text-th-muted transition-colors hover:text-th-heading">
          Back to Vouch →
        </a>
      </div>
    </div>
  );
}

function MappingCard() {
  const { mappingMeta, mappingConfidence } = useDashboard();
  if (!mappingMeta) return null;

  return (
    <div id="data-understanding" className="scroll-mt-20 rounded-xl border border-th-border bg-th-surface p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-th-heading">How Vouch understood your data</span>
        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold text-green-500">
          {mappingConfidence}% confidence
        </span>
      </div>
      <p className="mb-4 text-xs text-th-muted">Vouch standardised similar business fields from your upload.</p>
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Columns detected', value: String(mappingMeta.columns) },
          { label: 'Fields mapped', value: String(mappingMeta.mapped) },
          { label: 'Confidence', value: `${mappingMeta.confidence}%` },
        ].map(item => (
          <div key={item.label}>
            <div className="text-lg font-bold text-th-heading">{item.value}</div>
            <div className="text-[10px] text-th-muted">{item.label}</div>
          </div>
        ))}
      </div>
      {mappingMeta.examples.length > 0 && (
        <div className="space-y-1.5 border-t border-th-border pt-3">
          {mappingMeta.examples.map((example, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span className="font-mono text-th-faint">{example.from}</span>
              <span className="text-th-faint">→</span>
              <span className="text-th-body">{example.to}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const { view, showUpload, showGuide, role, dataMode } = useDashboard();
  const [showDeepAnalysis, setShowDeepAnalysis] = useState(false);
  const roleCopy = {
    executive: ['Here’s what needs your attention.', 'Start with the few priorities most likely to affect this month’s outcomes.'],
    sales: ['Your pipeline needs decisions.', 'Focus on stalled, high-value opportunities and overdue follow-ups.'],
    marketing: ['See which demand signals are working.', 'Act on the sources and leads losing momentum.'],
    finance: ['Protect value already in motion.', 'Review exposure, stalled deals and the actions that reduce risk.'],
    operations: ['Turn priorities into execution.', 'See ownership, action progress and where work is slowing down.'],
  }[role];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-th-page">
      <DashHeader />
      <main className="flex-1 overflow-y-auto bg-th-page">
        {view === 'dashboard' && (
          <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
            <section className="animate-fade-up">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-500">
                Vouch opportunity review
                <span className={`rounded-full border px-2 py-0.5 tracking-normal ${dataMode === 'demo' ? 'border-amber-500/20 bg-amber-500/10 text-amber-500' : 'border-green-500/20 bg-green-500/10 text-green-500'}`}>
                  {dataMode === 'demo' ? 'Sample data' : 'Uploaded data'}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-th-heading sm:text-2xl">{roleCopy[0]}</h1>
              <p className="mt-1 max-w-2xl text-xs text-th-muted sm:text-sm">{roleCopy[1]}</p>
            </section>

            <RoleSwitcher />
            <CompactSnapshot />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2"><PriorityHero /></div>
              <div><DecisionFeed /></div>
            </div>

            <ResultsCTA />
            <QuickActions />

            <div className="flex justify-center py-1">
              <button onClick={() => setShowDeepAnalysis(value => !value)} className="inline-flex items-center gap-2 rounded-lg border border-th-border bg-th-surface px-4 py-2.5 text-sm font-semibold text-th-heading transition-colors hover:bg-th-hover">
                {showDeepAnalysis ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                {showDeepAnalysis ? 'Hide deeper analysis' : 'Explore deeper analysis'}
              </button>
            </div>

            {showDeepAnalysis && (
              <div className="space-y-6 animate-fade-up">
                <DecisionReview />
                <div id="pipeline-flow" className="scroll-mt-20 rounded-xl border border-th-border bg-th-surface p-5"><PipelineFlow /></div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2"><OpportunityBubbleMap /></div>
                  <div><StageDistribution /></div>
                </div>
                <div className="rounded-xl border border-th-border bg-th-surface p-5"><PriorityMatrix /></div>
                <ActionCentre />
                <DecisionLoop />
                <OutcomeComparison />
                <MappingCard />
                <FinalCTA />
              </div>
            )}

            <div className="space-y-1.5 py-3 text-center">
              <div className="text-[10px] text-th-faint">Your uploaded data stays private during this session.</div>
              <div className="text-[10px] text-th-faint">Powered by <a href="https://yourvouch.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-th-muted">Vouch</a></div>
            </div>
          </div>
        )}
        {view === 'upload' && <UploadCSVView />}
        {view === 'guide' && <GuideView />}
      </main>
      {showUpload && view !== 'upload' && <UploadModal />}
      {showGuide && <UploadGuideView />}
      <AnalysisAnimation />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
