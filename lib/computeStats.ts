import type { UniversalLead, ComputedStats, StageRow, ActivityItem, FunnelStage } from './leadTypes';
import { FUNNEL_STAGES } from './leadTypes';

const PIPELINE_STAGES: FunnelStage[] = [
  'Proposal Sent', 'Quotation Sent', 'Negotiation',
];

const ACTIVE_STAGES: FunnelStage[] = [
  'New Inquiry', 'First Contact', 'Qualified', 'Consultation',
  'Site Visit', 'Proposal Sent', 'Quotation Sent', 'Negotiation',
];

export function computeStats(leads: UniversalLead[]): ComputedStats {
  const stageCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  const teamCounts: Record<string, number> = {};
  const stageValues: Record<string, number> = {};

  for (const s of FUNNEL_STAGES) {
    stageCounts[s] = 0;
    stageValues[s] = 0;
  }

  for (const lead of leads) {
    stageCounts[lead.stage] = (stageCounts[lead.stage] || 0) + 1;
    stageValues[lead.stage] = (stageValues[lead.stage] || 0) + lead.value;
    sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1;
    teamCounts[lead.owner] = (teamCounts[lead.owner] || 0) + 1;
  }

  const activeFunnelCount = ACTIVE_STAGES.reduce((s, st) => s + (stageCounts[st] || 0), 0);

  const stuckLeads = leads.filter(
    (l) => l.daysInStage >= 7 && !['Lost', 'Completed', 'Advance Received', 'Execution'].includes(l.stage)
  );
  const stuckCount = stuckLeads.length;

  const topStuckLeads = [...stuckLeads]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const pipelineValue = leads
    .filter((l) => PIPELINE_STAGES.includes(l.stage as FunnelStage))
    .reduce((s, l) => s + l.value, 0);

  const atRiskValue = stuckLeads
    .filter((l) => l.value >= 40)
    .reduce((s, l) => s + l.value, 0);

  const followUpCount = leads.filter(
    (l) => ACTIVE_STAGES.includes(l.stage as FunnelStage) && l.daysInStage >= 3
  ).length;

  const byStage: StageRow[] = FUNNEL_STAGES.map((stage) => ({
    stage,
    count: stageCounts[stage] || 0,
    value: stageValues[stage] || 0,
  }));

  const recentActivity = buildRecentActivity(leads);

  return {
    total: leads.length,
    activeFunnelCount,
    stuckCount,
    stageCounts,
    sourceCounts,
    teamCounts,
    pipelineValue,
    topStuckLeads,
    recentActivity,
    byStage,
    followUpCount,
    atRiskValue,
  };
}

function buildRecentActivity(leads: UniversalLead[]): ActivityItem[] {
  const items: ActivityItem[] = [];

  const won = leads.filter((l) => ['Advance Received', 'Completed'].includes(l.stage)).slice(0, 2);
  for (const l of won) {
    items.push({ type: 'won', client: l.client, lead: l.id, action: `Moved to ${l.stage}`, time: l.lastContacted });
  }

  const newLeads = leads.filter((l) => l.stage === 'New Inquiry' && l.daysInStage <= 1).slice(0, 2);
  for (const l of newLeads) {
    items.push({ type: 'new', client: l.client, lead: l.id, action: `New inquiry via ${l.source}`, time: l.lastContacted });
  }

  const stuck = leads.filter((l) => l.daysInStage >= 7 && !['Lost', 'Completed'].includes(l.stage)).slice(0, 2);
  for (const l of stuck) {
    items.push({ type: 'stuck', client: l.client, lead: l.id, action: `Stuck ${l.daysInStage}d — ${l.stage}`, time: l.lastContacted });
  }

  const updates = leads
    .filter((l) => ['Consultation', 'Site Visit', 'Proposal Sent'].includes(l.stage) && l.daysInStage <= 3)
    .slice(0, 2);
  for (const l of updates) {
    items.push({ type: 'update', client: l.client, lead: l.id, action: `Stage: ${l.stage}`, time: l.lastContacted });
  }

  return items.slice(0, 8);
}
