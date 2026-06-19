import type { UniversalLead, ComputedStats, StageRow, ActivityItem, TemplateId } from './leadTypes';
import { TEMPLATES } from './leadTypes';

function isWonStage(stage: string, templateId: TemplateId): boolean {
  const template = TEMPLATES[templateId];
  if (template.wonStages.length > 0) {
    return template.wonStages.some(s => s.toLowerCase() === stage.toLowerCase());
  }
  const s = stage.toLowerCase();
  return ['completed', 'closed won', 'won', 'converted', 'active customer', 'enrolled', 'registered',
    'advance received', 'execution', 'work started', 'onboarding', 'booking', 'agreement', 'payment',
    'fee paid', 'in treatment', 'planning'].some(k => s.includes(k));
}

function isLostStage(stage: string, templateId: TemplateId): boolean {
  const template = TEMPLATES[templateId];
  if (template.lostStages.length > 0) {
    return template.lostStages.some(s => s.toLowerCase() === stage.toLowerCase());
  }
  const s = stage.toLowerCase();
  return ['lost', 'closed lost', 'cancelled', 'dead', 'dropped'].some(k => s.includes(k));
}

function isActiveStage(stage: string, templateId: TemplateId): boolean {
  return !isWonStage(stage, templateId) && !isLostStage(stage, templateId);
}

export function computeStats(leads: UniversalLead[], templateId: TemplateId = 'auto'): ComputedStats {
  const stageCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  const teamCounts: Record<string, number> = {};
  const stageValues: Record<string, number> = {};

  const stageOrder: string[] = [];
  const seenStages = new Set<string>();

  for (const lead of leads) {
    if (!seenStages.has(lead.stage)) {
      seenStages.add(lead.stage);
      stageOrder.push(lead.stage);
    }
    stageCounts[lead.stage] = (stageCounts[lead.stage] || 0) + 1;
    stageValues[lead.stage] = (stageValues[lead.stage] || 0) + lead.value;
    sourceCounts[lead.source] = (sourceCounts[lead.source] || 0) + 1;
    teamCounts[lead.owner] = (teamCounts[lead.owner] || 0) + 1;
  }

  const activeFunnelCount = leads.filter(l => isActiveStage(l.stage, templateId)).length;

  const stuckLeads = leads.filter(l =>
    l.daysInStage >= 7 && isActiveStage(l.stage, templateId)
  );
  const stuckCount = stuckLeads.length;

  const topStuckLeads = [...stuckLeads]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const pipelineValue = leads
    .filter(l => isActiveStage(l.stage, templateId))
    .reduce((s, l) => s + l.value, 0);

  const atRiskValue = stuckLeads
    .filter(l => l.value >= 40)
    .reduce((s, l) => s + l.value, 0);

  const followUpCount = leads.filter(l =>
    isActiveStage(l.stage, templateId) && l.daysInStage >= 3
  ).length;

  const byStage: StageRow[] = stageOrder.map(stage => ({
    stage,
    count: stageCounts[stage] || 0,
    value: stageValues[stage] || 0,
  }));

  const recentActivity = buildRecentActivity(leads, templateId);

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
    mappingConfidence: 0,
  };
}

function buildRecentActivity(leads: UniversalLead[], templateId: TemplateId): ActivityItem[] {
  const items: ActivityItem[] = [];

  const won = leads.filter(l => isWonStage(l.stage, templateId)).slice(0, 2);
  for (const l of won) {
    items.push({ type: 'won', client: l.client, lead: l.id, action: `Moved to ${l.stage}`, time: l.lastContacted });
  }

  const newLeads = leads.filter(l => l.daysInStage <= 1 && isActiveStage(l.stage, templateId)).slice(0, 2);
  for (const l of newLeads) {
    items.push({ type: 'new', client: l.client, lead: l.id, action: `New ${l.source} lead`, time: l.lastContacted });
  }

  const stuck = leads.filter(l => l.daysInStage >= 7 && isActiveStage(l.stage, templateId)).slice(0, 2);
  for (const l of stuck) {
    items.push({ type: 'stuck', client: l.client, lead: l.id, action: `Stuck ${l.daysInStage}d in ${l.stage}`, time: l.lastContacted });
  }

  const updates = leads.filter(l => l.daysInStage <= 3 && isActiveStage(l.stage, templateId)).slice(0, 2);
  for (const l of updates) {
    items.push({ type: 'update', client: l.client, lead: l.id, action: `Stage: ${l.stage}`, time: l.lastContacted });
  }

  return items.slice(0, 8);
}
