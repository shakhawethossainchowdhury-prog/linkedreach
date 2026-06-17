export type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  prospects: number;
  connected: number;
  replied: number;
  connectionRate: number;
  replyRate: number;
  createdAt: string;
  target: string;
  steps: number;
}

export interface Prospect {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  status: 'pending' | 'connected' | 'replied' | 'meeting' | 'dropped';
  campaign: string;
  addedAt: string;
  lastAction: string;
  email?: string;
}

export interface Message {
  id: string;
  from: string;
  company: string;
  preview: string;
  time: string;
  unread: boolean;
  avatar: string;
  thread: { role: 'out' | 'in'; text: string; time: string }[];
}

export const CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'ERP Decision Makers – BD', status: 'active', prospects: 248, connected: 92, replied: 31, connectionRate: 37, replyRate: 34, createdAt: '2025-05-10', target: 'CFO, COO, IT Manager', steps: 5 },
  { id: 'c2', name: 'Fintech UAE – Exchange Houses', status: 'active', prospects: 186, connected: 74, replied: 28, connectionRate: 40, replyRate: 38, createdAt: '2025-05-18', target: 'CTO, Head of Digital', steps: 4 },
  { id: 'c3', name: 'Staff Aug – German Agencies', status: 'paused', prospects: 134, connected: 51, replied: 14, connectionRate: 38, replyRate: 27, createdAt: '2025-05-22', target: 'CTO, VP Engineering', steps: 4 },
  { id: 'c4', name: 'Shopify Stores – UK', status: 'draft', prospects: 0, connected: 0, replied: 0, connectionRate: 0, replyRate: 0, createdAt: '2025-06-01', target: 'Head of eCommerce', steps: 3 },
  { id: 'c5', name: 'Cloud Migration – USA SaaS', status: 'completed', prospects: 312, connected: 118, replied: 44, connectionRate: 38, replyRate: 37, createdAt: '2025-04-01', target: 'CIO, DevOps Lead', steps: 5 },
];

export const PROSPECTS: Prospect[] = [
  { id: 'p1', name: 'Rashida Ahmed', title: 'CFO', company: 'Apex Textiles Ltd', location: 'Dhaka, BD', status: 'replied', campaign: 'ERP Decision Makers – BD', addedAt: '2025-05-12', lastAction: 'Replied to message 2' },
  { id: 'p2', name: 'Omar Al-Rashid', title: 'Head of Digital Banking', company: 'Gulf Exchange House', location: 'Dubai, UAE', status: 'connected', campaign: 'Fintech UAE – Exchange Houses', addedAt: '2025-05-19', lastAction: 'Connected' },
  { id: 'p3', name: 'Klaus Müller', title: 'CTO', company: 'RemoteTeam GmbH', location: 'Berlin, DE', status: 'meeting', campaign: 'Staff Aug – German Agencies', addedAt: '2025-05-23', lastAction: 'Meeting booked' },
  { id: 'p4', name: 'Priya Sharma', title: 'COO', company: 'MegaMart Retail', location: 'Dhaka, BD', status: 'pending', campaign: 'ERP Decision Makers – BD', addedAt: '2025-06-01', lastAction: 'Connection request sent' },
  { id: 'p5', name: 'James Whitfield', title: 'Head of eCommerce', company: 'SwiftStore UK', location: 'London, UK', status: 'connected', campaign: 'Shopify Stores – UK', addedAt: '2025-06-03', lastAction: 'Connected' },
  { id: 'p6', name: 'Nadia Hassan', title: 'CTO', company: 'FinEdge Solutions', location: 'Riyadh, SA', status: 'replied', campaign: 'Fintech UAE – Exchange Houses', addedAt: '2025-05-20', lastAction: 'Replied positively' },
  { id: 'p7', name: 'David Park', title: 'VP Engineering', company: 'CloudFirst Systems', location: 'San Francisco, US', status: 'dropped', campaign: 'Cloud Migration – USA SaaS', addedAt: '2025-04-05', lastAction: 'No response after 5 steps' },
  { id: 'p8', name: 'Fatima Malik', title: 'IT Manager', company: 'PharmaDistrib BD', location: 'Chittagong, BD', status: 'pending', campaign: 'ERP Decision Makers – BD', addedAt: '2025-06-05', lastAction: 'Added to campaign' },
];

export const MESSAGES: Message[] = [
  { id: 'm1', from: 'Klaus Müller', company: 'RemoteTeam GmbH', preview: 'Yes, we would love to explore this further. Can we schedule a call?', time: '2h ago', unread: true, avatar: 'KM', thread: [
    { role: 'out', text: 'Hi Klaus, saw that RemoteTeam is actively hiring senior engineers. If local hiring timelines are stretching out, we work with software teams in similar situations — placing pre-vetted remote engineers quickly. Worth a short conversation?', time: '3 days ago' },
    { role: 'in', text: 'Hi! Thanks for reaching out. Yes, we are struggling with hiring right now — took 4 months to fill our last senior backend role.', time: '2 days ago' },
    { role: 'out', text: 'That is a long wait. We typically place engineers within 2–3 weeks. Happy to share a few profiles from our talent pool if that would be useful.', time: '1 day ago' },
    { role: 'in', text: 'Yes, we would love to explore this further. Can we schedule a call?', time: '2h ago' },
  ]},
  { id: 'm2', from: 'Rashida Ahmed', company: 'Apex Textiles Ltd', preview: 'Interesting. We are evaluating options right now. Send me more details.', time: '5h ago', unread: true, avatar: 'RA', thread: [
    { role: 'out', text: 'Saw that Apex is expanding to new factories. Teams at this stage often hit a wall with inventory visibility across sites. We have helped similar manufacturers fix this with ERP. Curious if that is something on your radar.', time: '2 days ago' },
    { role: 'in', text: 'Interesting. We are evaluating options right now. Send me more details.', time: '5h ago' },
  ]},
  { id: 'm3', from: 'Nadia Hassan', company: 'FinEdge Solutions', preview: 'We are building from scratch, would love to see what you have built before.', time: '1d ago', unread: false, avatar: 'NH', thread: [
    { role: 'out', text: 'We work with fintech teams building mobile-first banking products. If it helps, happy to share a few relevant case studies from similar builds.', time: '3 days ago' },
    { role: 'in', text: 'We are building from scratch, would love to see what you have built before.', time: '1d ago' },
  ]},
  { id: 'm4', from: 'Omar Al-Rashid', company: 'Gulf Exchange House', preview: 'Let me check with my team and get back to you.', time: '2d ago', unread: false, avatar: 'OA', thread: [
    { role: 'out', text: 'Gulf Exchange House seems to be at an interesting point — digitizing operations at 40 branches is a big undertaking. We have done similar work for exchange houses in GCC. Happy to share specifics.', time: '4 days ago' },
    { role: 'in', text: 'Let me check with my team and get back to you.', time: '2d ago' },
  ]},
];

export const TEMPLATES = [
  { id: 't1', name: 'ERP – Expansion Signal', service: 'ERP', steps: 5, useRate: 68, desc: 'For manufacturers and distributors expanding operations. Connection + 4 follow-ups.' },
  { id: 't2', name: 'Fintech – Funding Round', service: 'Fintech', steps: 4, useRate: 74, desc: 'For fintech startups that recently raised. Congrats-based opener with value follow-ups.' },
  { id: 't3', name: 'Staff Aug – Hiring Signal', service: 'Staff Augmentation', steps: 4, useRate: 82, desc: 'Triggers when LinkedIn shows active hiring. Lead with speed-to-hire angle.' },
  { id: 't4', name: 'Cloud – Migration Intent', service: 'Cloud', steps: 5, useRate: 61, desc: 'For companies publicly signaling cloud migration. CTO/CIO focused.' },
  { id: 't5', name: 'Shopify – eCommerce Manager Hired', service: 'Shopify', steps: 3, useRate: 55, desc: 'Short 3-step sequence for Shopify stores that just hired eCommerce talent.' },
  { id: 't6', name: 'General – No Signal (Cold)', service: 'All', steps: 4, useRate: 43, desc: 'Cold outreach with no specific trigger. Industry pain point opener.' },
];

export const WEEKLY_STATS = [
  { day: 'Mon', connections: 18, replies: 6, views: 42 },
  { day: 'Tue', connections: 22, replies: 9, views: 51 },
  { day: 'Wed', connections: 15, replies: 5, views: 38 },
  { day: 'Thu', connections: 28, replies: 11, views: 64 },
  { day: 'Fri', connections: 24, replies: 8, views: 58 },
  { day: 'Sat', connections: 8, replies: 2, views: 19 },
  { day: 'Sun', connections: 6, replies: 1, views: 14 },
];

export const TEAM_MEMBERS = [
  { id: 'u1', name: 'Shakhawet Hossain', email: 'shakhawet@bs23.com', role: 'Admin', avatar: 'SH', campaigns: 3, status: 'active', dailySent: 28, dailyLimit: 30 },
  { id: 'u2', name: 'Raisul Islam', email: 'raisul@bs23.com', role: 'Member', avatar: 'RI', campaigns: 2, status: 'active', dailySent: 22, dailyLimit: 30 },
  { id: 'u3', name: 'Nusrat Jahan', email: 'nusrat@bs23.com', role: 'Member', avatar: 'NJ', campaigns: 1, status: 'active', dailySent: 15, dailyLimit: 30 },
  { id: 'u4', name: 'Tanvir Ahmed', email: 'tanvir@bs23.com', role: 'Member', avatar: 'TA', campaigns: 2, status: 'active', dailySent: 19, dailyLimit: 30 },
  { id: 'u5', name: 'Farhan Ullah', email: 'farhan@bs23.com', role: 'Member', avatar: 'FU', campaigns: 1, status: 'inactive', dailySent: 0, dailyLimit: 30 },
];
