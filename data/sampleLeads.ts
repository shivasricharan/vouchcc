export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type LeadSource = 'WhatsApp' | 'Referral' | 'Instagram' | 'Website' | 'Walk-in' | 'Phone Call';
export type LeadPriority = 'High' | 'Medium' | 'Low';
export type LeadStatus = 'Active' | 'Won' | 'Lost';

export interface Lead {
  name: string;
  business: string;
  phone: string;
  source: LeadSource;
  city: string;
  requirement: string;
  budgetRange: string;
  stage: LeadStage;
  priority: LeadPriority;
  lastContacted: string;
  nextFollowUp: string;
  assignedTo: string;
  estimatedValue: number;
  status: LeadStatus;
  notes: string;
}

export const sampleLeads: Lead[] = [
  { name: 'Priya Sharma', business: 'Self - Home Reno', phone: '+91-98765-43210', source: 'WhatsApp', city: 'Bangalore', requirement: 'Full home interior 3BHK', budgetRange: '10-20L', stage: 'Qualified', priority: 'High', lastContacted: '2026-06-05', nextFollowUp: '2026-06-14', assignedTo: 'Neha', estimatedValue: 15, status: 'Active', notes: 'Visited showroom twice — very interested. Wants moodboard by next week.' },
  { name: 'Rajiv Mehta', business: 'Mehta Constructions', phone: '+91-87654-32109', source: 'Referral', city: 'Mumbai', requirement: 'Office fit-out 4000 sqft', budgetRange: '20-50L', stage: 'Proposal', priority: 'High', lastContacted: '2026-06-07', nextFollowUp: '2026-06-13', assignedTo: 'Arjun', estimatedValue: 35, status: 'Active', notes: 'Proposal sent. Awaiting board approval. Follow up with CFO.' },
  { name: 'Deepa Iyer', business: 'Self', phone: '+91-76543-21098', source: 'Instagram', city: 'Chennai', requirement: 'Living room + master bedroom', budgetRange: '5-10L', stage: 'New', priority: 'Medium', lastContacted: '2026-06-10', nextFollowUp: '2026-06-15', assignedTo: 'Neha', estimatedValue: 7, status: 'Active', notes: 'Saw reel on Instagram. Wants portfolio PDF and pricing range.' },
  { name: 'Suresh Kumar', business: 'Kumar Properties', phone: '+91-65432-10987', source: 'Website', city: 'Hyderabad', requirement: 'Commercial showroom fit-out', budgetRange: '50L+', stage: 'Negotiation', priority: 'High', lastContacted: '2026-06-08', nextFollowUp: '2026-06-12', assignedTo: 'Arjun', estimatedValue: 65, status: 'Active', notes: 'Negotiating on timeline — needs delivery in 45 days. Price agreed.' },
  { name: 'Anjali Singh', business: 'Self', phone: '+91-54321-09876', source: 'WhatsApp', city: 'Delhi', requirement: '3BHK full interior', budgetRange: '10-20L', stage: 'Contacted', priority: 'Medium', lastContacted: '2026-06-06', nextFollowUp: '2026-06-10', assignedTo: 'Ravi', estimatedValue: 18, status: 'Active', notes: 'Site visit scheduled but rescheduled twice — follow up urgently.' },
  { name: 'Vikram Nair', business: 'Nair Family Villa', phone: '+91-43210-98765', source: 'Referral', city: 'Bangalore', requirement: 'Villa full interior + landscaping', budgetRange: '50L+', stage: 'Won', priority: 'High', lastContacted: '2026-05-28', nextFollowUp: '', assignedTo: 'Neha', estimatedValue: 80, status: 'Won', notes: 'Project signed and in execution. Client happy with progress.' },
  { name: 'Meena Patel', business: 'Patel Family', phone: '+91-32109-87654', source: 'WhatsApp', city: 'Pune', requirement: 'Kitchen + dining renovation', budgetRange: '5-10L', stage: 'Lost', priority: 'Low', lastContacted: '2026-06-03', nextFollowUp: '', assignedTo: 'Ravi', estimatedValue: 6, status: 'Lost', notes: 'Went with cheaper competitor. Price sensitivity.' },
  { name: 'Aryan Gupta', business: 'Self', phone: '+91-21098-76543', source: 'Instagram', city: 'Mumbai', requirement: 'Studio apartment 500sqft', budgetRange: '2-5L', stage: 'Qualified', priority: 'Medium', lastContacted: '2026-06-04', nextFollowUp: '2026-06-16', assignedTo: 'Arjun', estimatedValue: 4, status: 'Active', notes: 'Liked previous Instagram reels. Prefers modern minimalist style.' },
  { name: 'Kavya Reddy', business: 'Reddy Ventures', phone: '+91-98765-12345', source: 'Phone Call', city: 'Hyderabad', requirement: 'Corporate office 2500sqft', budgetRange: '20-50L', stage: 'Proposal', priority: 'High', lastContacted: '2026-06-09', nextFollowUp: '2026-06-12', assignedTo: 'Neha', estimatedValue: 40, status: 'Active', notes: 'CEO wants done in 2 months. Urgent. Proposal submitted — awaiting sign-off.' },
  { name: 'Rahul Krishnan', business: 'Self', phone: '+91-87654-23456', source: 'Referral', city: 'Bangalore', requirement: 'New home 4BHK', budgetRange: '20-50L', stage: 'New', priority: 'Medium', lastContacted: '2026-06-11', nextFollowUp: '2026-06-14', assignedTo: 'Arjun', estimatedValue: 28, status: 'Active', notes: 'Referred by Vikram Nair. High intent. Wants to start in July.' },
  { name: 'Sonal Joshi', business: 'Joshi & Sons Retail', phone: '+91-76543-34567', source: 'WhatsApp', city: 'Delhi', requirement: 'Retail store fit-out 1500sqft', budgetRange: '10-20L', stage: 'Contacted', priority: 'Medium', lastContacted: '2026-06-03', nextFollowUp: '2026-06-09', assignedTo: 'Ravi', estimatedValue: 12, status: 'Active', notes: 'Wants sustainable materials. No reply since Jun 3 — overdue.' },
  { name: 'Nikhil Desai', business: 'Self', phone: '+91-65432-45678', source: 'Website', city: 'Pune', requirement: 'Living room + foyer', budgetRange: '2-5L', stage: 'Qualified', priority: 'Low', lastContacted: '2026-06-01', nextFollowUp: '2026-06-18', assignedTo: 'Neha', estimatedValue: 3, status: 'Active', notes: 'Comparing 3 quotes. Needs value-based pitch.' },
  { name: 'Pooja Menon', business: 'Menon Family', phone: '+91-54321-56789', source: 'Instagram', city: 'Chennai', requirement: 'Full home 4BHK', budgetRange: '10-20L', stage: 'Lost', priority: 'Medium', lastContacted: '2026-06-05', nextFollowUp: '', assignedTo: 'Arjun', estimatedValue: 14, status: 'Lost', notes: 'No response after 3 follow-up attempts. Went silent post site visit.' },
  { name: 'Rohit Verma', business: 'Verma Holdings', phone: '+91-43210-67890', source: 'Referral', city: 'Mumbai', requirement: 'Penthouse luxury design', budgetRange: '50L+', stage: 'Negotiation', priority: 'High', lastContacted: '2026-06-10', nextFollowUp: '2026-06-12', assignedTo: 'Ravi', estimatedValue: 90, status: 'Active', notes: 'Negotiating Phase 1 vs full project scope. Needs quick decision.' },
  { name: 'Shilpa Rao', business: 'Rao Constructions', phone: '+91-32109-78901', source: 'Walk-in', city: 'Bangalore', requirement: 'Commercial complex common areas', budgetRange: '50L+', stage: 'Won', priority: 'High', lastContacted: '2026-05-22', nextFollowUp: '', assignedTo: 'Neha', estimatedValue: 120, status: 'Won', notes: 'Second project with us. Execution underway. Great relationship.' },
  { name: 'Aditya Kumar', business: 'Self', phone: '+91-21098-89012', source: 'WhatsApp', city: 'Hyderabad', requirement: '2BHK apartment new build', budgetRange: '5-10L', stage: 'New', priority: 'Medium', lastContacted: '2026-06-11', nextFollowUp: '2026-06-16', assignedTo: 'Arjun', estimatedValue: 8, status: 'Active', notes: 'First-time homeowner. Needs guidance on style and budget.' },
  { name: 'Preethi Nair', business: 'Nair Design Co', phone: '+91-98765-90123', source: 'Instagram', city: 'Chennai', requirement: 'Cafe interior + signage', budgetRange: '10-20L', stage: 'Proposal', priority: 'High', lastContacted: '2026-06-08', nextFollowUp: '2026-06-13', assignedTo: 'Ravi', estimatedValue: 16, status: 'Active', notes: 'Needs to open by Aug 15. Proposal submitted. Waiting on landlord approval.' },
  { name: 'Manish Shah', business: 'Shah Family', phone: '+91-87654-01234', source: 'Phone Call', city: 'Mumbai', requirement: 'Duplex home full design', budgetRange: '20-50L', stage: 'Contacted', priority: 'High', lastContacted: '2026-06-07', nextFollowUp: '2026-06-12', assignedTo: 'Neha', estimatedValue: 32, status: 'Active', notes: 'Busy MD. Prefers WhatsApp updates. High potential.' },
  { name: 'Divya Pillai', business: 'Pillai Family', phone: '+91-76543-12345', source: 'Referral', city: 'Bangalore', requirement: 'Master bedroom + study room', budgetRange: '5-10L', stage: 'Qualified', priority: 'Medium', lastContacted: '2026-06-05', nextFollowUp: '2026-06-16', assignedTo: 'Arjun', estimatedValue: 9, status: 'Active', notes: 'Specific vision board shared on Pinterest. Needs detailed breakdown.' },
  { name: 'Karan Malhotra', business: 'Malhotra Group', phone: '+91-65432-23456', source: 'Website', city: 'Delhi', requirement: 'Corporate HQ redesign 8000sqft', budgetRange: '50L+', stage: 'Lost', priority: 'High', lastContacted: '2026-05-30', nextFollowUp: '', assignedTo: 'Ravi', estimatedValue: 75, status: 'Lost', notes: 'Budget cut internally. Follow up next fiscal.' },
  { name: 'Sneha Iyer', business: 'Self', phone: '+91-54321-34567', source: 'WhatsApp', city: 'Pune', requirement: 'Home office + study', budgetRange: '2-5L', stage: 'Contacted', priority: 'Low', lastContacted: '2026-06-02', nextFollowUp: '2026-06-17', assignedTo: 'Neha', estimatedValue: 3, status: 'Active', notes: 'WFH setup. Quick decision-maker but small budget.' },
  { name: 'Varun Shetty', business: 'Shetty Properties', phone: '+91-43210-45678', source: 'Referral', city: 'Mumbai', requirement: '5 apartments model flat', budgetRange: '20-50L', stage: 'Proposal', priority: 'High', lastContacted: '2026-06-09', nextFollowUp: '2026-06-12', assignedTo: 'Arjun', estimatedValue: 45, status: 'Active', notes: 'Developer needs model flat for site launch. Very time-sensitive.' },
  { name: 'Lakshmi Prasad', business: 'Self', phone: '+91-32109-56789', source: 'Instagram', city: 'Hyderabad', requirement: 'Pooja room + living area', budgetRange: '2-5L', stage: 'New', priority: 'Low', lastContacted: '2026-06-11', nextFollowUp: '2026-06-19', assignedTo: 'Ravi', estimatedValue: 4, status: 'Active', notes: 'Traditional and Vastu-compliant style. No urgency.' },
  { name: 'Nitin Sharma', business: 'Sharma Enterprises', phone: '+91-21098-67890', source: 'Phone Call', city: 'Bangalore', requirement: 'Restaurant interior 2000sqft', budgetRange: '10-20L', stage: 'Qualified', priority: 'High', lastContacted: '2026-06-06', nextFollowUp: '2026-06-14', assignedTo: 'Neha', estimatedValue: 18, status: 'Active', notes: 'Opening in 3 months. Clear aesthetic. Needs concept presentation.' },
  { name: 'Amrita Kapoor', business: 'Self', phone: '+91-98765-78901', source: 'WhatsApp', city: 'Delhi', requirement: 'Full home reno heritage flat', budgetRange: '5-10L', stage: 'Contacted', priority: 'Medium', lastContacted: '2026-06-04', nextFollowUp: '2026-06-11', assignedTo: 'Arjun', estimatedValue: 7, status: 'Active', notes: 'Heritage building structural constraints. Needs specialist consultation.' },
  { name: 'Girish Rao', business: 'Rao Tech', phone: '+91-87654-89012', source: 'Referral', city: 'Bangalore', requirement: 'IT office expansion 3rd floor', budgetRange: '10-20L', stage: 'Won', priority: 'High', lastContacted: '2026-05-30', nextFollowUp: '', assignedTo: 'Ravi', estimatedValue: 22, status: 'Won', notes: 'Repeat client. Third project. Strong referrer.' },
  { name: 'Tanvi Joshi', business: 'Self', phone: '+91-76543-90123', source: 'Instagram', city: 'Chennai', requirement: 'Kids room + play area', budgetRange: '2-5L', stage: 'New', priority: 'Low', lastContacted: '2026-06-12', nextFollowUp: '2026-06-20', assignedTo: 'Neha', estimatedValue: 4, status: 'Active', notes: 'Young family. Flexible timeline. Safe and colourful design.' },
  { name: 'Sanjay Mehta', business: 'Mehta Residences', phone: '+91-65432-01234', source: 'Website', city: 'Pune', requirement: '10-unit residential project', budgetRange: '50L+', stage: 'Negotiation', priority: 'High', lastContacted: '2026-06-10', nextFollowUp: '2026-06-12', assignedTo: 'Arjun', estimatedValue: 85, status: 'Active', notes: 'Bulk project pricing discussion. Needs finalised rate card for builder.' },
  { name: 'Ritu Aggarwal', business: 'Self', phone: '+91-54321-12345', source: 'WhatsApp', city: 'Mumbai', requirement: '3BHK luxury — premium finishes', budgetRange: '20-50L', stage: 'Proposal', priority: 'High', lastContacted: '2026-06-08', nextFollowUp: '2026-06-12', assignedTo: 'Ravi', estimatedValue: 38, status: 'Active', notes: 'High budget. Open to premium brands. Wants to meet once more before signing.' },
  { name: 'Harsha Pillai', business: 'Pillai Family', phone: '+91-43210-23456', source: 'Walk-in', city: 'Hyderabad', requirement: 'Full home + terrace landscaping', budgetRange: '20-50L', stage: 'Qualified', priority: 'Medium', lastContacted: '2026-06-03', nextFollowUp: '2026-06-17', assignedTo: 'Neha', estimatedValue: 30, status: 'Active', notes: 'Came to showroom with entire family. Needs 3D walkthrough.' },
];

const TODAY = '2026-06-12';

export const dashboardStats = (() => {
  const activeLeads = sampleLeads.filter((l) => l.status === 'Active');
  const wonLeads = sampleLeads.filter((l) => l.status === 'Won');
  const lostLeads = sampleLeads.filter((l) => l.status === 'Lost');

  const hotLeads = activeLeads.filter((l) => l.priority === 'High');

  const pendingFollowUp = activeLeads.filter(
    (l) => l.nextFollowUp && l.nextFollowUp <= TODAY
  );

  const overdueFollowUp = pendingFollowUp.filter((l) => l.nextFollowUp < TODAY);

  const followUpDueToday = pendingFollowUp
    .sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 4);

  const pipelineValue = activeLeads.reduce((sum, l) => sum + l.estimatedValue, 0);

  const stageOrder: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const stageColors: Record<LeadStage, string> = {
    New: 'bg-slate-500',
    Contacted: 'bg-blue-500',
    Qualified: 'bg-violet-500',
    Proposal: 'bg-amber-500',
    Negotiation: 'bg-orange-500',
    Won: 'bg-green-500',
    Lost: 'bg-red-500',
  };

  const stageCounts = stageOrder
    .filter((s) => s !== 'Won' && s !== 'Lost')
    .map((stage) => ({
      label: stage,
      count: sampleLeads.filter((l) => l.stage === stage).length,
      color: stageColors[stage],
    }));

  const sourceColors: Record<string, string> = {
    WhatsApp: 'bg-green-500',
    Referral: 'bg-blue-500',
    Instagram: 'bg-pink-500',
    Website: 'bg-violet-500',
    'Phone Call': 'bg-cyan-500',
    'Walk-in': 'bg-amber-500',
  };

  const sourceCounts = (Object.keys(sourceColors) as LeadSource[])
    .map((source) => {
      const count = sampleLeads.filter((l) => l.source === source).length;
      return { name: source, leads: count, color: sourceColors[source] };
    })
    .filter((s) => s.leads > 0)
    .sort((a, b) => b.leads - a.leads);

  const totalForSourcePct = sourceCounts.reduce((s, c) => s + c.leads, 0);
  const sourceCountsWithPct = sourceCounts.map((s) => ({
    ...s,
    pct: Math.round((s.leads / totalForSourcePct) * 100),
  }));

  const conversionRate = Math.round((wonLeads.length / sampleLeads.length) * 100);

  return {
    total: sampleLeads.length,
    active: activeLeads.length,
    hot: hotLeads.length,
    pendingCount: pendingFollowUp.length,
    overdueCount: overdueFollowUp.length,
    lostCount: lostLeads.length,
    wonCount: wonLeads.length,
    followUpDueToday,
    pipelineValue,
    stageCounts,
    sourceCountsWithPct,
    conversionRate,
  };
})();
