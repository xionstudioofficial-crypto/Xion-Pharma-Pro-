import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  FileText, 
  Printer, 
  Bell, 
  Crown, 
  Cloud, 
  Lock, 
  Palette, 
  Puzzle,
  RotateCcw,
  Check,
  Plus,
  Search,
  Trash2,
  PenTool,
  Sliders,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Building2,
  Shield,
  ShieldCheck,
  UserCheck,
  Key,
  Database,
  BarChart,
  Grid,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  Eye,
  Settings as LucideSettings,
  Flame,
  AlertTriangle,
  Play,
  RotateCcw as RefreshCcw
} from 'lucide-react';
import Sidebar from '../Sidebar';

// Toast interface
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

// Role interface
interface RoleItem {
  id: string;
  name: string;
  usersCount: number;
  permissions: string[];
  status: 'Active' | 'Limited' | 'Inactive';
}

export default function SettingsDashboard({ setView }: { setView: (view: any) => void }) {
  // Mobile responsiveness
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Active Tab/Section state
  const [activeSection, setActiveSection] = useState<string>('general');

  // Toasts state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Roles states
  const [roleSearch, setRoleSearch] = useState('');
  const [rolesList, setRolesList] = useState<RoleItem[]>([
    { id: '1', name: 'Pharmacy Admin', usersCount: 2, permissions: ['Full Access'], status: 'Active' },
    { id: '2', name: 'Lead Pharmacist', usersCount: 3, permissions: ['Rx', 'Inventory', 'Reports'], status: 'Active' },
    { id: '3', name: 'Staff Pharmacist', usersCount: 5, permissions: ['Rx', 'Inventory'], status: 'Active' },
    { id: '4', name: 'Cashier', usersCount: 4, permissions: ['Billing', 'POS'], status: 'Active' },
    { id: '5', name: 'Intern / Observer', usersCount: 2, permissions: ['View Only'], status: 'Limited' }
  ]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleUsers, setNewRoleUsers] = useState(0);
  const [newRoleStatus, setNewRoleStatus] = useState<'Active' | 'Limited' | 'Inactive'>('Active');
  const [newRolePerms, setNewRolePerms] = useState<string[]>([]);

  // Form states - General Settings
  const [pharmacyName, setPharmacyName] = useState('GreenLeaf Community Pharmacy');
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('Eastern Time (ET)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [currency, setCurrency] = useState('USD ($)');
  const [rxPrefix, setRxPrefix] = useState('RX-GL');

  // Behavioral Toggle states
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);
  const [autoPrintLabels, setAutoPrintLabels] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  // Pharmacy Details Form states
  const [licenseNumber, setLicenseNumber] = useState('PH-2024-0892741');
  const [streetAddress, setStreetAddress] = useState('142 Oakwood Avenue, Suite 3');
  const [city, setCity] = useState('Portland');
  const [stateCode, setStateCode] = useState('OR');
  const [zipCode, setZipCode] = useState('97201');
  const [phone, setPhone] = useState('(503) 555-0142');
  const [email, setEmail] = useState('info@greenleafpharmacy.com');
  const [npiNumber, setNpiNumber] = useState('1234567890');
  const [deaNumber, setDeaNumber] = useState('GL1234567');

  // Operating Hours states
  const [hoursWeekdayOpen, setHoursWeekdayOpen] = useState('08:00');
  const [hoursWeekdayClose, setHoursWeekdayClose] = useState('18:00');
  const [hoursSatOpen, setHoursSatOpen] = useState('09:00');
  const [hoursSatClose, setHoursSatClose] = useState('14:00');

  // Billing and Tax states
  const [defaultTaxRate, setDefaultTaxRate] = useState(0.00);
  const [otcTaxRate, setOtcTaxRate] = useState(8.50);
  const [taxIdEin, setTaxIdEin] = useState('93-1234567');
  const [autoCalcTax, setAutoCalcTax] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', name: 'Credit/Debit', icon: 'credit-card', enabled: true },
    { id: '2', name: 'Cash', icon: 'banknotes', enabled: true },
    { id: '3', name: 'Insurance', icon: 'shield', enabled: true }
  ]);

  // Printer Settings states
  const [labelCopies, setLabelCopies] = useState(2);
  const [labelSize, setLabelSize] = useState('2" x 1" (Standard)');
  const [includeBarcode, setIncludeBarcode] = useState(true);

  // Notification Preferences states
  const [notificationSegment, setNotificationSegment] = useState<'All' | 'Email' | 'In-App' | 'SMS'>('All');
  const [notificationRules, setNotificationRules] = useState([
    { id: 'rx', title: 'New prescription received', desc: 'When a new Rx is sent to your pharmacy', email: true, inApp: true, sms: false },
    { id: 'interaction', title: 'Drug interaction alert', desc: 'Potential interactions detected', email: true, inApp: true, sms: true },
    { id: 'low_stock', title: 'Low stock warning', desc: 'Inventory below minimum threshold', email: false, inApp: true, sms: false },
    { id: 'refill', title: 'Refill reminders', desc: 'Patient refill due notifications', email: true, inApp: false, sms: true },
    { id: 'license', title: 'Expired license alert', desc: 'Before pharmacy license expiration', email: true, inApp: true, sms: true }
  ]);

  // Subscription plan states
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Backup and Sync states
  const [backupRunning, setBackupRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [lastBackupTime, setLastBackupTime] = useState('Dec 18, 2024 — 3:42 AM');

  // Encryption & Password guidelines states
  const [passwordMinLength, setPasswordMinLength] = useState(12);
  const [passwordExpDays, setPasswordExpDays] = useState(90);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecial, setRequireSpecial] = useState(true);
  const [preventReuse, setPreventReuse] = useState(true);
  const [autoLogoutVal, setAutoLogoutVal] = useState('15 minutes');
  const [maxSessions, setMaxSessions] = useState('2 sessions');

  // Theme states
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [accentColor, setAccentColor] = useState<string>('green');
  const [sidebarDensity, setSidebarDensity] = useState<'compact' | 'default' | 'comfortable'>('default');
  const [showSectionDesc, setShowSectionDesc] = useState(true);

  // Connected integrations list
  const [integrationsList, setIntegrationsList] = useState([
    { id: 'surescripts', name: 'Surescripts', desc: 'e-Prescribing network', status: 'Connected', iconBg: 'bg-blue-100 text-blue-600' },
    { id: 'drfirst', name: 'DrFirst', desc: 'Medication history', status: 'Connected', iconBg: 'bg-green-100 text-green-600' },
    { id: 'docusign', name: 'DocuSign', desc: 'Digital signatures', status: 'Setup Required', iconBg: 'bg-indigo-100 text-indigo-600' },
    { id: 'mckesson', name: 'McKesson', desc: 'Drug wholesaler API', status: 'Connected', iconBg: 'bg-orange-100 text-orange-600' },
    { id: 'square', name: 'Square', desc: 'Payment processing', status: 'Disconnected', iconBg: 'bg-pink-100 text-pink-600' },
    { id: 'analytics', name: 'Google Analytics', desc: 'Usage analytics', status: 'Optional', iconBg: 'bg-cyan-100 text-cyan-600' }
  ]);

  // Sidebar navigation configuration mapping
  const navItems = [
    { id: 'general', label: 'General', desc: 'Configure basic application preferences' },
    { id: 'pharmacy', label: 'Pharmacy Info', desc: 'Legal and contact information' },
    { id: 'roles', label: 'User Roles', desc: 'Manage team access levels' },
    { id: 'billing', label: 'Billing & Tax', desc: 'Tax rates and payment methods' },
    { id: 'printer', label: 'Printer Settings', desc: 'Label and receipt printers' },
    { id: 'notifications', label: 'Notifications', desc: 'Alert and notification preferences' },
    { id: 'subscription', label: 'Subscription Plans', desc: 'Plan comparison and upgrades' },
    { id: 'backup', label: 'Backup & Sync', desc: 'Data protection and sync' },
    { id: 'security', label: 'Security', desc: '2FA, passwords, and sessions' },
    { id: 'theme', label: 'Theme', desc: 'Appearance and layout options' },
    { id: 'integrations', label: 'Integrations', desc: 'Third-party service connections' }
  ];

  // Simulated live backup runner
  const startBackupProcess = () => {
    if (backupRunning) return;
    setBackupRunning(true);
    setBackupProgress(0);
    showToast('Starting cloud systems backup...', 'info');
  };

  useEffect(() => {
    if (!backupRunning) return;
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        const next = prev + Math.floor(Math.random() * 8 + 6);
        if (next >= 100) {
          clearInterval(interval);
          setBackupRunning(false);
          setLastBackupTime(new Date().toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
          showToast('Database cloud backup completed successfully!', 'success');
          return 100;
        }
        return next;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [backupRunning]);

  // Handlers for Add Role
  const handleAddNewRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      showToast('Please enter a role name', 'error');
      return;
    }
    const newId = (rolesList.length + 1).toString();
    const formattedPerms = newRolePerms.length > 0 ? newRolePerms : ['View Only'];
    const newObject: RoleItem = {
      id: newId,
      name: newRoleName,
      usersCount: newRoleUsers,
      permissions: formattedPerms,
      status: newRoleStatus
    };
    setRolesList(prev => [...prev, newObject]);
    showToast(`Role "${newRoleName}" has been successfully added.`, 'success');
    setNewRoleName('');
    setNewRoleUsers(0);
    setNewRolePerms([]);
    setShowAddRoleModal(false);
  };

  // Handlers for deleting role
  const handleDeleteRole = (id: string, name: string) => {
    setRolesList(prev => prev.filter(r => r.id !== id));
    showToast(`Role "${name}" deleted successfully.`, 'warning');
  };

  // Helper selectors based on active section
  const currentNavDetails = navItems.find(n => n.id === activeSection) || navItems[0];

  // Switch helper
  const renderToggleSwitch = (value: boolean, onChange: (v: boolean) => void) => {
    return (
      <button 
        type="button"
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative flex items-center ${value ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <span 
          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 block ${value ? 'translate-x-5' : 'translate-x-0'}`} 
        />
      </button>
    );
  };

  // Color theme mapping
  const getAccentColorClass = () => {
    switch (accentColor) {
      case 'green': return 'text-emerald-600 bg-emerald-50 border-emerald-500 hover:text-emerald-800';
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-500 hover:text-blue-800';
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-500 hover:text-purple-800';
      case 'amber': return 'text-amber-600 bg-amber-50 border-amber-500 hover:text-amber-800';
      case 'rose': return 'text-rose-600 bg-rose-50 border-rose-500 hover:text-rose-800';
      case 'teal': return 'text-teal-600 bg-teal-50 border-teal-500 hover:text-teal-800';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-500 hover:text-emerald-800';
    }
  };

  const getAccentBtnClass = () => {
    switch (accentColor) {
      case 'green': return 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800';
      case 'blue': return 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800';
      case 'amber': return 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800';
      case 'teal': return 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800';
      default: return 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800';
    }
  };

  const getAccentTextClass = () => {
    switch (accentColor) {
      case 'green': return 'text-emerald-600';
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      case 'amber': return 'text-amber-605';
      case 'rose': return 'text-rose-600';
      case 'teal': return 'text-teal-600';
      default: return 'text-emerald-600';
    }
  };

  const getAccentRingClass = () => {
    switch (accentColor) {
      case 'green': return 'focus:ring-emerald-500 border-emerald-200';
      case 'blue': return 'focus:ring-blue-500 border-blue-200';
      case 'purple': return 'focus:ring-purple-500 border-purple-200';
      case 'amber': return 'focus:ring-amber-500 border-amber-200';
      case 'rose': return 'focus:ring-rose-500 border-rose-200';
      case 'teal': return 'focus:ring-teal-500 border-teal-200';
      default: return 'focus:ring-emerald-500 border-emerald-200';
    }
  };

  return (
    <div className={`flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased ${themeMode === 'dark' ? 'dark-mode-override' : ''}`}>
      {/* Sidebar Component */}
      <Sidebar currentView="settings" setView={setView} />

      {/* Main Backing Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-250 transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{currentNavDetails.label} Settings</h1>
                {showSectionDesc && (
                  <p className="text-xs text-slate-500 mt-0.5">{currentNavDetails.desc}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  showToast('Settings has been reset to defaults.', 'warning');
                }}
                className="px-3.5 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition flex items-center gap-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button 
                onClick={() => {
                  showToast('All configuration modifications saved successfully!', 'success');
                }}
                className={`text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${getAccentBtnClass()}`}
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </header>

        {/* Outer background layout divided into Sidebar sections on left & Viewport container on right */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Inner Tabbed Navigation Sidebar for Desktop Layout */}
          <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 select-none">
            <div className="p-3 font-bold text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
              Settings Sections
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' 
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block shrink-0" />}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Scrolling Viewport Area containing dynamic forms depending on selected settings category */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-24">
            
            {/* 1. SECTION: GENERAL PREFERENCES */}
            {activeSection === 'general' && (
              <div className="space-y-6 max-w-4xl">
                {/* Prefs Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Application Preferences</h3>
                  <p className="text-xs text-slate-400 mb-5">Customize how PharmaCare works for your pharmacy</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pharmacy Name</label>
                      <input 
                        type="text" 
                        value={pharmacyName} 
                        onChange={e => setPharmacyName(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default Language</label>
                      <select 
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-white transition ${getAccentRingClass()}`}
                      >
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                      <select 
                        value={timezone}
                        onChange={e => setTimezone(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-white transition ${getAccentRingClass()}`}
                      >
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Pacific Time (PT)</option>
                        <option>Mountain Time (MT)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date Format</label>
                      <select 
                        value={dateFormat}
                        onChange={e => setDateFormat(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-white transition ${getAccentRingClass()}`}
                      >
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
                      <select 
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-white transition ${getAccentRingClass()}`}
                      >
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>CAD (C$)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prescription ID Prefix</label>
                      <input 
                        type="text" 
                        value={rxPrefix} 
                        onChange={e => setRxPrefix(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Behavioral Toggles */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Behavioral Toggles</h3>
                  <p className="text-xs text-slate-400 mb-5">Control automatic system behaviors</p>
                  
                  <div className="divide-y divide-slate-100">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Auto-save drafts</p>
                        <p className="text-[10px] text-slate-400">Automatically save prescription drafts every 30 seconds</p>
                      </div>
                      {renderToggleSwitch(autoSaveDrafts, setAutoSaveDrafts)}
                    </div>
                    <div className="flex items-center justify-between py-3 pt-4">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Sound notifications</p>
                        <p className="text-[10px] text-slate-400">Play audio alerts for new prescriptions and drug issues</p>
                      </div>
                      {renderToggleSwitch(soundNotifications, setSoundNotifications)}
                    </div>
                    <div className="flex items-center justify-between py-3 pt-4">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Auto-print labels</p>
                        <p className="text-[10px] text-slate-400">Print medication labels automatically after filling prescriptions</p>
                      </div>
                      {renderToggleSwitch(autoPrintLabels, setAutoPrintLabels)}
                    </div>
                    <div className="flex items-center justify-between py-3 pt-4">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Low stock alerts</p>
                        <p className="text-[10px] text-slate-400">Notify senior pharmacist when local inventory falls below target buffers</p>
                      </div>
                      {renderToggleSwitch(lowStockAlerts, setLowStockAlerts)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SECTION: PHARMACY INFO */}
            {activeSection === 'pharmacy' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Pharmacy Details</h3>
                  <p className="text-xs text-slate-400 mb-5">Legal, regulatory, and contact business information for your pharmacy</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pharmacy License Number</label>
                      <input 
                        type="text" 
                        value={licenseNumber} 
                        onChange={e => setLicenseNumber(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-emerald-50/20 text-slate-700 transition ${getAccentRingClass()}`}
                      />
                      <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        <span>Verified and active with state licensing bureau</span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Street Address</label>
                      <input 
                        type="text" 
                        value={streetAddress} 
                        onChange={e => setStreetAddress(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                        <input 
                          type="text" 
                          value={city} 
                          onChange={e => setCity(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">State</label>
                        <input 
                          type="text" 
                          value={stateCode} 
                          onChange={e => setStateCode(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ZIP Code</label>
                        <input 
                          type="text" 
                          value={zipCode} 
                          onChange={e => setZipCode(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                        <input 
                          type="text" 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">NPI Number (National Prescriber ID)</label>
                      <input 
                        type="text" 
                        value={npiNumber} 
                        onChange={e => setNpiNumber(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">DEA Number (Federal Drug Admin)</label>
                      <input 
                        type="text" 
                        value={deaNumber} 
                        onChange={e => setDeaNumber(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none border-red-200 bg-red-50/10 text-slate-800 transition ${getAccentRingClass()}`}
                      />
                      <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-550 animate-bounce" />
                        <span>DEA regulatory status renewal required in 15 days</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operating Business Hours */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Operating Hours</h3>
                  <p className="text-xs text-slate-400 mb-5">Set your pharmacy's business hours for each day of the week</p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-1.5">
                      <span className="w-28 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Mon – Fri</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="time" 
                          value={hoursWeekdayOpen} 
                          onChange={e => setHoursWeekdayOpen(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                        <span className="text-slate-400 text-xs font-medium">to</span>
                        <input 
                          type="time" 
                          value={hoursWeekdayClose}
                          onChange={e => setHoursWeekdayClose(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-1.5 border-t border-slate-100 pt-3">
                      <span className="w-28 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Saturday</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="time" 
                          value={hoursSatOpen} 
                          onChange={e => setHoursSatOpen(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                        <span className="text-slate-400 text-xs font-medium">to</span>
                        <input 
                          type="time" 
                          value={hoursSatClose}
                          onChange={e => setHoursSatClose(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-1.5 border-t border-slate-100 pt-3">
                      <span className="w-28 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Sunday</span>
                      <span className="text-xs text-slate-400 font-bold italic bg-slate-100/60 px-2.5 py-1 rounded-lg w-fit">Closed / Emergency Dispatch Only</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SECTION: USER ROLES */}
            {activeSection === 'roles' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">User Roles & Permissions</h3>
                      <p className="text-xs text-slate-400">Manage levels of security access and module visibility for your pharmacy team</p>
                    </div>
                    <button 
                      onClick={() => setShowAddRoleModal(true)}
                      className={`text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${getAccentBtnClass()}`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  {/* Role search */}
                  <div className="relative mb-5">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search roles..." 
                      value={roleSearch} 
                      onChange={e => setRoleSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  {/* Roles table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-450 uppercase font-black text-[10px] tracking-wider">
                          <th className="px-4 py-3">Role Designation</th>
                          <th className="px-4 py-3 text-center">Active Users</th>
                          <th className="px-4 py-3">Modules / Permissions</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rolesList
                          .filter(role => role.name.toLowerCase().includes(roleSearch.toLowerCase()))
                          .map((role) => (
                            <tr key={role.id} className="hover:bg-slate-50/50 transition">
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                    <Shield className="w-4 h-4 text-emerald-700" />
                                  </div>
                                  <span className="font-extrabold text-slate-900">{role.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-center font-bold text-slate-700 font-mono">
                                {role.usersCount}
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex flex-wrap gap-1">
                                  {role.permissions.map((p, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-650">
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide ${
                                  role.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {role.status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right space-x-1.5 select-none">
                                <button 
                                  onClick={() => showToast(`Edit form loaded for: ${role.name}`, 'info')}
                                  className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-slate-100 rounded-lg transition"
                                >
                                  <PenTool className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteRole(role.id, role.name)}
                                  className="p-1.5 hover:text-red-600 hover:bg-rose-50 border border-transparent hover:border-slate-100 rounded-lg transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* MODAL POPUP FOR ADDING ROLE */}
                {showAddRoleModal && (
                  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
                      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-emerald-400" />
                          <h3 className="font-bold text-sm tracking-tight">Create User Designation</h3>
                        </div>
                        <button onClick={() => setShowAddRoleModal(false)} className="text-slate-450 hover:text-white transition">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <form onSubmit={handleAddNewRole} className="p-6 space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Role Title / Designation</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Lead Technologist" 
                            value={newRoleName} 
                            onChange={e => setNewRoleName(e.target.value)} 
                            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Users Count</label>
                            <input 
                              type="number" 
                              min={0}
                              value={newRoleUsers} 
                              onChange={e => setNewRoleUsers(Number(e.target.value))} 
                              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                            <select 
                              value={newRoleStatus} 
                              onChange={e => setNewRoleStatus(e.target.value as any)} 
                              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                            >
                              <option>Active</option>
                              <option>Limited</option>
                              <option>Inactive</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Permissions Module Selection</label>
                          <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                            {['Rx', 'Inventory', 'POS', 'Billing', 'Reports', 'Full Access'].map((perm) => {
                              const isChecked = newRolePerms.includes(perm);
                              return (
                                <label key={perm} className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50">
                                  <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        setNewRolePerms(prev => prev.filter(p => p !== perm));
                                      } else {
                                        setNewRolePerms(prev => [...prev, perm]);
                                      }
                                    }}
                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                                  />
                                  <span className="font-bold text-slate-700">{perm}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2 text-xs">
                          <button 
                            type="button" 
                            onClick={() => setShowAddRoleModal(false)}
                            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 transition"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className={`text-white px-4 py-2 rounded-xl font-bold transition ${getAccentBtnClass()}`}
                          >
                            Add Role
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. SECTION: BILLING & TAX */}
            {activeSection === 'billing' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Tax Configuration</h3>
                  <p className="text-xs text-slate-400 mb-5">Set default tax rates applied to medication prescriptions versus overall OTC sales</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default Tax Rate (%)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={defaultTaxRate} 
                        onChange={e => setDefaultTaxRate(Number(e.target.value))}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                      <p className="text-[10px] text-slate-400 mt-1.5 font-bold">Prescription medications are typically tax-exempt in most states</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">OTC Sales Tax Rate (%)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={otcTaxRate} 
                        onChange={e => setOtcTaxRate(Number(e.target.value))}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tax ID / EIN</label>
                      <input 
                        type="text" 
                        value={taxIdEin} 
                        onChange={e => setTaxIdEin(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none transition ${getAccentRingClass()}`}
                      />
                    </div>
                    <div className="flex items-center justify-between py-1 border border-slate-100 rounded-xl px-4 bg-slate-50/50">
                      <div>
                        <p className="text-xs font-extrabold text-slate-705">Auto-calculate tax</p>
                        <p className="text-[9px] text-slate-400">Apply state & local taxes automatically at payment counter</p>
                      </div>
                      {renderToggleSwitch(autoCalcTax, setAutoCalcTax)}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1 font-sans">Payment Methods</h3>
                  <p className="text-xs text-slate-400 mb-5">Accepted payment methods for custom invoice checkout</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {paymentMethods.map(pm => {
                      return (
                        <div 
                          key={pm.id} 
                          onClick={() => {
                            setPaymentMethods(prev => prev.map(p => p.id === pm.id ? { ...p, enabled: !p.enabled } : p));
                            showToast(`${pm.name} payment method modified`, 'info');
                          }}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition cursor-pointer select-none ${
                            pm.enabled 
                              ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950' 
                              : 'border-slate-200 bg-white text-slate-450 hover:bg-slate-50/50'
                          }`}
                        >
                          <CreditCard className={`w-5 h-5 ${pm.enabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <div>
                            <p className="text-xs font-extrabold">{pm.name}</p>
                            <p className={`text-[10px] font-bold ${pm.enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {pm.enabled ? 'Enabled' : 'Disabled'}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    <div 
                      onClick={() => showToast('New payment network custom wizard starting...', 'info')}
                      className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-slate-350 cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-300 transition-all select-none"
                    >
                      <Plus className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">Add Method</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SECTION: PRINTER SETTINGS */}
            {activeSection === 'printer' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Connected Printers</h3>
                  <p className="text-xs text-slate-400 mb-5">Manage physical label dispensers, receipt printers, and invoice reports</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Printer className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">Zebra ZD420 — Dispensing Label Printer</p>
                          <p className="text-[10px] text-slate-400 font-bold">USB Connection • Connected Downtown</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Online</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center">
                          <Printer className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">Star TSP143 — Cashier Receipt Printer</p>
                          <p className="text-[10px] text-slate-400 font-bold">Network Connection • Host 192.168.1.42</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Online</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-200 transition-colors bg-rose-50/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100/30 text-rose-600 flex items-center justify-center">
                          <Printer className="w-5 h-5 text-red-700" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">HP LaserJet Pro — Admin Reports Printer</p>
                          <p className="text-[10px] text-slate-400 font-bold">Wi-Fi Connection • Offline or Hub Standby</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-red-100 text-red-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Offline</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Label Configuration</h3>
                  <p className="text-xs text-slate-400 mb-5">Default label template styling and physical paper sizes</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Label Size</label>
                      <select 
                        value={labelSize}
                        onChange={e => setLabelSize(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-white transition ${getAccentRingClass()}`}
                      >
                        <option>2" x 1" (Standard)</option>
                        <option>3" x 1.5" (Large)</option>
                        <option>1.5" x 0.5" (Small)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Copies Per Label Printout</label>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setLabelCopies(prev => Math.max(1, prev - 1))}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold transition"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-extrabold text-sm text-slate-800">{labelCopies}</span>
                        <button 
                          onClick={() => setLabelCopies(prev => Math.min(5, prev + 1))}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1 border border-slate-100 rounded-xl px-4 bg-slate-50/50">
                      <div>
                        <p className="text-xs font-extrabold text-slate-705">Include Barcode</p>
                        <p className="text-[9px] text-slate-400">Print custom QR compliance code on medicine labels</p>
                      </div>
                      {renderToggleSwitch(includeBarcode, setIncludeBarcode)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SECTION: NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Notification Preferences</h3>
                  <p className="text-xs text-slate-400 mb-5">Configure how and when clinical alerts and business triggers are dispatched</p>
                  
                  {/* Segment controller */}
                  <div className="mb-6 flex bg-slate-100 rounded-xl p-1 w-fit select-none">
                    {(['All', 'Email', 'In-App', 'SMS'] as const).map(segment => (
                      <button
                        key={segment}
                        onClick={() => setNotificationSegment(segment)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          notificationSegment === segment 
                            ? 'bg-emerald-600 text-white shadow' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {segment}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 select-text">
                    {notificationRules.map((rule) => {
                      return (
                        <div key={rule.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors gap-3">
                          <div className="flex items-start gap-3">
                            <Bell className="w-4 h-4 text-emerald-600 mt-1" />
                            <div>
                              <p className="text-xs font-extrabold text-slate-850">{rule.title}</p>
                              <p className="text-[10px] text-slate-400">{rule.desc}</p>
                            </div>
                          </div>
                          
                          {/* Segment rule checkboxes */}
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={rule.email}
                                onChange={() => {
                                  setNotificationRules(prev => prev.map(r => r.id === rule.id ? { ...r, email: !r.email } : r));
                                  showToast('Rule email state updated', 'info');
                                }}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                              />
                              <span className="text-[10px] font-bold text-slate-650">Email</span>
                            </label>
                            
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={rule.inApp}
                                onChange={() => {
                                  setNotificationRules(prev => prev.map(r => r.id === rule.id ? { ...r, inApp: !r.inApp } : r));
                                  showToast('Rule in-app state updated', 'info');
                                }}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                              />
                              <span className="text-[10px] font-bold text-slate-650">In-App</span>
                            </label>

                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={rule.sms}
                                onChange={() => {
                                  setNotificationRules(prev => prev.map(r => r.id === rule.id ? { ...r, sms: !r.sms } : r));
                                  showToast('Rule SMS state updated', 'info');
                                }}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                              />
                              <span className="text-[10px] font-bold text-slate-650">SMS</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 px-3 flex flex-wrap gap-4 text-[10px] text-slate-450 border-t border-slate-100 pt-3 font-semibold">
                    <span>Activated channels mapping details:</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 block"></span> Email Notifications</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 block"></span> Push In-App Popups</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 block"></span> Mobile SMS dispatch</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SECTION: SUBSCRIPTION PLANS */}
            {activeSection === 'subscription' && (
              <div className="space-y-6 max-w-5xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  
                  <div className="text-center mb-8">
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Choose Your Plan</h3>
                    <p className="text-xs text-slate-500">Scale your pharmacy business and digital compliance with our managed tiers</p>
                    
                    <div className="flex items-center justify-center gap-3 mt-4 select-none">
                      <span className={`text-xs font-bold ${billingPeriod === 'monthly' ? 'text-slate-900 font-black' : 'text-slate-400'}`}>Monthly</span>
                      <button 
                        onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative flex items-center ${billingPeriod === 'yearly' ? 'bg-emerald-600' : 'bg-slate-350'}`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                      <span className={`text-xs font-bold flex items-center gap-1 ${billingPeriod === 'yearly' ? 'text-slate-900 font-black' : 'text-slate-400'}`}>
                        <span>Yearly</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded">Save 20%</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Starter Card */}
                    <div className="border border-slate-205 rounded-2xl p-5 hover:shadow-md transition duration-350 bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <div className="mb-4"><span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-500">Starter</span></div>
                        <div className="mb-4">
                          <span className="text-3xl font-black text-slate-900">{billingPeriod === 'monthly' ? '$49' : '$39'}</span>
                          <span className="text-xs text-slate-400">/mo</span>
                        </div>
                        <ul className="space-y-3 mb-6 text-xs text-slate-650 font-medium">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Single pharmacy store</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Up to 3 user profiles</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Basic Rx storage ledger</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Standard email response desk</li>
                          <li className="flex items-center gap-2 text-slate-400 line-through"><X className="w-3.5 h-3.5 text-slate-300" /> Advanced real-time analysis</li>
                          <li className="flex items-center gap-2 text-slate-400 line-through"><X className="w-3.5 h-3.5 text-slate-300" /> Integration API access keys</li>
                        </ul>
                      </div>
                      <button className="w-full py-2.5 rounded-xl text-xs font-extrabold border border-slate-200 text-slate-505 bg-white shadow-sm cursor-not-allowed">
                        Current Initial Plan
                      </button>
                    </div>

                    {/* Pro Card (Featured!) */}
                    <div className="border-2 border-emerald-500 rounded-2xl p-5 shadow-lg relative bg-white flex flex-col justify-between">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3.5 py-0.5 rounded-full bg-emerald-600 text-[9px] font-black text-white shadow-md shadow-emerald-500/20 uppercase tracking-widest">Most Popular</span>
                      </div>
                      <div>
                        <div className="mb-4 mt-2"><span className="px-2.5 py-0.5 rounded-full bg-emerald-150 text-[10px] font-extrabold text-emerald-800">Professional</span></div>
                        <div className="mb-4">
                          <span className="text-3xl font-black text-slate-900">{billingPeriod === 'monthly' ? '$129' : '$103'}</span>
                          <span className="text-xs text-slate-400">/mo</span>
                        </div>
                        <ul className="space-y-3 mb-6 text-xs text-slate-650 font-semibold">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Up to 5 store locations</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Up to 15 team profiles</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Full Rx ledger & POS integration</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Advanced data analytics dashboard</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Priority 24/7 technical hotline</li>
                          <li className="flex items-center gap-2 text-slate-400 line-through"><X className="w-3.5 h-3.5 text-slate-300" /> Unlimited bespoke connections</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => showToast('Upgrading to Professional tier... processing payment hook', 'success')}
                        className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer text-center"
                      >
                        Upgrade to Pro
                      </button>
                    </div>

                    {/* Enterprise Card */}
                    <div className="border border-slate-205 rounded-2xl p-5 hover:shadow-md transition duration-350 bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <div className="mb-4"><span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-[10px] font-extrabold text-white">Enterprise</span></div>
                        <div className="mb-4">
                          <span className="text-3xl font-black text-slate-900">{billingPeriod === 'monthly' ? '$299' : '$239'}</span>
                          <span className="text-xs text-slate-400">/mo</span>
                        </div>
                        <ul className="space-y-3 mb-6 text-xs text-slate-650 font-medium">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Unlimited branch locations</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Unlimited custom accounts</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Everything in Professional tier</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Full custom API developer endpoints</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Account compliance manager</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Custom database ledger migrations</li>
                        </ul>
                      </div>
                      <button 
                        onClick={() => showToast('Connecting you with an enterprise sales agent. Check mail inbox!', 'info')}
                        className="w-full py-2.5 rounded-xl text-xs font-extrabold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer text-center"
                      >
                        Contact Sales Representative
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* 8. SECTION: BACKUP & SYNC */}
            {activeSection === 'backup' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Backup Status</h3>
                      <p className="text-xs text-slate-400">Automated cloud-hosted data backups and ledger protection parameters</p>
                    </div>
                    <button 
                      onClick={startBackupProcess}
                      disabled={backupRunning}
                      className={`text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${getAccentBtnClass()}`}
                    >
                      <Cloud className="w-4 h-4" />
                      <span>{backupRunning ? 'Synchronizing Archive...' : 'Backup Now'}</span>
                    </button>
                  </div>

                  {/* Backup stats */}
                  <div className="bg-emerald-50 text-emerald-950 rounded-xl p-4 mb-5 border border-emerald-100">
                    <div className="flex items-center justify-between mb-2 text-xs font-bold">
                      <span>Last Synced Backup</span>
                      <span className="font-semibold text-emerald-700">{lastBackupTime}</span>
                    </div>
                    
                    <div className="w-full bg-emerald-250/30 rounded-full h-2.5 relative overflow-hidden">
                      <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-[10px] text-emerald-700 font-bold mt-2">
                       2.4 GB of 5 GB allocated secure HIPAA cluster storage used • Next scheduled clock cycle: Daily 3:00 AM UTC
                    </p>
                  </div>

                  {/* Active backing progress tracker */}
                  {backupRunning && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 animate-pulse transition duration-300 mt-2">
                      <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-705">
                        <span>Uploading encrypted medical bundle to secure servers...</span>
                        <span className="text-emerald-600">{backupProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${backupProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Database className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-650">Prescriptions Logs</span>
                      </div>
                      <p className="text-2xl font-black text-slate-900 mt-1">14,283</p>
                      <p className="text-[10px] text-slate-400 font-bold">In-memory ledger synchronized</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-650">Patient Files</span>
                      </div>
                      <p className="text-2xl font-black text-slate-900 mt-1">8,941</p>
                      <p className="text-[10px] text-slate-400 font-bold">Secure records mapped check</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Layers className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-650">Inventory Units</span>
                      </div>
                      <p className="text-2xl font-black text-slate-900 mt-1">3,217</p>
                      <p className="text-[10px] text-slate-400 font-bold">Medicines catalog checked</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 9. SECTION: SECURITY & LOCKS */}
            {activeSection === 'security' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Two-Factor Authentication</h3>
                  <p className="text-xs text-slate-400 mb-5">Enforce high assurance parameters to protect patient health records HIPAA status</p>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-605 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">Authenticator App Authentication (TOTP)</p>
                        <p className="text-[10px] text-slate-400 font-bold">Google Authenticator, Authy, or Duo Mobile endpoints</p>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Required Activated</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">SMS Direct Code Verification</p>
                        <p className="text-[10px] text-slate-400 font-bold">Verify team access via verified phone carrier notifications</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast('SMS verification enabled successfully as fall-back mechanism.', 'success')}
                      className="px-3.5 py-2 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-slate-650 transition cursor-pointer"
                    >
                      Activate Fallback
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Enforced Password Policy</h3>
                  <p className="text-xs text-slate-400 mb-5 font-sans animate-fade">Control complexity algorithms for pharmacy team credentials</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-1 px-1">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Minimum characters list length</p>
                        <p className="text-[10px] text-slate-400">Restrict passwords below secure thresholds</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setPasswordMinLength(prev => Math.max(8, prev - 1))}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold transition"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-extrabold text-sm text-slate-800">{passwordMinLength}</span>
                        <button 
                          onClick={() => setPasswordMinLength(prev => Math.min(24, prev + 1))}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Require uppercase letters</p>
                      </div>
                      {renderToggleSwitch(requireUppercase, setRequireUppercase)}
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Require numerical numbers</p>
                      </div>
                      {renderToggleSwitch(requireNumbers, setRequireNumbers)}
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Require custom non-alphanumeric special characters</p>
                      </div>
                      {renderToggleSwitch(requireSpecial, setRequireSpecial)}
                    </div>

                    <div className="flex items-center justify-between py-1 px-1 border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Credential automatic rotation expiration (days)</p>
                        <p className="text-[10px] text-slate-400">Enforce rotation schedules on active accounts</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setPasswordExpDays(prev => Math.max(30, prev - 15))}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold transition"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-extrabold text-sm text-slate-800">{passwordExpDays}</span>
                        <button 
                          onClick={() => setPasswordExpDays(prev => Math.min(365, prev + 15))}
                          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Prevent historical password reuse</p>
                        <p className="text-[10px] text-slate-400">Saves and matches historical hash signatures to enforce freshness</p>
                      </div>
                      {renderToggleSwitch(preventReuse, setPreventReuse)}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Session Management</h3>
                  <p className="text-xs text-slate-400 mb-5">Controls terminal logs timeout and concurrency safety loops</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Inactivity Auto-Logout Timeout</label>
                      <select 
                        value={autoLogoutVal}
                        onChange={e => setAutoLogoutVal(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-white transition ${getAccentRingClass()}`}
                      >
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>Never</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Concurrent Active Sessions Per User</label>
                      <select 
                        value={maxSessions}
                        onChange={e => setMaxSessions(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-1 focus:outline-none bg-white transition ${getAccentRingClass()}`}
                      >
                        <option>1 session</option>
                        <option>2 sessions</option>
                        <option>3 sessions</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. SECTION: THEME */}
            {activeSection === 'theme' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Appearance & Colors</h3>
                  <p className="text-xs text-slate-400 mb-5">Configure the display layout density and active brand accent options</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6 select-none">
                    <button 
                      onClick={() => {
                        setThemeMode('light');
                        showToast('Light mode appearance preset selected.', 'info');
                      }}
                      className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 min-w-[120px] cursor-pointer transition ${
                        themeMode === 'light' ? 'border-emerald-500 bg-emerald-50/20 text-slate-900' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-8 rounded-lg bg-white border border-slate-250 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-xs font-bold">Classic Light</span>
                    </button>

                    <button 
                      onClick={() => {
                        setThemeMode('dark');
                        showToast('Immersive Dark Mode chosen.', 'info');
                      }}
                      className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 min-w-[120px] cursor-pointer transition ${
                        themeMode === 'dark' ? 'border-emerald-500 bg-emerald-50/20 text-slate-900' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-xs font-bold">Midnight Dark</span>
                    </button>

                    <button 
                      onClick={() => {
                        setThemeMode('auto');
                        showToast('System clock matched layout chosen.', 'info');
                      }}
                      className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 min-w-[120px] cursor-pointer transition ${
                        themeMode === 'auto' ? 'border-emerald-500 bg-emerald-50/20 text-slate-900' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-white to-slate-800 border border-slate-200 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-xs font-bold">Match System</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Accent Brand Color Theme</label>
                    <div className="flex gap-4">
                      {['green', 'blue', 'purple', 'amber', 'rose', 'teal'].map((color) => {
                        let isSelected = accentColor === color;
                        let ringColor = 'ring-emerald-500';
                        let bgColor = 'bg-emerald-500';
                        
                        if (color === 'blue') { ringColor = 'ring-blue-500'; bgColor = 'bg-blue-500'; }
                        if (color === 'purple') { ringColor = 'ring-purple-500'; bgColor = 'bg-purple-500'; }
                        if (color === 'amber') { ringColor = 'ring-amber-500'; bgColor = 'bg-amber-500'; }
                        if (color === 'rose') { ringColor = 'ring-rose-500'; bgColor = 'bg-rose-500'; }
                        if (color === 'teal') { ringColor = 'ring-teal-500'; bgColor = 'bg-teal-500'; }

                        return (
                          <button
                            key={color}
                            onClick={() => {
                              setAccentColor(color);
                              showToast(`Active accent color altered to: ${color}`, 'success');
                            }}
                            className={`w-9 h-9 rounded-full cursor-pointer transition transform active:scale-95 ${bgColor} ${
                              isSelected ? `ring-2 ring-offset-2 hover:scale-105 ${ringColor}` : 'hover:scale-105 hover:opacity-90'
                            }`}
                            aria-label={`Accent ${color}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Layout Preferences</h3>
                  <p className="text-xs text-slate-400 mb-5">Adjust margin density and metadata visibility</p>
                  
                  <div className="mb-5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">Sidebar Density</label>
                    <div className="flex bg-slate-100 rounded-xl p-1 w-fit select-none">
                      {(['compact', 'default', 'comfortable'] as const).map(density => (
                        <button
                          key={density}
                          onClick={() => {
                            setSidebarDensity(density);
                            showToast(`Sidebar density set to: ${density}`, 'info');
                          }}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-200 cursor-pointer ${
                            sidebarDensity === density 
                              ? 'bg-emerald-600 text-white shadow font-extrabold' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {density.charAt(0).toUpperCase() + density.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Show section descriptions</p>
                      <p className="text-[10px] text-slate-400">Display detailed instruction notes under primary section headings</p>
                    </div>
                    {renderToggleSwitch(showSectionDesc, setShowSectionDesc)}
                  </div>
                </div>
              </div>
            )}

            {/* 11. SECTION: INTEGRATIONS */}
            {activeSection === 'integrations' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm tracking-tight mb-1">Connected Integrations</h3>
                      <p className="text-xs text-slate-400">Third-party health clinical services connected directly to GreenLeaf local server database</p>
                    </div>
                    <button 
                      onClick={() => showToast('Opening integration connection directory...', 'info')}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-705 bg-white hover:bg-slate-50 transition cursor-pointer flex items-center gap-2`}
                    >
                      <Puzzle className="w-4 h-4 text-slate-500" />
                      <span>Browse Connectors</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrationsList.map((integration) => {
                      return (
                        <div 
                          key={integration.id} 
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-205 hover:border-emerald-300 transition-all duration-300 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${integration.iconBg}`}>
                              <Layers className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">{integration.name}</p>
                              <p className="text-[10px] text-slate-450">{integration.desc}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              showToast(`Configuring ${integration.name} connector...`, 'info');
                              if (integration.status === 'Connected') {
                                setIntegrationsList(prev => prev.map(p => p.id === integration.id ? { ...p, status: 'Disconnected' } : p));
                                showToast(`${integration.name} disconnected.`, 'warning');
                              } else {
                                setIntegrationsList(prev => prev.map(p => p.id === integration.id ? { ...p, status: 'Connected' } : p));
                                showToast(`${integration.name} connected successfully!`, 'success');
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide border transition select-none ${
                                integration.status === 'Connected' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' :
                                integration.status === 'Setup Required' ? 'bg-amber-100 border-amber-200 text-amber-800' :
                                integration.status === 'Disconnected' ? 'bg-rose-100 border-rose-200 text-rose-800' :
                                'bg-indigo-100 border-indigo-200 text-indigo-800'
                            }`}
                          >
                            {integration.status}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MOBILE OFFCANVAS DRAWER SIDEBAR */}
      {/* ========================================================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay mask */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          />
          {/* Menu Drawer */}
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
                  <LucideSettings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs">Settings Navigation</h3>
                  <p className="text-[10px] text-slate-400">GreenLeaf Community ERP</p>
                </div>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                <X className="w-4 h-4 text-slate-450" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-3 space-y-1 select-none">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 font-black' 
                        : 'text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="text-center">
                <button 
                  onClick={() => setView('dashboard')}
                  className="w-full py-2 bg-gradient-to-tr from-slate-800 to-slate-900 text-white rounded-xl text-xs font-bold shadow transition hover:opacity-95 cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FLOATING ACTION TOAST NOTIFICATION STACK */}
      {/* ========================================================= */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none select-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-emerald-600';
          let textColor = 'text-white border-transparent';
          let icon = <Check className="w-4 h-4 shrink-0 text-white" />;

          if (toast.type === 'error') {
            bgColor = 'bg-rose-50 border-rose-200 shadow-rose-200/20';
            textColor = 'text-rose-900 border';
            icon = <X className="w-4 h-4 shrink-0 text-rose-600" />;
          } else if (toast.type === 'info') {
            bgColor = 'bg-blue-50 border-blue-250 shadow-blue-200/20';
            textColor = 'text-blue-900 border';
            icon = <Info className="w-4 h-4 shrink-0 text-blue-600" />;
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-50 border-amber-250 shadow-amber-200/20';
            textColor = 'text-amber-900 border';
            icon = <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />;
          } else {
            bgColor = 'bg-white border-slate-200 shadow-slate-200/20';
            textColor = 'text-slate-900 border';
            icon = <Check className="w-4 h-4 shrink-0 text-emerald-600" />;
          }

          return (
            <div 
              key={toast.id}
              className={`p-3.5 px-4 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-350 transform translate-y-0 opacity-100 pointer-events-auto border ${bgColor} ${textColor}`}
            >
              {icon}
              <span className="text-[11.5px] font-bold leading-tight">{toast.message}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
