import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, DollarSign, LineChart, 
  Download, RefreshCw, Search, Bell, HelpCircle, 
  ChevronDown, ChevronUp, Calendar, ChevronRight, 
  Sparkles, CheckCircle, AlertCircle, Inbox, Eye, 
  X, Filter, ArrowUpRight, ArrowDownRight, Package, 
  ShoppingCart, Users, ShieldCheck, Mail, Phone, MapPin, Check, 
  CalendarRange, Tag, AlertTriangle, Layers, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import Sidebar from '../Sidebar';

// Definitions
interface SalesOrderItem {
  id: string;
  orderNumber: string;
  productName: string;
  category: string;
  sku: string;
  revenue: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
  date: string;
  emoji: string;
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  value: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface ExpiryAlertItem {
  id: string;
  name: string;
  batch: string;
  qty: number;
  expiresIn: string;
  type: 'critical' | 'warning';
}

const INITIAL_ORDERS: SalesOrderItem[] = [
  { id: '1', orderNumber: '#ORD-4821', productName: 'Wireless Pro Headphones', sku: 'WPH-001', category: 'Electronics', revenue: 2845, status: 'Completed', date: '2024-12-15', emoji: '🎧' },
  { id: '2', orderNumber: '#ORD-4820', productName: 'Organic Coffee Beans', sku: 'OCB-042', category: 'Food & Bev', revenue: 1247, status: 'Completed', date: '2024-12-14', emoji: '☕' },
  { id: '3', orderNumber: '#ORD-4819', productName: 'Premium Denim Jacket', sku: 'PDJ-105', category: 'Clothing', revenue: 3180, status: 'Processing', date: '2024-12-14', emoji: '👕' },
  { id: '4', orderNumber: '#ORD-4818', productName: 'Vitamin C Supplements', sku: 'VCS-074', category: 'Health', revenue: 890, status: 'Cancelled', date: '2024-12-13', emoji: '💊' },
  { id: '5', orderNumber: '#ORD-4817', productName: 'Ergonomic Desk Chair', sku: 'EDC-209', category: 'Furniture', revenue: 4790, status: 'Completed', date: '2024-12-12', emoji: '🪑' },
  { id: '6', orderNumber: '#ORD-4816', productName: 'Smart Running Watch', sku: 'SRW-884', category: 'Electronics', revenue: 1980, status: 'Completed', date: '2024-12-11', emoji: '⌚' },
  { id: '7', orderNumber: '#ORD-4815', productName: 'Eco Water Bottle', sku: 'EWB-501', category: 'Food & Bev', revenue: 640, status: 'Completed', date: '2024-12-10', emoji: '🥤' }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i-1', name: 'Wireless Pro Headphones', sku: 'WPH-001', stock: 342, value: 48540, status: 'In Stock' },
  { id: 'i-2', name: 'Organic Coffee Beans', sku: 'OCB-042', stock: 12, value: 4200, status: 'Low Stock' },
  { id: 'i-3', name: 'Denim Jacket', sku: 'PDJ-105', stock: 0, value: 0, status: 'Out of Stock' },
  { id: 'i-4', name: 'Vitamin C Supplements', sku: 'VCS-074', stock: 450, value: 9900, status: 'In Stock' },
  { id: 'i-5', name: 'Ergonomic Desk Chair', sku: 'EDC-209', stock: 8, value: 2400, status: 'Low Stock' }
];

const INITIAL_EXPIRY: ExpiryAlertItem[] = [
  { id: 'e-1', name: 'Fresh Milk 1L', batch: 'FM-2024-0847', qty: 24, expiresIn: '1 day', type: 'critical' },
  { id: 'e-2', name: 'Yoghurt Pack 6ct', batch: 'YP-2024-1203', qty: 48, expiresIn: '3 days', type: 'warning' },
  { id: 'e-3', name: 'Bread Wholemeal', batch: 'BW-2024-0512', qty: 36, expiresIn: '5 days', type: 'warning' }
];

// Interactive graph data matching user mockup metrics
const REVENUE_DATA = [
  { month: 'Jan', value: 18500, prevYear: 15200 },
  { month: 'Feb', value: 22300, prevYear: 18100 },
  { month: 'Mar', value: 19800, prevYear: 17400 },
  { month: 'Apr', value: 25600, prevYear: 21300 },
  { month: 'May', value: 28400, prevYear: 23100 },
  { month: 'Jun', value: 31200, prevYear: 26800 },
  { month: 'Jul', value: 29500, prevYear: 24900 },
  { month: 'Aug', value: 33800, prevYear: 28400 },
  { month: 'Sep', value: 35600, prevYear: 30200 },
  { month: 'Oct', value: 38200, prevYear: 32500 },
  { month: 'Nov', value: 41500, prevYear: 35800 },
  { month: 'Dec', value: 44200, prevYear: 38100 }
];

const ORDERS_DATA = [
  { month: 'Jan', value: 142, prevYear: 110 },
  { month: 'Feb', value: 178, prevYear: 135 },
  { month: 'Mar', value: 156, prevYear: 124 },
  { month: 'Apr', value: 195, prevYear: 150 },
  { month: 'May', value: 220, prevYear: 172 },
  { month: 'Jun', value: 248, prevYear: 190 },
  { month: 'Jul', value: 231, prevYear: 180 },
  { month: 'Aug', value: 264, prevYear: 204 },
  { month: 'Sep', value: 278, prevYear: 215 },
  { month: 'Oct', value: 295, prevYear: 230 },
  { month: 'Nov', value: 318, prevYear: 250 },
  { month: 'Dec', value: 342, prevYear: 275 }
];

const PROFIT_DATA = [
  { month: 'Jan', value: 6200, prevYear: 4900 },
  { month: 'Feb', value: 7800, prevYear: 5800 },
  { month: 'Mar', value: 6500, prevYear: 5100 },
  { month: 'Apr', value: 8900, prevYear: 6700 },
  { month: 'May', value: 9800, prevYear: 7500 },
  { month: 'Jun', value: 10500, prevYear: 8100 },
  { month: 'Jul', value: 9900, prevYear: 7600 },
  { month: 'Aug', value: 11200, prevYear: 8800 },
  { month: 'Sep', value: 11800, prevYear: 9200 },
  { month: 'Oct', value: 12600, prevYear: 9900 },
  { month: 'Nov', value: 13400, prevYear: 10800 },
  { month: 'Dec', value: 14200, prevYear: 11400 }
];

const CATEGORY_DATA = [
  { name: 'Electronics', value: 38, color: '#6366f1' },
  { name: 'Food & Bev', value: 27, color: '#10b981' },
  { name: 'Clothing', value: 20, color: '#f59e0b' },
  { name: 'Other', value: 15, color: '#ef4444' }
];

export default function ReportsAnalyticsDashboard({ setView }: { setView: (view: any) => void }) {
  // Main states
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'inventory' | 'suppliers'>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('Last 30 days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  
  // Simulated loading & interactive views
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState<'revenue' | 'orders' | 'profit'>('revenue');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [highMarginOnly, setHighMarginOnly] = useState(false);

  // Table expansion/collapse toggles
  const [salesExpanded, setSalesExpanded] = useState(true);
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [expiryExpanded, setExpiryExpanded] = useState(true);

  // Sorting
  const [sortField, setSortField] = useState<keyof SalesOrderItem>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modal drill-downs
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sidebar mobile responsive toggles
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle refresh action
  const triggerRefresh = () => {
    setIsRefreshing(true);
    showToast('Refreshing core sales database and syncing inventory parameters...');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Data refresh completed successfully.');
    }, 1200);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  // Date selectors range trigger
  const handleSelectRange = (range: string) => {
    setSelectedDateRange(range);
    setShowDateDropdown(false);
    showToast(`Reporting scope altered to ${range}.`);
  };

  // Export alerts
  const handleExport = (format: string) => {
    setShowExportDropdown(false);
    showToast(`Compiled export packet dispatched for ${format}. Download started.`);
  };

  // Sorting handlers
  const handleSort = (field: keyof SalesOrderItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter lists dynamically based on active categories/tabs & searches
  const filteredSalesData = useMemo(() => {
    let list = [...INITIAL_ORDERS];

    // Filter by segmented control tab
    if (activeTab === 'sales') {
      // Just keep standard list but we inspect details
    }

    // Filter by query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item.productName.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
      );
    }

    // Filter by logic: High margin only (represented here by items with revenue > $1200)
    if (highMarginOnly) {
      list = list.filter(item => item.revenue > 1200);
    }

    // Sort order
    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return list;
  }, [searchQuery, highMarginOnly, sortField, sortDirection, activeTab]);

  // Modal data handler
  const openDrilldown = (type: string) => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Sidebar Component */}
      <Sidebar currentView="analytics" setView={setView} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Responsive top indicator */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              <p className="text-xs font-semibold tracking-wide">{toastMsg}</p>
              <button onClick={() => setToastMsg(null)} className="ml-3 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Global Top Header */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shrink-0">
          <div className="px-6 py-3.5 flex items-center justify-between">
            {/* Breadcrumb Information */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>PRO ERP Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
              <span>Management Center</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
              <span className="text-slate-800 font-bold">Reports & Analytics</span>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center gap-3">
              {/* Quick Sync status pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100/60 rounded-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Synergy Live</span>
              </div>

              {/* Reset view triggers */}
              <button 
                onClick={triggerRefresh}
                className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition shadow-sm"
                title="Synchronize data ledger"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {/* View Main Sub-header with descriptive actions */}
        <div className="px-8 py-5 bg-white border-b border-slate-200/65 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
              <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2 rounded-full flex items-center gap-1 py-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                Live Feed
              </span>
            </div>
            <p className="text-xs text-indigo-600/90 font-medium mt-1">
              Comprehensive medical business insights, multi-channel profit streams, and real-time inventory compliance audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Dropdown in React */}
            <div className="relative">
              <button 
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Export Packet</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {showExportDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/80 rounded-xl shadow-2xl overflow-hidden z-50 py-1"
                  >
                    <button 
                      onClick={() => handleExport('PDF')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="w-1 bg-red-500 h-4 rounded-full" />
                      <span>Download PDF</span>
                    </button>
                    <button 
                      onClick={() => handleExport('CSV')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="w-1 bg-emerald-500 h-4 rounded-full" />
                      <span>Export CSV Ledger</span>
                    </button>
                    <button 
                      onClick={() => handleExport('Excel')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="w-1 bg-blue-500 h-4 rounded-full" />
                      <span>Export Excel Sheet</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* STICKY FILTER BAR */}
        <div className="bg-white border-b border-slate-200/70 px-8 py-3 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            
            {/* Date Range Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-350 transition"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedDateRange}</span>
                <ChevronDown className="w-3 h-3 text-indigo-500" />
              </button>

              <AnimatePresence>
                {showDateDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDateDropdown(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-72 bg-white card-shadow border border-slate-200 rounded-2xl p-4 z-50 shadow-2xl"
                    >
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year'].map(range => (
                          <button 
                            key={range}
                            onClick={() => handleSelectRange(range)}
                            className={`px-2.5 py-1.5 text-[11px] rounded-lg font-bold text-left transition ${
                              selectedDateRange === range 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-100 pt-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Custom Bounds</label>
                        <div className="flex gap-1.5">
                          <input type="date" className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          <input type="date" className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Segmented Filter Control tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => { setActiveTab('all'); showToast('Displaying general business diagnostics summary.') }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                All Reports
              </button>
              <button 
                onClick={() => { setActiveTab('sales'); showToast('Focused view on sales ledger indexes.') }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'sales' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Sales
              </button>
              <button 
                onClick={() => { setActiveTab('inventory'); showToast('Focused view on product stock compliance.') }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Inventory
              </button>
              <button 
                onClick={() => { setActiveTab('suppliers'); showToast('Focused view on partner supplier analytics.') }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'suppliers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Suppliers
              </button>
            </div>

            <div className="lg:flex-1"></div>

            {/* Smart Interactive Toggles */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setShowCategoryFilter(!showCategoryFilter); showToast(showCategoryFilter ? 'Category tracking turned off' : 'Triggering category level tracking'); }}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition ${showCategoryFilter ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Sector Category</span>
              </button>
              
              <button 
                onClick={() => { setHighMarginOnly(!highMarginOnly); showToast(highMarginOnly ? 'Now showing all item revenues.' : 'Applying filter: high margin items valuation only (> $1,200).'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition ${highMarginOnly ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100/70'}`}
              >
                {highMarginOnly ? 'High Margin Applied ✓' : 'Filter High Margin'}
              </button>

              {(highMarginOnly || searchQuery !== '') && (
                <button 
                  onClick={() => { setSearchQuery(''); setHighMarginOnly(false); showToast('Filters cleaned.') }}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold transition ml-1"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MAIN DYNAMIC SCROLL CONTAINER */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6">
          <div className="max-w-[1550px] mx-auto space-y-6">

            {/* SECTION SHIMMER / LOADING STATE INDICATOR */}
            {isRefreshing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="bg-white rounded-2xl h-32 animate-pulse border border-slate-200/50" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl h-80 animate-pulse border border-slate-200/50" />
                  <div className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200/50" />
                </div>
              </div>
            ) : (
              <>
                {/* DYNAMIC VIEW FOR CORE MODULES */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  
                  {/* KPI SUMMARY CARDS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1: Total Sales Revenue */}
                    <div 
                      onClick={() => openDrilldown('sales')}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition hover:shadow-md cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 transition group-hover:scale-105">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>12.5%</span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">$284,521</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">Total Revenue</p>
                      </div>

                      {/* Spark line bar indicators */}
                      <div className="mt-4 space-y-1">
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-650 rounded-full" style={{ width: '72%' }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">72% of monthly target parameters</p>
                      </div>
                    </div>

                    {/* Card 2: Net Profit Margin representation */}
                    <div 
                      onClick={() => openDrilldown('profit')}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition hover:shadow-md cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 transition group-hover:scale-105">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>8.3%</span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">$94,847</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">Net Profit Margin</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-4">33.3% net profit margin captured</p>
                    </div>

                    {/* Card 3: Total Orders index validation */}
                    <div 
                      onClick={() => openDrilldown('orders')}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition hover:shadow-md cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 transition group-hover:scale-105">
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-0.5 text-[10px] font-black text-red-650 bg-red-50 px-2 py-0.5 rounded-full">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>3.2%</span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">1,847</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">Total Orders</p>
                      </div>

                      {/* Spark progress target */}
                      <div className="mt-4 space-y-1">
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '58%' }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Avg. $154 valued payout receipts</p>
                      </div>
                    </div>

                    {/* Card 4: In stock catalog indicator */}
                    <div 
                      onClick={() => openDrilldown('inventory')}
                      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition hover:shadow-md cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-colors" />
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 transition group-hover:scale-105">
                          <Package className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-0.5 text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          <span>2.1% MoM</span>
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">4,238</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">In Stock Items</p>
                      </div>
                      <p className="text-[10px] text-red-650 font-bold mt-4 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>23 active product low stock alert lines</span>
                      </p>
                    </div>

                  </div>

                  {/* CHARTS LAYER (TWO COLUMN RECHARTS VISUALIZATION) */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Column 1 & 2: Revenue Trend line chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                            <LineChart className="w-4 h-4 text-indigo-500" />
                            <span>Revenue Trend Visualizer</span>
                          </h3>
                          <p className="text-xs text-slate-450 font-medium font-sans">Compare performance indexes against past period benchmarks</p>
                        </div>
                        
                        {/* Interactive toggle tabs for Graph source */}
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                          <button 
                            onClick={() => { setChartType('revenue'); showToast('Loaded total monthly revenue series.'); }}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition ${chartType === 'revenue' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                          >
                            Revenue
                          </button>
                          <button 
                            onClick={() => { setChartType('orders'); showToast('Loaded total monthly completed order totals.'); }}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition ${chartType === 'orders' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                          >
                            Orders
                          </button>
                          <button 
                            onClick={() => { setChartType('profit'); showToast('Loaded calculated EBITDA net-margin streams.'); }}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition ${chartType === 'profit' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}
                          >
                            Profit
                          </button>
                        </div>
                      </div>

                      {/* Line Chart Canvas container */}
                      <div className="h-64 sm:h-72 w-full font-mono text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart 
                            data={
                              chartType === 'revenue' ? REVENUE_DATA :
                              chartType === 'orders' ? ORDERS_DATA : PROFIT_DATA
                            }
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="premiumTrendCol" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.16}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                            <YAxis 
                              stroke="#94a3b8" 
                              fontSize={9} 
                              tickLine={false} 
                              axisLine={false} 
                              tickFormatter={(tick) => chartType === 'orders' ? tick : `$${(tick / 1000)}k`} 
                            />
                            <Tooltip 
                              formatter={(v: any) => [chartType === 'orders' ? `${v} paid` : `$${Number(v).toLocaleString()}`, 'Source']} 
                              labelStyle={{ fontWeight: 'bold', color: '#1e293b' }} 
                            />
                            <Legend align="right" verticalAlign="top" height={36} iconType="circle" />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#6366f1" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#premiumTrendCol)" 
                              name="Target Year Range (2024)" 
                            />
                            <Area 
                              type="monotone" 
                              strokeDasharray="4 4" 
                              dataKey="prevYear" 
                              stroke="#cbd5e1" 
                              strokeWidth={2} 
                              fillOpacity={0} 
                              name="Historical Target Period (2023)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Column 3: Category Doughnut Breakdown share */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-black text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-emerald-500" />
                              <span>Share by Category</span>
                            </h3>
                            <p className="text-xs text-slate-450 font-medium">Division distribution share</p>
                          </div>
                        </div>

                        {/* Doughnut structure layout */}
                        <div className="h-44 relative flex items-center justify-center font-mono">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={CATEGORY_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={52}
                                outerRadius={66}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {CATEGORY_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(v) => `${v}% of share`} />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* Centered Total Percent readout */}
                          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Gross</span>
                            <span className="text-lg font-black text-slate-800 leading-none mt-1">100%</span>
                          </div>
                        </div>
                      </div>

                      {/* Segment elements lists and colored badges representation */}
                      <div className="space-y-2 mt-4 text-xs font-sans">
                        {CATEGORY_DATA.map(item => (
                          <div key={item.name} className="flex items-center justify-between text-[11.5px] py-1.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-1 rounded transition">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-slate-600 font-bold">{item.name}</span>
                            </div>
                            <span className="font-mono font-black text-slate-850">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* SECOND ROW STATS GRAPHICS (TOP PRODUCTS & SUPPLIERS PERFORMANCE) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left Column: Top Products Best Sellers */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                            <Award className="w-4.5 h-4.5 text-indigo-505" />
                            <span>Top Performing Products</span>
                          </h3>
                          <p className="text-xs text-slate-455">Highest performing product lines in period catalog</p>
                        </div>
                        <button 
                          onClick={() => { setActiveTab('sales'); showToast('Showing detailed table to analyze products'); }}
                          className="text-xs text-indigo-600 hover:text-indigo-850 font-bold tracking-tight transition"
                        >
                          Analyze Inventory →
                        </button>
                      </div>

                      <div className="space-y-4">
                        
                        {/* Product item 1 */}
                        <div 
                          onClick={() => openDrilldown('Wireless Pro Headphones')}
                          className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-650 transition">
                            1
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">Wireless Pro Headphones</div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Category: Electronics • Ref #WPH-001</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-black text-slate-900 text-xs">$42,380</div>
                            <div className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5 mt-0.5">
                              <TrendingUp className="w-3 h-3" />
                              <span>+18.2%</span>
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Product item 2 */}
                        <div 
                          onClick={() => openDrilldown('Organic Coffee Beans')}
                          className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-650 transition">
                            2
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">Organic Coffee Beans 1kg</div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Category: Food & Beverage • Ref #OCB-042</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-black text-slate-900 text-xs">$38,150</div>
                            <div className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5 mt-0.5">
                              <TrendingUp className="w-3 h-3" />
                              <span>+12.4%</span>
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Product item 3 */}
                        <div 
                          onClick={() => openDrilldown('Premium Denim Jacket')}
                          className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-650 transition">
                            3
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">Premium Denim Jacket</div>
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Category: Clothing • Ref #PDJ-105</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-black text-slate-900 text-xs">$31,220</div>
                            <div className="text-[10px] font-bold text-red-600 flex items-center justify-end gap-0.5 mt-0.5">
                              <TrendingDown className="w-3 h-3" />
                              <span>-3.1%</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Right Column: Supplier Performance indicator scale */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                            <Users className="w-4.5 h-4.5 text-indigo-505" />
                            <span>Supplier Performance Ratings</span>
                          </h3>
                          <p className="text-xs text-slate-455">Highest performing partner suppliers ranked by efficiency ratio</p>
                        </div>
                        <button 
                          onClick={() => { setView('suppliers'); showToast('Redirecting to Suppliers panel.'); }}
                          className="text-xs text-indigo-600 hover:text-indigo-850 font-bold tracking-tight transition"
                        >
                          All Suppliers →
                        </button>
                      </div>

                      <div className="space-y-4">
                        
                        {/* Supplier 1 */}
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center border border-emerald-100">
                            A+
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800 text-xs">GlobalTech Supply Co.</span>
                              <span className="font-mono text-xs font-black text-slate-900">98%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '98%' }} />
                            </div>
                          </div>
                        </div>

                        {/* Supplier 2 */}
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center border border-indigo-100">
                            A
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800 text-xs">FreshFarms Wholesale Partners</span>
                              <span className="font-mono text-xs font-black text-slate-900">94%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-450 rounded-full" style={{ width: '94%' }} />
                            </div>
                          </div>
                        </div>

                        {/* Supplier 3 */}
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 font-extrabold text-xs flex items-center justify-center border border-amber-100">
                            B+
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-800 text-xs">StyleWear Manufacturers Ltd</span>
                              <span className="font-mono text-xs font-black text-slate-900">87%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '87%' }} />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* SALES DETAILED REPORT Collapsible Component */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
                    
                    <div className="p-5 border-b border-slate-150/70 bg-slate-50/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSalesExpanded(!salesExpanded)}
                          className="p-1.5 rounded-lg bg-slate-55 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                        >
                          {salesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <div>
                          <h3 className="font-black text-slate-900 text-sm tracking-tight">Detailed Sales Order Log</h3>
                          <p className="text-slate-450 text-[11px] font-medium leading-none mt-1">
                            {filteredSalesData.length} records retrieved • Synced real-time
                          </p>
                        </div>
                      </div>

                      {/* Search inputs */}
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input 
                            type="text" 
                            placeholder="Search orders, SKU..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold w-48 text-slate-850"
                          />
                        </div>
                        {highMarginOnly && (
                          <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg">
                            High Margin Applied
                          </span>
                        )}
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {salesExpanded && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="overflow-x-auto min-w-full">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/40 border-b border-slate-100 text-[10.5px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-50/80 transition" onClick={() => handleSort('orderNumber')}>
                                    Order ID {sortField === 'orderNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                                  </th>
                                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-50/80 transition" onClick={() => handleSort('productName')}>
                                    Product {sortField === 'productName' && (sortDirection === 'asc' ? '↑' : '↓')}
                                  </th>
                                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-50/80 transition" onClick={() => handleSort('category')}>
                                    Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                                  </th>
                                  <th className="px-5 py-3.5 text-right cursor-pointer hover:bg-slate-50/80 transition" onClick={() => handleSort('revenue')}>
                                    Revenue Total {sortField === 'revenue' && (sortDirection === 'asc' ? '↑' : '↓')}
                                  </th>
                                  <th className="px-5 py-3.5 text-center cursor-pointer hover:bg-slate-50/80 transition" onClick={() => handleSort('status')}>
                                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                                  </th>
                                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-50/80 transition" onClick={() => handleSort('date')}>
                                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                                  </th>
                                  <th className="px-5 py-3.5 text-right font-medium">Drill Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-sans text-xs">
                                {filteredSalesData.length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-400">
                                      <Inbox className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                                      <p className="font-bold">No registered sales orders match selection.</p>
                                      <p className="text-[10px] text-slate-400 mt-1">Try resetting high margins check or clearing inputs.</p>
                                    </td>
                                  </tr>
                                ) : (
                                  filteredSalesData.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition">
                                      <td className="px-5 py-3 font-mono font-bold text-indigo-650">{order.orderNumber}</td>
                                      <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                          <span className="text-base select-none">{order.emoji}</span>
                                          <div>
                                            <div className="font-bold text-slate-800 text-xs">{order.productName}</div>
                                            <div className="text-[9.5px] text-slate-400 font-mono tracking-tight">SKU: {order.sku}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-5 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                          {order.category}
                                        </span>
                                      </td>
                                      <td className="px-5 py-3 text-right font-mono font-black text-slate-800">
                                        ${order.revenue.toLocaleString()}
                                      </td>
                                      <td className="px-5 py-3 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                          order.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' :
                                          order.status === 'Processing' ? 'bg-amber-50 text-amber-800' :
                                          'bg-red-5/80 text-red-800 border-red-100/30'
                                        }`}>
                                          <span className={`w-1 h-1 rounded-full ${
                                            order.status === 'Completed' ? 'bg-emerald-500' :
                                            order.status === 'Processing' ? 'bg-amber-500' :
                                            'bg-red-500'
                                          }`} />
                                          {order.status}
                                        </span>
                                      </td>
                                      <td className="px-5 py-3 text-slate-500 font-medium font-mono">{order.date}</td>
                                      <td className="px-5 py-3 text-right">
                                        <button 
                                          onClick={() => openDrilldown(order.productName)}
                                          className="p-1 px-2 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-750 font-bold rounded-md transition inline-flex items-center gap-1 border border-slate-200/50"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                          <span className="text-[10px]">Inspect</span>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* INVENTORY & EXPIRY ALERTS ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Column 1 & 2: Inventory report */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
                      
                      <div className="p-5 border-b border-slate-150/70 bg-slate-50/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setInventoryExpanded(!inventoryExpanded)}
                            className="p-1.5 rounded-lg bg-slate-55 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                          >
                            {inventoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-slate-500" />
                              <span>Inventory Valuation Summary</span>
                            </h3>
                            <p className="text-slate-450 text-[11px] font-medium leading-none mt-1">
                              Stock assets & restock points computed
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 font-bold text-[10.5px]">
                          <span className="text-rose-600">23 low items</span>
                          <span className="text-amber-600">8 out-of-stock</span>
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {inventoryExpanded && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/40 border-b border-slate-100 text-[10.5px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                                  <th className="px-5 py-3">Product Name</th>
                                  <th className="px-5 py-3">SKU Code</th>
                                  <th className="px-5 py-3 text-right">Available stock</th>
                                  <th className="px-5 py-3 text-right">Valuation Index</th>
                                  <th className="px-5 py-3 text-center">Compliance</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs">
                                {INITIAL_INVENTORY.map(item => (
                                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-5 py-3 font-bold text-slate-800">{item.name}</td>
                                    <td className="px-5 py-3 font-mono font-medium text-slate-500">{item.sku}</td>
                                    <td className="px-5 py-3 text-right font-mono font-bold">{item.stock}</td>
                                    <td className="px-5 py-3 text-right font-mono font-bold text-slate-750">${item.value.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-center">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                                        item.status === 'Low Stock' ? 'bg-red-50 text-red-700' :
                                        'bg-amber-50 text-amber-700'
                                      }`}>
                                        {item.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Column 3: Expiry Alerts panel */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
                      
                      <div className="p-5 border-b border-slate-150/70 bg-slate-50/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setExpiryExpanded(!expiryExpanded)}
                            className="p-1.5 rounded-lg bg-slate-55 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                          >
                            {expiryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                              <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                              <span>Expiry Alerts log</span>
                            </h3>
                            <p className="text-slate-450 text-[11px] font-medium leading-none mt-1">
                              Immediate compliance response required
                            </p>
                          </div>
                        </div>

                        <span className="bg-red-100 text-red-650 font-black px-2 py-0.5 text-[10px] rounded-full">
                          3 Items
                        </span>
                      </div>

                      <AnimatePresence initial={false}>
                        {expiryExpanded && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden p-5 space-y-3"
                          >
                            {INITIAL_EXPIRY.map(alertItem => (
                              <div 
                                key={alertItem.id}
                                className={`p-3.5 rounded-xl border transition hover:shadow-sm ${
                                  alertItem.type === 'critical' 
                                    ? 'bg-red-50/60 border-red-100 text-red-800' 
                                    : 'bg-amber-50/60 border-amber-100 text-amber-800'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="font-extrabold text-xs block text-slate-900">{alertItem.name}</span>
                                    <span className="text-[10px] font-mono font-medium text-slate-500 block mt-0.5">
                                      Batch: {alertItem.batch} • Qty: {alertItem.qty}
                                    </span>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    alertItem.type === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {alertItem.expiresIn}
                                  </span>
                                </div>
                                <button 
                                  onClick={() => {
                                    showToast(`Take Action triggered for ${alertItem.name}. Stock quarantine forms generated.`);
                                  }}
                                  className={`mt-2.5 w-full text-[11px] font-bold py-1.5 rounded-lg transition ${
                                    alertItem.type === 'critical'
                                      ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                      : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                                  }`}
                                >
                                  Take Action →
                                </button>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                </motion.div>
              </>
            )}

            {/* LOWER ADVISORY EXTRA METADA CARD REPLICA SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-805">Data Freshness Verified</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Automatic system reconciliation executed 2 minutes ago.</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] text-emerald-600 font-bold">Auto-refreshing live socket</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CalendarRange className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-805">Selected Assessment Area</span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">Decem 16 – Jan 15, current evaluation window.</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">30 days assessment metrics segment.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-805">Integrated Pipelines</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium font-sans">POS Registers, E-comm terminals, and regional warehouse dispatch lines.</p>
                <p className="text-[10px] text-indigo-600 font-semibold mt-1">3 active socket sources integrated</p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* MODAL DRILL-DOWN CONTAINER ENVELOPE */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="fixed inset-0" onClick={() => setModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-slate-200 z-10"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Inspect Diagnostic Detail</h3>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {modalType === 'sales' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-indigo-50/70 border border-indigo-100/40 rounded-xl p-4">
                        <p className="text-[10px] text-indigo-600 font-black uppercase">Total Period Revenue</p>
                        <p className="text-xl font-bold font-mono text-indigo-750 mt-1">$284,521</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">+12.5% vs past baseline parameters</p>
                      </div>
                      <div className="bg-emerald-50/70 border border-emerald-100/40 rounded-xl p-4">
                        <p className="text-[10px] text-emerald-600 font-black uppercase">Gross Earnings</p>
                        <p className="text-xl font-bold font-mono text-emerald-750 mt-1">$94,847</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">33.3% exact profit share margin</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/50">
                      <p className="text-xs font-bold text-slate-800 mb-2">Automated Operations Diagnostics</p>
                      <ul className="space-y-2 text-xs text-slate-650">
                        <li className="flex items-start gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Revenue index is up 12.5% across primary POS pharmaceutical registers over 30 days.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Electronics/Medical Diagnostic inventory segment captures the principal share ratio at 38%.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>Primary average order value tracks steady at a validated index of $154.00.</span>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : modalType === 'profit' ? (
                  <>
                    <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-100 text-emerald-900 mb-4">
                      <p className="text-xl font-black font-mono">$94,847</p>
                      <p className="text-[11px] font-bold text-emerald-700">Net Profit index captured directly and reconciled in ledger.</p>
                    </div>
                    <div className="space-y-2.5 text-xs text-slate-700">
                      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded">
                        <span>Gross Aggregate Earnings</span>
                        <span className="font-mono font-bold">$284,521</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded">
                        <span>Cost of Goods Purchased (COGS)</span>
                        <span className="font-mono font-bold text-red-600">-$142,300</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded">
                        <span>Operating Expenditures (OPEX)</span>
                        <span className="font-mono font-bold text-red-600">-$47,374</span>
                      </div>
                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-900">Reconciled Net Value</span>
                        <span className="font-mono font-black text-emerald-650">$94,847</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-500">
                      Analytical metrics summary and active customer feedback loop for element:
                      <span className="font-bold text-slate-800 ml-1">"{modalType}"</span>
                    </p>
                    <div className="bg-indigo-50/35 border border-indigo-100 p-4 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between font-mono"><span className="text-slate-500">Audit Status:</span><span className="font-bold text-emerald-600">COMPLIANT</span></div>
                      <div className="flex justify-between font-mono"><span className="text-slate-500">Channel Distribution:</span><span className="font-bold">POS Main Store</span></div>
                      <div className="flex justify-between font-mono"><span className="text-slate-500">Tax Liability Rate:</span><span className="font-bold">4.2% Fixed</span></div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2 shrink-0">
                <button 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  Dismiss Window
                </button>
                <button 
                  onClick={() => { setModalOpen(false); showToast('Compiling analytical worksheet packet details.'); }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition shadow-sm"
                >
                  Export Diagnostic Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
