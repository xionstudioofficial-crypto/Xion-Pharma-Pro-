// Super Admin Types & Mock Data

export interface SuperAdminCustomer {
  id: string;
  name: string;
  location: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  mrr: number;
  joined: string;
  initials: string;
  color: string;
}

export interface PlatformNotification {
  id: string;
  priority: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  time: string;
  badge: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  textClass: string;
}

export const INITIAL_CUSTOMERS: SuperAdminCustomer[] = [
  { id: '1', name: 'MediCare Pharmacy', location: 'San Francisco, CA', plan: 'Professional', status: 'active', mrr: 79, joined: 'Jan 15, 2023', initials: 'MC', color: 'from-indigo-500 to-indigo-600' },
  { id: '2', name: 'HealthFirst Rx', location: 'New York, NY', plan: 'Enterprise', status: 'active', mrr: 199, joined: 'Mar 8, 2023', initials: 'HF', color: 'from-violet-500 to-violet-600' },
  { id: '3', name: 'GreenCross Pharma', location: 'Austin, TX', plan: 'Starter', status: 'trial', mrr: 0, joined: 'Nov 20, 2024', initials: 'GC', color: 'from-teal-500 to-teal-600' },
  { id: '4', name: 'Wellness Drug Store', location: 'Chicago, IL', plan: 'Professional', status: 'active', mrr: 79, joined: 'Jun 22, 2023', initials: 'WD', color: 'from-emerald-500 to-emerald-600' },
  { id: '5', name: 'Peak Health Pharmacy', location: 'Denver, CO', plan: 'Enterprise', status: 'active', mrr: 199, joined: 'Feb 14, 2023', initials: 'PH', color: 'from-rose-500 to-rose-600' },
  { id: '6', name: 'Sunrise Meds', location: 'Miami, FL', plan: 'Starter', status: 'expired', mrr: 0, joined: 'Sep 5, 2023', initials: 'SM', color: 'from-amber-500 to-amber-600' },
  { id: '7', name: 'Valley Pharmacy Co.', location: 'Los Angeles, CA', plan: 'Professional', status: 'active', mrr: 79, joined: 'Apr 18, 2024', initials: 'VP', color: 'from-sky-500 to-sky-600' },
  { id: '8', name: 'NorthBridge Rx', location: 'Seattle, WA', plan: 'Starter', status: 'cancelled', mrr: 0, joined: 'Oct 30, 2023', initials: 'NB', color: 'from-slate-500 to-slate-600' }
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-1',
    priority: 'critical',
    badge: 'Critical',
    title: 'API rate limit reached for 3 Enterprise accounts',
    time: '2 minutes ago',
    bgClass: 'bg-red-50 border-red-100',
    borderClass: 'border-red-250',
    badgeClass: 'text-red-650 bg-red-100',
    textClass: 'text-red-900'
  },
  {
    id: 'notif-2',
    priority: 'warning',
    badge: 'Warning',
    title: '12 trial accounts expiring within 48 hours',
    time: '15 minutes ago',
    bgClass: 'bg-amber-50 border-amber-100',
    borderClass: 'border-amber-250',
    badgeClass: 'text-amber-650 bg-amber-100',
    textClass: 'text-amber-900'
  },
  {
    id: 'notif-3',
    priority: 'info',
    badge: 'System',
    title: 'Scheduled maintenance window: Dec 15, 2AM-4AM EST',
    time: '1 hour ago',
    bgClass: 'bg-indigo-50 border-indigo-100',
    borderClass: 'border-indigo-250',
    badgeClass: 'text-indigo-650 bg-indigo-100',
    textClass: 'text-indigo-900'
  },
  {
    id: 'notif-4',
    priority: 'success',
    badge: 'Success',
    title: 'Backup completed successfully — 2.4GB archived',
    time: '3 hours ago',
    bgClass: 'bg-emerald-50 border-emerald-100',
    borderClass: 'border-emerald-250',
    badgeClass: 'text-emerald-650 bg-emerald-100',
    textClass: 'text-emerald-900'
  },
  {
    id: 'notif-5',
    priority: 'info',
    badge: 'Update',
    title: 'New analytics dashboard v2.4 is now available',
    time: '5 hours ago',
    bgClass: 'bg-teal-50 border-teal-100',
    borderClass: 'border-teal-250',
    badgeClass: 'text-teal-650 bg-teal-100',
    textClass: 'text-teal-950'
  }
];

export const REVENUE_DATA = [
  { month: 'Jan', revenue: 28400, previous: 24100, customers: 1100, plans: 800 },
  { month: 'Feb', revenue: 31200, previous: 26800, customers: 1250, plans: 950 },
  { month: 'Mar', revenue: 29800, previous: 27200, customers: 1190, plans: 920 },
  { month: 'Apr', revenue: 34500, previous: 28900, customers: 1500, plans: 1100 },
  { month: 'May', revenue: 37200, previous: 30400, customers: 1720, plans: 1250 },
  { month: 'Jun', revenue: 39100, previous: 31800, customers: 1840, plans: 1300 },
  { month: 'Jul', revenue: 41800, previous: 33500, customers: 2010, plans: 1450 },
  { month: 'Aug', revenue: 43200, previous: 35200, customers: 2110, plans: 1500 },
  { month: 'Sep', revenue: 42100, previous: 36800, customers: 2050, plans: 1480 },
  { month: 'Oct', revenue: 45600, previous: 38100, customers: 2240, plans: 1650 },
  { month: 'Nov', revenue: 47200, previous: 39500, customers: 2400, plans: 1780 },
  { month: 'Dec', revenue: 48230, previous: 41200, customers: 2847, plans: 2134 }
];
