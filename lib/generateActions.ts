import type { UniversalLead, ComputedStats } from './leadTypes';
import type { DemoAction, ActionPriority } from './actionTypes';

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

const TERMINAL = [
  'Lost', 'Completed', 'Closed Won', 'Closed Lost',
  'Active Customer', 'Enrolled', 'Registered',
];

function isActive(l: UniversalLead): boolean {
  return !TERMINAL.some(s => l.stage.includes(s));
}

export function generateActions(leads: UniversalLead[], stats: ComputedStats): DemoAction[] {
  const list: DemoAction[] = [];
  const seen = new Set<string>();
  let n = 0;
  const nextId = () => `action-${++n}`;

  // 1. Pending proposals (≥2 days without follow-up)
  const proposals = leads
    .filter(l =>
      ['Proposal Sent', 'Quotation Sent', 'Quote Sent', 'Contract Sent'].some(s => l.stage.includes(s)) &&
      l.daysInStage >= 2 && isActive(l))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  for (const l of proposals) {
    seen.add(l.id);
    const urgency: ActionPriority = l.daysInStage >= 5 ? 'critical' : 'high';
    list.push({
      id: nextId(),
      title: `Follow up on proposal — ${l.client}`,
      department: 'Sales',
      businessImpact: l.value > 0 ? `₹${l.value}L decision pending` : `No response for ${l.daysInStage} days`,
      urgency,
      owner: l.owner && l.owner !== 'Unassigned' ? l.owner : 'Sales Team',
      status: 'recommended',
      dueDate: 'Today',
      expectedOutcome: 'Confirm decision or schedule a follow-up call',
      sourceInsight: `Proposal sent ${l.daysInStage} days ago — no follow-up detected`,
      effort: 'low',
      impactScore: clamp(Math.round(l.value / 8) + 4, 4, 10),
      effortScore: 2,
      leadId: l.id,
    });
  }

  // 2. High-intent stalled leads (probability ≥60, daysInStage ≥3)
  const highIntent = leads
    .filter(l => l.probability >= 60 && l.daysInStage >= 3 && isActive(l) && !seen.has(l.id))
    .sort((a, b) => b.probability - a.probability || b.value - a.value)
    .slice(0, 3);

  for (const l of highIntent) {
    seen.add(l.id);
    list.push({
      id: nextId(),
      title: `Contact ${l.client} — high-intent, no recent activity`,
      department: 'Sales',
      businessImpact: l.value > 0 ? `₹${l.value}L opportunity` : `${l.probability}% close probability`,
      urgency: l.daysInStage >= 7 ? 'critical' : 'high',
      owner: l.owner && l.owner !== 'Unassigned' ? l.owner : 'Sales Team',
      status: 'recommended',
      dueDate: 'Today',
      expectedOutcome: 'Move to proposal stage or confirm timeline',
      sourceInsight: `${l.probability}% close probability, inactive for ${l.daysInStage} days`,
      effort: 'low',
      impactScore: clamp(Math.round(l.probability / 12) + 3, 3, 10),
      effortScore: 3,
      leadId: l.id,
    });
  }

  // 3. Stuck high-value deals (daysInStage ≥7, value ≥40)
  const stuckBig = leads
    .filter(l => l.daysInStage >= 7 && l.value >= 40 && isActive(l) && !seen.has(l.id))
    .sort((a, b) => b.value - a.value)
    .slice(0, 2);

  for (const l of stuckBig) {
    seen.add(l.id);
    list.push({
      id: nextId(),
      title: `Escalate stalled deal — ${l.client}`,
      department: 'Sales',
      businessImpact: `₹${l.value}L stalled ${l.daysInStage} days at "${l.stage}"`,
      urgency: 'critical',
      owner: l.owner && l.owner !== 'Unassigned' ? l.owner : 'Sales Manager',
      status: 'recommended',
      dueDate: 'Today',
      expectedOutcome: 'Unblock or formally re-qualify the deal',
      sourceInsight: `Deal stuck at "${l.stage}" for ${l.daysInStage} days with no movement`,
      effort: 'medium',
      impactScore: clamp(Math.round(l.value / 8), 5, 10),
      effortScore: 5,
      leadId: l.id,
    });
  }

  // 4. Unassigned leads
  const unassigned = leads.filter(l => (!l.owner || l.owner === 'Unassigned') && isActive(l));
  if (unassigned.length > 0) {
    list.push({
      id: nextId(),
      title: `Assign ${unassigned.length} unowned ${unassigned.length === 1 ? 'lead' : 'leads'} to team`,
      department: 'Operations',
      businessImpact: `${unassigned.length} ${unassigned.length === 1 ? 'lead' : 'leads'} receiving no follow-up`,
      urgency: 'critical',
      owner: 'Sales Manager',
      status: 'recommended',
      dueDate: 'Today',
      expectedOutcome: 'Every active lead has an owner and a next action',
      sourceInsight: `${unassigned.length} active ${unassigned.length === 1 ? 'lead has' : 'leads have'} no assigned owner`,
      effort: 'low',
      impactScore: 8,
      effortScore: 2,
    });
  }

  // 5. Source concentration risk
  const srcEntries = Object.entries(stats.sourceCounts).sort((a, b) => b[1] - a[1]);
  if (srcEntries.length > 0 && stats.total >= 5) {
    const [topSrc, topCnt] = srcEntries[0];
    if (topCnt / stats.total > 0.5) {
      list.push({
        id: nextId(),
        title: `Diversify lead sources — ${topSrc} is ${Math.round((topCnt / stats.total) * 100)}% of pipeline`,
        department: 'Marketing',
        businessImpact: `Over-reliance on one channel creates pipeline risk`,
        urgency: 'medium',
        owner: 'Marketing Team',
        status: 'recommended',
        dueDate: 'This week',
        expectedOutcome: 'Activate 2 additional lead sources this month',
        sourceInsight: `${topCnt} of ${stats.total} leads from ${topSrc} only`,
        effort: 'high',
        impactScore: 6,
        effortScore: 7,
      });
    }
  }

  // 6. Pipeline review (≥3 deals stuck)
  if (stats.stuckCount >= 3) {
    const val = Math.round(stats.atRiskValue);
    list.push({
      id: nextId(),
      title: `Pipeline review — ${stats.stuckCount} deals stuck 7+ days`,
      department: 'Operations',
      businessImpact: val > 0 ? `₹${val}L at risk of going cold` : `${stats.stuckCount} stalled deals need decisions`,
      urgency: stats.stuckCount >= 5 ? 'critical' : 'high',
      owner: 'Sales Manager',
      status: 'recommended',
      dueDate: 'This week',
      expectedOutcome: 'Bottlenecks cleared, next action defined for each deal',
      sourceInsight: `${stats.stuckCount} leads have had no stage movement in 7+ days`,
      effort: 'medium',
      impactScore: 7,
      effortScore: 4,
    });
  }

  // 7. Enforce follow-up standards
  if (stats.followUpCount > 5 && stats.activeFunnelCount > 0) {
    const rate = Math.round((stats.followUpCount / stats.activeFunnelCount) * 100);
    if (rate > 40) {
      list.push({
        id: nextId(),
        title: `Enforce 48-hour follow-up standard across team`,
        department: 'Operations',
        businessImpact: `${rate}% of active leads 3+ days without contact`,
        urgency: 'high',
        owner: 'Sales Manager',
        status: 'recommended',
        dueDate: 'This week',
        expectedOutcome: 'Average response time under 48 hours',
        sourceInsight: `${stats.followUpCount} of ${stats.activeFunnelCount} active leads overdue for contact`,
        effort: 'medium',
        impactScore: 7,
        effortScore: 4,
      });
    }
  }

  return list.slice(0, 12);
}
