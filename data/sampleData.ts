import type { UniversalLead, LeadSource } from '@/lib/leadTypes';

export interface SampleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  leads: UniversalLead[];
}

// ─── Helper types & utilities ────────────────────────────────

interface StageConfig {
  name: string;
  probabilityRange: [number, number];
  statusOverride?: 'won' | 'lost';
}

interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  stages: StageConfig[];
  owners: string[];
  ownerTeam: string;
  locations: string[];
  requirements: string[];
  sources: LeadSource[];
  valueRange: [number, number];
  nextActions: string[];
  clientNames: string[];
  emailDomain: string;
  phonePrefix: string;
}

function inferStatus(stage: string, daysInStage: number, stageConfigs: StageConfig[]): string {
  const cfg = stageConfigs.find(s => s.name === stage);
  if (cfg?.statusOverride === 'won') return 'won';
  if (cfg?.statusOverride === 'lost') return 'lost';
  if (daysInStage >= 7) return 'stuck';
  return 'active';
}

function pickProbability(stage: string, stageConfigs: StageConfig[]): number {
  const cfg = stageConfigs.find(s => s.name === stage);
  if (!cfg) return 30;
  const [min, max] = cfg.probabilityRange;
  return min + Math.floor(seededRandom() * (max - min + 1));
}

let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function resetSeed(val: number) {
  _seed = val;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)];
}

function pickIndex(max: number): number {
  return Math.floor(seededRandom() * max);
}

function generateDate(daysAgo: number): string {
  const d = new Date('2026-06-19');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function generatePhone(prefix: string): string {
  const n1 = String(10000 + pickIndex(89999));
  const n2 = String(10000 + pickIndex(89999));
  return `${prefix}${n1}-${n2}`;
}

function generateEmail(name: string, domain: string): string {
  const clean = name.toLowerCase().replace(/[^a-z ]/g, '').split(' ');
  if (clean.length >= 2) {
    return `${clean[0]}.${clean[1]}@${domain}`;
  }
  return `${clean[0]}${pickIndex(99)}@${domain}`;
}

function generateLeads(config: TemplateConfig, count: number): UniversalLead[] {
  resetSeed(config.id.length * 1000 + 42);
  const leads: UniversalLead[] = [];

  const activeStages = config.stages.filter(s => !s.statusOverride);
  const wonStages = config.stages.filter(s => s.statusOverride === 'won');
  const lostStages = config.stages.filter(s => s.statusOverride === 'lost');

  // Pre-assign stage types to ensure good distribution:
  // ~60% active stages, ~20% won, ~12% lost, ~8% stuck-guaranteed
  const stageSlots: Array<'active' | 'won' | 'lost'> = [];
  for (let i = 0; i < count; i++) {
    if (i < Math.floor(count * 0.20)) stageSlots.push('won');
    else if (i < Math.floor(count * 0.32)) stageSlots.push('lost');
    else stageSlots.push('active');
  }
  // Shuffle slots using seeded random
  for (let i = stageSlots.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [stageSlots[i], stageSlots[j]] = [stageSlots[j], stageSlots[i]];
  }

  for (let i = 0; i < count; i++) {
    const slotType = stageSlots[i];
    let stage: StageConfig;
    if (slotType === 'lost' && lostStages.length > 0) {
      stage = pick(lostStages);
    } else if (slotType === 'won' && wonStages.length > 0) {
      stage = pick(wonStages);
    } else {
      stage = pick(activeStages);
    }

    const clientName = config.clientNames[i % config.clientNames.length];
    // For active leads: ~40% should be stuck (daysInStage >= 7)
    const isStuckCandidate = !stage.statusOverride && seededRandom() < 0.35;
    const daysInStage = stage.statusOverride === 'won' ? 0
      : stage.statusOverride === 'lost' ? pickIndex(10)
      : isStuckCandidate ? 7 + pickIndex(8)
      : pickIndex(6);
    const daysSinceUpdate = Math.max(0, daysInStage - pickIndex(3));
    const isUnassigned = seededRandom() < 0.1;
    const owner = isUnassigned ? 'Unassigned' : pick(config.owners);
    const value = config.valueRange[0] + Math.floor(seededRandom() * (config.valueRange[1] - config.valueRange[0]));
    const createdDaysAgo = daysInStage + pickIndex(20) + 1;

    leads.push({
      id: `${config.id}-${String(i + 1).padStart(3, '0')}`,
      client: clientName,
      phone: generatePhone(config.phonePrefix),
      email: generateEmail(clientName, config.emailDomain),
      source: pick(config.sources),
      location: pick(config.locations),
      requirement: pick(config.requirements),
      stage: stage.name,
      status: inferStatus(stage.name, daysInStage, config.stages),
      ownerTeam: isUnassigned ? 'Unassigned' : config.ownerTeam,
      owner,
      createdAt: generateDate(createdDaysAgo),
      lastContacted: generateDate(daysSinceUpdate),
      daysInStage,
      daysSinceUpdate,
      value,
      probability: pickProbability(stage.name, config.stages),
      nextAction: pick(config.nextActions),
    });


  }

  return leads;
}

// ─── Name pools ──────────────────────────────────────────────

const INDIAN_NAMES = [
  'Priya Sharma', 'Rajiv Mehta', 'Deepa Iyer', 'Suresh Kumar', 'Anjali Singh',
  'Vikram Nair', 'Meena Patel', 'Aryan Gupta', 'Kavya Reddy', 'Rahul Krishnan',
  'Sonal Joshi', 'Nikhil Desai', 'Pooja Menon', 'Rohit Verma', 'Shilpa Rao',
  'Aditya Kumar', 'Preethi Nair', 'Manish Shah', 'Divya Pillai', 'Karan Malhotra',
  'Sneha Iyer', 'Varun Shetty', 'Lakshmi Prasad', 'Nitin Sharma', 'Amrita Kapoor',
  'Girish Rao', 'Tanvi Joshi', 'Sanjay Mehta', 'Ritu Aggarwal', 'Harsha Pillai',
  'Ananya Bhat', 'Vivek Sundaram', 'Rekha Nambiar', 'Prakash Hegde', 'Swati Kulkarni',
];

const MIXED_NAMES = [
  'Priya Sharma', 'James Wilson', 'Deepa Iyer', 'Michael Chen', 'Anjali Singh',
  'Sarah Johnson', 'Meena Patel', 'David Kim', 'Kavya Reddy', 'Robert Taylor',
  'Sonal Joshi', 'Emily Davis', 'Pooja Menon', 'Chris Anderson', 'Shilpa Rao',
  'Laura Martinez', 'Preethi Nair', 'Daniel Brown', 'Divya Pillai', 'Karen White',
  'Sneha Iyer', 'Tom Harris', 'Lakshmi Prasad', 'Jessica Lee', 'Amrita Kapoor',
  'Mark Thompson', 'Tanvi Joshi', 'Rachel Green', 'Ritu Aggarwal', 'Alex Morgan',
  'Ananya Bhat', 'Brian Clark', 'Rekha Nambiar', 'Sophie Turner', 'Vivek Sundaram',
];

const SAAS_NAMES = [
  'TechFlow Inc', 'DataBridge Solutions', 'CloudSync Labs', 'PixelWave Studio',
  'GreenLeaf Analytics', 'NovaSpark AI', 'SwiftPay Systems', 'MetricHub Corp',
  'BlueRidge Software', 'QuantumEdge Tech', 'VeloCity Apps', 'PrimeStack IO',
  'Zenith Digital', 'ApexCloud Services', 'CodeNest Solutions', 'BrightPath SaaS',
  'IronGate Security', 'NimbusWorks', 'FusionTech Labs', 'ClearView Analytics',
  'StarGrid Computing', 'PulsePoint Data', 'AgileCraft Tools', 'DeepSight AI',
  'TrueNorth Systems', 'FlowState Tech', 'BridgePoint SaaS', 'VertexLabs',
  'HorizonScale', 'OmniStack Corp', 'CrestWave Digital', 'PeakLogic Software',
  'AtlasForge', 'RapidBase IO', 'CoreSignal Tech',
];

const AGENCY_NAMES = [
  'Priya Sharma', 'James Wilson', 'Nidhi Kapoor', 'Michael Chen', 'Rakesh Gupta',
  'Sarah Johnson', 'Arjun Menon', 'David Kim', 'Meera Sinha', 'Robert Taylor',
  'Sunita Reddy', 'Emily Davis', 'Vikash Yadav', 'Chris Anderson', 'Poornima Rao',
  'Laura Martinez', 'Harsh Vardhan', 'Daniel Brown', 'Ranjini Nair', 'Karen White',
  'Siddharth Patel', 'Tom Harris', 'Gayatri Iyer', 'Jessica Lee', 'Anand Kulkarni',
  'Mark Thompson', 'Bhavana Desai', 'Rachel Green', 'Tarun Bhatia', 'Alex Morgan',
  'Neha Agarwal', 'Brian Clark', 'Mahesh Hegde', 'Sophie Turner', 'Aisha Khan',
];

const HEALTHCARE_NAMES = [
  'Ramesh Gupta', 'Fatima Sheikh', 'Sunil Patel', 'Ayesha Khan', 'Vinod Sharma',
  'Nasreen Begum', 'Prakash Rao', 'Zainab Ali', 'Gopal Krishna', 'Saira Bano',
  'Rajan Nair', 'Mumtaz Khatun', 'Manoj Singh', 'Haseena Banu', 'Vijay Kumar',
  'Reshma Siddiqui', 'Ashok Pillai', 'Nusrat Jahan', 'Dinesh Verma', 'Shabnam Parveen',
  'Kishore Reddy', 'Tabassum Ara', 'Naveen Hegde', 'Sakina Bibi', 'Rajendra Prasad',
  'Amina Khatoon', 'Sudhir Menon', 'Farzana Sultana', 'Balaji Sundaram', 'Rukhsar Naaz',
  'Harish Joshi', 'Samina Begum', 'Arun Kumar', 'Nafisa Sheikh', 'Mohan Das',
];

const REALESTATE_NAMES = [
  'Rajesh Agarwal', 'Sunita Reddy', 'Mohan Kapoor', 'Lakshmi Devi', 'Vinay Singhania',
  'Kamala Nair', 'Pramod Jain', 'Saroja Iyer', 'Ashish Mittal', 'Padma Rao',
  'Dinesh Gupta', 'Revathi Menon', 'Sunil Bansal', 'Vasanthi Pillai', 'Naveen Goel',
  'Sumathi Krishnan', 'Ravi Khandelwal', 'Meenakshi Sharma', 'Ajay Maheshwari', 'Geetha Nambiar',
  'Pankaj Oswal', 'Janaki Sundaram', 'Sanjay Lodha', 'Bhavani Hegde', 'Manoj Sethia',
  'Usha Rani', 'Deepak Birla', 'Saraswathi Bhat', 'Rahul Bajaj', 'Prema Kumari',
  'Anil Goenka', 'Vijayalakshmi', 'Kiran Parekh', 'Nalini Desai', 'Suresh Jhunjhunwala',
];

const EDUCATION_NAMES = [
  'Arjun Nair', 'Megha Srinivasan', 'Rohan Deshmukh', 'Ananya Krishnamurthy', 'Varun Bhat',
  'Shreya Venkatesh', 'Aakash Patel', 'Isha Raghavan', 'Dev Sharma', 'Tanya Joshi',
  'Karthik Subramanian', 'Nisha Iyer', 'Pranav Kulkarni', 'Aditi Menon', 'Sahil Gupta',
  'Riya Nambiar', 'Arun Hegde', 'Divya Sundaram', 'Nihal Khan', 'Pooja Reddy',
  'Siddharth Rao', 'Meghana Pillai', 'Harsh Agarwal', 'Kavita Nair', 'Rahul Bose',
  'Swathi Krishna', 'Tarun Mehta', 'Anjali Prasad', 'Vishal Singh', 'Neha Sharma',
  'Abhishek Iyer', 'Prerna Kaur', 'Akshay Verma', 'Simran Gill', 'Dhruv Malhotra',
];

const EVENTS_NAMES = [
  'Priya Malhotra', 'Ravi Shankar', 'Neha Aggarwal', 'Vikram Khanna', 'Sunita Rao',
  'Amit Bhasin', 'Kavya Nair', 'Manish Arora', 'Deepa Krishnan', 'Sanjay Puri',
  'Asha Hegde', 'Rajat Kapoor', 'Meera Sundaram', 'Vijay Malya', 'Pooja Shetty',
  'Karan Johar', 'Anita Desai', 'Sunil Gavaskar', 'Renu Pillai', 'Aakash Mehta',
  'Jyoti Bhat', 'Prakash Sharma', 'Geeta Iyer', 'Naresh Goyal', 'Savita Kulkarni',
  'Hemant Verma', 'Usha Nair', 'Rajendra Prasad', 'Lalita Menon', 'Ashwin Reddy',
  'Bhavana Joshi', 'Tarun Singh', 'Padma Subramanian', 'Mohan Lal', 'Smita Patil',
];

const RETAIL_NAMES = [
  'Ramesh Store', 'Patel Traders', 'Singh Electronics', 'Kumar Fashions', 'Sharma General Store',
  'Gupta Hardware', 'Joshi Opticals', 'Iyer Silks', 'Nair Furniture', 'Reddy Supermart',
  'Mehta Jewellers', 'Rao Pharmacy', 'Verma Sports', 'Kapoor Bakery', 'Desai Textiles',
  'Bhat Stationery', 'Pillai Mobiles', 'Khan Perfumes', 'Hegde Organics', 'Sundaram Watches',
  'Aggarwal Sweets', 'Krishnan Books', 'Malhotra Shoes', 'Menon Tea House', 'Shetty Hardware',
  'Kulkarni Medical', 'Prasad Garments', 'Nambiar Auto Parts', 'Singhania Home Decor', 'Arora Gift Shop',
  'Chandra Electronics', 'Mukherjee Sarees', 'Saxena Cosmetics', 'Bansal Dry Fruits', 'Tiwari Provisions',
];

const VIRALREELS_NAMES = [
  'FreshBite Cafe', 'GlowUp Skincare', 'FitZone Gym', 'StyleHub Boutique', 'TravelMate Tours',
  'HomeBrew Coffee', 'PetPals Store', 'ArtisanCraft Studio', 'QuickBite Delivery', 'EcoWear Fashion',
  'UrbanNest Interiors', 'SpiceRoute Restaurant', 'BookNook Cafe', 'ZenYoga Studio', 'TechGadget Store',
  'BloomBox Florist', 'StreetStyle Brand', 'FreshFarm Organics', 'SnapShot Photography', 'DanceVibe Academy',
  'MealPrep Kitchen', 'GlamSquad Salon', 'PixelPerfect Design', 'SoulFood Bakery', 'WanderLust Travel',
  'NeonNights Lounge', 'GreenThumb Garden', 'VintageVibes Store', 'PowerLift Gym', 'CraftBeer Pub',
  'SmoothBlend Juices', 'UrbanArt Gallery', 'ChillZone Hookah', 'BoldBrew Roasters', 'FlexFit Athleisure',
];

// ─── Template configurations ────────────────────────────────

const GENERIC_CONFIG: TemplateConfig = {
  id: 'generic',
  name: 'Generic Business',
  description: 'Mixed business leads across industries',
  icon: '🏢',
  stages: [
    { name: 'New Inquiry', probabilityRange: [5, 15] },
    { name: 'First Contact', probabilityRange: [10, 25] },
    { name: 'Qualified', probabilityRange: [25, 40] },
    { name: 'Proposal Sent', probabilityRange: [35, 55] },
    { name: 'Negotiation', probabilityRange: [50, 70] },
    { name: 'Completed', probabilityRange: [100, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Amit R.', 'Priya S.', 'Rajesh K.', 'Neha M.'],
  ownerTeam: 'Sales Team',
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'],
  requirements: [
    'Annual service contract', 'Product bulk order', 'Custom solution needed',
    'Consulting engagement', 'Partnership discussion', 'Vendor onboarding',
    'Maintenance contract renewal', 'New project scoping', 'Training program',
    'Support plan upgrade',
  ],
  sources: ['WhatsApp', 'Phone Call', 'Email', 'Website', 'Referral', 'LinkedIn', 'Google Ads'],
  valueRange: [25000, 500000],
  nextActions: [
    'Send proposal', 'Follow up call', 'Schedule meeting', 'Send quotation',
    'Share case study', 'Arrange demo', 'Negotiate terms', 'Close deal',
  ],
  clientNames: MIXED_NAMES,
  emailDomain: 'business.com',
  phonePrefix: '+91-',
};

const SAAS_CONFIG: TemplateConfig = {
  id: 'saas',
  name: 'SaaS',
  description: 'Software and subscription leads',
  icon: '💻',
  stages: [
    { name: 'New Inquiry', probabilityRange: [5, 15] },
    { name: 'Demo Booked', probabilityRange: [15, 25] },
    { name: 'Demo Completed', probabilityRange: [25, 40] },
    { name: 'Trial Started', probabilityRange: [35, 50] },
    { name: 'Proposal Sent', probabilityRange: [45, 60] },
    { name: 'Negotiation', probabilityRange: [55, 75] },
    { name: 'Closed Won', probabilityRange: [95, 100], statusOverride: 'won' },
    { name: 'Closed Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Anika D.', 'Rohan P.', 'Sita V.', 'Dev K.'],
  ownerTeam: 'SaaS Sales',
  locations: ['San Francisco', 'New York', 'London', 'Bangalore', 'Singapore', 'Berlin', 'Sydney', 'Toronto'],
  requirements: [
    'Enterprise plan - 500 seats', 'Startup plan - 20 seats', 'API integration needed',
    'Custom SSO setup', 'Data migration from competitor', 'Team plan upgrade',
    'Annual enterprise license', 'Platform evaluation', 'Multi-region deployment',
    'White-label solution',
  ],
  sources: ['Website', 'LinkedIn', 'Google Ads', 'Email', 'Referral', 'Campaign'],
  valueRange: [5000, 120000],
  nextActions: [
    'Schedule demo', 'Send trial credentials', 'Share pricing deck', 'Follow up on trial',
    'Arrange technical call', 'Send contract', 'Negotiate enterprise terms', 'Onboard team',
  ],
  clientNames: SAAS_NAMES,
  emailDomain: 'company.io',
  phonePrefix: '+1-',
};

const AGENCY_CONFIG: TemplateConfig = {
  id: 'agency',
  name: 'Agency / Consulting',
  description: 'Consulting and agency project leads',
  icon: '📊',
  stages: [
    { name: 'New Inquiry', probabilityRange: [5, 15] },
    { name: 'First Contact', probabilityRange: [10, 20] },
    { name: 'Qualified', probabilityRange: [20, 35] },
    { name: 'Proposal Sent', probabilityRange: [35, 50] },
    { name: 'Quotation Sent', probabilityRange: [40, 55] },
    { name: 'Negotiation', probabilityRange: [50, 70] },
    { name: 'Execution', probabilityRange: [85, 95] },
    { name: 'Completed', probabilityRange: [100, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Vikram S.', 'Nidhi K.', 'Arun M.', 'Shalini R.'],
  ownerTeam: 'Consulting',
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida'],
  requirements: [
    'Brand strategy overhaul', 'Digital marketing retainer', 'Website redesign project',
    'Social media management', 'SEO and content strategy', 'PR and communications',
    'Market research study', 'UX audit and redesign', 'Performance marketing setup',
    'Employer branding project',
  ],
  sources: ['Referral', 'LinkedIn', 'Email', 'Website', 'Phone Call', 'Instagram'],
  valueRange: [100000, 1500000],
  nextActions: [
    'Send proposal', 'Present strategy deck', 'Share case studies', 'Negotiate scope',
    'Schedule kickoff', 'Send revised quote', 'Follow up with decision maker', 'Arrange workshop',
  ],
  clientNames: AGENCY_NAMES,
  emailDomain: 'agency-client.com',
  phonePrefix: '+91-',
};

const INTERIOR_CONFIG: TemplateConfig = {
  id: 'interior',
  name: 'Interior / Architecture',
  description: 'Interior design and architecture project leads',
  icon: '🏠',
  stages: [
    { name: 'New Inquiry', probabilityRange: [5, 15] },
    { name: 'First Contact', probabilityRange: [10, 20] },
    { name: 'Qualified', probabilityRange: [20, 35] },
    { name: 'Consultation', probabilityRange: [30, 45] },
    { name: 'Site Visit', probabilityRange: [40, 55] },
    { name: 'Proposal Sent', probabilityRange: [45, 60] },
    { name: 'Quotation Sent', probabilityRange: [50, 65] },
    { name: 'Negotiation', probabilityRange: [55, 75] },
    { name: 'Advance Received', probabilityRange: [85, 95] },
    { name: 'Execution', probabilityRange: [90, 98] },
    { name: 'Completed', probabilityRange: [100, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Neha A.', 'Arjun D.', 'Ravi P.', 'Meera S.'],
  ownerTeam: 'Design Team',
  locations: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kochi', 'Goa'],
  requirements: [
    'Full home interior 3BHK', 'Office fit-out 4000 sqft', 'Living room + master bedroom',
    'Commercial showroom design', 'Villa interior + landscaping', 'Kitchen + dining renovation',
    'Studio apartment 500 sqft', 'Corporate office 2500 sqft', 'Cafe interior + signage',
    'Duplex full home design', 'Restaurant interior 2000 sqft', 'Penthouse luxury design',
  ],
  sources: ['WhatsApp', 'Instagram', 'Referral', 'Website', 'Phone Call', 'Walk-in'],
  valueRange: [200000, 5000000],
  nextActions: [
    'Schedule site visit', 'Send moodboard', 'Prepare 3D walkthrough', 'Share quotation',
    'Follow up on proposal', 'Collect advance', 'Start execution', 'Present concept',
  ],
  clientNames: INDIAN_NAMES,
  emailDomain: 'homeowner.in',
  phonePrefix: '+91-',
};

const HEALTHCARE_CONFIG: TemplateConfig = {
  id: 'healthcare',
  name: 'Clinic / Healthcare',
  description: 'Patient and appointment leads for clinics',
  icon: '🏥',
  stages: [
    { name: 'Enquiry', probabilityRange: [5, 15] },
    { name: 'Appointment Booked', probabilityRange: [20, 35] },
    { name: 'Consultation Done', probabilityRange: [35, 50] },
    { name: 'Treatment Plan', probabilityRange: [45, 60] },
    { name: 'Payment', probabilityRange: [70, 85] },
    { name: 'In Treatment', probabilityRange: [85, 95] },
    { name: 'Completed', probabilityRange: [100, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Dr. Anand K.', 'Dr. Sunita R.', 'Priya (Coord)', 'Ravi (Coord)'],
  ownerTeam: 'Clinical Team',
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Jaipur'],
  requirements: [
    'Dental implants - full mouth', 'Orthodontic braces consultation', 'Knee replacement surgery',
    'Skin treatment - acne scars', 'Hair transplant evaluation', 'Eye LASIK surgery',
    'Physiotherapy - sports injury', 'IVF consultation', 'Cosmetic rhinoplasty',
    'Weight loss program', 'Cardiac checkup package', 'Diabetes management plan',
  ],
  sources: ['Phone Call', 'WhatsApp', 'Google Ads', 'Website', 'Referral', 'Walk-in'],
  valueRange: [15000, 500000],
  nextActions: [
    'Confirm appointment', 'Share treatment plan', 'Collect reports', 'Schedule follow-up',
    'Process payment', 'Send pre-op instructions', 'Book surgery slot', 'Send recovery guide',
  ],
  clientNames: HEALTHCARE_NAMES,
  emailDomain: 'patient.in',
  phonePrefix: '+91-',
};

const REALESTATE_CONFIG: TemplateConfig = {
  id: 'realestate',
  name: 'Real Estate',
  description: 'Property sales and rental leads',
  icon: '🏗️',
  stages: [
    { name: 'Enquiry', probabilityRange: [5, 12] },
    { name: 'Contacted', probabilityRange: [10, 20] },
    { name: 'Site Visit', probabilityRange: [20, 35] },
    { name: 'Interested', probabilityRange: [35, 50] },
    { name: 'Negotiation', probabilityRange: [50, 65] },
    { name: 'Booking', probabilityRange: [70, 85] },
    { name: 'Agreement', probabilityRange: [85, 95] },
    { name: 'Registered', probabilityRange: [98, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Mohit T.', 'Anita G.', 'Sanjay B.', 'Rekha P.'],
  ownerTeam: 'Sales',
  locations: ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Noida', 'Gurgaon', 'Thane', 'Navi Mumbai'],
  requirements: [
    '2BHK flat - budget segment', '3BHK premium apartment', 'Row house with garden',
    'Commercial office space 1500 sqft', 'Plot 2000 sqft residential', 'Penthouse 4BHK sea view',
    '1BHK investment property', 'Villa project 3000 sqft', 'Shop space in mall',
    'Warehouse 5000 sqft', '4BHK duplex apartment', 'Studio apartment for rental income',
  ],
  sources: ['Google Ads', 'Website', 'Phone Call', 'Referral', 'WhatsApp', 'Facebook', 'Walk-in'],
  valueRange: [2500000, 25000000],
  nextActions: [
    'Schedule site visit', 'Share brochure', 'Follow up post visit', 'Negotiate price',
    'Process booking amount', 'Prepare agreement', 'Arrange home loan assist', 'Registry coordination',
  ],
  clientNames: REALESTATE_NAMES,
  emailDomain: 'buyer.in',
  phonePrefix: '+91-',
};

const EDUCATION_CONFIG: TemplateConfig = {
  id: 'education',
  name: 'Coaching / Education',
  description: 'Student enrollment and coaching leads',
  icon: '🎓',
  stages: [
    { name: 'Enquiry', probabilityRange: [5, 15] },
    { name: 'Counselling', probabilityRange: [15, 30] },
    { name: 'Application', probabilityRange: [30, 45] },
    { name: 'Document Submitted', probabilityRange: [40, 55] },
    { name: 'Admission Offered', probabilityRange: [55, 70] },
    { name: 'Fee Paid', probabilityRange: [85, 95] },
    { name: 'Enrolled', probabilityRange: [98, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Meera C.', 'Suresh N.', 'Anita B.', 'Karthik R.'],
  ownerTeam: 'Admissions',
  locations: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Lucknow'],
  requirements: [
    'MBA full-time program', 'Data Science certification', 'Digital marketing course',
    'UPSC coaching - prelims batch', 'IELTS preparation intensive', 'B.Tech CSE admission',
    'CA foundation coaching', 'Study abroad - MS in USA', 'NEET preparation batch',
    'Executive MBA weekend program', 'Python + AI bootcamp', 'GRE + university application',
  ],
  sources: ['Website', 'Google Ads', 'Phone Call', 'WhatsApp', 'Instagram', 'Referral', 'Campaign'],
  valueRange: [25000, 500000],
  nextActions: [
    'Schedule counselling', 'Send course brochure', 'Follow up on application', 'Collect documents',
    'Process admission offer', 'Share fee structure', 'Arrange campus tour', 'Connect with alumni',
  ],
  clientNames: EDUCATION_NAMES,
  emailDomain: 'student.edu',
  phonePrefix: '+91-',
};

const EVENTS_CONFIG: TemplateConfig = {
  id: 'events',
  name: 'Events / Exhibitions',
  description: 'Event planning and exhibition leads',
  icon: '🎪',
  stages: [
    { name: 'Enquiry', probabilityRange: [5, 15] },
    { name: 'Consultation', probabilityRange: [15, 25] },
    { name: 'Proposal Sent', probabilityRange: [25, 40] },
    { name: 'Quotation Sent', probabilityRange: [35, 50] },
    { name: 'Negotiation', probabilityRange: [50, 65] },
    { name: 'Advance Received', probabilityRange: [75, 90] },
    { name: 'Planning', probabilityRange: [85, 95] },
    { name: 'Execution', probabilityRange: [90, 98] },
    { name: 'Completed', probabilityRange: [100, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Priya M.', 'Ravi S.', 'Ankit B.', 'Divya N.'],
  ownerTeam: 'Events Team',
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Goa', 'Jaipur', 'Udaipur', 'Chennai'],
  requirements: [
    'Corporate annual conference 500 pax', 'Wedding reception - grand ballroom',
    'Product launch event', 'Exhibition stall design 9x6m', 'Birthday party - premium theme',
    'Corporate team outing 100 pax', 'Award ceremony and gala dinner',
    'Trade show booth + collateral', 'Destination wedding planning',
    'Seminar + workshop setup 200 pax', 'Brand activation campaign', 'Music festival stage setup',
  ],
  sources: ['Referral', 'Instagram', 'WhatsApp', 'Website', 'Phone Call', 'Email'],
  valueRange: [100000, 3000000],
  nextActions: [
    'Site recce', 'Send mood board', 'Share detailed proposal', 'Negotiate vendor rates',
    'Collect advance payment', 'Finalize vendor list', 'Coordinate logistics', 'Run rehearsal',
  ],
  clientNames: EVENTS_NAMES,
  emailDomain: 'events-client.com',
  phonePrefix: '+91-',
};

const RETAIL_CONFIG: TemplateConfig = {
  id: 'retail',
  name: 'Retail / Local Business',
  description: 'Retail and local business leads',
  icon: '🛍️',
  stages: [
    { name: 'New Inquiry', probabilityRange: [5, 15] },
    { name: 'First Contact', probabilityRange: [10, 25] },
    { name: 'Quote Sent', probabilityRange: [30, 45] },
    { name: 'Follow-up', probabilityRange: [40, 55] },
    { name: 'Negotiation', probabilityRange: [50, 70] },
    { name: 'Completed', probabilityRange: [100, 100], statusOverride: 'won' },
    { name: 'Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Ramesh V.', 'Sunita K.', 'Anil P.', 'Geeta D.'],
  ownerTeam: 'Retail Sales',
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Ahmedabad', 'Surat', 'Indore'],
  requirements: [
    'Bulk order - festive season stock', 'POS system installation', 'Store renovation quote',
    'Franchise inquiry', 'Wholesale pricing for 500 units', 'Custom packaging design',
    'Inventory management setup', 'Signage and branding refresh', 'Delivery logistics partnership',
    'Digital payment terminal setup', 'Loyalty program integration', 'Staff uniform bulk order',
  ],
  sources: ['WhatsApp', 'Phone Call', 'Walk-in', 'Referral', 'Google Ads', 'Website'],
  valueRange: [10000, 300000],
  nextActions: [
    'Send price list', 'Schedule store visit', 'Share bulk discount quote', 'Follow up on order',
    'Arrange product demo', 'Process order', 'Negotiate payment terms', 'Confirm delivery date',
  ],
  clientNames: RETAIL_NAMES,
  emailDomain: 'retailer.in',
  phonePrefix: '+91-',
};

const VIRALREELS_CONFIG: TemplateConfig = {
  id: 'viralreels',
  name: 'ViralReels Sample',
  description: 'Social media growth agency sample data',
  icon: '🎬',
  stages: [
    { name: 'New Inquiry', probabilityRange: [5, 15] },
    { name: 'First Contact', probabilityRange: [10, 20] },
    { name: 'Qualified', probabilityRange: [20, 35] },
    { name: 'Demo Booked', probabilityRange: [30, 45] },
    { name: 'Demo Completed', probabilityRange: [40, 55] },
    { name: 'Proposal Sent', probabilityRange: [50, 65] },
    { name: 'Negotiation', probabilityRange: [55, 75] },
    { name: 'Closed Won', probabilityRange: [95, 100], statusOverride: 'won' },
    { name: 'Active Customer', probabilityRange: [98, 100], statusOverride: 'won' },
    { name: 'Closed Lost', probabilityRange: [0, 0], statusOverride: 'lost' },
  ],
  owners: ['Arjun K.', 'Sneha P.', 'Rahul M.', 'Divya S.'],
  ownerTeam: 'ViralReels Sales',
  locations: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Jaipur', 'Goa'],
  requirements: [
    'Instagram Growth Package', 'YouTube Shorts Strategy', 'Influencer Collab Package',
    'Brand Reels Bundle', 'TikTok Growth Plan', 'Social Media Audit + Strategy',
    'Content Calendar Management', 'Viral Video Production - 30 reels/month',
    'Influencer Marketing Campaign', 'UGC Content Creation Package',
    'Reels + Stories daily management', 'LinkedIn Video Strategy',
  ],
  sources: ['Instagram', 'WhatsApp', 'Referral', 'Website', 'LinkedIn', 'Google Ads'],
  valueRange: [15000, 300000],
  nextActions: [
    'Share portfolio deck', 'Schedule strategy call', 'Send pricing packages', 'Demo past campaigns',
    'Share case study results', 'Negotiate retainer terms', 'Onboard to dashboard', 'Start content audit',
  ],
  clientNames: VIRALREELS_NAMES,
  emailDomain: 'brand.social',
  phonePrefix: '+91-',
};

// ─── Generate all template data ─────────────────────────────

const CONFIGS: TemplateConfig[] = [
  GENERIC_CONFIG, SAAS_CONFIG, AGENCY_CONFIG, INTERIOR_CONFIG,
  HEALTHCARE_CONFIG, REALESTATE_CONFIG, EDUCATION_CONFIG,
  EVENTS_CONFIG, RETAIL_CONFIG, VIRALREELS_CONFIG,
];

export const SAMPLE_TEMPLATES: SampleTemplate[] = CONFIGS.map(cfg => ({
  id: cfg.id,
  name: cfg.name,
  description: cfg.description,
  icon: cfg.icon,
  leads: generateLeads(cfg, 35),
}));

export function getSampleLeads(templateId: string): UniversalLead[] {
  const template = SAMPLE_TEMPLATES.find(t => t.id === templateId);
  return template?.leads ?? [];
}
