'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Mail, ShieldCheck, X } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

interface EmailDecisionBriefModalProps { onClose: () => void; }

const ROLE_OPTIONS = ['Owner / Founder', 'CEO / Leadership', 'Sales', 'Marketing', 'Finance', 'Operations', 'Other'];

export default function EmailDecisionBriefModal({ onClose }: EmailDecisionBriefModalProps) {
  const { leads, stats, actions, mappingConfidence } = useDashboard();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [reportConsent, setReportConsent] = useState(false);
  const [pilotConsent, setPilotConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const summary = useMemo(() => {
    const active = actions.filter(action => !['completed', 'dismissed'].includes(action.status));
    const topPriority = active.find(action => action.urgency === 'critical') ?? active[0] ?? null;
    const nextActions = active.filter(action => action.id !== topPriority?.id).slice(0, 2);
    const toBriefAction = (action: typeof topPriority) => action ? ({ title: action.title, owner: action.owner, dueDate: action.dueDate, impact: action.businessImpact }) : null;
    return {
      recordCount: leads.length,
      followUpCount: stats.followUpCount,
      stuckCount: stats.stuckCount,
      atRiskValue: stats.atRiskValue,
      mappingConfidence,
      topPriority: toBriefAction(topPriority),
      nextActions: nextActions.map(action => toBriefAction(action)).filter(action => action !== null),
    };
  }, [actions, leads.length, mappingConfidence, stats.atRiskValue, stats.followUpCount, stats.stuckCount]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', handleKeyDown); };
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reportConsent || status === 'sending') return;
    setStatus('sending'); setMessage('');
    const requestPayload = { name, email, company, role, reportConsent, pilotConsent, website, summary };
    try {
      const response = await fetch('/api/decision-brief', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestPayload),
      });
      const result = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || !result.success) throw new Error(result.message || 'The report could not be sent.');
      fetch('/api/lead-log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestPayload),
      }).catch(() => undefined);
      setStatus('sent');
      setMessage(result.message || 'Your decision brief has been emailed.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="email-brief-title" className="max-h-[94vh] w-full overflow-y-auto rounded-t-2xl border border-th-border bg-th-surface shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-th-border bg-th-surface px-5 py-4 sm:px-6">
          <div><div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-500"><Mail size={13} /> Take the brief with you</div><h2 id="email-brief-title" className="text-lg font-bold text-th-heading">Email this decision brief</h2><p className="mt-1 text-xs leading-relaxed text-th-muted">Receive the key signals and recommended actions in a concise email you can forward internally.</p></div>
          <button type="button" onClick={onClose} aria-label="Close email brief" className="rounded-lg p-2 text-th-muted transition-colors hover:bg-th-hover hover:text-th-heading"><X size={18} /></button>
        </div>

        {status === 'sent' ? (
          <div className="px-5 py-10 text-center sm:px-6"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500"><CheckCircle2 size={24} /></div><h3 className="mt-4 text-lg font-bold text-th-heading">Decision brief sent</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-th-muted">{message} Check spam or promotions if it does not arrive shortly.</p><div className="mx-auto mt-5 max-w-sm rounded-lg border border-green-500/15 bg-green-500/5 p-3 text-xs leading-relaxed text-th-muted">Only aggregated insights were sent. Your uploaded CSV and customer-level records stayed in this browser session.</div><button type="button" onClick={onClose} className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">Return to my brief</button></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium text-th-body">Your name<input autoFocus required maxLength={80} value={name} onChange={event => setName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-th-border bg-th-input px-3 py-2.5 text-sm text-th-heading outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10" placeholder="Your name" /></label>
              <label className="text-xs font-medium text-th-body">Work email<input required type="email" maxLength={160} value={email} onChange={event => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-th-border bg-th-input px-3 py-2.5 text-sm text-th-heading outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10" placeholder="you@company.com" /></label>
              <label className="text-xs font-medium text-th-body">Company <span className="font-normal text-th-faint">(optional)</span><input maxLength={100} value={company} onChange={event => setCompany(event.target.value)} className="mt-1.5 w-full rounded-lg border border-th-border bg-th-input px-3 py-2.5 text-sm text-th-heading outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10" placeholder="Company name" /></label>
              <label className="text-xs font-medium text-th-body">Your role <span className="font-normal text-th-faint">(optional)</span><select value={role} onChange={event => setRole(event.target.value)} className="mt-1.5 w-full rounded-lg border border-th-border bg-th-input px-3 py-2.5 text-sm text-th-heading outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"><option value="">Select role</option>{ROLE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}</select></label>
            </div>
            <label className="hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label>
            <div className="space-y-3 rounded-xl border border-th-border bg-th-hover/40 p-4">
              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-th-body"><input required type="checkbox" checked={reportConsent} onChange={event => setReportConsent(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-th-border accent-blue-600" /><span>Email my requested decision brief. I understand Vouch will process my name, email and aggregated analysis to deliver it.</span></label>
              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-th-body"><input type="checkbox" checked={pilotConsent} onChange={event => setPilotConsent(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-th-border accent-blue-600" /><span>Vouch may contact me about the ₹9,999 guided 14-day pilot. <span className="text-th-faint">Optional</span></span></label>
            </div>
            <div className="flex items-start gap-2 text-[10px] leading-relaxed text-th-faint"><ShieldCheck size={13} className="mt-0.5 shrink-0" /> Your raw CSV and customer-level records are not uploaded with this request. Vouch will not add you to marketing follow-ups unless you choose the optional pilot permission.</div>
            {status === 'error' && <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-500">{message}</div>}
            <button type="submit" disabled={!reportConsent || status === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{status === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending securely…</> : <><Mail size={16} /> Email my decision brief</>}</button>
          </form>
        )}
      </div>
    </div>
  );
}