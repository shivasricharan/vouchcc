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

export type LeadSource = 'WhatsApp' | 'Instagram' | 'Referral' | 'Website' | 'Phone Call' | 'Walk-in';

export interface DzineLead {
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

export const STAGE_TEXT_COLORS: Record<FunnelStage, string> = {
  'New Inquiry':      'text-slate-400',
  'First Contact':    'text-blue-400',
  'Qualified':        'text-indigo-400',
  'Consultation':     'text-violet-400',
  'Site Visit':       'text-purple-400',
  'Proposal Sent':    'text-fuchsia-400',
  'Quotation Sent':   'text-amber-400',
  'Negotiation':      'text-orange-400',
  'Advance Received': 'text-green-400',
  'Execution':        'bg-emerald-400',
  'Completed':        'text-teal-400',
  'Lost':             'text-red-400',
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  'WhatsApp':    'bg-green-500',
  'Instagram':   'bg-pink-500',
  'Referral':    'bg-blue-500',
  'Website':     'bg-violet-500',
  'Phone Call':  'bg-cyan-500',
  'Walk-in':     'bg-amber-500',
};

export const TEAM_COLORS: Record<string, string> = {
  'Kavitha R.': 'bg-blue-400',
  'Pradeep S.': 'bg-violet-400',
  'Ananya M.':  'bg-green-400',
  'Sriram V.':  'bg-amber-400',
  'Unassigned': 'bg-slate-500',
};

// ─── 100 Leads ────────────────────────────────────────────────────────────────

export const leads: DzineLead[] = [
  // ── New Inquiry (15) ─────────────────────────────────────────────────────
  { id:'DZH-001', client:'Priya Sharma',       source:'WhatsApp',   location:'Koramangala',     requirement:'3BHK Full Interior',        stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Today',         daysInStage:0,  value:18,  nextAction:'Send welcome message & portfolio' },
  { id:'DZH-002', client:'Tanvi Joshi',        source:'Instagram',  location:'Whitefield',      requirement:'4BHK Interior',             stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Yesterday',     daysInStage:1,  value:28,  nextAction:'Call and qualify budget' },
  { id:'DZH-003', client:'Rahul Krishnan',     source:'Referral',   location:'HSR Layout',      requirement:'Office Fitout 3500 sqft',   stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Today',         daysInStage:0,  value:35,  nextAction:'Assign to Sriram for discovery' },
  { id:'DZH-004', client:'Meera Nair',         source:'WhatsApp',   location:'Bandra, Mumbai',  requirement:'2BHK Interior',             stage:'New Inquiry', owner:'Sriram V.',   lastContacted:'Yesterday',     daysInStage:2,  value:9,   nextAction:'Send style quiz' },
  { id:'DZH-005', client:'Vivek Anand',        source:'Website',    location:'Gurgaon',         requirement:'Villa Interior 5000 sqft',  stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Yesterday',     daysInStage:1,  value:55,  nextAction:'Qualify and assign to Kavitha' },
  { id:'DZH-006', client:'Sudha Iyer',         source:'Instagram',  location:'Indiranagar',     requirement:'Kitchen Renovation',        stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Today',         daysInStage:0,  value:6,   nextAction:'Send kitchen portfolio' },
  { id:'DZH-007', client:'Karthik Rajan',      source:'Phone Call', location:'Koramangala',     requirement:'Living Room + Dining',      stage:'New Inquiry', owner:'Sriram V.',   lastContacted:'2d ago',        daysInStage:2,  value:8,   nextAction:'Follow up on call' },
  { id:'DZH-008', client:'Nalini Roy',         source:'WhatsApp',   location:'Andheri, Mumbai', requirement:'Studio Apartment',          stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Yesterday',     daysInStage:1,  value:4,   nextAction:'Assess scope' },
  { id:'DZH-009', client:'Suresh Patel',       source:'Referral',   location:'Jubilee Hills',   requirement:'4BHK Interior',             stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Today',         daysInStage:0,  value:32,  nextAction:'Assign to Kavitha' },
  { id:'DZH-010', client:'Lakshmi Prasad',     source:'Instagram',  location:'Anna Nagar',      requirement:'3BHK Full Interior',        stage:'New Inquiry', owner:'Sriram V.',   lastContacted:'3d ago',        daysInStage:3,  value:16,  nextAction:'Follow up — no reply' },
  { id:'DZH-011', client:'Rajesh Nambiar',     source:'Walk-in',    location:'Jayanagar',       requirement:'Master Bedroom',            stage:'New Inquiry', owner:'Unassigned',  lastContacted:'2d ago',        daysInStage:2,  value:7,   nextAction:'Send moodboard options' },
  { id:'DZH-012', client:'Puja Chatterjee',    source:'WhatsApp',   location:'Baner, Pune',     requirement:'2BHK Interior',             stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Yesterday',     daysInStage:1,  value:11,  nextAction:'Call and qualify' },
  { id:'DZH-013', client:'Vinod Kumar',        source:'Website',    location:'Noida',           requirement:'Home + Office Combo',       stage:'New Inquiry', owner:'Unassigned',  lastContacted:'Today',         daysInStage:0,  value:14,  nextAction:'Send intro deck' },
  { id:'DZH-014', client:'Seetha Lakshmi',     source:'Instagram',  location:'Velachery',       requirement:"Kids Room + Bedroom",       stage:'New Inquiry', owner:'Unassigned',  lastContacted:'3d ago',        daysInStage:3,  value:5,   nextAction:'Respond to DM' },
  { id:'DZH-015', client:'Ravi Shankar',       source:'Referral',   location:'Powai, Mumbai',   requirement:'Restaurant Interior',       stage:'New Inquiry', owner:'Sriram V.',   lastContacted:'2d ago',        daysInStage:2,  value:42,  nextAction:'Schedule discovery call' },

  // ── First Contact (12) ──────────────────────────────────────────────────
  { id:'DZH-016', client:'Anita Bose',         source:'WhatsApp',   location:'Whitefield',      requirement:'3BHK Full Interior',        stage:'First Contact', owner:'Kavitha R.',  lastContacted:'4d ago',      daysInStage:4,  value:22,  nextAction:'Follow up call' },
  { id:'DZH-017', client:'Mohan Verma',        source:'Instagram',  location:'Banjara Hills',   requirement:'4BHK Interior',             stage:'First Contact', owner:'Pradeep S.',  lastContacted:'5d ago',      daysInStage:5,  value:30,  nextAction:'Send design approach deck' },
  { id:'DZH-018', client:'Pratibha Singh',     source:'Referral',   location:'HSR Layout',      requirement:'Duplex Home Interior',      stage:'First Contact', owner:'Kavitha R.',  lastContacted:'3d ago',      daysInStage:3,  value:45,  nextAction:'Schedule consultation' },
  { id:'DZH-019', client:'Arun Kumar',         source:'Phone Call', location:'Gurgaon',         requirement:'Office Fitout 5000 sqft',   stage:'First Contact', owner:'Sriram V.',   lastContacted:'6d ago',      daysInStage:6,  value:40,  nextAction:'Resend portfolio + follow up' },
  { id:'DZH-020', client:'Padmaja Reddy',      source:'WhatsApp',   location:'Jubilee Hills',   requirement:'Villa Interior 6000 sqft',  stage:'First Contact', owner:'Kavitha R.',  lastContacted:'8d ago',      daysInStage:8,  value:65,  nextAction:'Urgent: no reply in 8 days' },
  { id:'DZH-021', client:'Geeta Mishra',       source:'Instagram',  location:'Koramangala',     requirement:'3BHK Interior',             stage:'First Contact', owner:'Ananya M.',   lastContacted:'5d ago',      daysInStage:5,  value:20,  nextAction:'Send portfolio' },
  { id:'DZH-022', client:'Naveen Kumar',       source:'Website',    location:'Andheri, Mumbai', requirement:'Commercial Office',         stage:'First Contact', owner:'Pradeep S.',  lastContacted:'4d ago',      daysInStage:4,  value:28,  nextAction:'Call to qualify' },
  { id:'DZH-023', client:'Usha Rani',          source:'WhatsApp',   location:'Indiranagar',     requirement:'2BHK Interior',             stage:'First Contact', owner:'Ananya M.',   lastContacted:'6d ago',      daysInStage:6,  value:12,  nextAction:'Send options A/B' },
  { id:'DZH-024', client:'Deepak Mehta',       source:'Referral',   location:'Powai, Mumbai',   requirement:'Penthouse Design 4500 sqft',stage:'First Contact', owner:'Kavitha R.',  lastContacted:'9d ago',      daysInStage:9,  value:95,  nextAction:'Escalate — high value, stuck' },
  { id:'DZH-025', client:'Rekha Nair',         source:'Instagram',  location:'Velachery',       requirement:'3BHK Full Interior',        stage:'First Contact', owner:'Pradeep S.',  lastContacted:'7d ago',      daysInStage:7,  value:18,  nextAction:'Try alternate channel' },
  { id:'DZH-026', client:'Balaji Murugan',     source:'Walk-in',    location:'Jayanagar',       requirement:'Studio Apartment',          stage:'First Contact', owner:'Ananya M.',   lastContacted:'3d ago',      daysInStage:3,  value:5,   nextAction:'Send quote range' },
  { id:'DZH-027', client:'Saritha Pillai',     source:'WhatsApp',   location:'Baner, Pune',     requirement:'4BHK Interior',             stage:'First Contact', owner:'Pradeep S.',  lastContacted:'4d ago',      daysInStage:4,  value:26,  nextAction:'Schedule consultation' },

  // ── Qualified (11) ─────────────────────────────────────────────────────
  { id:'DZH-028', client:'Vijay Agarwal',      source:'Referral',   location:'Whitefield',      requirement:'Villa Interior 7000 sqft',  stage:'Qualified', owner:'Kavitha R.',    lastContacted:'5d ago',        daysInStage:5,  value:58,  nextAction:'Book consultation slot' },
  { id:'DZH-029', client:'Madhuri Joshi',      source:'WhatsApp',   location:'HSR Layout',      requirement:'3BHK Full Interior',        stage:'Qualified', owner:'Ananya M.',     lastContacted:'3d ago',        daysInStage:3,  value:21,  nextAction:'Confirm site visit date' },
  { id:'DZH-030', client:'Srinivas Rao',       source:'Instagram',  location:'Banjara Hills',   requirement:'4BHK Interior',             stage:'Qualified', owner:'Pradeep S.',    lastContacted:'8d ago',        daysInStage:8,  value:35,  nextAction:'Stuck — follow up needed' },
  { id:'DZH-031', client:'Uma Krishnan',       source:'Referral',   location:'Koramangala',     requirement:'Kitchen + Living Room',     stage:'Qualified', owner:'Kavitha R.',    lastContacted:'4d ago',        daysInStage:4,  value:15,  nextAction:'Send concept options' },
  { id:'DZH-032', client:'Chandrika Nair',     source:'WhatsApp',   location:'Anna Nagar',      requirement:'2BHK Interior',             stage:'Qualified', owner:'Ananya M.',     lastContacted:'6d ago',        daysInStage:6,  value:10,  nextAction:'Call to schedule consultation' },
  { id:'DZH-033', client:'Ajay Thakur',        source:'Website',    location:'Gurgaon',         requirement:'Commercial Office 3000 sqft',stage:'Qualified', owner:'Sriram V.',    lastContacted:'5d ago',        daysInStage:5,  value:48,  nextAction:'Send scope document' },
  { id:'DZH-034', client:'Meghna Chatterjee',  source:'Instagram',  location:'Indiranagar',     requirement:'3BHK Interior',             stage:'Qualified', owner:'Pradeep S.',    lastContacted:'7d ago',        daysInStage:7,  value:24,  nextAction:'Stuck — try WhatsApp' },
  { id:'DZH-035', client:'Balu Krishnaswamy',  source:'Referral',   location:'Kothrud, Pune',   requirement:'Full Home 5BHK',            stage:'Qualified', owner:'Kavitha R.',    lastContacted:'3d ago',        daysInStage:3,  value:68,  nextAction:'Book site consultation' },
  { id:'DZH-036', client:'Neeraja Reddy',      source:'WhatsApp',   location:'Jubilee Hills',   requirement:'4BHK + Home Office',        stage:'Qualified', owner:'Pradeep S.',    lastContacted:'4d ago',        daysInStage:4,  value:32,  nextAction:'Confirm consultation time' },
  { id:'DZH-037', client:'Praveen Raj',        source:'Instagram',  location:'Velachery',       requirement:'Retail Store 2000 sqft',    stage:'Qualified', owner:'Sriram V.',     lastContacted:'6d ago',        daysInStage:6,  value:22,  nextAction:'Send commercial portfolio' },
  { id:'DZH-038', client:'Sudha Krishnamurthy',source:'Referral',   location:'Whitefield',      requirement:'Villa + Landscape',         stage:'Qualified', owner:'Kavitha R.',    lastContacted:'5d ago',        daysInStage:5,  value:75,  nextAction:'Book site visit' },

  // ── Consultation (9) ───────────────────────────────────────────────────
  { id:'DZH-039', client:'Ramachandran S.',    source:'WhatsApp',   location:'Koramangala',     requirement:'4BHK Interior',             stage:'Consultation', owner:'Kavitha R.',  lastContacted:'6d ago',       daysInStage:6,  value:38,  nextAction:'Prepare concept presentation' },
  { id:'DZH-040', client:'Sheela Thomas',      source:'Referral',   location:'Bandra, Mumbai',  requirement:'Penthouse Design 5000 sqft',stage:'Consultation', owner:'Kavitha R.',  lastContacted:'9d ago',       daysInStage:9,  value:110, nextAction:'Critical — escalate to founder' },
  { id:'DZH-041', client:'Gopal Krishnan',     source:'Instagram',  location:'HSR Layout',      requirement:'3BHK Full Interior',        stage:'Consultation', owner:'Ananya M.',   lastContacted:'4d ago',       daysInStage:4,  value:25,  nextAction:'Send mood board options' },
  { id:'DZH-042', client:'Nalina Rao',         source:'WhatsApp',   location:'Andheri, Mumbai', requirement:'Office Fitout 2500 sqft',   stage:'Consultation', owner:'Pradeep S.',  lastContacted:'7d ago',       daysInStage:7,  value:38,  nextAction:'Stuck — resend proposal outline' },
  { id:'DZH-043', client:'Prasad Iyer',        source:'Referral',   location:'Jubilee Hills',   requirement:'Villa Interior 6500 sqft',  stage:'Consultation', owner:'Kavitha R.',  lastContacted:'5d ago',       daysInStage:5,  value:85,  nextAction:'Finalise concept selection' },
  { id:'DZH-044', client:'Geethanjali K.',     source:'Instagram',  location:'Baner, Pune',     requirement:'4BHK Full Home',            stage:'Consultation', owner:'Pradeep S.',  lastContacted:'8d ago',       daysInStage:8,  value:42,  nextAction:'Stuck — call client' },
  { id:'DZH-045', client:'Sudhir Mehta',       source:'Website',    location:'Noida',           requirement:'Corporate Office HQ 8000 sqft',stage:'Consultation', owner:'Sriram V.',lastContacted:'6d ago',      daysInStage:6,  value:120, nextAction:'Prepare commercial proposal' },
  { id:'DZH-046', client:'Bhavana Nair',       source:'WhatsApp',   location:'Indiranagar',     requirement:'3BHK Interior',             stage:'Consultation', owner:'Ananya M.',   lastContacted:'4d ago',       daysInStage:4,  value:28,  nextAction:'Share sample projects' },
  { id:'DZH-047', client:'Jayakumar R.',       source:'Referral',   location:'Velachery',       requirement:'5BHK Villa',                stage:'Consultation', owner:'Kavitha R.',  lastContacted:'7d ago',       daysInStage:7,  value:78,  nextAction:'Stuck — high value, needs action' },

  // ── Site Visit (8) ─────────────────────────────────────────────────────
  { id:'DZH-048', client:'Shobha Menon',       source:'Referral',   location:'Whitefield',      requirement:'Villa Interior 6000 sqft',  stage:'Site Visit', owner:'Kavitha R.',    lastContacted:'5d ago',        daysInStage:5,  value:92,  nextAction:'Prepare site measurements' },
  { id:'DZH-049', client:'Vijay Kumar S.',     source:'WhatsApp',   location:'Koramangala',     requirement:'4BHK Full Interior',        stage:'Site Visit', owner:'Pradeep S.',    lastContacted:'8d ago',        daysInStage:8,  value:35,  nextAction:'Stuck — pending site report' },
  { id:'DZH-050', client:'Seetha D.',          source:'Instagram',  location:'Banjara Hills',   requirement:'3BHK + Guest Room',         stage:'Site Visit', owner:'Ananya M.',     lastContacted:'4d ago',        daysInStage:4,  value:28,  nextAction:'Send site visit summary' },
  { id:'DZH-051', client:'Ravi Kumar G.',      source:'Referral',   location:'HSR Layout',      requirement:'Office Fitout',             stage:'Site Visit', owner:'Kavitha R.',    lastContacted:'6d ago',        daysInStage:6,  value:45,  nextAction:'Draft proposal from site notes' },
  { id:'DZH-052', client:'Dinesh Kumar',       source:'Website',    location:'Gurgaon',         requirement:'Duplex Full Interior',      stage:'Site Visit', owner:'Pradeep S.',    lastContacted:'9d ago',        daysInStage:9,  value:65,  nextAction:'Stuck — overdue site summary' },
  { id:'DZH-053', client:'Savitri Rao',        source:'WhatsApp',   location:'Jubilee Hills',   requirement:'4BHK Interior',             stage:'Site Visit', owner:'Pradeep S.',    lastContacted:'3d ago',        daysInStage:3,  value:40,  nextAction:'Prepare design brief' },
  { id:'DZH-054', client:'Narayana Rao',       source:'Referral',   location:'Powai, Mumbai',   requirement:'Penthouse 4000 sqft',       stage:'Site Visit', owner:'Kavitha R.',    lastContacted:'7d ago',        daysInStage:7,  value:88,  nextAction:'Stuck — site report due' },
  { id:'DZH-055', client:'Lalitha Chandran',   source:'Instagram',  location:'Kothrud, Pune',   requirement:'Full Home 4BHK',            stage:'Site Visit', owner:'Ananya M.',     lastContacted:'5d ago',        daysInStage:5,  value:32,  nextAction:'Send 3D concept options' },

  // ── Proposal Sent (7) ─────────────────────────────────────────────────
  { id:'DZH-056', client:'Raghunathan P.',     source:'Referral',   location:'Whitefield',      requirement:'Villa Interior 7500 sqft',  stage:'Proposal Sent', owner:'Kavitha R.',  lastContacted:'6d ago',      daysInStage:6,  value:105, nextAction:'Follow up on proposal feedback' },
  { id:'DZH-057', client:'Sujatha Iyer',       source:'WhatsApp',   location:'Koramangala',     requirement:'4BHK Interior',             stage:'Proposal Sent', owner:'Pradeep S.',  lastContacted:'10d ago',     daysInStage:10, value:45,  nextAction:'Stuck 10 days — call urgently' },
  { id:'DZH-058', client:'Venkateswaran K.',   source:'Instagram',  location:'Banjara Hills',   requirement:'Restaurant Outlet',         stage:'Proposal Sent', owner:'Sriram V.',   lastContacted:'5d ago',      daysInStage:5,  value:35,  nextAction:'Request feedback on proposal' },
  { id:'DZH-059', client:'Meenakshi Rajan',    source:'Referral',   location:'Indiranagar',     requirement:'Full Home 5BHK',            stage:'Proposal Sent', owner:'Kavitha R.',  lastContacted:'8d ago',      daysInStage:8,  value:72,  nextAction:'Stuck — founder to call' },
  { id:'DZH-060', client:'Suresh Babu',        source:'Website',    location:'Andheri, Mumbai', requirement:'Corporate Office 4000 sqft',stage:'Proposal Sent', owner:'Sriram V.',   lastContacted:'4d ago',      daysInStage:4,  value:55,  nextAction:'Await client board meeting' },
  { id:'DZH-061', client:'Ramesh Gupta',       source:'WhatsApp',   location:'Gurgaon',         requirement:'Full Home 4BHK',            stage:'Proposal Sent', owner:'Pradeep S.',  lastContacted:'7d ago',      daysInStage:7,  value:42,  nextAction:'Stuck — send revised timeline' },
  { id:'DZH-062', client:'Sunita Rao',         source:'Referral',   location:'HSR Layout',      requirement:'3BHK Interior + Study',     stage:'Proposal Sent', owner:'Ananya M.',   lastContacted:'5d ago',      daysInStage:5,  value:24,  nextAction:'Share revision options' },

  // ── Quotation Sent (11) ───────────────────────────────────────────────
  { id:'DZH-063', client:'Vikram Malhotra',    source:'Referral',   location:'Whitefield',      requirement:'Villa 8000 sqft',           stage:'Quotation Sent', owner:'Kavitha R.',  lastContacted:'4d ago',     daysInStage:4,  value:150, nextAction:'Follow up on quote decision' },
  { id:'DZH-064', client:'Preethi Suresh',     source:'WhatsApp',   location:'Koramangala',     requirement:'3BHK Full Interior',        stage:'Quotation Sent', owner:'Ananya M.',   lastContacted:'6d ago',     daysInStage:6,  value:22,  nextAction:'Send revised quote if needed' },
  { id:'DZH-065', client:'Anand Krishnan',     source:'Instagram',  location:'Bandra, Mumbai',  requirement:'Penthouse 4000 sqft',       stage:'Quotation Sent', owner:'Kavitha R.',  lastContacted:'8d ago',     daysInStage:8,  value:120, nextAction:'Stuck — high value, escalate' },
  { id:'DZH-066', client:'Radha Krishnan',     source:'Referral',   location:'Jubilee Hills',   requirement:'4BHK Interior',             stage:'Quotation Sent', owner:'Pradeep S.',  lastContacted:'5d ago',     daysInStage:5,  value:38,  nextAction:'Ask for feedback on quote' },
  { id:'DZH-067', client:'Venkatesh M.',       source:'Website',    location:'Noida',           requirement:'Office HQ Redesign',        stage:'Quotation Sent', owner:'Sriram V.',   lastContacted:'9d ago',     daysInStage:9,  value:85,  nextAction:'Stuck — no response, try call' },
  { id:'DZH-068', client:'Kavya Reddy P.',     source:'WhatsApp',   location:'HSR Layout',      requirement:'3BHK + Kids Room',          stage:'Quotation Sent', owner:'Ananya M.',   lastContacted:'3d ago',     daysInStage:3,  value:25,  nextAction:'Follow up on timeline' },
  { id:'DZH-069', client:'Santosh Kumar',      source:'Referral',   location:'Powai, Mumbai',   requirement:'Duplex Home',               stage:'Quotation Sent', owner:'Pradeep S.',  lastContacted:'7d ago',     daysInStage:7,  value:55,  nextAction:'Stuck — resend with breakdown' },
  { id:'DZH-070', client:'Hemalatha R.',       source:'Instagram',  location:'Velachery',       requirement:'Full Home 3BHK',            stage:'Quotation Sent', owner:'Ananya M.',   lastContacted:'4d ago',     daysInStage:4,  value:19,  nextAction:'Call for decision timeline' },
  { id:'DZH-071', client:'Gopinath S.',        source:'Walk-in',    location:'Jayanagar',       requirement:'4BHK Full Interior',        stage:'Quotation Sent', owner:'Pradeep S.',  lastContacted:'6d ago',     daysInStage:6,  value:36,  nextAction:'Negotiate scope if needed' },
  { id:'DZH-072', client:'Padma Venkatesh',    source:'Referral',   location:'Baner, Pune',     requirement:'Villa Interior 5500 sqft',  stage:'Quotation Sent', owner:'Kavitha R.',  lastContacted:'5d ago',     daysInStage:5,  value:68,  nextAction:'Follow up on decision' },
  { id:'DZH-073', client:'Mohan Raj',          source:'WhatsApp',   location:'Anna Nagar',      requirement:'3BHK Interior',             stage:'Quotation Sent', owner:'Ananya M.',   lastContacted:'7d ago',     daysInStage:7,  value:21,  nextAction:'Stuck — push for decision' },

  // ── Negotiation (7) ───────────────────────────────────────────────────
  { id:'DZH-074', client:'Rohit Verma',        source:'Referral',   location:'Whitefield',      requirement:'Villa 9000 sqft',           stage:'Negotiation', owner:'Kavitha R.',    lastContacted:'5d ago',        daysInStage:5,  value:180, nextAction:'Finalise scope and timeline' },
  { id:'DZH-075', client:'Deepa Krishnaswamy', source:'WhatsApp',   location:'Koramangala',     requirement:'4BHK + Garden Design',      stage:'Negotiation', owner:'Pradeep S.',    lastContacted:'8d ago',        daysInStage:8,  value:62,  nextAction:'Stuck — founder call needed' },
  { id:'DZH-076', client:'Suresh Rao',         source:'Instagram',  location:'Banjara Hills',   requirement:'Commercial Complex',        stage:'Negotiation', owner:'Sriram V.',     lastContacted:'6d ago',        daysInStage:6,  value:95,  nextAction:'Finalise payment terms' },
  { id:'DZH-077', client:'Anika Malhotra',     source:'Referral',   location:'Indiranagar',     requirement:'Penthouse 5000 sqft',       stage:'Negotiation', owner:'Kavitha R.',    lastContacted:'9d ago',        daysInStage:9,  value:135, nextAction:'Stuck — critical, high value' },
  { id:'DZH-078', client:'Rajan Pillai',       source:'Website',    location:'Gurgaon',         requirement:'Office + Showroom',         stage:'Negotiation', owner:'Sriram V.',     lastContacted:'4d ago',        daysInStage:4,  value:70,  nextAction:'Send revised payment schedule' },
  { id:'DZH-079', client:'Kavitha Sundaram',   source:'WhatsApp',   location:'HSR Layout',      requirement:'Full Home 4BHK',            stage:'Negotiation', owner:'Pradeep S.',    lastContacted:'7d ago',        daysInStage:7,  value:48,  nextAction:'Stuck — revisit scope' },
  { id:'DZH-080', client:'Subramaniam K.',     source:'Referral',   location:'Jubilee Hills',   requirement:'Villa + Landscape',         stage:'Negotiation', owner:'Kavitha R.',    lastContacted:'5d ago',        daysInStage:5,  value:110, nextAction:'Close advance by end of week' },

  // ── Advance Received (4) ─────────────────────────────────────────────
  { id:'DZH-081', client:'Pradeep Nair',       source:'Referral',   location:'Koramangala',     requirement:'4BHK Full Interior',        stage:'Advance Received', owner:'Kavitha R.',  lastContacted:'Today',    daysInStage:0,  value:55,  nextAction:'Begin design development' },
  { id:'DZH-082', client:'Sunitha Reddy',      source:'WhatsApp',   location:'Whitefield',      requirement:'Villa Interior 7000 sqft',  stage:'Advance Received', owner:'Kavitha R.',  lastContacted:'Yesterday',daysInStage:0,  value:90,  nextAction:'Issue project timeline' },
  { id:'DZH-083', client:'Kiran Mehta',        source:'Referral',   location:'Bandra, Mumbai',  requirement:'Penthouse Full Design',     stage:'Advance Received', owner:'Kavitha R.',  lastContacted:'Yesterday',daysInStage:0,  value:145, nextAction:'Start concept development' },
  { id:'DZH-084', client:'Anita Krishnan',     source:'Instagram',  location:'HSR Layout',      requirement:'3BHK + Office',             stage:'Advance Received', owner:'Ananya M.',   lastContacted:'2d ago',   daysInStage:0,  value:32,  nextAction:'Confirm design brief' },

  // ── Execution (7) ─────────────────────────────────────────────────────
  { id:'DZH-085', client:'Srinivas Sharma',    source:'Referral',   location:'Whitefield',      requirement:'4BHK Interior',             stage:'Execution', owner:'Kavitha R.',      lastContacted:'Today',         daysInStage:0,  value:65,  nextAction:'Week 6 progress review' },
  { id:'DZH-086', client:'Uma Devi',           source:'WhatsApp',   location:'Koramangala',     requirement:'Villa Interior 5500 sqft',  stage:'Execution', owner:'Kavitha R.',      lastContacted:'Yesterday',     daysInStage:0,  value:110, nextAction:'Electrical phase sign-off' },
  { id:'DZH-087', client:'Rajesh Kumar',       source:'Website',    location:'Gurgaon',         requirement:'Corporate HQ 10000 sqft',   stage:'Execution', owner:'Pradeep S.',      lastContacted:'2d ago',        daysInStage:0,  value:180, nextAction:'Furniture delivery check' },
  { id:'DZH-088', client:'Meena Pillai',       source:'Referral',   location:'Jubilee Hills',   requirement:'5BHK Home Interior',        stage:'Execution', owner:'Pradeep S.',      lastContacted:'Yesterday',     daysInStage:0,  value:85,  nextAction:'Handover prep — milestone 3' },
  { id:'DZH-089', client:'Vivek Nair',         source:'Instagram',  location:'Indiranagar',     requirement:'3BHK Interior',             stage:'Execution', owner:'Ananya M.',       lastContacted:'3d ago',        daysInStage:0,  value:28,  nextAction:'Client walkthrough this week' },
  { id:'DZH-090', client:'Lavanya S.',         source:'Referral',   location:'Baner, Pune',     requirement:'Restaurant Chain Outlet',   stage:'Execution', owner:'Sriram V.',       lastContacted:'2d ago',        daysInStage:0,  value:55,  nextAction:'Soft launch prep' },
  { id:'DZH-091', client:'Sundar Rajan',       source:'WhatsApp',   location:'Anna Nagar',      requirement:'4BHK Full Home',            stage:'Execution', owner:'Ananya M.',       lastContacted:'Today',         daysInStage:0,  value:45,  nextAction:'Final furniture installation' },

  // ── Completed (5) ─────────────────────────────────────────────────────
  { id:'DZH-092', client:'Padma Rao',          source:'Referral',   location:'Whitefield',      requirement:'Villa Interior 6500 sqft',  stage:'Completed', owner:'Kavitha R.',      lastContacted:'Jun 01',        daysInStage:0,  value:95,  nextAction:'Request testimonial + referral' },
  { id:'DZH-093', client:'Ashok Kumar',        source:'Instagram',  location:'Koramangala',     requirement:'4BHK Interior',             stage:'Completed', owner:'Pradeep S.',      lastContacted:'May 28',        daysInStage:0,  value:42,  nextAction:'Send after-photos for portfolio' },
  { id:'DZH-094', client:'Kavitha Iyer',       source:'WhatsApp',   location:'Bandra, Mumbai',  requirement:'Penthouse Full Design',     stage:'Completed', owner:'Kavitha R.',      lastContacted:'May 22',        daysInStage:0,  value:125, nextAction:'Portfolio shoot scheduled' },
  { id:'DZH-095', client:'Mohan Krishna',      source:'Referral',   location:'Jubilee Hills',   requirement:'Commercial Office',         stage:'Completed', owner:'Sriram V.',       lastContacted:'May 18',        daysInStage:0,  value:75,  nextAction:'Referral follow-up pending' },
  { id:'DZH-096', client:'Prabha Sundaram',    source:'Website',    location:'HSR Layout',      requirement:'3BHK Interior',             stage:'Completed', owner:'Ananya M.',       lastContacted:'May 15',        daysInStage:0,  value:22,  nextAction:'Request Google review' },

  // ── Lost (4) ─────────────────────────────────────────────────────────
  { id:'DZH-097', client:'Naresh Babu',        source:'Website',    location:'Gurgaon',         requirement:'Office Fitout',             stage:'Lost', owner:'Sriram V.',            lastContacted:'May 30',        daysInStage:0,  value:35,  nextAction:'Understand loss reason' },
  { id:'DZH-098', client:'Saroja Devi',        source:'WhatsApp',   location:'Velachery',       requirement:'4BHK Interior',             stage:'Lost', owner:'Pradeep S.',           lastContacted:'May 25',        daysInStage:0,  value:30,  nextAction:'Log competitor info' },
  { id:'DZH-099', client:'Ranjit Singh',       source:'Instagram',  location:'Noida',           requirement:'Villa Interior',            stage:'Lost', owner:'Kavitha R.',           lastContacted:'May 20',        daysInStage:0,  value:55,  nextAction:'6-month re-engage reminder' },
  { id:'DZH-100', client:'Geetha Rao',         source:'Referral',   location:'Koramangala',     requirement:'3BHK Interior',             stage:'Lost', owner:'Ananya M.',            lastContacted:'Jun 04',        daysInStage:0,  value:18,  nextAction:'Understand why — budget issue?' },
];

// ─── Computed Stats ────────────────────────────────────────────────────────────

const TERMINAL_STAGES: FunnelStage[] = ['Advance Received', 'Execution', 'Completed', 'Lost'];
const ACTIVE_FUNNEL_STAGES: FunnelStage[] = [
  'New Inquiry', 'First Contact', 'Qualified', 'Consultation',
  'Site Visit', 'Proposal Sent', 'Quotation Sent', 'Negotiation',
];

export const dzinehomeStats = (() => {
  const activeFunnel = leads.filter((l) => ACTIVE_FUNNEL_STAGES.includes(l.stage));
  const stuckLeads = activeFunnel.filter((l) => l.daysInStage >= 7);
  const atRiskLeads = stuckLeads.filter((l) => l.value >= 30);

  const stageCounts: Record<FunnelStage, number> = {} as Record<FunnelStage, number>;
  const stageValues: Record<FunnelStage, number> = {} as Record<FunnelStage, number>;
  FUNNEL_STAGES.forEach((s) => { stageCounts[s] = 0; stageValues[s] = 0; });
  leads.forEach((l) => { stageCounts[l.stage]++; stageValues[l.stage] += l.value; });

  const sourceCounts: Record<LeadSource, number> = {} as Record<LeadSource, number>;
  (['WhatsApp','Instagram','Referral','Website','Phone Call','Walk-in'] as LeadSource[])
    .forEach((s) => { sourceCounts[s] = 0; });
  leads.forEach((l) => { sourceCounts[l.source]++; });

  const teamCounts: Record<string, number> = {};
  activeFunnel.forEach((l) => {
    teamCounts[l.owner] = (teamCounts[l.owner] || 0) + 1;
  });

  const pipelineStages: FunnelStage[] = ['Proposal Sent', 'Quotation Sent', 'Negotiation'];
  const pipelineValue = leads
    .filter((l) => pipelineStages.includes(l.stage))
    .reduce((sum, l) => sum + l.value, 0);

  const topStuckLeads = stuckLeads
    .sort((a, b) => b.value - a.value || b.daysInStage - a.daysInStage)
    .slice(0, 8);

  const founderLeads = leads
    .filter((l) => ['Quotation Sent','Negotiation'].includes(l.stage) && l.value >= 50)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const recentActivity = [
    { time: '9:42 AM',  lead: 'DZH-083', client: 'Kiran Mehta',       action: 'Advance received — ₹145L project confirmed',  type: 'won' },
    { time: '9:15 AM',  lead: 'DZH-074', client: 'Rohit Verma',       action: 'Negotiation update — timeline discussed',       type: 'update' },
    { time: '8:50 AM',  lead: 'DZH-003', client: 'Rahul Krishnan',    action: 'New inquiry — Office fitout, ₹35L',             type: 'new' },
    { time: 'Yesterday',lead: 'DZH-077', client: 'Anika Malhotra',    action: 'No response — stuck 9 days in Negotiation',    type: 'stuck' },
    { time: 'Yesterday',lead: 'DZH-085', client: 'Srinivas Sharma',   action: 'Execution update — week 6 milestone complete',  type: 'update' },
    { time: 'Jun 11',   lead: 'DZH-057', client: 'Sujatha Iyer',      action: 'Proposal — no reply in 10 days',                type: 'stuck' },
    { time: 'Jun 11',   lead: 'DZH-001', client: 'Priya Sharma',      action: 'New inquiry — 3BHK, ₹18L via WhatsApp',         type: 'new' },
    { time: 'Jun 10',   lead: 'DZH-063', client: 'Vikram Malhotra',   action: 'Quote sent — ₹150L Villa project',              type: 'update' },
  ];

  return {
    total: leads.length,
    activeFunnelCount: activeFunnel.length,
    stuckCount: stuckLeads.length,
    atRiskCount: atRiskLeads.length,
    stageCounts,
    stageValues,
    sourceCounts,
    teamCounts,
    pipelineValue,
    topStuckLeads,
    founderLeads,
    recentActivity,
    byStage: FUNNEL_STAGES.map((s) => ({
      stage: s,
      count: stageCounts[s],
      value: stageValues[s],
    })),
  };
})();
