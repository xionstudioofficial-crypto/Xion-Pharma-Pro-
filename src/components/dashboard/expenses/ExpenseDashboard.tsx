import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, CreditCard, ChevronRight, Bell, Calendar, 
  Check, X, Inbox, Sparkles, AlertCircle, RefreshCw, Printer, 
  FileDown, Save, FileText, User, Trash2, Edit2, Plus, 
  Phone, Mail, ArrowUpRight, TrendingDown, ClipboardList, CheckCircle2, 
  Package, HelpCircle, Layers, Coins, Search, Wallet, SlidersHorizontal, 
  Upload, XCircle, FileSpreadsheet, Paperclip, ChevronDown, CheckCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import Sidebar from '../Sidebar';

// Definitions
interface ExpenseItem {
  id: string;
  date: string;
  description: string;
  invoiceNo: string;
  category: 'Software' | 'Rent' | 'Salaries' | 'Utilities' | 'Marketing' | 'Travel' | 'Office';
  submitterName: string;
  submitterAvatar: string;
  submitterColor: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    date: '2026-05-28',
    description: 'AWS Cloud Services',
    invoiceNo: 'AWS-2026-1028',
    category: 'Software',
    submitterName: 'James Dean',
    submitterAvatar: 'JD',
    submitterColor: 'from-pink-400 to-rose-500',
    amount: 12480.00,
    status: 'Approved'
  },
  {
    id: 'exp-2',
    date: '2026-05-27',
    description: 'Office Rent — Building B',
    invoiceNo: 'BLD-LEASE-MAY',
    category: 'Rent',
    submitterName: 'Elena Martinez',
    submitterAvatar: 'EM',
    submitterColor: 'from-amber-400 to-orange-500',
    amount: 26000.00,
    status: 'Approved'
  },
  {
    id: 'exp-3',
    date: '2026-05-26',
    description: 'Engineering Team Salaries',
    invoiceNo: 'PAY-ENG-OCT',
    category: 'Salaries',
    submitterName: 'Sarah Kim',
    submitterAvatar: 'SK',
    submitterColor: 'from-indigo-400 to-purple-500',
    amount: 98420.00,
    status: 'Pending'
  },
  {
    id: 'exp-4',
    date: '2026-05-25',
    description: 'Electricity — Main Office',
    invoiceNo: 'CONED-OCT-889',
    category: 'Utilities',
    submitterName: 'Mark Peterson',
    submitterAvatar: 'MP',
    submitterColor: 'from-teal-400 to-cyan-500',
    amount: 3240.50,
    status: 'Approved'
  },
  {
    id: 'exp-5',
    date: '2026-05-24',
    description: 'Q4 Marketing Campaign',
    invoiceNo: 'AD-GGL-LNKD',
    category: 'Marketing',
    submitterName: 'Ana Rivera',
    submitterAvatar: 'AR',
    submitterColor: 'from-rose-400 to-pink-500',
    amount: 8940.00,
    status: 'Rejected'
  },
  {
    id: 'exp-6',
    date: '2026-05-23',
    description: 'Team Offsite — Travel',
    invoiceNo: 'TRV-FLGHT-OCT',
    category: 'Travel',
    submitterName: 'David Kincaid',
    submitterAvatar: 'DK',
    submitterColor: 'from-violet-400 to-fuchsia-500',
    amount: 14820.00,
    status: 'Approved'
  },
  {
    id: 'exp-7',
    date: '2026-05-22',
    description: 'Office Supplies — Q4',
    invoiceNo: 'STN-OFF-SUPPLY',
    category: 'Office',
    submitterName: 'Elena Martinez',
    submitterAvatar: 'EM',
    submitterColor: 'from-amber-450 to-pink-500',
    amount: 1284.75,
    status: 'Pending'
  }
];

// Activity logger shape
interface ActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  target: string;
  meta?: string;
  type: 'approve' | 'submit' | 'reject' | 'upload' | 'alert';
}

const INITIAL_ACTIVITIES: ActivityLog[] = [
  { id: 'act-1', time: '2 mins ago', user: 'Sarah Kim', action: 'approved', target: '$12,480.00', meta: 'AWS Cloud Services', type: 'approve' },
  { id: 'act-2', time: '18 mins ago', user: 'James Dean', action: 'submitted', target: '$3,240.50', meta: 'Electricity ConEd', type: 'submit' },
  { id: 'act-3', time: '1 hour ago', user: 'Elena Martinez', action: 'rejected', target: '$8,940.00', meta: 'Q4 Marketing - limit reached', type: 'reject' },
  { id: 'act-4', time: '3 hours ago', user: 'David Kincaid', action: 'uploaded receipts', target: '3 files', meta: 'Team Offsite (2.4 MB)', type: 'upload' },
  { id: 'act-5', time: '5 hours ago', user: 'System Indicator', action: 'warning alert', target: 'Salaries cap', meta: '98% of Q4 budgets consumed', type: 'alert' }
];

// File upload structure
interface UploadedFile {
  name: string;
  progress: number;
  status: 'Done' | 'Uploading' | 'Failed';
  size: string;
  category: string;
}

export default function ExpenseDashboard({ setView }: { setView: (view: any) => void }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'all' | 'Software' | 'Rent' | 'Salaries' | 'Utilities' | 'Marketing'>('all');
  
  // Real-time modified state variables
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Software' | 'Rent' | 'Salaries' | 'Utilities' | 'Marketing' | 'Travel' | 'Office'>('All');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Interactive dropzone state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { name: 'coned-electric-oct.pdf', progress: 100, status: 'Done', size: '1.2 MB', category: 'Utilities' },
    { name: 'aws-invoice-oct.jpg', progress: 68, status: 'Uploading', size: '820 KB', category: 'Software' }
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Custom Detail views expansion states
  const [openSubscriptionDetails, setOpenSubscriptionDetails] = useState(true);
  const [openUtilityDetails, setOpenUtilityDetails] = useState(true);
  const [openSalaryDetails, setOpenSalaryDetails] = useState(true);
  const [openPropertyDetails, setOpenPropertyDetails] = useState(true);

  // New Expense Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpenseForm, setNewExpenseForm] = useState({
    description: '',
    invoiceNo: '',
    category: 'Software' as ExpenseItem['category'],
    amount: '',
    submitterName: 'Dr. Sarah Khan',
    submitterAvatar: 'SK',
    submitterColor: 'from-emerald-450 to-teal-500'
  });

  const displayToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Trend Chart Data (from the design mockup template: "Spending Trends Line Chart")
  const trendChartData = [
    { name: 'Nov 25', ThisYear: 142000, LastYear: 128000 },
    { name: 'Dec 25', ThisYear: 158000, LastYear: 135000 },
    { name: 'Jan 26', ThisYear: 165000, LastYear: 142000 },
    { name: 'Feb 26', ThisYear: 172000, LastYear: 148000 },
    { name: 'Mar 26', ThisYear: 168000, LastYear: 155000 },
    { name: 'Apr 26', ThisYear: 184000, LastYear: 162000 },
    { name: 'May 26', ThisYear: 198000, LastYear: 170000 },
    { name: 'Jun 26', ThisYear: 205000, LastYear: 178000 },
    { name: 'Jul 26', ThisYear: 212000, LastYear: 185000 },
    { name: 'Aug 26', ThisYear: 221000, LastYear: 192000 },
    { name: 'Sep 26', ThisYear: 221184, LastYear: 198000 },
    { name: 'Oct 26', ThisYear: 248392, LastYear: 205000 }
  ];

  // Dynamic Calculations based on our local expenses list
  const categoryStats = useMemo(() => {
    const categories: { [key: string]: number } = {
      Software: 0,
      Rent: 0,
      Salaries: 0,
      Utilities: 0,
      Marketing: 0,
      Travel: 0,
      Office: 0
    };

    expenses.forEach(item => {
      if (item.status !== 'Rejected') {
        categories[item.category] = (categories[item.category] || 0) + item.amount;
      }
    });

    const totalCalculated = Object.values(categories).reduce((acc, curr) => acc + curr, 0);

    return {
      Breakdown: Object.keys(categories).map(catName => ({
        name: catName,
        value: Number(categories[catName].toFixed(1)),
        percentage: totalCalculated > 0 ? Number(((categories[catName] / totalCalculated) * 100).toFixed(1)) : 0
      })),
      totalApprovedAndPending: totalCalculated
    };
  }, [expenses]);

  // Doughnut category colors configuration matching the designer mockup style
  const COLORS_MAP: { [key: string]: string } = {
    Software: '#a855f7', // Purple
    Rent: '#059669',     // Emerald
    Salaries: '#4f46e5', // Indigo brand
    Utilities: '#ca8a04', // Amber/Yellow
    Marketing: '#f43f5e', // Rose/Pink
    Travel: '#06b6d4',    // Cyan style
    Office: '#64748b'     // Slate Grey
  };

  const getCategoryThemeClass = (cat: ExpenseItem['category']) => {
    switch (cat) {
      case 'Software': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Rent': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Salaries': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Utilities': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Marketing': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Travel': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
      case 'Office': return 'bg-slate-50 text-slate-705 border-slate-200';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  // List filter calculations
  const filteredList = useMemo(() => {
    let result = [...expenses];

    // Sub-tab selection filters
    if (activeTab !== 'all') {
      result = result.filter(item => item.category === activeTab);
    }

    // Droppable or search bar matches
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.description.toLowerCase().includes(q) ||
        item.invoiceNo.toLowerCase().includes(q) ||
        item.submitterName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    // Status filter option
    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter);
    }

    // Category drop filter option
    if (categoryFilter !== 'All') {
      result = result.filter(item => item.category === categoryFilter);
    }

    // Sort configurations
    if (selectedSort === 'newest') {
      result.sort((a, b) => b.date.localeCompare(a.date));
    } else if (selectedSort === 'highest') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (selectedSort === 'lowest') {
      result.sort((a, b) => a.amount - b.amount);
    }

    return result;
  }, [expenses, activeTab, searchQuery, statusFilter, categoryFilter, selectedSort]);

  // Actions
  const handleApproveExpense = (id: string, name: string, amount: number) => {
    setExpenses(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
    const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      user: 'Sarah Khan',
      action: 'approved',
      target: formattedAmount,
      meta: name,
      type: 'approve'
    };
    setActivities([newLog, ...activities]);
    displayToast(`Successfully approved expense of ${formattedAmount} for ${name}`);
  };

  const handleRejectExpense = (id: string, name: string, amount: number) => {
    setExpenses(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
    const formattedAmount = amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      user: 'Sarah Khan',
      action: 'rejected',
      target: formattedAmount,
      meta: name,
      type: 'reject'
    };
    setActivities([newLog, ...activities]);
    displayToast(`Rejected expense request of ${formattedAmount} for ${name}`);
  };

  const handleDeleteExpense = (id: string, name: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
    displayToast(`Removed ${name} record from database ledger.`);
  };

  // Create new expense form handler
  const handleCreateExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newExpenseForm.amount);
    if (!newExpenseForm.description || isNaN(parsedAmount) || parsedAmount <= 0) {
      displayToast('Error: Please enter a valid description and a positive amount.');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const createdItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      date: todayDate,
      description: newExpenseForm.description,
      invoiceNo: newExpenseForm.invoiceNo || `EXP-${Math.floor(Math.random() * 8000) + 1000}`,
      category: newExpenseForm.category,
      submitterName: newExpenseForm.submitterName,
      submitterAvatar: 'SK',
      submitterColor: 'from-emerald-400 to-teal-500',
      amount: parsedAmount,
      status: 'Pending'
    };

    setExpenses([createdItem, ...expenses]);
    setShowAddModal(false);

    // Activity logging
    const formattedVal = parsedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      time: 'Just now',
      user: 'Sarah Khan',
      action: 'submitted',
      target: formattedVal,
      meta: newExpenseForm.description,
      type: 'submit'
    };
    setActivities([newActivity, ...activities]);

    displayToast(`Dispatched new expense request "${newExpenseForm.description}" for approval.`);
    // Reset
    setNewExpenseForm({
      description: '',
      invoiceNo: '',
      category: 'Software',
      amount: '',
      submitterName: 'Dr. Sarah Khan',
      submitterAvatar: 'SK',
      submitterColor: 'from-emerald-450 to-teal-500'
    });
  };

  // Drag & drop simulate file uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      (Array.from(e.dataTransfer.files) as File[]).forEach((file: File) => {
        simulateFileUpload(file.name, file.size);
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      (Array.from(e.target.files) as File[]).forEach((file: File) => {
        simulateFileUpload(file.name, file.size);
      });
    }
  };

  const simulateFileUpload = (filename: string, rawSize: number) => {
    const formattedSize = rawSize > 1048576 
      ? (rawSize / 1048576).toFixed(1) + ' MB' 
      : (rawSize / 1024).toFixed(0) + ' KB';

    const newFileRecord: UploadedFile = {
      name: filename,
      progress: 0,
      status: 'Uploading',
      size: formattedSize,
      category: 'Office'
    };

    setUploadedFiles(prev => [...prev, newFileRecord]);

    // Simulate progress ticker
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 20;
      if (currentPercent >= 100) {
        clearInterval(interval);
        setUploadedFiles(prev => prev.map(f => f.name === filename ? { ...f, progress: 100, status: 'Done' } : f));
        
        const newAct: ActivityLog = {
          id: `act-${Date.now()}`,
          time: 'Just now',
          user: 'Sarah Khan',
          action: 'uploaded receipt',
          target: filename,
          meta: `Successfully scanned and archived`,
          type: 'upload'
        };
        setActivities(prevAct => [newAct, ...prevAct]);
        displayToast(`Attached and classified receipt "${filename}" successfully.`);
      } else {
        setUploadedFiles(prev => prev.map(f => f.name === filename ? { ...f, progress: currentPercent } : f));
      }
    }, 300);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar currentView="expenses" setView={setView} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Animated Toast Component */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -45, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-xs font-semibold tracking-wide">{toastMessage}</p>
              <button onClick={() => setToastMessage(null)} className="ml-3 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global sticky bar matching theme with search & connect status */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shrink-0">
          <div className="px-6 py-3.5 flex items-center justify-between">
            {/* Breadcrumb Info */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
              <span>Finance Center</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
              <span className="text-slate-800 font-bold">Expense Overview</span>
            </div>

            {/* Right Header Panel Actions */}
            <div className="flex items-center gap-3">
              {/* Quick status dots */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100/60 rounded-lg">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] uppercase font-bold text-indigo-700 font-sans tracking-wider">Spendwise Sync Live</span>
              </div>

              {/* Add New Expense Button */}
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Expense</span>
              </button>
            </div>
          </div>
        </header>

        {/* Operational View Subheader */}
        <div className="px-8 py-5 bg-white border-b border-slate-200/65 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Spendwise — Expense Management</h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify vendor invoices, track monthly utility recurring bills, and execute team ledger reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer transition">
              <Calendar className="w-3.5 h-3.5 text-slate-450" />
              <span>Oct 1 – Oct 31, 2026</span>
            </div>
            
            <button 
              onClick={() => {
                setExpenses(INITIAL_EXPENSES);
                setActivities(INITIAL_ACTIVITIES);
                displayToast('Demo expense parameters reset to baseline values.');
              }}
              className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none transition"
              title="Reset Demo State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Scrolling Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="max-w-[1550px] mx-auto space-y-6">

            {/* KEY METRICS SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Total Spending Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative group hover:shadow-md transition duration-155">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-sans">
                    <TrendingDown className="w-3 h-3 rotate-180" />
                    <span>+12.4%</span>
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Expenses</span>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      ${categoryStats.totalApprovedAndPending.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">.50</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">vs $221,184 last month</p>
                </div>

                {/* Sparkling Mini Chart */}
                <div className="w-full h-8 mt-3 overflow-hidden text-indigo-500 opacity-70">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,22 L15,18 L30,21 L45,12 L60,15 L75,8 L90,11 L100,5 L100,30 L0,30 Z" fill="rgba(99,102,241,0.06)"/>
                    <path d="M0,22 L15,18 L30,21 L45,12 L60,15 L75,8 L90,11 L100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Card 2: Pending Approvals request tracker */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative group hover:shadow-md transition duration-155">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wide text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full font-sans animate-pulse">
                    Action Required
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Approvals</span>
                  <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      {expenses.filter(i => i.status === 'Pending').length}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">requests</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ${expenses.filter(i => i.status === 'Pending').reduce((acc, i) => acc+i.amount, 0).toLocaleString('en-US', {maximumFractionDigits:0})} awaiting desk review
                  </p>
                </div>

                {/* Progress bar matching design (68% limit indicator) */}
                <div className="mt-4 space-y-1">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>

              {/* Card 3: Remaining quarterly budget cap */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative group hover:shadow-md transition duration-155">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    Q4 2026
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget Remaining</span>
                  <div className="flex items-baseline mt-1 font-mono">
                    <span className="text-2xl font-black text-slate-900 leading-none">$151,608</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">of $400,000 global budget cap</p>
                </div>

                {/* Active progress bar (62%) */}
                <div className="mt-4 space-y-1">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>

              {/* Card 4: Average per employee metric */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative group hover:shadow-md transition duration-155">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 bg-purple-50 text-purple-600 flex items-center justify-center rounded-xl font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    -4.2% MoM
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employee Spend Index</span>
                  <div className="flex items-baseline mt-1 font-mono">
                    <span className="text-2xl font-black text-slate-900 leading-none">$1,847</span>
                    <span className="text-xs text-slate-500">/mo average</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Computed across 134 staff members</p>
                </div>

                {/* Sparkling Mini Purple Trend Chart */}
                <div className="w-full h-8 mt-3 overflow-hidden text-purple-400 opacity-70">
                  <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,20 L15,15 L30,18 L45,10 L60,14 L75,7 L90,9 L100,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="100" cy="4" r="2.5" fill="currentColor"/>
                  </svg>
                </div>
              </div>

            </div>

            {/* DUAL CHART DATA VISUALIZATION AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column (col-span-2): Line and Area Trends Chart (Using safe available Recharts dependencies) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/85 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Spending Trends Line Chart</h3>
                    <p className="text-xs text-slate-40s">Monthly expense index comparisons with previous periods</p>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                    <button className="px-3 py-1 text-[11px] font-semibold text-slate-550 hover:text-slate-900 transition rounded">7 Days</button>
                    <button className="px-3 py-1 text-[11px] font-semibold text-slate-550 hover:text-slate-900 transition rounded">30 Days</button>
                    <button className="px-3 py-1 text-[11px] font-bold bg-white text-indigo-700 shadow-sm transition rounded">12 Months</button>
                  </div>
                </div>

                {/* Line Chart wrapper */}
                <div className="h-64 sm:h-72 w-full font-mono text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradientThisYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradientLastYear" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={tick => `$${(tick / 1000)}k`} />
                      <ChartTooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']} labelStyle={{ fontWeight: 'bold', color: '#1e293b' }} />
                      <Area type="monotone" dataKey="ThisYear" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#gradientThisYear)" name="This Year" />
                      <Area type="monotone" strokeDasharray="3 3" dataKey="LastYear" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gradientLastYear)" name="Last Year" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: Doughnut Breakdown widget */}
              <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Distribution By Category</h3>
                      <p className="text-xs text-slate-450">Active monthly ledger share</p>
                    </div>
                  </div>

                  {/* Doughnut Chart */}
                  <div className="h-44 relative flex items-center justify-center font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryStats.Breakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryStats.Breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS_MAP[entry.name] || '#cbd5e1'} />
                          ))}
                        </Pie>
                        <ChartTooltip formatter={v => `$${Number(v).toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total Share indicator */}
                    <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wide">Total</span>
                      <span className="text-base font-black text-slate-800 leading-none mt-0.5">
                        ${(categoryStats.totalApprovedAndPending / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categorized Detailed Indicators Leger */}
                <div className="space-y-2 mt-4 text-xs font-sans">
                  {categoryStats.Breakdown.map(entry => (
                    <div key={entry.name} className="flex items-center justify-between text-[11.5px]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS_MAP[entry.name] || '#cbd5e1' }}></span>
                        <span className="text-slate-650 font-medium">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-slate-800">${entry.value.toLocaleString()}</span>
                        <span className="text-slate-400 text-[10px]">{entry.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* TABBED EXPENSE TABLE & ACTIONS SECTION */}
            <div className="bg-white rounded-3xl border border-slate-250/70 shadow-sm overflow-hidden">
              
              {/* Category Sub-tabs Selection List */}
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 overflow-x-auto scroll-thin select-none">
                <div className="flex items-center gap-6 py-1">
                  <button 
                    onClick={() => setActiveTab('all')}
                    className={`py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'all' ? 'border-indigo-650 text-indigo-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    All Expenses <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-640 text-[10px] font-medium">{expenses.length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('Software')}
                    className={`py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'Software' ? 'border-indigo-650 text-indigo-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    Software SaaS <span className="ml-1 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-medium">{expenses.filter(i=>i.category==='Software').length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('Rent')}
                    className={`py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'Rent' ? 'border-indigo-650 text-indigo-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    Rent & Lease <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium">{expenses.filter(i=>i.category==='Rent').length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('Salaries')}
                    className={`py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'Salaries' ? 'border-indigo-650 text-indigo-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    Payroll Salaries <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-medium">{expenses.filter(i=>i.category==='Salaries').length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('Utilities')}
                    className={`py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'Utilities' ? 'border-indigo-650 text-indigo-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    Utility Bills <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium">{expenses.filter(i=>i.category==='Utilities').length}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('Marketing')}
                    className={`py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${activeTab === 'Marketing' ? 'border-indigo-650 text-indigo-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    Marketing <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-medium">{expenses.filter(i=>i.category==='Marketing').length}</span>
                  </button>
                </div>
              </div>

              {/* Filtering Controls Bar */}
              <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/20">
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
                  
                  {/* Search Description Input */}
                  <div className="relative max-w-xs flex-1">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search description, sub..."
                      className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 font-medium"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Category dropdown selector */}
                  <select 
                    value={categoryFilter}
                    onChange={(e: any) => setCategoryFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-650 font-semibold focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Software">Software</option>
                    <option value="Rent">Rent</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Travel">Travel</option>
                    <option value="Office">Office</option>
                  </select>

                  {/* Status Drop Filter */}
                  <select 
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-650 font-semibold focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">Sort:</span>
                  <select 
                    value={selectedSort}
                    onChange={(e: any) => setSelectedSort(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="newest">Recent Date</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-450 uppercase tracking-wider font-mono">
                      <th className="p-4 w-12 text-center">Check</th>
                      <th className="p-4">Date Submitted</th>
                      <th className="p-4">Expense Description</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Submitter Profile</th>
                      <th className="p-4 text-right">Amount Value</th>
                      <th className="p-4 text-center">Workflow Status</th>
                      <th className="p-4 text-right">Reconcile Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-16 text-center text-slate-400">
                          <Inbox className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold">No registered expense records matching criteria.</p>
                          <p className="text-[11px] text-slate-450 mt-1">Try clearing filters or adding a new expense dispatch.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredList.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/55 transition duration-150">
                          {/* Checklist block */}
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/10 cursor-pointer w-4 h-4" 
                            />
                          </td>

                          {/* Date */}
                          <td className="p-4 font-mono font-medium text-slate-500 tracking-wider">
                            {item.date}
                          </td>

                          {/* Description & sub */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50/70 text-indigo-700 flex items-center justify-center shrink-0">
                                <FileText className="w-4.5 h-4.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-800 text-[13px]">{item.description}</div>
                                <div className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5">Ref ID: {item.invoiceNo}</div>
                              </div>
                            </div>
                          </td>

                          {/* Category badge */}
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${getCategoryThemeClass(item.category)}`}>
                              {item.category}
                            </span>
                          </td>

                          {/* Submitter */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.submitterColor} text-white font-bold text-[10px] flex items-center justify-center`}>
                                {item.submitterAvatar}
                              </div>
                              <span className="font-bold text-slate-700 text-xs">{item.submitterName}</span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="p-4 text-right font-mono font-black text-slate-800 text-[13.5px]">
                            ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>

                          {/* Workflow status */}
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                              item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-rose-50 text-rose-700 border border-rose-105'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'Approved' ? 'bg-emerald-500' :
                                item.status === 'Pending' ? 'bg-amber-500 animate-pulse' :
                                'bg-rose-500'
                              }`}></span>
                              {item.status}
                            </span>
                          </td>

                          {/* Reconcile actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleApproveExpense(item.id, item.description, item.amount)}
                                    className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 rounded"
                                    title="Approve immediately"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleRejectExpense(item.id, item.description, item.amount)}
                                    className="px-2 py-1 text-[11px] font-semibold bg-rose-5 text-rose-800 hover:bg-rose-100/70 rounded"
                                    title="Reject this payment"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => handleDeleteExpense(item.id, item.description)}
                                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded"
                                title="Remove expense entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table pagination stats footer */}
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-55/35">
                <span className="text-xs text-slate-450">
                  Showing <strong className="text-slate-700">{filteredList.length}</strong> of <strong className="text-slate-900">{expenses.length}</strong> registered ledger records
                </span>
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <button className="px-3 py-1 bg-white hover:bg-slate-105 border border-slate-200 text-slate-600 rounded-lg disabled:opacity-40" disabled>Previous</button>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg">1</button>
                  <button className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg">2</button>
                  <button className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg">Next</button>
                </div>
              </div>

            </div>

            {/* LOWER GRIDS: DYNAMIC LIST OPERATIONS, FILE UPLOAD & ACTIONS FEED */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Grid 1: Interactive Upload receipts list Dropzone */}
              <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Scanned Receipts Center</h3>
                      <p className="text-xs text-slate-450">Drag and Drop OCR verification intake</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">
                      {uploadedFiles.length}/10 slots
                    </span>
                  </div>

                  {/* Dropzone field click or drop */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition relative group ${
                      isDragOver ? 'border-indigo-550 bg-indigo-50/40' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-502/10'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden" 
                      multiple 
                    />
                    <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2.5 transition duration-150 group-hover:scale-110" />
                    <div className="text-xs font-bold text-slate-800">Drop files here to upload</div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      PDF, JPG or PNG. Automatic OCR spend classification instantly.
                    </p>
                  </div>

                  {/* File Uploading progress ledger tracking list */}
                  <div className="mt-4 space-y-2.5">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 relative group border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                          <Paperclip className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                          <div className="text-[11px] font-bold text-slate-800 truncate">{file.name}</div>
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium font-mono mt-0.5">
                            <span>{file.size} • automatic</span>
                            <span>{file.progress}%</span>
                          </div>
                          
                          {/* Live Progress loading bar */}
                          {file.status === 'Uploading' && (
                            <div className="h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${file.progress}%` }}></div>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] font-bold font-sans">
                          {file.status === 'Done' ? (
                            <span className="text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </span>
                          ) : (
                            <span className="text-indigo-600 animate-pulse">Running</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 italic">
                    AI OCR validates duplicate vendor claim records automatically.
                  </span>
                </div>
              </div>

              {/* Grid 2: Expanding detailed tracking elements utilities summary */}
              <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dynamic Spendwise Ledgers</h3>
                  <p className="text-xs text-slate-450">Track monthly utility lease structures</p>
                </div>

                {/* Subscription details card block */}
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                  <button 
                    onClick={() => setOpenSubscriptionDetails(!openSubscriptionDetails)}
                    className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 hover:bg-slate-100/60"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-450" />
                      <span>Monthly SaaS Subscriptions</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition transform ${openSubscriptionDetails ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openSubscriptionDetails && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white px-4 py-2 text-xs divide-y divide-slate-50"
                      >
                        <div className="py-2 flex justify-between items-center text-[11.5px]">
                          <div>
                            <div className="font-bold text-slate-800">GitHub Enterprise</div>
                            <div className="text-[9.5px] text-slate-400">Renews Nov 12, 2026</div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">$1,280</span>
                        </div>
                        <div className="py-2 flex justify-between items-center text-[11.5px]">
                          <div>
                            <div className="font-bold text-slate-800">Figma Organization</div>
                            <div className="text-[9.5px] text-slate-400">Renews Nov 03, 2026</div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">$540</span>
                        </div>
                        <div className="py-2 flex justify-between items-center text-[11.5px]">
                          <div>
                            <div className="font-bold text-slate-800">Datadog Core</div>
                            <div className="text-[9.5px] text-slate-400">Renews Nov 18, 2023</div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">$3,200</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Utilities expansion block */}
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                  <button 
                    onClick={() => setOpenUtilityDetails(!openUtilityDetails)}
                    className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 hover:bg-slate-100/60"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-slate-450" />
                      <span>Pharmacy Utility Bills</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition transform ${openUtilityDetails ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openUtilityDetails && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white px-4 py-2 text-xs divide-y divide-slate-50"
                      >
                        <div className="py-2 flex justify-between items-center text-[11.5px]">
                          <div>
                            <div className="font-bold text-slate-800">ConEd Office Grid</div>
                            <div className="text-[9.5px] text-slate-400">Due Nov 02, 2026</div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">$3,240</span>
                        </div>
                        <div className="py-2 flex justify-between items-center text-[11.5px]">
                          <div>
                            <div className="font-bold text-slate-800">Verizon Fibre Internet</div>
                            <div className="text-[9.5px] text-slate-400">Due Nov 10, 2026</div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">$1,180</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Salary division expansion list */}
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs animate-fade-in">
                  <button 
                    onClick={() => setOpenSalaryDetails(!openSalaryDetails)}
                    className="w-full bg-slate-50 px-4 py-3 flex items-center justify-between font-semibold text-xs text-slate-700 hover:bg-slate-100/60"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-450" />
                      <span>Payroll Structures</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition transform ${openSalaryDetails ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openSalaryDetails && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white px-4 py-2 text-xs divide-y divide-slate-50"
                      >
                        <div className="py-2 flex justify-between items-center text-[11.5px]">
                          <div>
                            <div className="font-bold text-slate-800">Engineering Staff Wages</div>
                            <div className="text-[9.5px] text-emerald-600 font-medium">+3 new hires</div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">$98,420</span>
                        </div>
                        <div className="py-2 flex justify-between items-center text-[11.5px]">
                          <div>
                            <div className="font-bold text-slate-800">Marketing Division</div>
                            <div className="text-[9.5px] text-slate-400 font-medium">Reconciled</div>
                          </div>
                          <span className="font-mono font-bold text-slate-800">$38,200</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Grid 3: Live interactive activity verification logger stream */}
              <div className="bg-white rounded-2xl border border-slate-200/85 p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Recent Activities feed</h3>
                    <p className="text-xs text-slate-450">Latest ledger actions verified in ERP system</p>
                  </div>

                  <div className="space-y-4">
                    {activities.map(act => (
                      <div key={act.id} className="flex items-start gap-3 text-xs leading-relaxed relative">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          act.type === 'approve' ? 'bg-emerald-50 text-emerald-600' :
                          act.type === 'submit' ? 'bg-indigo-50 text-indigo-600' :
                          act.type === 'reject' ? 'bg-rose-50 text-rose-600' :
                          act.type === 'upload' ? 'bg-purple-50 text-purple-650' :
                          'bg-amber-50 text-amber-600 shadow-animate'
                        }`}>
                          {act.type === 'approve' && <Check className="w-4.5 h-4.5" />}
                          {act.type === 'submit' && <Plus className="w-4.5 h-4.5" />}
                          {act.type === 'reject' && <X className="w-4.5 h-4.5" />}
                          {act.type === 'upload' && <Paperclip className="w-4 h-4" />}
                          {act.type === 'alert' && <AlertCircle className="w-4.5 h-4.5" />}
                        </div>

                        <div className="flex-1">
                          <div className="text-[12px] text-slate-850">
                            <span className="font-bold text-slate-800">{act.user}</span> {act.action} {' '}
                            <span className="font-mono font-semibold text-slate-900">{act.target}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">{act.meta} • {act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 text-center flex justify-between items-center text-[10.5px]">
                  <span className="font-bold text-indigo-700 hover:text-indigo-800 cursor-pointer">
                    Clear Logs feed
                  </span>
                  <span className="text-slate-400">Ledger fully synchronized</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Global sticky footer matching Spendwise design */}
        <footer className="bg-white border-t border-slate-200/80 px-6 py-4.5 shrink-0 text-center flex flex-col sm:flex-row items-center justify-between text-[11.5px] text-slate-450 font-medium">
          <span>© 2026 Spendwise Financial Suite Module • Real-time Pharmacy Ledger Sync Integration</span>
          <span className="flex items-center gap-1">
            <span className="animate-ping w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-500">Service Operational (99.98% SLA target uptime verified)</span>
          </span>
        </footer>

      </div>

      {/* NEW EXPENSE MODAL COMPONENT WINDOW */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-indigo-200" />
                  <h3 className="font-bold tracking-tight text-sm">Dispatched New Expense Request</h3>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 hover:bg-indigo-800 text-indigo-100 hover:text-white rounded-lg transition"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form panel body */}
              <form onSubmit={handleCreateExpenseSubmit} className="p-6 space-y-4">
                
                {/* Description info */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Expense Title / Description *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newExpenseForm.description}
                    onChange={(e) => setNewExpenseForm({ ...newExpenseForm, description: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 font-semibold"
                    placeholder="E.g., AWS Cloud Services, Medical Equipment, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Amount Input (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-slate-400 font-mono text-xs">$</span>
                      <input 
                        type="number" 
                        required
                        step="0.01"
                        min="0.01"
                        value={newExpenseForm.amount}
                        onChange={(e) => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })}
                        className="w-full text-xs pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 font-bold"
                        placeholder="1500.00"
                      />
                    </div>
                  </div>

                  {/* Invoice reference */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Invoice Referenc No.
                    </label>
                    <input 
                      type="text" 
                      value={newExpenseForm.invoiceNo}
                      onChange={(e) => setNewExpenseForm({ ...newExpenseForm, invoiceNo: e.target.value })}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-700 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500"
                      placeholder="AWS-2026-1028"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Spend Category
                    </label>
                    <select 
                      value={newExpenseForm.category}
                      onChange={(e) => setNewExpenseForm({ ...newExpenseForm, category: e.target.value as any })}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    >
                      <option value="Software">Software & SaaS</option>
                      <option value="Rent">Rent & Lease</option>
                      <option value="Salaries">Payroll Salaries</option>
                      <option value="Utilities">Pharmacy Utilities</option>
                      <option value="Marketing">Marketing campaigns</option>
                      <option value="Travel">Business Travel</option>
                      <option value="Office">Office General Expenses</option>
                    </select>
                  </div>

                  {/* Submitter Info */}
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Submitting Agent
                    </label>
                    <input 
                      type="text" 
                      disabled
                      value={newExpenseForm.submitterName}
                      className="w-full text-xs border border-slate-100 rounded-lg p-2 text-slate-400 bg-slate-50 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Submit button bar */}
                <div className="flex gap-2 pt-3 justify-end text-xs">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="border border-slate-200 hover:bg-slate-55 text-slate-600 px-4 py-2 rounded-lg font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-indigo-650 hover:bg-indigo-750 text-white px-5 py-2 rounded-lg font-extrabold flex items-center gap-1 shadow"
                  >
                    <Save className="w-4.5 h-4.5" />
                    <span>Submit & Request Approval</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
