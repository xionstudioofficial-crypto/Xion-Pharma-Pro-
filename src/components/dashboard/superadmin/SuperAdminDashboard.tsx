import React, { useState } from 'react';
import { 
  X, 
  Menu, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Search, 
  Building2, 
  Download, 
  Check, 
  Trash2, 
  Eye, 
  Settings as SettingsIcon, 
  Activity, 
  Bell, 
  CreditCard, 
  Lock, 
  Database, 
  AlertTriangle, 
  LayoutGrid, 
  PieChart as PieChartIcon, 
  LogOut, 
  MapPin, 
  TrendingUp, 
  UserCheck, 
  RefreshCw, 
  Play, 
  HelpCircle,
  FileText,
  Workflow,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  SuperAdminCustomer, 
  PlatformNotification, 
  INITIAL_CUSTOMERS, 
  INITIAL_NOTIFICATIONS, 
  REVENUE_DATA 
} from './superData';

export default function SuperAdminDashboard({ setView }: { setView: (view: any) => void }) {
  // Mobile sidebar drawer state
  const [mobileSidebarActive, setMobileSidebarActive] = useState(false);

  // Sub-view switcher state
  // Supported sub-views: 'dashboard', 'pharmacies', 'subscriptions', 'analytics', 'notifications', 'settings', 'security', 'integrations'
  const [activeSubView, setActiveSubView] = useState<string>('dashboard');

  // Interactive Toast list
  const [toasts, setToasts] = useState<Array<{ id: string; text: string; type: 'success' | 'warning' | 'info' | 'error' }>>([]);

  const addToast = (text: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts([ { id, text, type }, ...toasts ]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Customers table states
  const [customers, setCustomers] = useState<SuperAdminCustomer[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired' | 'cancelled'>('all');
  
  // Modals simulation state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<SuperAdminCustomer | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPlan, setFormPlan] = useState<'Starter' | 'Professional' | 'Enterprise'>('Professional');
  const [formStatus, setFormStatus] = useState<'active' | 'trial' | 'expired' | 'cancelled'>('active');
  const [formMrr, setFormMrr] = useState(79);

  // Notification states with real-time countdown badge
  const [notifications, setNotifications] = useState<PlatformNotification[]>(INITIAL_NOTIFICATIONS);

  // Revenue chart filter tab
  const [chartTab, setChartTab] = useState<'revenue' | 'customers' | 'plans'>('revenue');

  // Range Picker trigger state
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);

  // Interactive subscription features
  const [planToggleState, setPlanToggleState] = useState({ Starter: true, Professional: true, Enterprise: true });

  // Add dummy pharmacy location details 
  const handleOpenAddModal = () => {
    setFormName('');
    setFormLocation('');
    setFormPlan('Professional');
    setFormStatus('active');
    setFormMrr(79);
    setAddModalOpen(true);
  };

  const submitAddPharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formLocation.trim()) {
      addToast('Please fill out all fields.', 'error');
      return;
    }
    const initials = formName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['from-teal-500 to-teal-600', 'from-indigo-500 to-indigo-600', 'from-violet-500 to-violet-600', 'from-emerald-500 to-emerald-600'];
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];

    const newPharmacy: SuperAdminCustomer = {
      id: (Date.now() + Math.random()).toString(),
      name: formName,
      location: formLocation,
      plan: formPlan,
      status: formStatus,
      mrr: formStatus === 'trial' || formStatus === 'expired' ? 0 : formMrr,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      initials,
      color: selectedColor
    };

    setCustomers([newPharmacy, ...customers]);
    setAddModalOpen(false);
    addToast(`"${formName}" registered successfully!`, 'success');
  };

  // Edit pharmacy
  const handleOpenEditModal = (customer: SuperAdminCustomer) => {
    setSelectedCustomer(customer);
    setFormName(customer.name);
    setFormLocation(customer.location);
    setFormPlan(customer.plan);
    setFormStatus(customer.status);
    setFormMrr(customer.mrr);
    setEditModalOpen(true);
  };

  const submitEditPharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    if (!formName.trim() || !formLocation.trim()) {
      addToast('Name and Location cannot be empty.', 'error');
      return;
    }

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          name: formName,
          location: formLocation,
          plan: formPlan,
          status: formStatus,
          mrr: formStatus === 'trial' || formStatus === 'expired' ? 0 : formMrr
        };
      }
      return c;
    }));

    setEditModalOpen(false);
    setSelectedCustomer(null);
    addToast('Pharmacy settings updated successfully.', 'success');
  };

  // Delete pharmacy
  const handleDeletePharmacy = (id: string, name: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    addToast(`"${name}" was deleted from registry list.`, 'warning');
  };

  // Dismiss notification item safely
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    addToast('Notification marked as resolved.', 'info');
  };

  // Download simulation trigger
  const triggerCsvExport = () => {
    addToast('Preparing system datastream CSV download...', 'info');
    setTimeout(() => {
      addToast('CSV spreadsheet generated and saved successfully!', 'success');
    }, 1200);
  };

  const handleLogout = () => {
    localStorage.removeItem("xion_auth_token");
    localStorage.removeItem("xion_user_role");
    addToast('Logging session out...', 'warning');
    setTimeout(() => {
      setView('login');
    }, 500);
  };

  // Statistics summaries derived directly from customer array state for real-time reactivity
  const totalPharmaciesCount = customers.length;
  const activeSubsCount = customers.filter(c => c.status === 'active').length;
  const trialCount = customers.filter(c => c.status === 'trial').length;
  const currentMrrSum = customers.reduce((acc, c) => acc + c.mrr, 0) + 47500; // base offset + simulation state

  // Filters mapping
  const filteredCustomers = customers.filter(c => {
    const matchesKeyword = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  // Recharts custom colors for Pie Chart
  const PIE_COLORS = ['#6366f1', '#14b8a6', '#fbbf24'];

  const getSubViewTitle = () => {
    switch (activeSubView) {
      case 'pharmacies': return 'Pharmacy Locations Registry';
      case 'customers': return 'Global Customer Registry';
      case 'subscriptions': return 'Platform Billing Tiers';
      case 'analytics': return 'Telemetry Projections';
      case 'notifications': return 'System Alerts Dispatcher';
      case 'settings': return 'Super Admin Control Center';
      case 'security': return 'Security Access Protocols';
      case 'integrations': return 'Managed API Tokens & Webhooks';
      default: return 'Super Admin Dashboard';
    }
  };

  const getSubViewDesc = () => {
    switch (activeSubView) {
      case 'pharmacies': return 'View and manage physical locations running Xion Pharma Client software.';
      case 'customers': return 'Track and maintain standard client memberships, accounts activity, and subscription billing statuses.';
      case 'subscriptions': return 'Configure active SaaS pricing, feature variables, and plan activations.';
      case 'analytics': return 'Assess growth patterns, trial conversions, and recurring financial statements.';
      case 'notifications': return 'Triage and review warning logs generated by connected enterprise tenants.';
      case 'settings': return 'Adjust global settings, legal designations, and email templates.';
      case 'security': return 'Enforce strict security locks, session expiry parameters, and MFA limits.';
      case 'integrations': return 'Inspect live Surescripts API logs, wholesaler tokens, and Square callbacks.';
      default: return 'Welcome back, Super Admin. Take a look at overall system operation, tenant activities, and MRR.';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased select-none">
      
      {/* Toast Alert Popups Wrapper */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`flex items-center gap-3 bg-white px-4 py-3.5 rounded-xl shadow-xl border w-80 pointer-events-auto transition-all animate-bounce ${
              t.type === 'success' ? 'border-emerald-200 text-emerald-950' :
              t.type === 'warning' ? 'border-amber-200 text-amber-950' :
              t.type === 'error' ? 'border-rose-200 text-rose-950' : 'border-indigo-150 text-indigo-950'
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${
              t.type === 'success' ? 'bg-emerald-500' :
              t.type === 'warning' ? 'bg-amber-500' :
              t.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'
            }`} />
            <span className="text-xs font-bold flex-1">{t.text}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-slate-400 hover:text-slate-600 transition">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Responsive Overlay for Mobile Layout Drawer */}
      <div 
        onClick={() => setMobileSidebarActive(false)}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200 ${
          mobileSidebarActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 1. SIDEBAR NAVIGATION PANELS */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-100 text-slate-650 z-50 transform lg:transform-none transition-transform duration-250 flex flex-col shrink-0 ${
        mobileSidebarActive ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Banner */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100/50">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="block text-md font-bold tracking-tight text-slate-900 leading-tight">Xion Pharma</span>
              <span className="block text-[10px] font-bold text-indigo-500 tracking-widest uppercase mt-0.5">Super Admin</span>
            </div>
          </div>
          <button 
            className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
            onClick={() => setMobileSidebarActive(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 pl-4 pr-0 overflow-y-auto space-y-6">
          <div>
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Main</div>
            <div className="space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
                { id: 'pharmacies', label: 'Pharmacies', icon: Building2, badge: (2841 + totalPharmaciesCount).toLocaleString() },
                { id: 'customers', label: 'Customers', icon: UserCheck },
                { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
                { id: 'analytics', label: 'Analytics', icon: PieChartIcon }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeSubView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSubView(item.id);
                      setMobileSidebarActive(false);
                    }}
                    className={`w-full flex items-center justify-between pl-3 pr-4 py-2.5 rounded-l-xl text-[13px] font-semibold transition-all text-left ${
                      isActive 
                        ? 'bg-indigo-50/65 text-indigo-600 border-r-[3.5px] border-indigo-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Platform</div>
            <div className="space-y-1">
              {[
                { id: 'notifications', label: 'Notifications', icon: Bell, hasDot: notifications.length > 0 },
                { id: 'settings', label: 'Settings', icon: SettingsIcon },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'integrations', label: 'API & Integrations', icon: Workflow }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeSubView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSubView(item.id);
                      setMobileSidebarActive(false);
                    }}
                    className={`w-full flex items-center justify-between pl-3 pr-4 py-2.5 rounded-l-xl text-[13px] font-semibold transition-all text-left ${
                      isActive 
                        ? 'bg-indigo-50/65 text-indigo-600 border-r-[3.5px] border-indigo-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.hasDot && (
                      <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Need Help Card */}
        <div className="p-4 border-t border-slate-100 select-none shrink-0">
          <div className="bg-[#f5f8ff]/80 border border-indigo-100/75 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100/60 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <h4 className="text-xs font-bold text-slate-900 mt-1">Need Help?</h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-relaxed">
              Access documentation & support resources.
            </p>
            <button 
              onClick={() => addToast('Opening Support Suite...', 'info')}
              className="mt-3 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <span>Open Support Center</span>
              <span className="text-xs font-bold font-sans">&rsaquo;</span>
            </button>
          </div>
        </div>

        {/* Signout bottom bar */}
        <div className="p-4 pt-0 select-none shrink-0 mb-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-slate-450 hover:text-rose-500 hover:bg-rose-50/30 transition text-[11px] font-bold py-2 border border-slate-100 rounded-xl bg-slate-50/50"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign out Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKING PAGE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Header Ribbon */}
        <header className="bg-white border-b border-slate-100 z-10 sticky top-0 shrink-0 select-none">
          <div className="flex items-center justify-between h-16 px-4 md:px-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileSidebarActive(true)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">{getSubViewTitle()}</h2>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">{getSubViewDesc()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search utility */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 w-64 group focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                <input 
                  type="text" 
                  placeholder="Global search..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1 font-medium"
                />
              </div>

              {/* Action shortcuts */}
              <button 
                onClick={() => {
                  setActiveSubView('notifications');
                  addToast('Navigated to pending system warnings.', 'info');
                }}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-650 transition relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </button>

              <button 
                onClick={() => {
                  setView('dashboard');
                  addToast('Standard pharmacy view activated.', 'info');
                }}
                className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition hover:bg-slate-50 flex items-center gap-1"
                title="Enter Standard View"
              >
                <span>Standard View</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Scrolling Workplane */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-24">
          
          {/* A. CONTENT MODULE: MASTER DASHBOARD SUMMARY OVERVIEW */}
          {activeSubView === 'dashboard' && (
            <div className="space-y-8 select-none">
              
              {/* KPI CARD BLOCK - 6 Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { title: 'Total Pharmacies', value: totalPharmaciesCount + 2839, raw: totalPharmaciesCount, desc: 'Registered instances', color: 'bg-indigo-50 text-indigo-600', barColor: 'bg-indigo-500', pct: '78%', growth: '+12.5%' },
                  { title: 'Active Subscriptions', value: activeSubsCount + 2126, raw: activeSubsCount, desc: 'Enterprise active keys', color: 'bg-teal-50 text-teal-600', barColor: 'bg-teal-500', pct: '64%', growth: '+8.2%' },
                  { title: 'Trial Accounts', value: trialCount + 309, raw: trialCount, desc: 'Limited trial users', color: 'bg-amber-50 text-amber-600', barColor: 'bg-amber-400', pct: '42%', growth: '-3.1%', neg: true },
                  { title: 'SaaS Monthly Revenue', value: `$${(currentMrrSum / 1000).toFixed(1)}K`, raw: currentMrrSum, desc: 'Live current month', color: 'bg-emerald-50 text-emerald-600', barColor: 'bg-emerald-500', pct: '85%', growth: '+15.8%' },
                  { title: 'Gross Churn Rate', value: '2.4%', raw: 2.4, desc: 'Platform departures', color: 'bg-rose-50 text-rose-600', barColor: 'bg-rose-400', pct: '24%', growth: '-0.8%' },
                  { title: 'Annual ARR Projection', value: `$${((currentMrrSum * 12) / 1000).toFixed(1)}K`, raw: currentMrrSum * 12, desc: 'Next 12Mo estimate', color: 'bg-violet-50 text-violet-600', barColor: 'bg-violet-500', pct: '91%', growth: '+22.1%' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm hover:translate-y-[-1px] transition duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${kpi.color} flex items-center justify-center font-bold`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${kpi.neg ? 'bg-rose-55 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {kpi.growth}
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900 leading-tight">{kpi.value}</div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{kpi.title}</p>
                    <div className="mt-4 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`${kpi.barColor} h-full rounded-full transition-all`} style={{ width: kpi.pct }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* TELEMETRY ANALYTICS WITH POWERFUL INTERACTIVE CHARTS */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Visual Line/Area Chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Revenue Analytics</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Track revenue and client acquisition trends across segments</p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 select-none">
                        {[
                          { id: 'revenue', label: 'Revenue' },
                          { id: 'customers', label: 'Customers' },
                          { id: 'plans', label: 'Plans' }
                        ].map(t => (
                          <button 
                            key={t.id}
                            onClick={() => {
                              setChartTab(t.id as any);
                              addToast(`Now representing ${t.label} metrics.`, 'info');
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${chartTab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-505 hover:text-slate-800'}`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Date Range Dropdown */}
                      <div className="relative">
                        <button 
                          onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
                          className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-50 transition flex items-center gap-1.5"
                        >
                          <span>{dateRange}</span>
                          <ArrowDown className="w-3 h-3 hover:translate-y-1" />
                        </button>
                        {rangeDropdownOpen && (
                          <div className="absolute right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 min-w-44 p-1.5 space-y-0.5">
                            {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year'].map(rng => (
                              <button 
                                key={rng}
                                onClick={() => {
                                  setDateRange(rng);
                                  setRangeDropdownOpen(false);
                                  addToast(`Period scope set to: ${rng}`, 'info');
                                }}
                                className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-bold transition ${dateRange === rng ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                              >
                                {rng}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* High Quality SVGA Area Chart using Recharts */}
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4338ca" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#4338ca" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 650, fill: '#94a3b8' }} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fontWeight: 650, fill: '#94a3b8' }} axisLine={false} />
                        <RechartsTooltip 
                          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={chartTab === 'revenue' ? 'revenue' : chartTab === 'customers' ? 'customers' : 'plans'} 
                          stroke="#4f46e5" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Grid stats */}
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-5 mt-5 text-center select-none">
                    <div>
                      <p className="text-xs font-black text-slate-800">$48,230</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Premium MRR</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">$578,760</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Projected ARR</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-600">+15.8%</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">vs Previous Mo</p>
                    </div>
                  </div>
                </div>

                {/* Subsections: Plan Distribution Doughnut & Progress bars */}
                <div className="space-y-6">
                  
                  {/* Plan distribution */}
                  <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900">Plan Distribution</h3>
                    <p className="text-xs text-slate-400 font-medium">Platform layout spread by tiers</p>
                    
                    <div className="h-44 flex items-center justify-center py-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Enterprise', value: 428 },
                              { name: 'Professional', value: 960 },
                              { name: 'Starter', value: 746 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#4f46e5" />
                            <Cell fill="#14b8a6" />
                            <Cell fill="#fbbf24" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-550 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Enterprise</span>
                        <span className="font-extrabold text-slate-800">428 (20%)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                        <span className="flex items-center gap-1.5 text-slate-550 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Professional</span>
                        <span className="font-extrabold text-slate-800">960 (45%)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                        <span className="flex items-center gap-1.5 text-slate-550 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Starter</span>
                        <span className="font-extrabold text-slate-800">746 (35%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance variables */}
                  <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-900">Performance Metrics</h3>
                    
                    <div className="space-y-3.5">
                      {[
                        { label: 'Overall Conversion Rate', val: '34.2%', w: '34.2%', barColor: 'bg-indigo-500' },
                        { label: 'Trial to Paid Upgrades', val: '28.7%', w: '28.7%', barColor: 'bg-teal-500' },
                        { label: 'Gross Security Retention', val: '94.1%', w: '94.1%', barColor: 'bg-emerald-500' },
                        { label: 'Net Annual Retention (NDR)', val: '112%', w: '84%', barColor: 'bg-violet-500' }
                      ].map((item, id) => (
                        <div key={id}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-slate-650">{item.label}</span>
                            <span className="font-extrabold text-slate-900">{item.val}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`${item.barColor} h-full rounded-full transition-all`} style={{ width: item.w }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* CUSTOMER MANAGEMENT GRID WITH CRUD ACTIONS */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Customer Management</h3>
                      <p className="text-xs text-slate-400">Review platform instances, SaaS plan tiers, and billing statuses</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      
                      {/* Search */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 w-60 group focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="Search registers..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1 font-medium"
                        />
                      </div>

                      {/* Status select */}
                      <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 select-none cursor-pointer"
                      >
                        <option value="all">All Status Modes</option>
                        <option value="active">Active Tiers</option>
                        <option value="trial">Pending Trials</option>
                        <option value="expired">Expired Services</option>
                        <option value="cancelled">Cancelled Lists</option>
                      </select>

                      <button 
                        onClick={triggerCsvExport}
                        className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 hover:bg-slate-50"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Export CSV</span>
                      </button>

                      <button 
                        onClick={handleOpenAddModal}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Pharmacy</span>
                      </button>

                    </div>
                  </div>
                </div>

                {/* Table details */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                        <th className="px-6 py-3.5">Pharmacy Name</th>
                        <th className="px-6 py-3.5">SaaS Plan</th>
                        <th className="px-6 py-3.5 text-center">Service Status</th>
                        <th className="px-6 py-3.5 text-right">Subscription MRR</th>
                        <th className="px-6 py-3.5 hidden md:table-cell">Date Joined</th>
                        <th className="px-6 py-3.5 text-right">Modifier Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-slate-405 font-bold">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                            No matching pharmacy registers located. Try adjusting query terms.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map(customer => {
                          const isAct = customer.status === 'active';
                          const isTr = customer.status === 'trial';
                          const isExp = customer.status === 'expired';
                          return (
                            <tr key={customer.id} className="hover:bg-slate-50/50 transition">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${customer.color} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
                                    {customer.initials}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900">{customer.name}</p>
                                    <p className="text-[10px] text-slate-450 font-bold flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-slate-350" />
                                      <span>{customer.location}</span>
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${
                                  customer.plan === 'Enterprise' ? 'bg-violet-100 text-violet-800' :
                                  customer.plan === 'Professional' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {customer.plan}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                                  isAct ? 'bg-emerald-100 text-emerald-800' :
                                  isTr ? 'bg-amber-100 text-amber-800' :
                                  isExp ? 'bg-rose-105 text-rose-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    isAct ? 'bg-emerald-500' :
                                    isTr ? 'bg-amber-400' :
                                    isExp ? 'bg-rose-500' : 'bg-slate-400'
                                  }`} />
                                  <span>{customer.status.toUpperCase()}</span>
                                </span>
                              </td>

                              <td className="px-6 py-4 text-right font-mono font-black text-slate-900">
                                {customer.status === 'trial' || customer.status === 'expired' ? '$0' : `$${customer.mrr}`}
                              </td>

                              <td className="px-6 py-4 hidden md:table-cell text-slate-500 font-semibold">
                                {customer.joined}
                              </td>

                              <td className="px-6 py-4 text-right space-x-1">
                                <button 
                                  onClick={() => handleOpenEditModal(customer)}
                                  className="p-1.5 hover:text-indigo-650 hover:bg-slate-100 rounded-lg transition"
                                  title="Edit Pharmacy Specs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePharmacy(customer.id, customer.name)}
                                  className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Remove registered listing info"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination status footer bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 select-none">
                  <p className="text-xs text-slate-500 font-semibold">
                    Showing <span className="font-extrabold text-slate-800">1-{filteredCustomers.length}</span> of <span className="font-extrabold text-slate-800">{filteredCustomers.length}</span> results scope
                  </p>
                  <div className="flex items-center gap-1">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400" disabled>Prev</button>
                    <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-black">1</button>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-650 hover:bg-slate-50 transition" onClick={() => addToast('This is simulated pagination.', 'info')}>Next</button>
                  </div>
                </div>

              </div>

              {/* PRICING PLANS COMPLIANCE SEC & SYSTEM NOTIFICATIONS DISPATCHER WRAPPER */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Visualizing billing plans configurations */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5 select-none">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Subscription Pricing Modules</h3>
                      <p className="text-xs text-slate-400">Configure licensing presets and feature toggles</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { tier: 'Starter', price: '$29', limit: 'Up to 5 locations', act: planToggleState.Starter, field: 'Starter' },
                      { tier: 'Professional', price: '$79', limit: 'Up to 25 locations', act: planToggleState.Professional, field: 'Professional', pop: true },
                      { tier: 'Enterprise', price: '$199', limit: 'Unlimited locations', act: planToggleState.Enterprise, field: 'Enterprise' }
                    ].map(plan => (
                      <div 
                        key={plan.tier}
                        className={`border rounded-2xl p-4 flex flex-col justify-between relative transition hover:shadow-md ${
                          plan.pop ? 'border-2 border-indigo-500 shadow-md shadow-indigo-100' : 'border-slate-200'
                        }`}
                      >
                        {plan.pop && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-650 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Most Popular
                          </span>
                        )}

                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-slate-800">{plan.tier}</span>
                            <div className="flex items-center">
                              <button 
                                onClick={() => {
                                  const nextVal = !plan.act;
                                  setPlanToggleState(prev => ({ ...prev, [plan.field]: nextVal }));
                                  addToast(`${plan.tier} tier has been ${nextVal ? 'enabled' : 'disabled'}`, 'warning');
                                }}
                                className={`w-8 h-4 rounded-full p-0.5 transition ${plan.act ? 'bg-emerald-500' : 'bg-slate-350'}`}
                              >
                                <span className={`w-3 h-3 bg-white rounded-full block transition-transform ${plan.act ? 'translate-x-4' : 'translate-x-0'}`} />
                              </button>
                            </div>
                          </div>

                          <div className="my-4">
                            <span className="text-2xl font-black text-slate-950">{plan.price}</span>
                            <span className="text-slate-400 text-xs font-bold"> / month</span>
                          </div>

                          <ul className="text-[10px] font-bold text-slate-500 space-y-1.5 mt-2">
                            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> {plan.limit}</li>
                            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Wholesaler connection</li>
                            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Digital POS support</li>
                          </ul>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-4 flex gap-1.5">
                          <button 
                            onClick={() => addToast(`Modification panel for ${plan.tier} loaded.`, 'info')}
                            className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 transition"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => addToast(`Promoted direct alert dispatch triggered.`, 'success')}
                            className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 rounded-xl text-[10px] font-black text-indigo-700 transition"
                          >
                            Promote
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Feed */}
                <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 select-none">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">Platform Notifications</h3>
                        <p className="text-xs text-slate-400">System event logs queue</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-extrabold text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span>{notifications.length} New</span>
                      </span>
                    </div>

                    <div className="space-y-3.5 max-h-76 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 font-bold text-xs select-none">
                          <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                          No pending system warnings.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id}
                            className={`flex gap-3 p-3.5 rounded-xl border ${n.bgClass} flex items-start group relative transition duration-150 hover:shadow-xs`}
                          >
                            <AlertTriangle className="w-4.5 h-4.5 text-slate-700 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide ${n.badgeClass}`}>
                                {n.badge}
                              </span>
                              <p className={`text-xs font-bold leading-tight mt-1.5 truncate ${n.textClass}`}>{n.title}</p>
                              <span className="block text-[9px] text-slate-400 font-semibold mt-1">{n.time}</span>
                            </div>
                            <button 
                              onClick={() => dismissNotification(n.id)}
                              className="lg:opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                              title="Acknowledge & Resolve Log"
                            >
                              <Check className="w-3.5 h-3.5 text-slate-650" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-105 mt-4">
                    <button 
                      onClick={() => addToast('Telemetry notifications archived logs successfully.', 'info')}
                      className="w-full text-center py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 rounded-xl text-xs font-black transition"
                    >
                      View All Logs Channel
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* CUSTOMER DEDICATED VIEW */}
          {activeSubView === 'customers' && (
            <div className="space-y-6">
              {/* CUSTOMER MANAGEMENT GRID WITH CRUD ACTIONS */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Customer Management Registry</h3>
                      <p className="text-xs text-slate-400">Review platform instances, SaaS plan tiers, and billing statuses of all customers</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      
                      {/* Search */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 w-60 group focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition">
                        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="Search registers..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1 font-medium"
                        />
                      </div>

                      {/* Status select */}
                      <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 select-none cursor-pointer"
                      >
                        <option value="all">All Status Modes</option>
                        <option value="active">Active Tiers</option>
                        <option value="trial">Pending Trials</option>
                        <option value="expired">Expired Services</option>
                        <option value="cancelled">Cancelled Lists</option>
                      </select>

                      <button 
                        onClick={triggerCsvExport}
                        className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5 hover:bg-slate-50"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Export CSV</span>
                      </button>

                      <button 
                        onClick={handleOpenAddModal}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Customer</span>
                      </button>

                    </div>
                  </div>
                </div>

                {/* Table details */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                        <th className="px-6 py-3.5">Pharmacy Name</th>
                        <th className="px-6 py-3.5">SaaS Plan</th>
                        <th className="px-6 py-3.5 text-center">Service Status</th>
                        <th className="px-6 py-3.5 text-right">Subscription MRR</th>
                        <th className="px-6 py-3.5 hidden md:table-cell">Date Joined</th>
                        <th className="px-6 py-3.5 text-right">Modifier Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-slate-405 font-bold">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                            No matching pharmacy registers located. Try adjusting query terms.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map(customer => {
                          const isAct = customer.status === 'active';
                          const isTr = customer.status === 'trial';
                          const isExp = customer.status === 'expired';
                          return (
                            <tr key={customer.id} className="hover:bg-slate-50/50 transition">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${customer.color} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
                                    {customer.initials}
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900">{customer.name}</p>
                                    <p className="text-[10px] text-slate-450 font-bold flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3 text-slate-350" />
                                      <span>{customer.location}</span>
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${
                                  customer.plan === 'Enterprise' ? 'bg-violet-100 text-violet-800' :
                                  customer.plan === 'Professional' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {customer.plan}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                                  isAct ? 'bg-emerald-100 text-emerald-800' :
                                  isTr ? 'bg-amber-100 text-amber-800' :
                                  isExp ? 'bg-rose-105 text-rose-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    isAct ? 'bg-emerald-500' :
                                    isTr ? 'bg-amber-400' :
                                    isExp ? 'bg-rose-500' : 'bg-slate-400'
                                  }`} />
                                  <span>{customer.status.toUpperCase()}</span>
                                </span>
                              </td>

                              <td className="px-6 py-4 text-right font-mono font-black text-slate-900">
                                {customer.status === 'trial' || customer.status === 'expired' ? '$0' : `$${customer.mrr}`}
                              </td>

                              <td className="px-6 py-4 hidden md:table-cell text-slate-500 font-semibold">
                                {customer.joined}
                              </td>

                              <td className="px-6 py-4 text-right space-x-1">
                                <button 
                                  onClick={() => handleOpenEditModal(customer)}
                                  className="p-1.5 hover:text-indigo-650 hover:bg-slate-100 rounded-lg transition"
                                  title="Edit Customer Specs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePharmacy(customer.id, customer.name)}
                                  className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Remove registered listing info"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination status footer bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 select-none">
                  <p className="text-xs text-slate-500 font-semibold">
                    Showing <span className="font-extrabold text-slate-800">1-{filteredCustomers.length}</span> of <span className="font-extrabold text-slate-800">{filteredCustomers.length}</span> results scope
                  </p>
                  <div className="flex items-center gap-1">
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-400" disabled>Prev</button>
                    <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-xs font-black">1</button>
                    <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-650 hover:bg-slate-50 transition" onClick={() => addToast('This is simulated pagination.', 'info')}>Next</button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* B. CONTENT MODULE: DIRECT PHARMACIES VIEW */}
          {activeSubView === 'pharmacies' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Registered Pharmacy Tiers</h3>
                  <p className="text-xs text-slate-420 font-bold mt-1">Review live active subscription status for connected healthcare entities.</p>
                </div>
                <button 
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Pharmacy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map(c => (
                  <div key={c.id} className="border border-slate-150 p-5 rounded-2xl bg-white shadow-xs space-y-4 relative">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${c.color} flex items-center justify-center text-white font-black`}>
                        {c.initials}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{c.name}</h4>
                        <p className="text-[10px] text-slate-450 font-bold mt-0.5">{c.location}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-450">Active Tier:</span>
                      <span className="text-slate-800 uppercase bg-slate-200/50 px-2 py-0.5 rounded-lg">{c.plan}</span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] font-bold border-t border-slate-100 pt-3">
                      <span className="text-slate-450">Date Activated:</span>
                      <span className="text-slate-700">{c.joined}</span>
                    </div>

                    <div className="flex justify-end gap-1 border-t border-slate-100 pt-3">
                      <button 
                        onClick={() => handleOpenEditModal(c)}
                        className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-780 rounded-xl font-bold text-[10.5px] transition"
                      >
                        Adjust Configuration
                      </button>
                      <button 
                        onClick={() => handleDeletePharmacy(c.id, c.name)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C. CONTENT MODULE: BILLING PORTFOLIO */}
          {activeSubView === 'subscriptions' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-1">Billing Configurations & Active Rates</h3>
                <p className="text-xs text-slate-400">Review SaaS billing triggers, default payment gateway rules and invoice templates.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">SaaS Billing Interval</label>
                    <select className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl bg-white font-bold">
                      <option>Calendar Month Cycle (Default)</option>
                      <option>Annually Recurring Cycle</option>
                      <option>Weekly Metered Usage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Late Payment Grace Period</label>
                    <select className="w-full px-3 py-2 border border-slate-200 text-xs rounded-xl bg-white font-bold">
                      <option>3 Business Days Grace</option>
                      <option>7 Calendar Days Grace</option>
                      <option>14 Calendar Days Grace</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-4">Platform Pricing Matrix</h3>
                <div className="space-y-3.5">
                  {[
                    { tier: 'Basic Starter Pack', price: '$29/mo', desc: 'Shorthand local configurations', target: 'Starter' },
                    { tier: 'Mid Professional Suite', price: '$79/mo', desc: 'Integrated state logs wholesaler connections', target: 'Professional' },
                    { tier: 'Enterprise Dedicated Server Bundle', price: '$199/mo', desc: 'Direct webhook debugger parameters', target: 'Enterprise' }
                  ].map((p, index) => (
                    <div key={index} className="flex justify-between items-center p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                      <div>
                        <p className="text-xs font-black text-slate-800">{p.tier}</p>
                        <p className="text-[10.5px] text-slate-421 font-medium mt-0.5">{p.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-black text-indigo-705 bg-indigo-50 px-3 py-1 rounded-lg">{p.price}</span>
                        <button 
                          onClick={() => addToast(`Editing matrix rules for tier: ${p.target}`, 'info')}
                          className="py-1.5 px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-[10.5px] font-bold"
                        >
                          Modify Rules
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* D. CONTENT MODULE: GRAPH TELEMETRY ANALYSIS */}
          {activeSubView === 'analytics' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900">Platform Analytics Telemetry Dashboard</h3>
                <p className="text-xs text-slate-420 font-bold mt-1">Granular graph measurements computed directly from ledger endpoints.</p>
              </div>

              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 'bold' }} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#4f46e5" fill="#e2e8f0" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="previous" stackId="2" stroke="#2dd4bf" fill="#ccfbf1" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center select-none pt-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Max Annual Capacity</span>
                  <span className="text-xl font-black text-slate-900">92k Instances</span>
                  <span className="text-[10px] text-emerald-600 block mt-1 font-bold">Safe thresholds • Core active</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Trial Conversion Mean</span>
                  <span className="text-xl font-black text-slate-900">28.74% Percent</span>
                  <span className="text-[10px] text-emerald-600 block mt-1 font-bold">+2.3% improvement from Dec</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Compute Cost Per Instance</span>
                  <span className="text-xl font-black text-slate-900">$1.14 / Tenant</span>
                  <span className="text-[10px] text-indigo-600 block mt-1 font-bold">Optimized database indices</span>
                </div>
              </div>
            </div>
          )}

          {/* E. CONTENT MODULE: PLATFORM GLOBAL SETTINGS */}
          {activeSubView === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6 max-w-4xl">
              <div>
                <h3 className="text-sm font-black text-slate-900">General Platform settings</h3>
                <p className="text-xs text-slate-420 font-bold mt-1">Configure legal designations, system maintenance banners, and global support metrics.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Super Admin Contact Email</label>
                    <input type="text" className="w-full px-3.5 py-2 border border-slate-200 text-xs rounded-xl font-bold bg-slate-50 text-slate-600" value="super_admin@xion.pro" disabled />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Default System Locale</label>
                    <select className="w-full px-3.5 py-2 border border-slate-200 text-xs rounded-xl bg-white font-bold">
                      <option>United States (EN-US)</option>
                      <option>United Kingdom (EN-GB)</option>
                      <option>Canada (FR-CA)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">Operational Under Maintenance Banner</p>
                    <p className="text-[10px] text-slate-410 font-bold">Display diagnostic service alert banner to all standard pharmacy tenants.</p>
                  </div>
                  <button onClick={() => addToast('System banner toggled.', 'warning')} className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-xs transition">
                    Toggle banner warning
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* F. CONTENT MODULE: SECURITY SEC */}
          {activeSubView === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6 max-w-4xl">
              <div>
                <h3 className="text-sm font-black text-slate-900">Security Access & API Scope Keys</h3>
                <p className="text-xs text-slate-420 font-bold mt-1">Maintain active sessions control standards and log monitoring limits.</p>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="pb-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">Minimum Password Length Requirement</p>
                    <p className="text-[10px] text-slate-440 font-bold">Enforce rigid strength policy variables across administrative registers.</p>
                  </div>
                  <span className="bg-slate-100 font-mono font-black text-xs px-3 py-1.5 rounded-lg text-slate-705">12 characters min</span>
                </div>

                <div className="pt-4 pb-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">Automatic Session Locking Terminals</p>
                    <p className="text-[10px] text-slate-440 font-bold">Disconnect standard client active logins after 15 minutes window.</p>
                  </div>
                  <span className="bg-slate-100 font-mono font-black text-xs px-3 py-1.5 rounded-lg text-emerald-705">15 Min active lock</span>
                </div>
              </div>
            </div>
          )}

          {/* G. CONTENT MODULE: API & CONNECTED INTEGRATIONS */}
          {activeSubView === 'integrations' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6 max-w-4xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900">API Gateway Tokens and Endpoint Webhooks</h3>
                  <p className="text-xs text-slate-420 font-bold mt-1">Register webhooks to receive live client checkouts and billing events.</p>
                </div>
                <button 
                  onClick={() => addToast('Dispatched token rotation key generator.', 'success')}
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Generate New Master API Key
                </button>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-slate-50">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Master Token Endpoint Scope</p>
                <div className="flex gap-2">
                  <input type="text" className="flex-1 bg-white border border-slate-200 text-slate-500 px-3 py-2 text-xs rounded-xl font-mono font-bold" value="sk_platform_live_79a25b162bf3d941cecfbf8ee" disabled />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("sk_platform_live_79a25b162bf3d941cecfbf8ee");
                      addToast('Token copied to dashboard clipboard!', 'success');
                    }}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition"
                  >
                    Copy Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* H. SYSTEM NOTIFICATIONS FEED FULLSCREEN PANEL */}
          {activeSubView === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Active System Notifications Log Queue</h3>
                  <p className="text-xs text-slate-402 font-bold mt-1">Review active warning parameters and service alarms.</p>
                </div>
                <button 
                  onClick={() => {
                    setNotifications([]);
                    addToast('Clear logs operation complete.', 'warning');
                  }}
                  className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Mark All Resolved
                </button>
              </div>

              <div className="space-y-3.5">
                {notifications.length === 0 ? (
                  <div className="py-20 text-center text-slate-420 font-bold text-xs select-none">
                    <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    All diagnostic queues have cleared. System health remains excellent.
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="flex gap-4 p-4 rounded-xl border border-slate-150 bg-slate-50 hover:bg-slate-100/50 transition">
                      <AlertTriangle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-black uppercase text-slate-700 tracking-wide">
                          {n.badge}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-xs mt-1.5">{n.title}</h4>
                        <p className="text-[10px] text-slate-415 mt-0.5 font-bold">Priority Score: {n.priority.toUpperCase()} • Time stamp: {n.time}</p>
                      </div>
                      <button 
                        onClick={() => dismissNotification(n.id)}
                        className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-650 shrink-0 transition"
                      >
                        Acknowledge Alert
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer info strip */}
        <footer className="py-4 border-t border-slate-200 text-center bg-white sticky bottom-0 z-10 shrink-0 select-none">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 px-8">
            <span className="font-bold">&copy; 2024 Xion Pharma Pro Platform. All rights reserved.</span>
            <div className="flex items-center gap-4 font-bold">
              <a href="#" className="hover:text-slate-700 transition">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition">Terms of Service</a>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" /> Status: Operational</span>
            </div>
          </div>
        </footer>

      </div>

      {/* 3. MODAL COMPONENT: REGISTER NEW TENANT PHARMACY */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400 animate-pulse" />
                <h3 className="font-black text-sm tracking-tight">Register New Pharmacy</h3>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={submitAddPharmacy} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Pharmacy Business Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Oakwood Wellness Pharmacy" 
                  value={formName} 
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Physical Location Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. San Jose, CA" 
                  value={formLocation} 
                  onChange={e => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">SaaS Plan Tier</label>
                  <select 
                    value={formPlan} 
                    onChange={e => setFormPlan(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white select-none"
                  >
                    <option value="Starter">Starter Pack ($29)</option>
                    <option value="Professional">Professional Suite ($79)</option>
                    <option value="Enterprise">Enterprise Solution ($199)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Default MRR ($ value)</label>
                  <input 
                    type="number" 
                    min={0}
                    value={formMrr} 
                    onChange={e => setFormMrr(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Service Status Mode</label>
                <select 
                  value={formStatus} 
                  onChange={e => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white select-none"
                >
                  <option value="active">Active System</option>
                  <option value="trial">Pending Trial Scope</option>
                  <option value="expired">Expired Services</option>
                  <option value="cancelled">Cancelled Service</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-650 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL COMPONENT: ADJUST CONFIGURATION */}
      {editModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm tracking-tight">Adjust Registered Configuration</h3>
              </div>
              <button onClick={() => {setEditModalOpen(false); setSelectedCustomer(null);}} className="text-slate-450 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={submitEditPharmacy} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Pharmacy Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Medicare Pharmacy Solutions" 
                  value={formName} 
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold animate-fade"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Location Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. San Jose, CA" 
                  value={formLocation} 
                  onChange={e => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">SaaS Plan Tier</label>
                  <select 
                    value={formPlan} 
                    onChange={e => setFormPlan(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white select-none"
                  >
                    <option value="Starter">Starter Pack ($29)</option>
                    <option value="Professional">Professional Suite ($79)</option>
                    <option value="Enterprise font-black">Enterprise Solution ($199)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Actual MRR ($)</label>
                  <input 
                    type="number" 
                    min={0}
                    value={formMrr} 
                    onChange={e => setFormMrr(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest mb-1.5">Service Status Mode</label>
                <select 
                  value={formStatus} 
                  onChange={e => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active System</option>
                  <option value="trial">Pending Trial Scope</option>
                  <option value="expired">Expired Services</option>
                  <option value="cancelled">Cancelled Service</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => {setEditModalOpen(false); setSelectedCustomer(null);}}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-655 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
