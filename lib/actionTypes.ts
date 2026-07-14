export type ActionStatus = 'recommended' | 'assigned' | 'in_progress' | 'completed' | 'dismissed';
export type ActionPriority = 'critical' | 'high' | 'medium';
export type RoleId = 'executive' | 'sales' | 'marketing' | 'finance' | 'operations';

export const ROLES: { id: RoleId; label: string }[] = [
  { id: 'executive', label: 'Executive' },
  { id: 'sales', label: 'Sales' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finance', label: 'Finance' },
  { id: 'operations', label: 'Operations' },
];

export interface DemoAction {
  id: string;
  title: string;
  department: string;
  businessImpact: string;
  urgency: ActionPriority;
  owner: string;
  status: ActionStatus;
  dueDate: string;
  expectedOutcome: string;
  sourceInsight: string;
  effort: 'low' | 'medium' | 'high';
  impactScore: number;  // 1–10
  effortScore: number;  // 1–10
  leadId?: string;
}

export const STATUS_LABELS: Record<ActionStatus, string> = {
  recommended: 'Recommended',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  dismissed: 'Dismissed',
};

export const STATUS_COLORS: Record<ActionStatus, string> = {
  recommended: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  assigned: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  in_progress: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  completed: 'text-green-500 bg-green-500/10 border-green-500/20',
  dismissed: 'text-th-faint bg-th-hover border-th-border',
};

export const URGENCY_LABELS: Record<ActionPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
};

export const URGENCY_COLORS: Record<ActionPriority, string> = {
  critical: 'text-red-500 bg-red-500/10 border-red-500/20',
  high: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  medium: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
};
