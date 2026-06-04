import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie
} from 'recharts';
import { 
  Search, Plus, Bell, MessageSquare, Download, Filter, MoreHorizontal, Phone, Mail, 
  MapPin, Calendar, Clock, CheckCircle2, ChevronLeft, ChevronRight, Users, 
  ArrowUpRight, ArrowDownRight, CreditCard, Send, PlusCircle, Activity, Heart, Bookmark,
  TrendingUp, Award, UserPlus, X, Check, Settings, Receipt, FileText, ShoppingCart, 
  Truck, Trash2, Edit, Eye, Upload, Printer, FileDown, Inbox, Sparkles, Building, 
  AlertCircle, HelpCircle, RefreshCw, Layers
} from 'lucide-react';
import Sidebar from '../Sidebar';

// Data types matching our structure
interface PurchaseOrderItem {
  id: string; // PO-xxxx
  supplierName: string;
  supplierInitial: string;
  medicines: string;
  totalAmount: number;
  orderDate: string;
  expectedDelivery: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
}

interface SupplierItem {
  id: string;
  name: string;
  initial: string;
  rating: number;
  since: string;
  ordersCount: number;
  phone: string;
  email: string;
  avgDeliveryDays: number;
  creditLimit: number;
  status: 'Active' | 'Inactive';
}

interface UploadedInvoice {
  id: string;
  fileName: string;
  fileSize: string;
  progress: number;
  status: 'Uploading' | 'Completed' | 'Failed';
  detectedSupplier?: string;
  detectedTotal?: number;
  poDraftCreated?: boolean;
}

// Initial mock datasets
const defaultSuppliers: SupplierItem[] = [
  { id: 'SPL-001', name: 'MediCorp Global', initial: 'M', rating: 4.8, since: '2018', ordersCount: 342, phone: '+1 (555) 234-8901', email: 'orders@medicorp.com', avgDeliveryDays: 7.2, creditLimit: 50000, status: 'Active' },
  { id: 'SPL-002', name: 'PharmaLine Inc', initial: 'P', rating: 4.5, since: '2020', ordersCount: 184, phone: '+1 (555) 876-4321', email: 'sales@pharmaline.com', avgDeliveryDays: 5.5, creditLimit: 35000, status: 'Active' },
  { id: 'SPL-003', name: 'HealthSource Dist', initial: 'H', rating: 4.2, since: '2019', ordersCount: 220, phone: '+1 (555) 345-2198', email: 'distribution@healthsource.com', avgDeliveryDays: 8.0, creditLimit: 25000, status: 'Active' },
  { id: 'SPL-004', name: 'BioMed Supplies', initial: 'B', rating: 4.9, since: '2017', ordersCount: 412, phone: '+1 (555) 987-1122', email: 'support@biomedsupplies.com', avgDeliveryDays: 4.8, creditLimit: 75000, status: 'Active' },
  { id: 'SPL-005', name: 'Astra Distribution', initial: 'A', rating: 3.9, since: '2022', ordersCount: 45, phone: '+1 (555) 443-4491', email: 'contact@astradist.com', avgDeliveryDays: 10.5, creditLimit: 15000, status: 'Inactive' }
];

const defaultPurchaseOrders: PurchaseOrderItem[] = [
  { id: 'PO-2024-0891', supplierName: 'MediCorp Global', supplierInitial: 'M', medicines: 'Amoxicillin, Metformin, Lisinopril', totalAmount: 14230.00, orderDate: '2024-12-10', expectedDelivery: '2024-12-24', status: 'In Transit', paymentStatus: 'Partial' },
  { id: 'PO-2024-0890', supplierName: 'PharmaLine Inc', supplierInitial: 'P', medicines: 'Omeprazole, Atorvastatin, Amlodipine', totalAmount: 22150.00, orderDate: '2024-12-08', expectedDelivery: '2024-12-22', status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'PO-2024-0889', supplierName: 'HealthSource Dist', supplierInitial: 'H', medicines: 'Ibuprofen, Cetirizine, Vitamin D3', totalAmount: 8940.00, orderDate: '2024-12-12', expectedDelivery: '2024-12-26', status: 'Pending', paymentStatus: 'Unpaid' },
  { id: 'PO-2024-0888', supplierName: 'BioMed Supplies', supplierInitial: 'B', medicines: 'Insulin Glargine, Levothyroxine, Gabapentin', totalAmount: 31670.00, orderDate: '2024-12-05', expectedDelivery: '2024-12-19', status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'PO-2024-0887', supplierName: 'MediCorp Global', supplierInitial: 'M', medicines: 'Sertraline, Pantoprazole, Prednisolone', totalAmount: 18520.00, orderDate: '2024-11-28', expectedDelivery: '2024-12-12', status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'PO-2024-0886', supplierName: 'BioMed Supplies', supplierInitial: 'B', medicines: 'Atorvastatin, Metformin, Ibuprofen', totalAmount: 12500.00, orderDate: '2024-11-20', expectedDelivery: '2024-12-04', status: 'Delivered', paymentStatus: 'Paid' },
  { id: 'PO-2024-0885', supplierName: 'PharmaLine Inc', supplierInitial: 'P', medicines: 'Lisinopril, Gabapentin, Cetirizine', totalAmount: 9800.00, orderDate: '2024-11-15', expectedDelivery: '2024-11-29', status: 'Cancelled', paymentStatus: 'Unpaid' }
];

export default function PurchaseDashboard({ setView }: { setView: (view: any) => void }) {
  // Main states
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderItem[]>(defaultPurchaseOrders);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(defaultSuppliers);
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers' | 'invoices' | 'history'>('orders');
  
  // Filter and search variables
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');

  // Multi-selection
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Modals state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState<PurchaseOrderItem | null>(null);
  const [editOrderDetails, setEditOrderDetails] = useState<PurchaseOrderItem | null>(null);

  // New PO Form states
  const [newOrderForm, setNewOrderForm] = useState({
    supplierName: 'MediCorp Global',
    medicines: '',
    totalAmount: '',
    status: 'Pending' as 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled',
    paymentStatus: 'Unpaid' as 'Paid' | 'Partial' | 'Unpaid' | 'Overdue',
    orderDaysOffset: '14'
  });

  // Edit PO Form state
  const [editForm, setEditForm] = useState<PurchaseOrderItem | null>(null);

  // Add Supplier Form states
  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    phone: '',
    email: '',
    rating: 5.0,
    creditLimit: 25000,
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Invoice Upload States
  const [dragOver, setDragOver] = useState(false);
  const [uploadedInvoices, setUploadedInvoices] = useState<UploadedInvoice[]>([
    { id: 'INV-001', fileName: 'MediCorp_Dec_Invoice_1092.pdf', fileSize: '1.4 MB', progress: 100, status: 'Completed', detectedSupplier: 'MediCorp Global', detectedTotal: 14230.00, poDraftCreated: true },
    { id: 'INV-002', fileName: 'BioMed_InsulinOrder_45.pdf', fileSize: '870 KB', progress: 100, status: 'Completed', detectedSupplier: 'BioMed Supplies', detectedTotal: 31670.00, poDraftCreated: true }
  ]);

  // Alert triggers (toasts)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Live Metrics Calculations based on State!
  const purchaseMetrics = useMemo(() => {
    // Calculated from delivered and in-transit orders
    const relevantOrders = purchaseOrders.filter(o => o.status !== 'Cancelled');
    
    // Total monthly purchases
    const totalAmount = relevantOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Pending Orders count
    const pendingOrdersCount = purchaseOrders.filter(o => o.status === 'Pending' || o.status === 'In Transit').length;
    
    // Delivered Orders count
    const deliveredCount = purchaseOrders.filter(o => o.status === 'Delivered').length;
    
    // Compute Cost Savings (Hypothetically 15% of the total amount managed effectively)
    const costSavings = Math.round(totalAmount * 0.1487);

    // Payment tracking calculations
    const outstandingAmount = purchaseOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => {
        if (o.paymentStatus === 'Unpaid' || o.paymentStatus === 'Overdue') return sum + o.totalAmount;
        if (o.paymentStatus === 'Partial') return sum + (o.totalAmount * 0.5); // Simulating half remaining
        return sum;
      }, 0);

    const paidAmount = purchaseOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => {
        if (o.paymentStatus === 'Paid') return sum + o.totalAmount;
        if (o.paymentStatus === 'Partial') return sum + (o.totalAmount * 0.5);
        return sum;
      }, 0);

    const partialAmount = purchaseOrders
      .filter(o => o.status !== 'Cancelled' && o.paymentStatus === 'Partial')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const unpaidAmount = purchaseOrders
      .filter(o => o.status !== 'Cancelled' && (o.paymentStatus === 'Unpaid' || o.paymentStatus === 'Overdue'))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalBudget = 395000;
    const pctOfBudget = Math.min(Math.round((totalAmount / totalBudget) * 100), 100);

    return {
      totalAmount,
      pendingOrdersCount,
      deliveredCount,
      costSavings,
      outstandingAmount,
      paidAmount,
      partialAmount,
      unpaidAmount,
      pctOfBudget
    };
  }, [purchaseOrders]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(order => {
      // Search matches
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.medicines.toLowerCase().includes(searchQuery.toLowerCase());

      // Status matches
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

      // Supplier matches
      const matchesSupplier = supplierFilter === 'All' || order.supplierName === supplierFilter;

      // Date matches
      const matchesDate = (!startDate || order.orderDate >= startDate) && (!endDate || order.orderDate <= endDate);

      return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
    });
  }, [purchaseOrders, searchQuery, statusFilter, supplierFilter, startDate, endDate]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);

  // Pagination Simulator
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Select all handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(paginatedOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  // Add Purchase Order Form Action
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.medicines || !newOrderForm.totalAmount) {
      triggerToast('Please fill in some medicines and standard total amount!');
      return;
    }

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const offsetDays = parseInt(newOrderForm.orderDaysOffset) || 14;
    const expectedDate = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const supplierObj = suppliers.find(s => s.name === newOrderForm.supplierName);

    const newPO: PurchaseOrderItem = {
      id: `PO-2024-0${Math.floor(Math.random() * 900) + 100}`,
      supplierName: newOrderForm.supplierName,
      supplierInitial: supplierObj?.initial || newOrderForm.supplierName.charAt(0),
      medicines: newOrderForm.medicines,
      totalAmount: parseFloat(newOrderForm.totalAmount),
      orderDate: formattedToday,
      expectedDelivery: expectedDate,
      status: newOrderForm.status,
      paymentStatus: newOrderForm.paymentStatus
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    setShowOrderModal(false);
    triggerToast(`Successfully generated new purchase order: ${newPO.id}`);
    
    // Reset form
    setNewOrderForm({
      supplierName: 'MediCorp Global',
      medicines: '',
      totalAmount: '',
      status: 'Pending',
      paymentStatus: 'Unpaid',
      orderDaysOffset: '14'
    });
  };

  // Edit PO Form Action
  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setPurchaseOrders(purchaseOrders.map(o => o.id === editForm.id ? editForm : o));
    setEditOrderDetails(null);
    setEditForm(null);
    triggerToast(`Updated Purchase Order ${editForm.id} successfully!`);
  };

  // Add Supplier Form Action
  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierForm.name || !newSupplierForm.phone || !newSupplierForm.email) {
      triggerToast('Please provide supplier name, phone, and contact email!');
      return;
    }

    const newSup: SupplierItem = {
      id: `SPL-${Math.floor(Math.random() * 900) + 100}`,
      name: newSupplierForm.name,
      initial: newSupplierForm.name.charAt(0).toUpperCase(),
      rating: parseFloat(String(newSupplierForm.rating)) || 5.0,
      since: '2026',
      ordersCount: 0,
      phone: newSupplierForm.phone,
      email: newSupplierForm.email,
      avgDeliveryDays: 6.0,
      creditLimit: parseFloat(String(newSupplierForm.creditLimit)) || 25000,
      status: newSupplierForm.status
    };

    setSuppliers([...suppliers, newSup]);
    setShowSupplierModal(false);
    triggerToast(`Added new supplier partner: ${newSup.name}`);
    
    // Reset Form
    setNewSupplierForm({
      name: '',
      phone: '',
      email: '',
      rating: 5.0,
      creditLimit: 25000,
      status: 'Active'
    });
  };

  // Delete Action
  const handleDeleteOrder = (id: string) => {
    if (window.confirm(`Are you sure you want to delete purchase order ${id}?`)) {
      setPurchaseOrders(purchaseOrders.filter(o => o.id !== id));
      setSelectedOrders(selectedOrders.filter(oId => oId !== id));
      triggerToast(`Successfully deleted order ${id}`);
    }
  };

  // Simulated Drag Drop File handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelected(file.name, file.size);
    }
  };

  const triggerManualFileInput = () => {
    const names = [
      'Astra_AntibioticPurchases_Q2.pdf',
      'MediCorp_OrderList_Docu.pdf',
      'PharmaLine_BillingStatement.pdf',
      'BioMed_Invoice_984.pdf'
    ];
    const pickedName = names[Math.floor(Math.random() * names.length)];
    const simulatedSize = `${(Math.random() * 1.5 + 0.3).toFixed(1)} MB`;
    handleFileSelected(pickedName, 1024 * 1024);
  };

  const handleFileSelected = (fileName: string, sizeInBytes: number) => {
    const sizeStr = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    const newId = `INV-0${Math.floor(Math.random() * 900) + 100}`;
    
    const newUploadObj: UploadedInvoice = {
      id: newId,
      fileName,
      fileSize: sizeStr,
      progress: 0,
      status: 'Uploading'
    };

    setUploadedInvoices(prev => [newUploadObj, ...prev]);

    // Simulate upload timer
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setUploadedInvoices(prev => 
        prev.map(item => {
          if (item.id === newId) {
            const completed = currentProgress >= 100;
            // Generate parsed invoice metadata upon completion
            const randSup = ['PharmaLine Inc', 'MediCorp Global', 'BioMed Supplies', 'HealthSource Dist'][Math.floor(Math.random() * 4)];
            const randTotal = Math.floor(Math.random() * 18000) + 2000;
            return {
              ...item,
              progress: Math.min(currentProgress, 100),
              status: completed ? 'Completed' : 'Uploading',
              detectedSupplier: completed ? randSup : undefined,
              detectedTotal: completed ? randTotal : undefined,
              poDraftCreated: false
            } as UploadedInvoice;
          }
          return item;
        })
      );

      if (currentProgress >= 100) {
        clearInterval(interval);
        triggerToast(`Invoice loaded successfully! System analyzed meta details.`);
      }
    }, 400);
  };

  // Helper to convert detected invoice to PO Draft
  const handleCreateDraftPO = (invoice: UploadedInvoice) => {
    if (!invoice.detectedSupplier || !invoice.detectedTotal) return;
    
    const supplierObj = suppliers.find(s => s.name === invoice.detectedSupplier);
    const today = new Date().toISOString().split('T')[0];
    const expDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const draftedPO: PurchaseOrderItem = {
      id: `PO-2024-0${Math.floor(Math.random() * 900) + 100}`,
      supplierName: invoice.detectedSupplier,
      supplierInitial: supplierObj?.initial || invoice.detectedSupplier.charAt(0),
      medicines: `Auto-extracted medicines from ${invoice.fileName}`,
      totalAmount: invoice.detectedTotal,
      orderDate: today,
      expectedDelivery: expDate,
      status: 'Pending',
      paymentStatus: 'Unpaid'
    };

    setPurchaseOrders([draftedPO, ...purchaseOrders]);
    setUploadedInvoices(prev => 
      prev.map(item => item.id === invoice.id ? { ...item, poDraftCreated: true } : item)
    );
    triggerToast(`Drafted PO ${draftedPO.id} instantly created from uploaded billing statement!`);
  };

  // Timeline / History Item representation helper
  const purchaseHistoryTimeline = useMemo(() => {
    return purchaseOrders
      .filter(o => o.status === 'Delivered' || o.status === 'Cancelled')
      .sort((a,b) => b.orderDate.localeCompare(a.orderDate));
  }, [purchaseOrders]);

  // Export CSV simulation
  const exportToCSV = () => {
    triggerToast('Generating Purchase Order Spreadsheet... Excel report downloaded!');
  };

  // Print simulation
  const printPurchaseOrders = () => {
    triggerToast('Opening native browser printing overlay for Purchase Records...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Dynamic Navigation Sidebar */}
      <Sidebar currentView="purchases" setView={setView} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Dynamic Toast Toast Message */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-800"
            >
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="ml-2 hover:text-red-400 p-0.5 rounded-md">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 py-3.5 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={() => setView('dashboard')}>Dashboard</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-medium">Purchases</span>
            </div>
            <h1 id="mainPurchaseHeader" className="text-lg font-bold text-slate-800 -mt-0.5">Purchase Management</h1>
            <p className="text-xs text-slate-500">Manage supplier requisitions, billing statements, and payments</p>
          </div>

          {/* Search bar helper inside header */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, medicines, suppliers..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-500">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </button>
            <button 
              onClick={() => setShowOrderModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 shadow-sm shadow-emerald-600/10 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Requisition</span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard View Frame */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-h-screen">
          <div className="max-w-[1400px] mx-auto space-y-6">
            
            {/* KPI Cards section (matching provided design variables) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              
              {/* Card 1: Total Purchases */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3 h-3" />
                    12.5%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">${purchaseMetrics.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-xs text-slate-500 mt-1">Total Purchases (This Month)</p>
                <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${purchaseMetrics.pctOfBudget}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{purchaseMetrics.pctOfBudget}% of monthly budget ($395k)</p>
              </div>

              {/* Card 2: Pending Orders */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{purchaseMetrics.pendingOrdersCount}</p>
                <p className="text-xs text-slate-500 mt-1">Awaiting Delivery / Transit</p>
                <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full" 
                    style={{ width: `${(purchaseMetrics.pendingOrdersCount / purchaseOrders.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Reflecting active open purchase requisitions</p>
              </div>

              {/* Card 3: Orders Delivered */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    98.7%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{purchaseMetrics.deliveredCount}</p>
                <p className="text-xs text-slate-500 mt-1">Closed Purchases (YTD)</p>
                <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: '89%' }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">98.7% overall supply fulfillment rate</p>
              </div>

              {/* Card 4: Cost Savings */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    +6.8%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">${purchaseMetrics.costSavings.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Cost Savings (Negotiated)</p>
                <div className="mt-3.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-1.5 rounded-full" 
                    style={{ width: '63%' }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">17.4% average cost discount active</p>
              </div>

            </div>

            {/* Payment Tracking Card (Matching spec percentages beautifully) */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800">Payment Tracking Status</h3>
                    <p className="text-xs text-slate-500">Analysis of settlement statuses of active ledger</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 self-start md:self-auto">
                  <span className="text-xs text-slate-500 mr-2">Total Outstanding:</span>
                  <span className="text-[14px] font-bold text-red-600">${purchaseMetrics.outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Three Stat Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-slate-50 hover:bg-slate-100/50 transition duration-200 rounded-xl p-4 border border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Settled (Paid)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>
                  </div>
                  <p className="text-xl font-bold text-slate-850 mt-2">${purchaseMetrics.paidAmount.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Approx. 76% of total purchases</p>
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/50 transition duration-200 rounded-xl p-4 border border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Partially Resolved</span>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">In Progress</span>
                  </div>
                  <p className="text-xl font-bold text-slate-850 mt-2">${purchaseMetrics.partialAmount.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Approx. 11% representing active terms</p>
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/50 transition duration-200 rounded-xl p-4 border border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Unsettled / Deferred</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Outstanding</span>
                  </div>
                  <p className="text-xl font-bold text-slate-850 mt-2">${purchaseMetrics.unpaidAmount.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Approx. 13% outstanding supplier dues</p>
                </div>

              </div>

              {/* Segmented Horizontal Progress bar */}
              <div className="mt-5">
                <div className="w-full bg-slate-100 rounded-full h-3 flex overflow-hidden">
                  <div className="bg-emerald-500 h-3" style={{ width: '76%' }} title="Paid: 76%"></div>
                  <div className="bg-indigo-500 h-3" style={{ width: '11%' }} title="Partial: 11%"></div>
                  <div className="bg-amber-400 h-3" style={{ width: '13%' }} title="Unpaid/Due: 13%"></div>
                </div>

                <div className="flex items-center gap-6 mt-3.5 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> 
                    <span>Paid Dues (76%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> 
                    <span>Partial Installment (11%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> 
                    <span>Overdue & Pending (13%)</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Interactive Tabs Menu Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
              <div className="border-b border-slate-100 px-6 pt-4 bg-slate-50/50">
                <div className="flex items-center gap-2 overflow-x-auto">
                  
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider relative transition-all duration-150 whitespace-nowrap outline-none ${activeTab === 'orders' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Purchase Orders</span>
                    <span className="ml-1 bg-slate-200/60 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{filteredOrders.length}</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('suppliers'); setSearchQuery(''); }}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider relative transition-all duration-150 whitespace-nowrap outline-none ${activeTab === 'suppliers' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Supplier Directory</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider relative transition-all duration-150 whitespace-nowrap outline-none ${activeTab === 'invoices' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Invoice Intake</span>
                    <span className="ml-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">AI parsing</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider relative transition-all duration-150 whitespace-nowrap outline-none ${activeTab === 'history' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Purchase Ledger</span>
                  </button>

                </div>
              </div>

              {/* Sub-content: Purchase Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6 space-y-4">
                  
                  {/* Grid filters matching mockup custom selectors */}
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    
                    <div className="flex flex-wrap items-center gap-2.5">
                      
                      {/* Status Selector */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-2">Status:</span>
                        <select 
                          value={statusFilter}
                          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                          className="bg-transparent border-none text-[12.5px] font-medium text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Status</option>
                          <option value="Pending">Pending</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Supplier Selector */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mr-2">Provider:</span>
                        <select 
                          value={supplierFilter}
                          onChange={(e) => { setSupplierFilter(e.target.value); setCurrentPage(1); }}
                          className="bg-transparent border-none text-[12.5px] font-medium text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Suppliers</option>
                          {suppliers.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[12.5px] text-slate-600 gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="date" 
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-transparent border-none focus:outline-none text-[12px] font-medium max-w-[110px]"
                        />
                        <span className="text-slate-400 text-xs">to</span>
                        <input 
                          type="date" 
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-transparent border-none focus:outline-none text-[12px] font-medium max-w-[110px]"
                        />
                      </div>

                      {/* Quick Reset */}
                      {(statusFilter !== 'All' || supplierFilter !== 'All' || searchQuery) && (
                        <button 
                          onClick={() => {
                            setStatusFilter('All');
                            setSupplierFilter('All');
                            setSearchQuery('');
                            setStartDate('2024-01-01');
                            setEndDate('2024-12-31');
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold underline underline-offset-2 flex items-center gap-1"
                        >
                          Clear Filters
                        </button>
                      )}

                    </div>

                    {/* Left Actions: Export, Print */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 transition rounded-xl text-xs font-semibold text-slate-650"
                      >
                        <FileDown className="w-3.5 h-3.5 text-slate-500" />
                        <span>Excel Export</span>
                      </button>

                      <button 
                        onClick={printPurchaseOrders}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 transition rounded-xl text-xs font-semibold text-slate-650"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Print Records</span>
                      </button>
                    </div>

                  </div>

                  {/* Multi Selected Action bar */}
                  {selectedOrders.length > 0 && (
                    <motion.div 
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-250 p-3.5 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-800">{selectedOrders.length} requisition orders selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            if (window.confirm(`Bulk set 'Delivered' for ${selectedOrders.length} orders?`)) {
                              setPurchaseOrders(purchaseOrders.map(o => selectedOrders.includes(o.id) ? { ...o, status: 'Delivered', paymentStatus: 'Paid' } : o));
                              setSelectedOrders([]);
                              triggerToast('Bulk status updated successfully!');
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg"
                        >
                          Mark Delivered
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`Bulk delete ${selectedOrders.length} selected orders?`)) {
                              setPurchaseOrders(purchaseOrders.filter(o => !selectedOrders.includes(o.id)));
                              setSelectedOrders([]);
                              triggerToast('Bulk record purge completed successfully.');
                            }
                          }}
                          className="bg-red-150 hover:bg-red-200 text-red-700 font-bold text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-red-250"
                        >
                          Delete Selected
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Interactive PO Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="p-3.5">
                            <input 
                              type="checkbox" 
                              checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrders.includes(o.id))}
                              onChange={handleSelectAll}
                              className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500/20 w-3.5 h-3.5 cursor-pointer"
                            />
                          </th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">PO Number</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Supplier</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Ordered Medicines & Items</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase text-right">Invoice Total</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Order Date</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Expected On</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Fulfillment</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Payment Status</th>
                          <th className="p-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase text-center">Manage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedOrders.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="p-10 text-center text-slate-400">
                              <Inbox className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                              <p className="text-xs font-semibold">No purchase orders matches the selected filter keys.</p>
                            </td>
                          </tr>
                        ) : (
                          paginatedOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/70 transition duration-150">
                              <td className="p-3.5">
                                <input 
                                  type="checkbox"
                                  checked={selectedOrders.includes(order.id)}
                                  onChange={() => handleSelectOne(order.id)}
                                  className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500/20 w-3.5 h-3.5 cursor-pointer"
                                />
                              </td>
                              
                              {/* PO Code */}
                              <td className="p-3.5 text-[13px] font-bold text-emerald-600 hover:underline cursor-pointer" onClick={() => setViewOrderDetails(order)}>
                                {order.id}
                              </td>

                              {/* Supplier Label */}
                              <td className="p-3.5 text-[13px]">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 border border-slate-300/45 flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                                    {order.supplierInitial}
                                  </div>
                                  <span className="font-semibold text-slate-850">{order.supplierName}</span>
                                </div>
                              </td>

                              {/* Medicines list */}
                              <td className="p-3.5 text-[12.5px] text-slate-600 truncate max-w-[210px]" title={order.medicines}>
                                {order.medicines}
                              </td>

                              {/* Total Price */}
                              <td className="p-3.5 text-[13px] font-bold text-slate-900 text-right">
                                ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>

                              {/* Date Order */}
                              <td className="p-3.5 text-[12.5px] text-slate-500">
                                {order.orderDate}
                              </td>

                              {/* Target Date */}
                              <td className="p-3.5 text-[12.5px] text-slate-500">
                                {order.expectedDelivery}
                              </td>

                              {/* Fulfillment Badge state */}
                              <td className="p-3.5 text-xs">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10.5px] tracking-wide inline-block ${
                                  order.status === 'Delivered' ? 'bg-emerald-55 text-emerald-700' :
                                  order.status === 'In Transit' ? 'bg-blue-50 text-blue-750' :
                                  order.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                  'bg-rose-50 text-rose-700'
                                }`}>
                                  {order.status}
                                </span>
                              </td>

                              {/* Financial settlement state */}
                              <td className="p-3.5 text-xs">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10.5px] tracking-wide inline-block ${
                                  order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-750' :
                                  order.paymentStatus === 'Partial' ? 'bg-purple-50 text-purple-750' :
                                  order.paymentStatus === 'Unpaid' ? 'bg-yellow-50 text-yellow-750' :
                                  'bg-red-50 text-red-750'
                                }`}>
                                  {order.paymentStatus}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="p-3.5 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button 
                                    onClick={() => setViewOrderDetails(order)}
                                    title="Inspect Details" 
                                    className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setEditOrderDetails(order);
                                      setEditForm(order);
                                    }}
                                    title="Edit Requisition keys" 
                                    className="p-1 text-slate-500 hover:text-amber-655 hover:bg-amber-50 rounded transition"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteOrder(order.id)}
                                    title="Revoke PO" 
                                    className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded transition"
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

                  {/* Clean Pagination and Row Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-150">
                    <p className="text-xs text-slate-500">
                      Displaying <span className="font-bold text-slate-800">{Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredOrders.length, currentPage * itemsPerPage)}</span> of <span className="font-bold text-slate-800">{filteredOrders.length}</span> purchase orders managed
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 select-none transition"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 select-none transition"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Sub-content: Suppliers Directory Tab */}
              {activeTab === 'suppliers' && (
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-800">Affiliated Procurement Supply Partners</h4>
                      <p className="text-xs text-slate-500">Active and retired medical distributors</p>
                    </div>
                    
                    <button 
                      onClick={() => setShowSupplierModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4.5 py-2 rounded-xl flex items-center gap-2 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Supplier Partner</span>
                    </button>
                  </div>

                  {/* Supplier Bento Cards Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSuppliers.map(supplier => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={supplier.id} 
                        className="bg-white border border-slate-200/75 rounded-2xl p-5 hover:shadow-md transition duration-250 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
                              {supplier.initial}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-850 hover:underline cursor-pointer">{supplier.name}</h5>
                              <p className="text-[10.5px] text-slate-400">Registered since {supplier.since} • {supplier.ordersCount} requests</p>
                            </div>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                            supplier.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {supplier.status}
                          </span>
                        </div>

                        {/* Supplier Specs info */}
                        <div className="space-y-2 py-3 border-y border-slate-50 text-[12px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-550 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                            </span>
                            <span className="font-semibold text-slate-700">{supplier.phone}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-slate-550 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" /> Alternate Email
                            </span>
                            <span className="font-semibold text-slate-700 text-xs truncate max-w-[170px]">{supplier.email}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-550 flex items-center gap-1.5 text-amber-500 font-semibold">
                              ★ Partner Rating
                            </span>
                            <span className="font-bold text-slate-800">{supplier.rating} / 5.0</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-550 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" /> Avg Lead Lag
                            </span>
                            <span className="font-bold text-slate-800">{supplier.avgDeliveryDays} Days</span>
                          </div>
                        </div>

                        {/* Footer card info */}
                        <div className="mt-4 flex items-center justify-between text-xs pt-1.5">
                          <div>
                            <p className="text-slate-400 text-[9.5px] uppercase tracking-wide">Financial Limit</p>
                            <p className="font-black text-slate-750 text-sm">${supplier.creditLimit.toLocaleString()}</p>
                          </div>

                          <button 
                            onClick={() => {
                              // Simulate setting active PO filter for this supplier
                              setSupplierFilter(supplier.name);
                              setActiveTab('orders');
                              triggerToast(`Filtered purchase requisitions by ${supplier.name}`);
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-bold text-xs hover:underline flex items-center gap-1"
                          >
                            <span>Browse POs</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </motion.div>
                    ))}
                  </div>

                </div>
              )}

              {/* Sub-content: Invoice Intake (AI Upload zone) */}
              {activeTab === 'invoices' && (
                <div className="p-6 space-y-6">
                  
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-400 animate-bounce" />
                        <h4 className="text-sm font-bold tracking-wide uppercase">AI-Informed Document ingestion</h4>
                      </div>
                      <p className="text-xs text-slate-300">Drag pharmaceutical invoices statements here. System auto-extracts medicine names, quantities, billing values, and drafts POs directly.</p>
                    </div>
                    <button 
                      onClick={triggerManualFileInput}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-xs font-black px-4 py-2 rounded-xl shadow transition whitespace-nowrap self-start md:self-auto"
                    >
                      Process Demo Invoice
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Visual File upload zone with drag events */}
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed ${
                        dragOver ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-400'
                      } transition-all duration-200`}
                      onClick={triggerManualFileInput}
                    >
                      <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h5 className="font-bold text-slate-800 text-[14px]">Ingest PDF purchase invoice / receipt</h5>
                      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">Supports standard scan-formats, billing logs, and Excel files. Limit 50MB per upload.</p>
                      
                      <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4.5 py-2 rounded-xl transition">
                        Select File from Storage
                      </div>
                    </div>

                    {/* Extracted file list queue */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider">Queue / Parsing Ledger</h5>
                      
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {uploadedInvoices.map(invoice => (
                          <div key={invoice.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 relative">
                            
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-650 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  PDF
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[12.5px] font-bold text-slate-800 truncate" title={invoice.fileName}>{invoice.fileName}</p>
                                  <p className="text-[10px] text-slate-400">{invoice.fileSize} • {invoice.status}</p>
                                </div>
                              </div>

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                invoice.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                              }`}>
                                {invoice.status}
                              </span>
                            </div>

                            {/* Simulated Upload progress bar */}
                            {invoice.status === 'Uploading' && (
                              <div className="w-full bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                                <div className="bg-emerald-500 h-1 rounded-full transition-all duration-300" style={{ width: `${invoice.progress}%` }}></div>
                              </div>
                            )}

                            {/* Detected AI outcomes metadata */}
                            {invoice.status === 'Completed' && invoice.detectedSupplier && (
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150/50 mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="text-[11px] text-slate-600">
                                  <span className="font-bold text-slate-700 mr-2">Parsed Outcome:</span> 
                                  <span>Supplier: <strong className="text-slate-850 font-bold">{invoice.detectedSupplier}</strong></span>
                                  <span className="mx-2">•</span>
                                  <span>Extracted Total: <strong className="text-slate-850 font-bold">${invoice.detectedTotal?.toLocaleString()}</strong></span>
                                </div>

                                {invoice.poDraftCreated ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                    <Check className="w-3.5 h-3.5" /> Ordered
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => handleCreateDraftPO(invoice)}
                                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-350 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md transition select-none"
                                  >
                                    Create Requisition PO
                                  </button>
                                )}
                              </div>
                            )}

                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* Sub-content: Purchase Ledger / History Log */}
              {activeTab === 'history' && (
                <div className="p-6 space-y-6">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-800">Closed Purchase Archives</h4>
                      <p className="text-xs text-slate-500">Timeline of completely resolved or cancelled supplier procurements</p>
                    </div>

                    <div className="bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-100">
                      <span className="text-xs text-slate-600 font-semibold mr-1">Total Fulfilled ledger:</span>
                      <strong className="text-emerald-800 font-bold text-sm">${purchaseHistoryTimeline.reduce((sum,o) => o.status === 'Delivered' ? sum + o.totalAmount : sum, 0).toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Interactive timeline map layout */}
                  <div className="relative border-l-2 border-slate-100 pl-6 space-y-6 ml-3">
                    {purchaseHistoryTimeline.length === 0 ? (
                      <p className="text-slate-450 text-xs py-4 select-none italic text-center">No resolved historical transactions available inside system.</p>
                    ) : (
                      purchaseHistoryTimeline.map((item, index) => (
                        <div key={item.id} className="relative group">
                          
                          {/* Circle dot timeline tag */}
                          <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white transition group-hover:scale-110 ${
                            item.status === 'Delivered' ? 'border-emerald-500' : 'border-rose-400'
                          }`}></div>

                          <div className="bg-white border border-slate-200 p-4.5 rounded-2xl max-w-2xl hover:shadow hover:border-slate-300/80 transition duration-150">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-[13px] font-bold text-slate-805 mr-2">{item.id}</span>
                                <span className="text-xs font-medium text-slate-400">{item.orderDate}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                item.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                            </div>

                            <p className="text-[13px] font-semibold text-slate-750">
                              Requisition to <span className="font-extrabold text-slate-900">{item.supplierName}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              <strong>Items included:</strong> {item.medicines}
                            </p>

                            <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-xs text-slate-400">Ledger balance settled</span>
                              <strong className="font-bold text-[14px] text-slate-850">${item.totalAmount.toLocaleString()}</strong>
                            </div>

                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* MODAL 1: Create New Requisition Form */}
      <AnimatePresence>
        {showOrderModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderModal(false)}
              className="fixed inset-y-0 inset-x-0 bg-slate-950/45 backdrop-blur-sm"
            ></motion.div>

            {/* Content box popup */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 z-10"
              >
                
                <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold tracking-wide uppercase">New Purchase Order Requisition</h4>
                      <p className="text-[11px] text-slate-350">Create registered request to pharmaceutical suppliers</p>
                    </div>
                  </div>
                  <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateOrder} className="p-6 space-y-4 text-xs font-semibold text-slate-650">
                  
                  {/* Supplier Drops selector */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Target Supplier</label>
                    <select 
                      value={newOrderForm.supplierName}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, supplierName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none"
                    >
                      {suppliers.map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.status})</option>
                      ))}
                    </select>
                  </div>

                  {/* Medicines specification textarea */}
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Required Medicines & Material quantity</label>
                    <textarea 
                      required
                      placeholder="e.g. Amoxicillin 500mg (20 x 100 packs), Insulin Humalin vials (50 units)"
                      value={newOrderForm.medicines}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, medicines: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none h-20 resize-none placeholder:text-slate-400 text-xs"
                    ></textarea>
                  </div>

                  {/* Total Value */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide font-mono">Invoice Dues ($ USD)</label>
                      <input 
                        type="number"
                        step="0.01"
                        required
                        placeholder="14500.00"
                        value={newOrderForm.totalAmount}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, totalAmount: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Expected Shipping Window</label>
                      <select
                        value={newOrderForm.orderDaysOffset}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, orderDaysOffset: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-705 outline-none"
                      >
                        <option value="5">Rapid Delivery (5 Days)</option>
                        <option value="14">Standard Delivery (14 Days)</option>
                        <option value="30">Regular Sea Freight (30 Days)</option>
                      </select>
                    </div>
                  </div>

                  {/* Order & Payment status options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Fulfillment Status</label>
                      <select 
                        value={newOrderForm.status}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-705 outline-none"
                      >
                        <option value="Pending">Awaiting Confirmation (Pending)</option>
                        <option value="In Transit">Dispatched (In Transit)</option>
                        <option value="Delivered">Delivered & Stocked</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Immediate Payment terms</label>
                      <select 
                        value={newOrderForm.paymentStatus}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentStatus: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-705 outline-none"
                      >
                        <option value="Unpaid">Unpaid (Post-pay net 30)</option>
                        <option value="Partial">Partial Down-payment (50%)</option>
                        <option value="Paid">Prepaid Completed (Paid)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2.5">
                    <button 
                      type="button"
                      onClick={() => setShowOrderModal(false)}
                      className="border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-slate-700 font-bold transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-600/10"
                    >
                      Issue Requisition
                    </button>
                  </div>

                </form>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Edit Requisition Form */}
      <AnimatePresence>
        {editOrderDetails && editForm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditOrderDetails(null)}
              className="fixed inset-y-0 inset-x-0 bg-slate-950/45 backdrop-blur-sm"
            ></motion.div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 z-10"
              >
                
                <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold tracking-wide uppercase">Modify Requisition: {editForm.id}</h4>
                      <p className="text-[11px] text-slate-350">Change supplier values or status outcomes</p>
                    </div>
                  </div>
                  <button onClick={() => setEditOrderDetails(null)} className="text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateOrder} className="p-6 space-y-4 text-xs font-semibold text-slate-650">
                  
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Target Supplier</label>
                    <input 
                      type="text" 
                      disabled
                      value={editForm.supplierName} 
                      className="w-full bg-slate-100 border border-slate-200 px-3 py-2.5 rounded-xl text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Required Medicines & Material quantity</label>
                    <textarea 
                      required
                      value={editForm.medicines}
                      onChange={(e) => setEditForm({ ...editForm, medicines: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none h-20 resize-none text-xs"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide font-mono">Invoice Dues ($ USD)</label>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={editForm.totalAmount}
                      onChange={(e) => setEditForm({...editForm, totalAmount: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Fulfillment Status</label>
                      <select 
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 px-3 py-2.5 rounded-xl text-slate-705 outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide font-mono">Payment Status</label>
                      <select 
                        value={editForm.paymentStatus}
                        onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 px-3 py-2.5 rounded-xl text-slate-705 outline-none"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Unpaid">Unpaid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2.5">
                    <button 
                      type="button"
                      onClick={() => setEditOrderDetails(null)}
                      className="border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-slate-750 font-bold transition"
                    >
                      Close
                    </button>
                    <button 
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl transition shadow"
                    >
                      Save Changes
                    </button>
                  </div>

                </form>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Inspect Requisition details */}
      <AnimatePresence>
        {viewOrderDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewOrderDetails(null)}
              className="fixed inset-y-0 inset-x-0 bg-slate-950/45 backdrop-blur-sm"
            ></motion.div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 z-10"
              >
                
                <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Requisition details sheet</h4>
                    <h3 className="text-sm font-black text-white">{viewOrderDetails.id}</h3>
                  </div>
                  <button onClick={() => setViewOrderDetails(null)} className="text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4.5 text-xs font-semibold text-slate-650">
                  
                  {/* Summary Status Badges */}
                  <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black uppercase tracking-wider mb-1">Stock status</p>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold ${
                        viewOrderDetails.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800' :
                        viewOrderDetails.status === 'In Transit' ? 'bg-blue-55 text-blue-800' : 'bg-amber-50 text-amber-850'
                      }`}>{viewOrderDetails.status}</span>
                    </div>

                    <div className="ml-6">
                      <p className="text-[10px] text-slate-400 uppercase font-black uppercase tracking-wider mb-1">Financial settlement</p>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold ${
                        viewOrderDetails.paymentStatus === 'Paid' ? 'bg-emerald-55 text-emerald-805' :
                        viewOrderDetails.paymentStatus === 'Partial' ? 'bg-purple-50 text-purple-800' : 'bg-red-50 text-red-800'
                      }`}>{viewOrderDetails.paymentStatus}</span>
                    </div>
                  </div>

                  {/* Procurement Partner details */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-black uppercase tracking-wide">Supply Partner</p>
                    <p className="text-[13px] font-black text-slate-850">{viewOrderDetails.supplierName}</p>
                    <p className="text-slate-450 text-[11px]">Primary point contact assigned: orders@{viewOrderDetails.supplierName.toLowerCase().replace(/\s/g, '')}.com</p>
                  </div>

                  {/* Medicines specification list */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-150/45">
                    <p className="text-[10px] text-slate-400 uppercase font-black uppercase tracking-wide">Requisite manifest</p>
                    <p className="text-[12.5px] font-medium text-slate-700 leading-relaxed whitespace-pre-line">{viewOrderDetails.medicines}</p>
                  </div>

                  {/* Order & Shipment Timeline block */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black uppercase tracking-wide">Ordered On</p>
                      <span className="text-slate-705 font-bold text-xs flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 font-mono" />
                        {viewOrderDetails.orderDate}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black uppercase tracking-wide">Delivery Expected</p>
                      <span className="text-slate-705 font-bold text-xs flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {viewOrderDetails.expectedDelivery}
                      </span>
                    </div>
                  </div>

                  {/* Final amount */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 uppercase font-black text-[10px] tracking-wide">Requisition Bill Amount:</span>
                    <strong className="text-lg font-black text-slate-900">${viewOrderDetails.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</strong>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 text-xs">
                    <button 
                      onClick={() => {
                        setViewOrderDetails(null);
                        setEditOrderDetails(viewOrderDetails);
                        setEditForm(viewOrderDetails);
                      }}
                      className="border border-slate-200 hover:bg-slate-50 px-4.5 py-2.5 rounded-xl font-bold text-slate-700 transition"
                    >
                      Edit Requisition
                    </button>
                    <button 
                      onClick={() => setViewOrderDetails(null)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black px-5 py-2.5 rounded-xl transition"
                    >
                      Done
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Create Supplier Form */}
      <AnimatePresence>
        {showSupplierModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupplierModal(false)}
              className="fixed inset-y-0 inset-x-0 bg-slate-950/45 backdrop-blur-sm"
            ></motion.div>

            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 z-10"
              >
                
                <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold tracking-wide uppercase">Register Supply Partner</h4>
                      <p className="text-[11px] text-slate-350">Add professional pharmaceutical distributor to database</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSupplierModal(false)} className="text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateSupplier} className="p-6 space-y-4 text-xs font-semibold text-slate-650">
                  
                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Supplier / Dist Company Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Novartis Distribution Group"
                      value={newSupplierForm.name}
                      onChange={(e) => setNewSupplierForm({ ...newSupplierForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Hotline / Contact Phone No</label>
                    <input 
                      type="text"
                      required
                      placeholder="+1 (555) 480-1284"
                      value={newSupplierForm.phone}
                      onChange={(e) => setNewSupplierForm({ ...newSupplierForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Primary Contact Email</label>
                    <input 
                      type="email"
                      required
                      placeholder="orders@novartisdist.com"
                      value={newSupplierForm.email}
                      onChange={(e) => setNewSupplierForm({ ...newSupplierForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide font-mono">Credit Limit ($ USD)</label>
                      <input 
                        type="number"
                        placeholder="50000"
                        value={newSupplierForm.creditLimit}
                        onChange={(e) => setNewSupplierForm({ ...newSupplierForm, creditLimit: parseInt(e.target.value) || 25000 })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Initial rating</label>
                      <input 
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        placeholder="5.0"
                        value={newSupplierForm.rating}
                        onChange={(e) => setNewSupplierForm({ ...newSupplierForm, rating: parseFloat(e.target.value) || 5.0 })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-700 outline-none text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-500 uppercase font-black text-[10px] tracking-wide">Initial Status</label>
                    <select 
                      value={newSupplierForm.status}
                      onChange={(e) => setNewSupplierForm({ ...newSupplierForm, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 px-3 py-2.5 rounded-xl text-slate-705 outline-none"
                    >
                      <option value="Active">Active registered partner</option>
                      <option value="Inactive">Suspended / Inactive</option>
                    </select>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2.5">
                    <button 
                      type="button"
                      onClick={() => setShowSupplierModal(false)}
                      className="border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-slate-755 font-bold transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition shadow"
                    >
                      Register Supplier
                    </button>
                  </div>

                </form>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
