export type FunnelStage =
  | 'New Inquiry'
  | 'First Contact'
  | 'Qualified'
  | 'Consultation'
  | 'Site Visit'
  | 'Proposal Sent'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Advance Received'
  | 'Execution'
  | 'Completed'
  | 'Lost';

export type LeadSource =
  | 'WhatsApp'
  | 'Instagram'
  | 'Referral'
  | 'Website'
  | 'Phone Call'
  | 'Walk-in'
  | 'Other';

export interface UniversalLead {
  id: string;
  client: string;
  source: LeadSource;
  location: string;
  requirement: string;
  stage: FunnelStage;
  owner: string;
  lastContacted: string;
  daysInStage: number;
  value: number;
  nextAction: string;
}

export interface StageRow {
  stage: FunnelStage;
  count: number;
  value: number;
}

export interface ActivityItem {
  type: 'won' | 'new' | 'update' | 'stuck';
  client: string;
  lead: string;
  action: string;
  time: string;
}

export interface ComputedStats {
  total: number;
  activeFunnelCount: number;
  stuckCount: number;
  stageCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
  teamCounts: Record<string, number>;
  pipelineValue: number;
  topStuckLeads: UniversalLead[];
  recentActivity: ActivityItem[];
  byStage: StageRow[];
  followUpCount: number;
  atRiskValue: number;
}

export const FUNNEL_STAGES: FunnelStage[] = [
  'New Inquiry', 'First Contact', 'Qualified', 'Consultation', 'Site Visit',
  'Proposal Sent', 'Quotation Sent', 'Negotiation', 'Advance Received', 'Execution',
  'Completed', 'Lost',
];

export const STAGE_COLORS: Record<FunnelStage, string> = {
  'New Inquiry':      'bg-slate-500',
  'First Contact':    'bg-blue-600',
  'Qualified':        'bg-indigo-500',
  'Consultation':     'bg-violet-500',
  'Site Visit':       'bg-purple-500',
  'Proposal Sent':    'bg-fuchsia-500',
  'Quotation Sent':   'bg-amber-500',
  'Negotiation':      'bg-orange-500',
  'Advance Received': 'bg-green-600',
  'Execution':        'bg-emerald-500',
  'Completed':        'bg-teal-500',
  'Lost':             'bg-red-500',
};

export const SOURCE_COLORS: Record<string, string> = {
  'WhatsApp':    'bg-green-500',
  'Instagram':   'bg-pink-500',
  'Referral':    'bg-blue-500',
  'Website':     'bg-violet-500',
  'Phone Call':  'bg-cyan-500',
  'Walk-in':     'bg-amber-500',
  'Other':       'bg-slate-500',
};

export const TEAM_COLORS: Record<string, string> = {
  'Kavitha R.': 'bg-blue-400',
  'Pradeep S.': 'bg-violet-400',
  'Ananya M.':  'bg-green-400',
  'Sriram V.':  'bg-amber-400',
  'Unassigned': 'bg-slate-500',
};
