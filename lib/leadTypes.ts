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
  | 'Lost'
  // SaaS stages
  | 'Demo Booked'
  | 'Demo Completed'
  | 'Trial Started'
  | 'Contract Sent'
  | 'Closed Won'
  | 'Closed Lost'
  | 'Onboarding'
  | 'Active Customer'
  // Service stages
  | 'Enquiry'
  | 'Contacted'
  | 'Requirement Captured'
  | 'Quote Sent'
  | 'Follow-up'
  | 'Work Started'
  // Generic
  | 'Proposal';

export type LeadSource =
  | 'WhatsApp'
  | 'Instagram'
  | 'Referral'
  | 'Website'
  | 'Phone Call'
  | 'Walk-in'
  | 'Email'
  | 'LinkedIn'
  | 'Facebook'
  | 'Google Ads'
  | 'Campaign'
  | 'Other';

export interface UniversalLead {
  id: string;
  client: string;
  phone: string;
  email: string;
  source: LeadSource;
  location: string;
  requirement: string;
  stage: string;
  status: string;
  ownerTeam: string;
  owner: string;
  createdAt: string;
  lastContacted: string;
  daysInStage: number;
  daysSinceUpdate: number;
  value: number;
  probability: number;
  nextAction: string;
}

export interface StageRow {
  stage: string;
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
  openCount: number;
  wonCount: number;
  lostCount: number;
  stuckCount: number;
  stuckWithoutValueCount: number;
  stageCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
  teamCounts: Record<string, number>;
  pipelineValue: number;
  topStuckLeads: UniversalLead[];
  recentActivity: ActivityItem[];
  byStage: StageRow[];
  followUpCount: number;
  atRiskValue: number;
  mappingConfidence: number;
  hasValues: boolean;
}

// ─── Templates ────────────────────────────────────────────

export type TemplateId = 'auto' | 'service' | 'interior' | 'saas' | 'agency' | 'education' | 'realestate' | 'healthcare' | 'events' | 'retail' | 'viralreels';

export interface JourneyTemplate {
  id: TemplateId;
  name: string;
  stages: string[];
  wonStages: string[];
  lostStages: string[];
  activeStages: string[];
}

export const TEMPLATES: Record<TemplateId, JourneyTemplate> = {
  auto: {
    id: 'auto', name: 'Auto-detect',
    stages: [],
    wonStages: ['Completed', 'Closed Won', 'Won', 'Converted', 'Active Customer'],
    lostStages: ['Lost', 'Closed Lost', 'Cancelled', 'Dropped'],
    activeStages: [],
  },
  service: {
    id: 'service', name: 'Service Business',
    stages: ['Enquiry', 'Contacted', 'Requirement Captured', 'Consultation', 'Quote Sent', 'Follow-up', 'Negotiation', 'Advance Received', 'Work Started', 'Completed', 'Lost'],
    wonStages: ['Advance Received', 'Work Started', 'Completed'],
    lostStages: ['Lost'],
    activeStages: ['Enquiry', 'Contacted', 'Requirement Captured', 'Consultation', 'Quote Sent', 'Follow-up', 'Negotiation'],
  },
  interior: {
    id: 'interior', name: 'Interior Design',
    stages: ['New Inquiry', 'First Contact', 'Qualified', 'Consultation', 'Site Visit', 'Proposal Sent', 'Quotation Sent', 'Negotiation', 'Advance Received', 'Execution', 'Completed', 'Lost'],
    wonStages: ['Advance Received', 'Execution', 'Completed'],
    lostStages: ['Lost'],
    activeStages: ['New Inquiry', 'First Contact', 'Qualified', 'Consultation', 'Site Visit', 'Proposal Sent', 'Quotation Sent', 'Negotiation'],
  },
  saas: {
    id: 'saas', name: 'SaaS',
    stages: ['New Inquiry', 'First Contact', 'Qualified', 'Demo Booked', 'Demo Completed', 'Trial Started', 'Proposal Sent', 'Contract Sent', 'Negotiation', 'Closed Won', 'Onboarding', 'Active Customer', 'Closed Lost'],
    wonStages: ['Closed Won', 'Onboarding', 'Active Customer'],
    lostStages: ['Closed Lost'],
    activeStages: ['New Inquiry', 'First Contact', 'Qualified', 'Demo Booked', 'Demo Completed', 'Trial Started', 'Proposal Sent', 'Contract Sent', 'Negotiation'],
  },
  agency: {
    id: 'agency', name: 'Agency',
    stages: ['New Inquiry', 'First Contact', 'Qualified', 'Proposal Sent', 'Quotation Sent', 'Negotiation', 'Advance Received', 'Execution', 'Completed', 'Lost'],
    wonStages: ['Advance Received', 'Execution', 'Completed'],
    lostStages: ['Lost'],
    activeStages: ['New Inquiry', 'First Contact', 'Qualified', 'Proposal Sent', 'Quotation Sent', 'Negotiation'],
  },
  education: {
    id: 'education', name: 'Education',
    stages: ['Enquiry', 'Counselling', 'Application', 'Document Submitted', 'Admission Offered', 'Fee Paid', 'Enrolled', 'Lost'],
    wonStages: ['Fee Paid', 'Enrolled'],
    lostStages: ['Lost'],
    activeStages: ['Enquiry', 'Counselling', 'Application', 'Document Submitted', 'Admission Offered'],
  },
  realestate: {
    id: 'realestate', name: 'Real Estate',
    stages: ['Enquiry', 'Contacted', 'Site Visit', 'Interested', 'Negotiation', 'Booking', 'Agreement', 'Registered', 'Lost'],
    wonStages: ['Booking', 'Agreement', 'Registered'],
    lostStages: ['Lost'],
    activeStages: ['Enquiry', 'Contacted', 'Site Visit', 'Interested', 'Negotiation'],
  },
  healthcare: {
    id: 'healthcare', name: 'Healthcare / Clinic',
    stages: ['Enquiry', 'Appointment Booked', 'Consultation Done', 'Treatment Plan', 'Payment', 'In Treatment', 'Completed', 'Lost'],
    wonStages: ['Payment', 'In Treatment', 'Completed'],
    lostStages: ['Lost'],
    activeStages: ['Enquiry', 'Appointment Booked', 'Consultation Done', 'Treatment Plan'],
  },
  events: {
    id: 'events', name: 'Events',
    stages: ['Enquiry', 'Consultation', 'Proposal Sent', 'Quotation Sent', 'Negotiation', 'Advance Received', 'Planning', 'Execution', 'Completed', 'Lost'],
    wonStages: ['Advance Received', 'Planning', 'Execution', 'Completed'],
    lostStages: ['Lost'],
    activeStages: ['Enquiry', 'Consultation', 'Proposal Sent', 'Quotation Sent', 'Negotiation'],
  },
  retail: {
    id: 'retail', name: 'Retail / Local Business',
    stages: ['New Inquiry', 'First Contact', 'Quote Sent', 'Follow-up', 'Negotiation', 'Completed', 'Lost'],
    wonStages: ['Completed'],
    lostStages: ['Lost'],
    activeStages: ['New Inquiry', 'First Contact', 'Quote Sent', 'Follow-up', 'Negotiation'],
  },
  viralreels: {
    id: 'viralreels', name: 'ViralReels Sample',
    stages: ['New Inquiry', 'First Contact', 'Qualified', 'Demo Booked', 'Demo Completed', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Active Customer', 'Closed Lost'],
    wonStages: ['Closed Won', 'Active Customer'],
    lostStages: ['Closed Lost'],
    activeStages: ['New Inquiry', 'First Contact', 'Qualified', 'Demo Booked', 'Demo Completed', 'Proposal Sent', 'Negotiation'],
  },
};

// ─── Stage colors ────────────────────────────────────────────

const STAGE_COLOR_PALETTE = [
  'bg-slate-500', 'bg-blue-600', 'bg-indigo-500', 'bg-violet-500',
  'bg-purple-500', 'bg-fuchsia-500', 'bg-amber-500', 'bg-orange-500',
  'bg-green-600', 'bg-emerald-500', 'bg-teal-500', 'bg-red-500',
  'bg-cyan-500', 'bg-pink-500', 'bg-lime-500', 'bg-sky-500',
];

export function getStageColor(stage: string, index: number): string {
  const FIXED: Record<string, string> = {
    'Lost': 'bg-red-500', 'Closed Lost': 'bg-red-500',
    'Completed': 'bg-teal-500', 'Closed Won': 'bg-teal-500',
    'Active Customer': 'bg-teal-500', 'Enrolled': 'bg-teal-500', 'Registered': 'bg-teal-500',
    'Execution': 'bg-emerald-500', 'Work Started': 'bg-emerald-500', 'In Treatment': 'bg-emerald-500',
    'Advance Received': 'bg-green-600', 'Booking': 'bg-green-600', 'Fee Paid': 'bg-green-600',
    'Negotiation': 'bg-orange-500',
    'New Inquiry': 'bg-slate-500', 'Enquiry': 'bg-slate-500',
  };
  return FIXED[stage] || STAGE_COLOR_PALETTE[index % STAGE_COLOR_PALETTE.length];
}

export const SOURCE_COLORS: Record<string, string> = {
  'WhatsApp': 'bg-green-500', 'Instagram': 'bg-pink-500', 'Referral': 'bg-blue-500',
  'Website': 'bg-violet-500', 'Phone Call': 'bg-cyan-500', 'Walk-in': 'bg-amber-500',
  'Email': 'bg-indigo-500', 'LinkedIn': 'bg-sky-600', 'Facebook': 'bg-blue-600',
  'Google Ads': 'bg-red-500', 'Campaign': 'bg-fuchsia-500', 'Other': 'bg-slate-500',
};

const TEAM_COLOR_PALETTE = [
  'bg-blue-400', 'bg-violet-400', 'bg-green-400', 'bg-amber-400',
  'bg-pink-400', 'bg-cyan-400', 'bg-indigo-400', 'bg-rose-400',
  'bg-teal-400', 'bg-orange-400',
];

export function getTeamColor(name: string, index: number): string {
  if (name === 'Unassigned') return 'bg-slate-500';
  return TEAM_COLOR_PALETTE[index % TEAM_COLOR_PALETTE.length];
}
