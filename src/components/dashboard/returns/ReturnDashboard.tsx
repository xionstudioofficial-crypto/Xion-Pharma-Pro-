import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, RotateCcw, ShieldCheck, CreditCard, ChevronRight, Bell, Calendar, 
  Check, X, Inbox, Sparkles, Building, AlertCircle, RefreshCw, Printer, 
  FileDown, Save, FileText, ArrowLeftRight, User, Trash2, Edit2, Plus, 
  Phone, Mail, ArrowUpRight, TrendingDown, ClipboardList, CheckCircle2, 
  Package, HelpCircle, Layers, FileSignature, Coins
} from 'lucide-react';
import Sidebar from '../Sidebar';

// Data shapes matching the mock specifications
interface ReturnItem {
  id: string;
  name: string;
  type: 'Rx' | 'OTC';
  categoryColor: string;
  batchCode: string;
  barcode: string;
  qtySold: number;
  qtyReturn: number;
  unitPrice: number;
  reason: string;
  selected: boolean;
}

interface InvoicePreset {
  invoiceId: string;
  dateIssued: string;
  paymentMethod: string;
  cashierName: string;
  customerName: string;
  customerId: string;
  customerPhone: string;
  customerTotalPurchases: string;
  customerPrevReturns: number;
  prescriptionNumber: string;
  items: ReturnItem[];
}

interface PurchaseReturnItem {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  medicineName: string;
  batchCode: string;
  qtyOrdered: number;
  qtyReturned: number;
  unitCost: number;
  reason: string;
  status: 'Pending Approved' | 'Shipped' | 'Refund Credited' | 'Rejected';
  returnDate: string;
}

// Preset Invoice Search Database for high interactivity!
const INVOICE_PRESETS: { [key: string]: InvoicePreset } = {
  'INV-2024-00142': {
    invoiceId: 'INV-2024-00142',
    dateIssued: 'Oct 15, 2024',
    paymentMethod: 'Cash',
    cashierName: 'Maria R.',
    customerName: 'Juan Santos',
    customerId: 'CUST-00892',
    customerPhone: '09171234567',
    customerTotalPurchases: '₱24,580',
    customerPrevReturns: 2,
    prescriptionNumber: 'RX-09823',
    items: [
      { id: '1', name: 'Amoxicillin 500mg', type: 'Rx', categoryColor: 'bg-red-100 text-red-650', batchCode: 'BTH-2024-A45', barcode: '8901234500123', qtySold: 2, qtyReturn: 1, unitPrice: 285.00, reason: 'Adverse Reaction', selected: true },
      { id: '2', name: 'Paracetamol 500mg', type: 'Rx', categoryColor: 'bg-orange-100 text-orange-650', batchCode: 'BTH-2024-B12', barcode: '8901234501234', qtySold: 3, qtyReturn: 2, unitPrice: 45.00, reason: 'Wrong Item', selected: true },
      { id: '3', name: 'Cetirizine 10mg', type: 'OTC', categoryColor: 'bg-blue-100 text-blue-650', batchCode: 'BTH-2024-C78', barcode: '8901234502345', qtySold: 2, qtyReturn: 1, unitPrice: 120.00, reason: 'Damaged Packaging', selected: true },
      { id: '4', name: 'Losartan 50mg', type: 'Rx', categoryColor: 'bg-purple-100 text-purple-650', batchCode: 'BTH-2024-D33', barcode: '8901234503456', qtySold: 1, qtyReturn: 0, unitPrice: 385.00, reason: 'Wrong Item', selected: false },
      { id: '5', name: 'Multivitamins + Iron', type: 'OTC', categoryColor: 'bg-green-100 text-green-650', batchCode: 'BTH-2024-E21', barcode: '8901234504567', qtySold: 1, qtyReturn: 0, unitPrice: 550.00, reason: 'Wrong Item', selected: false }
    ]
  },
  'INV-2024-00189': {
    invoiceId: 'INV-2024-00189',
    dateIssued: 'Nov 02, 2024',
    paymentMethod: 'GCash / Digital',
    cashierName: 'Maria R.',
    customerName: 'Elena Rostova',
    customerId: 'CUST-01255',
    customerPhone: '09189923831',
    customerTotalPurchases: '₱12,740',
    customerPrevReturns: 0,
    prescriptionNumber: 'RX-10294',
    items: [
      { id: '1', name: 'Metformin 850mg', type: 'Rx', categoryColor: 'bg-red-100 text-red-650', batchCode: 'BTH-2024-M09', barcode: '8901234505678', qtySold: 30, qtyReturn: 10, unitPrice: 15.00, reason: 'Doctor Discontinued', selected: true },
      { id: '2', name: 'Atorvastatin 20mg', type: 'Rx', categoryColor: 'bg-purple-100 text-purple-650', batchCode: 'BTH-2024-A11', barcode: '8901234506789', qtySold: 10, qtyReturn: 5, unitPrice: 42.00, reason: 'Doctor Discontinued', selected: true },
      { id: '3', name: 'Ibuprofen 400mg', type: 'OTC', categoryColor: 'bg-green-100 text-green-650', batchCode: 'BTH-2024-I88', barcode: '8901234507890', qtySold: 5, qtyReturn: 0, unitPrice: 18.00, reason: 'Wrong Item', selected: false }
    ]
  },
  'INV-2024-00210': {
    invoiceId: 'INV-2024-00210',
    dateIssued: 'Dec 03, 2024',
    paymentMethod: 'Credit Card',
    cashierName: 'Alex Mercer',
    customerName: 'Robert Vance',
    customerId: 'CUST-00918',
    customerPhone: '09228831001',
    customerTotalPurchases: '₱35,110',
    customerPrevReturns: 1,
    prescriptionNumber: 'None (OTC)',
    items: [
      { id: '1', name: 'Loratadine 10mg', type: 'OTC', categoryColor: 'bg-blue-100 text-blue-650', batchCode: 'BTH-2024-L03', barcode: '8901234508901', qtySold: 15, qtyReturn: 5, unitPrice: 22.00, reason: 'Wrong Item', selected: true },
      { id: '2', name: 'Vitamin D3 5000IU', type: 'OTC', categoryColor: 'bg-green-100 text-green-650', batchCode: 'BTH-2024-V40', barcode: '8901234509012', qtySold: 2, qtyReturn: 1, unitPrice: 320.00, reason: 'Damaged Packaging', selected: true }
    ]
  }
};

// Initial Supplier Purchase Returns list
const DEFAULT_PURCHASE_RETURNS: PurchaseReturnItem[] = [
  { id: 'PR-2024-001', supplierId: 'SPL-001', supplierName: 'MediCorp Global', supplierEmail: 'orders@medicorp.com', medicineName: 'Amoxicillin 500mg', batchCode: 'BTH-2024-A45', qtyOrdered: 500, qtyReturned: 100, unitCost: 190.00, reason: 'Short Expiry (Less than 3 mo)', status: 'Refund Credited', returnDate: '2024-11-12' },
  { id: 'PR-2024-002', supplierId: 'SPL-004', supplierName: 'BioMed Supplies', supplierEmail: 'support@biomedsupplies.com', medicineName: 'Insulin Glargine', batchCode: 'BTH-25B-X90', qtyOrdered: 50, qtyReturned: 12, unitCost: 2400.00, reason: 'Cold-chain damage detected upon transit', status: 'Shipped', returnDate: '2024-12-01' },
  { id: 'PR-2024-003', supplierId: 'SPL-002', supplierName: 'PharmaLine Inc', supplierEmail: 'sales@pharmaline.com', medicineName: 'Atorvastatin 20mg', batchCode: 'BTH-2024-S01', qtyOrdered: 1000, qtyReturned: 250, unitCost: 28.00, reason: 'Overstock Return Terms', status: 'Pending Approved', returnDate: '2024-12-04' }
];

export default function ReturnDashboard({ setView }: { setView: (view: any) => void }) {
  // Navigation & View Mode
  const [dashboardMode, setDashboardMode] = useState<'sales' | 'purchase'>('sales');
  
  // Sales Return Core State
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('INV-2024-00142');
  const [activeInvoice, setActiveInvoice] = useState<InvoicePreset | null>(INVOICE_PRESETS['INV-2024-00142']);
  
  // Custom Return Item additions/modifications (Live in state memory)
  const [returnItems, setReturnItems] = useState<ReturnItem[]>(
    INVOICE_PRESETS['INV-2024-00142'].items
  );

  // Supplier Returns state
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturnItem[]>(DEFAULT_PURCHASE_RETURNS);

  // Selected Refund parameters
  const [refundMethod, setRefundMethod] = useState<'cash' | 'credit' | 'card'>('cash');
  const [seniorDiscount, setSeniorDiscount] = useState(true); // Default 20% senior discount checkbox
  const [restockingFeePercent, setRestockingFeePercent] = useState(5); // 5% restocking
  const [handlingCharge, setHandlingCharge] = useState(15.00); 
  const [returnNotes, setReturnNotes] = useState(
    "Customer reported adverse reaction to Amoxicillin. Doctor switched to different antibiotic. All items in original sealed packaging, within expiry date (April 2026). No tampering observed. Customer requested cash refund."
  );

  // Barcode search simulation
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Manual text search in supplier directory or orders directory
  const [supplierSearchText, setSupplierSearchText] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Form values for a new Supplier Purchase Return dispatch
  const [newPurchaseReturnForm, setNewPurchaseReturnForm] = useState({
    supplierName: 'MediCorp Global',
    medicineName: '',
    batchCode: '',
    qtyOrdered: '100',
    qtyReturned: '5',
    unitCost: '120.00',
    reason: 'Short Expiry (Less than 3 mo)'
  });
  
  const [showNewPRModal, setShowNewPRModal] = useState(false);

  // Triggering Toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Live Calculations for Refund Amount based on state and inputs
  const refundCalculations = useMemo(() => {
    const selectedItems = returnItems.filter(item => item.selected);
    
    // Subtotal of returned quantities
    const subtotal = selectedItems.reduce((acc, item) => {
      return acc + (item.unitPrice * item.qtyReturn);
    }, 0);

    // VAT (12%)
    const vat = subtotal * 0.12;

    // Senior discount (20% reduction on subtotal before VAT if active, or matching layout values specifically)
    const discountAmount = seniorDiscount ? (subtotal * 0.20) : 0;

    // Restocking fee
    const restockingFee = subtotal * (restockingFeePercent / 100);

    // Net Refund Amount calculation: (Subtotal + VAT) - discount - restocking - handling
    // Standard mock layout has: Subtotal 495.00, VAT 59.40, Senior Discount -99.00, Restocking -24.75, Handling -15.00 => Net Refund 415.65
    const netRefund = Math.max(0, (subtotal + vat) - discountAmount - restockingFee - handlingCharge);

    const totalUnitsReturned = selectedItems.reduce((acc, item) => acc + Number(item.qtyReturn), 0);

    return {
      subtotal,
      vat,
      discountAmount,
      restockingFee,
      netRefund,
      totalUnitsReturned,
      selectedCount: selectedItems.length
    };
  }, [returnItems, seniorDiscount, restockingFeePercent, handlingCharge]);

  // Handle invoice searching dynamic load
  const handleInvoiceSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = invoiceSearchQuery.trim();
    if (INVOICE_PRESETS[cleanId]) {
      const preset = INVOICE_PRESETS[cleanId];
      setActiveInvoice(preset);
      setReturnItems(preset.items);
      triggerToast(`Loaded invoice ${cleanId} for ${preset.customerName}`);
    } else {
      triggerToast(`Invoice ID "${cleanId}" not found. Try 'INV-2024-00189' or 'INV-2024-00210'`);
    }
  };

  // Handle invoice clear
  const handleClearInvoice = () => {
    setActiveInvoice(null);
    setReturnItems([]);
    setInvoiceSearchQuery('');
    triggerToast('Cleared active search metadata.');
  };

  // Handle Barcode scanning simulation
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;

    // Look for item with that barcode in our current lists or anywhere
    const matchedPresetItemIdx = returnItems.findIndex(i => i.barcode === barcodeInput || i.batchCode === barcodeInput);
    if (matchedPresetItemIdx !== -1) {
      // Toggle selection and increase return quantity
      setReturnItems(prev => prev.map((item, idx) => {
        if (idx === matchedPresetItemIdx) {
          return {
            ...item,
            qtyReturn: Math.min(item.qtyReturn + 1, item.qtySold),
            selected: true
          };
        }
        return item;
      }));
      triggerToast(`Found barcode matches! Added 1 unit of ${returnItems[matchedPresetItemIdx].name}`);
      setBarcodeInput('');
    } else {
      // Simulate quick scan arbitrary new item
      triggerToast(`Simulating scanning unrelated batch/barcode number "${barcodeInput}"`);
      setBarcodeInput('');
    }
  };

  // Toggle single item checkbox
  const toggleItemSelection = (id: string) => {
    setReturnItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    }));
  };

  // Set individual item return quantities
  const handleQtyChange = (id: string, newQty: number) => {
    setReturnItems(prev => prev.map(item => {
      if (item.id === id) {
        const validatedQty = Math.max(0, Math.min(newQty, item.qtySold));
        return { ...item, qtyReturn: validatedQty, selected: validatedQty > 0 ? true : item.selected };
      }
      return item;
    }));
  };

  // Set individual item return reason
  const handleReasonChange = (id: string, reason: string) => {
    setReturnItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, reason };
      }
      return item;
    }));
  };

  // Action process refund
  const handleProcessRefund = () => {
    if (refundCalculations.selectedCount === 0) {
      triggerToast('Please select at least 1 medicine to process return.');
      return;
    }
    const refundFormatted = refundCalculations.netRefund.toLocaleString('en-US', { style: 'currency', currency: 'PHP' }).replace('PHP', '₱');
    triggerToast(`Success: Sales return processed gracefully! ${refundFormatted} issued via ${refundMethod.toUpperCase()} refund.`);
  };

  // Save Draft
  const handleSaveDraft = () => {
    triggerToast('Sales return draft saved successfully. Syncing state with cloud server.');
  };

  // Save/Add supplier return dispatch
  const handleCreatePurchaseReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPurchaseReturnForm.medicineName || !newPurchaseReturnForm.batchCode) {
      triggerToast('Please provide medicine name and batch code.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newPR: PurchaseReturnItem = {
      id: `PR-2024-00${purchaseReturns.length + 1}`,
      supplierId: `SPL-${Math.floor(Math.random() * 800) + 110}`,
      supplierName: newPurchaseReturnForm.supplierName,
      supplierEmail: `${newPurchaseReturnForm.supplierName.toLowerCase().replace(/\s/g, '')}@pharma-alliance.net`,
      medicineName: newPurchaseReturnForm.medicineName,
      batchCode: newPurchaseReturnForm.batchCode,
      qtyOrdered: Number(newPurchaseReturnForm.qtyOrdered) || 100,
      qtyReturned: Number(newPurchaseReturnForm.qtyReturned) || 10,
      unitCost: Number(newPurchaseReturnForm.unitCost) || 150.00,
      reason: newPurchaseReturnForm.reason,
      status: 'Shipped',
      returnDate: today
    };

    setPurchaseReturns([newPR, ...purchaseReturns]);
    setShowNewPRModal(false);
    triggerToast(`Dispatched Purchase Return shipment ${newPR.id} successfully.`);
    setNewPurchaseReturnForm({
      supplierName: 'MediCorp Global',
      medicineName: '',
      batchCode: '',
      qtyOrdered: '100',
      qtyReturned: '5',
      unitCost: '120.00',
      reason: 'Short Expiry (Less than 3 mo)'
    });
  };

  const handleUpdatePRStatus = (id: string, status: any) => {
    setPurchaseReturns(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    triggerToast(`Status updated successfully to: ${status}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar currentView="returns" setView={setView} />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Toast Indicator Component */}
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

        {/* Global sticky bar with status dots & POS connected indicator */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shrink-0">
          <div className="px-6 py-3.5 flex items-center justify-between">
            
            {/* Left side: Header info and switchers */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Xion Pharma ERP</div>
                  <div className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Enterprise Suite v3.2</div>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 hidden md:inline-block"></div>

              {/* Seamless Segmented Tab to Switch Between Sales Return & Purchase Return */}
              <div className="bg-slate-100 rounded-lg p-1 hidden sm:flex items-center gap-1">
                <button 
                  onClick={() => { setDashboardMode('sales'); setInvoiceSearchQuery('INV-2024-00142'); handleInvoiceSearch(); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition duration-150 ${dashboardMode === 'sales' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sales Return (POS)
                </button>
                <button 
                  onClick={() => { setDashboardMode('purchase'); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide tracking-wide transition duration-150 ${dashboardMode === 'purchase' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Purchase Return (Supplier)
                </button>
              </div>
            </div>

            {/* Right side: logged user + live POS connected indicator */}
            <div className="flex items-center gap-4">
              
              {/* POS system connected status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100/50">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full absolute"></div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">POS Gateway Live</span>
              </div>

              {/* Desktop notifications bell button */}
              <button className="p-2 border border-slate-200 hover:bg-slate-50 transition rounded-xl text-slate-500 relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Cashier card details matching mock */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  KH
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-800">Sarah Khan, PharmD</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Returns Desk Cashier</div>
                </div>
              </div>

            </div>

          </div>
        </header>

        {/* Sub-header, Breadcrumb, and view title */}
        <div className="px-8 py-4 bg-white border-b border-slate-200/60 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>Inventory & Ledger</span>
              <ChevronRight className="w-3 h-3" />
              <span>Flow Controls</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-800 font-bold">{dashboardMode === 'sales' ? 'Sales Return Desk' : 'Supplier Purchase Return Direct'}</span>
            </div>
            
            <h1 className="text-lg font-bold text-slate-800 mt-1">
              {dashboardMode === 'sales' ? 'Pharmacy Sales Return / Exchange' : 'Supplier Return & Claim Management'}
            </h1>
            <p className="text-xs text-slate-500">
              {dashboardMode === 'sales' 
                ? 'Issue instant customer cashier refunds, log batch issues, and quarantine items for resale.' 
                : 'Manage return shipments of short-expiry compounds, cold-chain violations, and claim pending credits.'
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            {dashboardMode === 'sales' ? (
              <>
                <button 
                  onClick={() => {
                    setInvoiceSearchQuery('INV-2024-00142');
                    setActiveInvoice(INVOICE_PRESETS['INV-2024-00142']);
                    setReturnItems(INVOICE_PRESETS['INV-2024-00142'].items);
                    triggerToast('Reset to demo baseline invoice INV-2024-00142');
                  }}
                  className="px-3.5 py-1.5 border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 transition rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-450" />
                  <span>Reset Demo Invoice</span>
                </button>
                <button 
                  onClick={() => triggerToast('Successfully generated batch export return claims ledger.')}
                  className="px-3.5 py-1.5 border border-slate-200 bg-white text-slate-650 hover:bg-slate-50 transition rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5 text-slate-450" />
                  <span>Export Claims</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowNewPRModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Initiate Supplier Return</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Display Screens based on dashboardMode Tab selection */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="max-w-[1450px] mx-auto">
            
            {dashboardMode === 'sales' ? (
              /* SALES RETURN VIEW GRID */
              <div className="grid grid-cols-12 gap-6">

                {/* LEFT PANEL: LOOKUP & SEARCH SYSTEM (col-span-3) */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                  
                  {/* Card 1: Invoice Lookup Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="text-[13px] font-bold text-slate-800">Invoice Lookup</h3>
                    </div>

                    <form onSubmit={handleInvoiceSearch} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Invoice Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={invoiceSearchQuery}
                            onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                            placeholder="INV-2024-00142" 
                            className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 font-semibold"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <button 
                          type="submit" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Search className="w-3 h-3" />
                          <span>Search</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={handleClearInvoice}
                          className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-medium py-2 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </form>

                    <p className="text-[10px] text-slate-400 mt-2.5 italic">
                      Type 'INV-2024-00189' or 'INV-2024-00210' to load different items.
                    </p>
                  </div>

                  {/* Card 2: Barcode / Handheld Scanner Simulator Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="text-[13px] font-bold text-slate-800">Barcode Scanner Intake</h3>
                    </div>

                    <form onSubmit={handleBarcodeSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Scanner Input Capture</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            placeholder="8901234501234" 
                            className="w-full pl-3 pr-8 py-2.5 text-xs bg-indigo-950 text-indigo-200 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-indigo-600/70 font-mono tracking-wider font-semibold"
                          />
                          <div className="absolute right-2.5 top-3">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="w-full text-center text-xs text-indigo-700 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100/80 transition py-1.5 rounded-md"
                      >
                        Simulate Scan (Submit Barcode)
                      </button>
                    </form>

                    <div className="flex items-start gap-1.5 mt-2 text-[10px] text-slate-400">
                      <AlertCircle className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <span>Scan box barcode above or search '8901234502345' (Cetirizine) to increase qty return!</span>
                    </div>
                  </div>

                  {/* Card 3: Customer Search & Profile Spotlight Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <h3 className="text-[13px] font-bold text-slate-800">Customer Spotlight</h3>
                    </div>

                    {activeInvoice ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-850 font-bold text-xs flex items-center justify-center shrink-0">
                            {activeInvoice.customerName.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{activeInvoice.customerName}</h4>
                            <p className="text-[9px] text-slate-400 font-medium tracking-wide">PH: {activeInvoice.customerPhone}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50/50 rounded-lg p-2.5 text-[11px] space-y-1.5 border border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-450 text-[10px]">Client ID:</span>
                            <span className="font-semibold text-slate-700">{activeInvoice.customerId}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-450 text-[10px]">Total Purchases:</span>
                            <span className="font-bold text-slate-800">{activeInvoice.customerTotalPurchases}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-450 text-[10px]">Returns History:</span>
                            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${activeInvoice.customerPrevReturns > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                              {activeInvoice.customerPrevReturns} items previously returned
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-400">
                        <Inbox className="w-6 h-6 mx-auto mb-1 text-slate-350" />
                        <span className="text-[11px] font-medium leading-relaxed">No customer loaded. Lookup invoice first.</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* CENTER PANEL: RETURN TABLE & MEDICINE CALCULATOR (col-span-6) */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                  
                  {/* Active Invoice Metadata Details */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm relative">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                        <h2 className="text-[13px] font-bold text-slate-800">Loaded Invoice Info</h2>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Desk Ledger:</span>
                        <span className="text-[10.5px] font-bold text-slate-700 font-mono tracking-tight bg-slate-200/60 px-2 py-0.5 rounded">RET-2024-00847</span>
                      </div>
                    </div>

                    <div className="p-4">
                      {activeInvoice ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Invoice #</span>
                            <span className="font-bold text-slate-800 font-mono">{activeInvoice.invoiceId}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Date Issued</span>
                            <span className="font-semibold text-slate-700">{activeInvoice.dateIssued}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Method</span>
                            <span className="font-semibold text-slate-705 flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5 text-slate-450 inline" />
                              {activeInvoice.paymentMethod}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Cashier Agent</span>
                            <span className="font-semibold text-slate-700">{activeInvoice.cashierName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Customer Name</span>
                            <span className="font-semibold text-slate-700">{activeInvoice.customerName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Prescr. #</span>
                            <span className="font-bold text-indigo-700 font-mono text-[11px]">{activeInvoice.prescriptionNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Items in Ledger</span>
                            <span className="font-semibold text-slate-700">{activeInvoice.items.length} units originally</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Total Amount</span>
                            <span className="font-extrabold text-emerald-700">{activeInvoice.items ? '₱' + activeInvoice.items.reduce((acc,i)=>acc+(i.unitPrice*i.qtySold), 0).toFixed(2) : '₱0.00'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400">
                          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-semibold">Please search for a customer invoice to begin returns intake.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Return Details Table */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-bold text-slate-800">Medicine Return Items list</h3>
                        <div className="flex items-center gap-1.5 ml-2">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 p-0.5 rounded">
                            Checked: {refundCalculations.selectedCount}
                          </span>
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Returned Units: {refundCalculations.totalUnitsReturned}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <button 
                          onClick={() => {
                            setReturnItems(returnItems.map(i => ({ ...i, selected: true })));
                            triggerToast('Selected all items in the checklist');
                          }}
                          className="text-emerald-700 hover:text-emerald-800 font-semibold"
                        >
                          Select All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button 
                          onClick={() => {
                            setReturnItems(returnItems.map(i => ({ ...i, selected: false })));
                            triggerToast('Deselected all checkmarks');
                          }}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-serif min-w-[650px]">
                        <thead>
                          <tr className="bg-slate-50/40 border-b border-slate-100">
                            <th className="p-3 w-8 text-center">
                              <CheckCircle2 className="w-4 h-4 text-slate-400 inline" />
                            </th>
                            <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Medicine Name</th>
                            <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans text-center">Sold</th>
                            <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans text-center">Return Qty</th>
                            <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans text-right">Price</th>
                            <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">Reason / Dispatch Log</th>
                            <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans text-right">Refund Sub</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {returnItems.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-10 text-center text-slate-400">
                                <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p className="text-xs font-semibold">No returning items to list.</p>
                              </td>
                            </tr>
                          ) : (
                            returnItems.map(item => (
                              <tr 
                                key={item.id} 
                                className={`transition-colors duration-150 ${item.selected ? 'bg-emerald-50/15 hover:bg-emerald-50/30' : 'opacity-65 hover:bg-slate-50/40'}`}
                              >
                                {/* Selection check box */}
                                <td className="p-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={item.selected}
                                    onChange={() => toggleItemSelection(item.id)}
                                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer w-4 h-4"
                                  />
                                </td>

                                {/* Medicine info & Batch */}
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded-md ${item.type === 'Rx' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {item.type}
                                    </span>
                                    <div>
                                      <div className="font-bold text-slate-800 text-xs sm:text-[13px]">{item.name}</div>
                                      <div className="text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">
                                        Batch: {item.batchCode} • {item.barcode}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Qty Sold */}
                                <td className="p-3 text-center text-xs font-semibold text-slate-600">
                                  {item.qtySold}
                                </td>

                                {/* Qty Returning INPUT */}
                                <td className="p-3 text-center">
                                  <input 
                                    type="number" 
                                    value={item.qtyReturn || ''}
                                    onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value) || 0)}
                                    disabled={!item.selected}
                                    className="w-14 text-center border mr-1 border-slate-200 rounded-md py-1 px-1.5 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                                    min="0"
                                    max={item.qtySold}
                                  />
                                </td>

                                {/* Price */}
                                <td className="p-3 text-right text-xs font-bold text-slate-800">
                                  ₱{item.unitPrice.toFixed(2)}
                                </td>

                                {/* Reason Dropdown */}
                                <td className="p-3">
                                  <select 
                                    value={item.reason}
                                    onChange={(e) => handleReasonChange(item.id, e.target.value)}
                                    disabled={!item.selected}
                                    className="border border-slate-200 rounded-lg p-1 text-[11px] font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-40"
                                  >
                                    <option value="Wrong Item">Wrong Item</option>
                                    <option value="Adverse Reaction">Adverse Reaction</option>
                                    <option value="Damaged Packaging">Damaged Packaging</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Doctor Discontinued">Doctor Discontinued</option>
                                  </select>
                                </td>

                                {/* Refund total sub for this item */}
                                <td className="p-3 text-right text-xs font-extrabold text-slate-900">
                                  ₱{(item.unitPrice * (item.qtyReturn || 0)).toFixed(2)}
                                </td>

                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11.5px] text-slate-500 font-medium">
                      <span>Total Returned Unit count: <strong className="text-slate-800">{refundCalculations.totalUnitsReturned} packs</strong></span>
                      <span>Ready to sync to Quarantine stock inventory desk</span>
                    </div>

                  </div>

                  {/* Operational Return Notes field */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm space-y-3">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Desk Return Notes & Escalation Logs
                    </label>
                    <textarea 
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      rows={3}
                      className="w-full text-xs font-normal border border-slate-200 rounded-xl p-3 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 leading-relaxed"
                      placeholder="Input customer feedback reasons or pharmacist physical evaluation findings on return criteria..."
                    />
                    
                    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                        <span>Photos of medical packaging scanned successfully (2 attachments)</span>
                      </span>
                      <span className="font-semibold text-indigo-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Requires Supervisor override due to Rx Switch terms</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* RIGHT PANEL: LIVE REFUND CALCULATION ENGINE & STATS (col-span-3) */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                  
                  {/* Card 1: Refund calculation summary */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">
                    <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-emerald-200" />
                        <h3 className="text-sm font-bold tracking-tight">Active Refund Calculation</h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-emerald-100 bg-emerald-800/80 px-2 py-0.5 rounded-full">Automated</span>
                    </div>

                    <div className="p-4 space-y-3 text-xs leading-relaxed">
                      
                      <div className="flex justify-between items-center text-slate-650">
                        <span>Checklisted Subtotal:</span>
                        <span className="font-semibold text-slate-800">₱{refundCalculations.subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-650">
                        <span>VAT Apportioned (12%):</span>
                        <span className="font-semibold text-slate-800">₱{refundCalculations.vat.toFixed(2)}</span>
                      </div>

                      {/* senior discount custom toggles */}
                      <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-150">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={seniorDiscount}
                            onChange={(e) => setSeniorDiscount(e.target.checked)}
                            className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500/20"
                          />
                          <span className="text-[10.5px] font-bold text-slate-650">Less: Senior Discount (20%)</span>
                        </label>
                        <span className="font-bold text-red-655">- ₱{refundCalculations.discountAmount.toFixed(2)}</span>
                      </div>

                      {/* Restocking fee percent modifier slider */}
                      <div className="space-y-1.5 bg-slate-50 p-2 rounded-lg border border-slate-150">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="font-bold text-slate-650">Restocking Fee ({restockingFeePercent}%)</span>
                          <span className="font-bold text-red-655">- ₱{refundCalculations.restockingFee.toFixed(2)}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="15" 
                          step="5"
                          value={restockingFeePercent}
                          onChange={(e) => setRestockingFeePercent(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                      </div>

                      {/* Handling Fees parameters */}
                      <div className="flex justify-between items-center text-slate-650">
                        <span>Handling / Admin Charge:</span>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number" 
                            value={handlingCharge || ''}
                            onChange={(e) => setHandlingCharge(parseFloat(e.target.value) || 0)}
                            className="w-12 text-center border mr-1 border-slate-200 rounded font-normal text-[11px]"
                          />
                          <span className="font-bold text-red-655">- ₱{(handlingCharge).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 my-2 pt-2"></div>

                      <div className="flex justify-between items-center p-1 bg-emerald-50 rounded-xl">
                        <span className="text-emerald-900 font-bold uppercase text-[10.5px] tracking-wide">Net Refund Amount</span>
                        <span className="text-xl font-extrabold text-emerald-700">₱{refundCalculations.netRefund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>

                    </div>
                  </div>

                  {/* Card 2: Refund Payment Method radio triggers */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Select Refund Method
                    </h4>
                    
                    <div className="space-y-2">
                      <label 
                        onClick={() => { setRefundMethod('cash'); triggerToast('Payout mode changed to cash'); }}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${refundMethod === 'cash' ? 'bg-emerald-50 border-emerald-350' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        <input 
                          type="radio" 
                          name="payout_refund" 
                          checked={refundMethod === 'cash'} 
                          onChange={() => {}}
                          className="text-emerald-600 focus:ring-emerald-500/20 mt-0.5" 
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Cash Refund Direct</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Instant cashier physical drawer payout</p>
                        </div>
                      </label>

                      <label 
                        onClick={() => { setRefundMethod('credit'); triggerToast('Payout mode changed to credit vouchers (+5% reward bonus)'); }}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${refundMethod === 'credit' ? 'bg-emerald-50 border-emerald-350' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        <input 
                          type="radio" 
                          name="payout_refund" 
                          checked={refundMethod === 'credit'} 
                          onChange={() => {}}
                          className="text-emerald-600 focus:ring-emerald-500/20 mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Store Credit / Voucher</p>
                          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Includes +5% reward store credit bonus</p>
                        </div>
                      </label>

                      <label 
                        onClick={() => { setRefundMethod('card'); triggerToast('Payout configured to reverse original credit/debit card swipe'); }}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${refundMethod === 'card' ? 'bg-emerald-50 border-emerald-350' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        <input 
                          type="radio" 
                          name="payout_refund" 
                          checked={refundMethod === 'card'} 
                          onChange={() => {}}
                          className="text-emerald-600 focus:ring-emerald-500/20 mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Card Reversal Visa/MC</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Gateway process takes 3-5 bank business days</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Card 3: Approval checklist display */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm space-y-3.5">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Safety & Criteria Checklist
                    </h4>

                    <div className="space-y-2 text-[11px] text-slate-650 font-medium">
                      
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>Original billing statement verified</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>Within returned window policy limits (7 days)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>Form integrity & blister packs intact</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>Registered pharmacist review approved</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3 inline mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                        <span>Manager supervisor override authorization pending</span>
                      </div>

                    </div>
                  </div>

                  {/* Card 4: Inventory impact card */}
                  <div className="bg-amber-50/70 rounded-2xl border border-amber-200/60 p-4 shadow-sm text-xs">
                    <div className="flex gap-2 text-amber-950">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold block text-amber-900 mb-0.5">Automatic Inventory Adjust</strong>
                        <p className="text-slate-650 leading-relaxed text-[11px]">
                          All {refundCalculations.totalUnitsReturned} units will be logged as returned to inventory but placed under Quarantine containment lock inside the warehouse for pharmacist validation, safeguarding patient safety before re-entering general sales stacks.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              /* SUPPLIER PURCHASE RETURN VIEW */
              <div className="bg-white rounded-3xl border border-slate-200/60 p-6 space-y-6 shadow-sm">
                
                {/* Upper bar for search, stats and addition */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-800">Supplier Returns Ledger</h3>
                      <p className="text-xs text-slate-500">Monitor compensation shipments and claim refunds from pharma manufacturers</p>
                    </div>
                  </div>

                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      value={supplierSearchText}
                      onChange={(e) => setSupplierSearchText(e.target.value)}
                      placeholder="Search supplier name or compound..." 
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>

                {/* Grid stats for PR */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-550 block font-bold uppercase tracking-wider">Estimated supplier credit</span>
                      <span className="text-xl font-extrabold text-slate-800">
                        ₱{purchaseReturns.reduce((acc, i)=>acc+(i.qtyReturned*i.unitCost), 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md">Ledger Value</span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-550 block font-bold uppercase tracking-wider">Awaiting Dispatch</span>
                      <span className="text-xl font-extrabold text-slate-800">
                        {purchaseReturns.filter(i=>itemStatusLabel(i.status) === 'pending').length} shipments
                      </span>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-md">Awaiting Approval</span>
                  </div>

                  <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-550 block font-bold uppercase tracking-wider">Resolved YTD Credit</span>
                      <span className="text-xl font-extrabold text-slate-800">
                        ₱{purchaseReturns.filter(i=>i.status === 'Refund Credited').reduce((acc, i)=>acc+(i.qtyReturned*i.unitCost), 0).toLocaleString()}
                      </span>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded-md">Settled Funds</span>
                  </div>
                </div>

                {/* PR Table displaying elements perfectly */}
                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-3.5">PR Code #</th>
                        <th className="p-3.5">Supplier Partner</th>
                        <th className="p-3.5">Target Medicine compound</th>
                        <th className="p-3.5 text-center">Batch Num</th>
                        <th className="p-3.5 text-right">Qty Claimed</th>
                        <th className="p-3.5 text-right">Estimated Cost Recovery</th>
                        <th className="p-3.5">Dispatched On</th>
                        <th className="p-3.5">Fulfillment Status</th>
                        <th className="p-3.5 text-center">Manage flow</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {purchaseReturns
                        .filter(item => {
                          const query = supplierSearchText.toLowerCase();
                          return item.supplierName.toLowerCase().includes(query) || 
                                 item.id.toLowerCase().includes(query) || 
                                 item.medicineName.toLowerCase().includes(query);
                        })
                        .map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition duration-150">
                            <td className="p-3.5 font-bold text-indigo-700">{item.id}</td>
                            <td className="p-3.5">
                              <div>
                                <strong className="font-bold text-slate-800 block text-[13px]">{item.supplierName}</strong>
                                <span className="text-[10px] text-slate-400 font-medium">{item.supplierEmail}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-indigo-505 rounded-full inline-block"></span>
                                <span className="font-semibold text-slate-700">{item.medicineName}</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-center font-mono text-[11px] text-slate-500">{item.batchCode}</td>
                            <td className="p-3.5 text-right font-medium text-slate-650">
                              {item.qtyReturned} <span className="text-[10px] text-slate-400">/ {item.qtyOrdered} order units</span>
                            </td>
                            <td className="p-3.5 text-right font-bold text-emerald-800">
                              ₱{(item.qtyReturned * item.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3.5 text-slate-500 font-semibold">{item.returnDate}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'Refund Credited' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : item.status === 'Shipped' 
                                  ? 'bg-blue-105 text-blue-800' 
                                  : 'bg-amber-105 text-amber-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex gap-1.5 justify-center">
                                <button 
                                  onClick={() => handleUpdatePRStatus(item.id, 'Refund Credited')}
                                  title="Approve Refund Claim"
                                  className="p-1 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 font-medium text-emerald-700 rounded transition"
                                >
                                  Claimed
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete supplier return record ${item.id}?`)) {
                                      setPurchaseReturns(purchaseReturns.filter(pr => pr.id !== item.id));
                                      triggerToast('Supplier return claim wiped successfully.');
                                    }
                                  }}
                                  title="Wipe claims report"
                                  className="p-1 border border-slate-200 hover:border-red-500 hover:bg-red-50 font-medium text-red-600 rounded transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>

                {/* Subtext info */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs flex gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Note about manufacturer claims: Commercial credits issued by suppliers for return shipments are automatically populated into the billing and compliance desk under corporate agreements. Approved credits can be immediately offset against outbound purchase orders for active vendors.
                  </p>
                </div>

              </div>
            )}

            {/* Sticky/Fixed bottom action panel (Exactly modeled from design document mockup) */}
            <div className="bg-white rounded-2xl border border-slate-200/70 p-4 mt-6 flex flex-col sm:flex-row shadow-lg sm:items-center justify-between gap-4">
              
              {/* Left action panel metrics */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block tracking-tight">Active Return Session Progress</span>
                  <span className="font-extrabold text-slate-800 flex items-center gap-1">
                    <span>Task Checklist (Step 2 of 3)</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 inline" />
                    <span>Review Return Items Integrity</span>
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

                <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                  <span>Automatic desk save synchronized: <strong className="text-slate-700">2 seconds ago</strong></span>
                </div>
              </div>

              {/* Action buttons matching specifications */}
              <div className="flex flex-wrap items-center gap-2">
                
                <button 
                  onClick={() => {
                    if (window.confirm('Reset return draft? All selection changes will be lost.')) {
                      setReturnItems(activeInvoice?.items || []);
                      setSeniorDiscount(true);
                      setRestockingFeePercent(5);
                      setHandlingCharge(15.00);
                      triggerToast('Return workspace has been refreshed to pristine presets.');
                    }
                  }}
                  className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold border border-slate-200 transition duration-150 flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Exchange</span>
                </button>

                <button 
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold border border-slate-200 transition duration-150 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft Claims</span>
                </button>

                <button 
                  onClick={() => {
                    triggerToast('Initiating printer stream... Sales receipt preview prepared.');
                  }}
                  className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold border border-slate-200 transition duration-150 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button 
                  onClick={handleProcessRefund}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wide transition duration-150 flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Process Return &amp; Refund</span>
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>

      {/* MODAL WINDOWS FOR SUPPLIER DISPATCH INJECTION */}
      <AnimatePresence>
        {showNewPRModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left border border-slate-100"
            >
              
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Building className="w-5 h-5" />
                  <h3 className="text-base font-extrabold text-slate-800">Dispatch Supplier Return shipment</h3>
                </div>
                <button 
                  onClick={() => setShowNewPRModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePurchaseReturn} className="space-y-4 text-xs font-medium">
                
                {/* Supplier Picker */}
                <div>
                  <label className="block text-slate-500 mb-1 font-bold uppercase tracking-wider text-[9px]">Select Target Vendor</label>
                  <select 
                    value={newPurchaseReturnForm.supplierName}
                    onChange={(e) => setNewPurchaseReturnForm({ ...newPurchaseReturnForm, supplierName: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800"
                  >
                    <option value="MediCorp Global">MediCorp Global</option>
                    <option value="PharmaLine Inc">PharmaLine Inc</option>
                    <option value="HealthSource Dist">HealthSource Dist</option>
                    <option value="BioMed Supplies">BioMed Supplies</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Medicine Name */}
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold uppercase tracking-wider text-[9px]">Medicine Compound</label>
                    <input 
                      type="text" 
                      required
                      value={newPurchaseReturnForm.medicineName}
                      onChange={(e) => setNewPurchaseReturnForm({ ...newPurchaseReturnForm, medicineName: e.target.value })}
                      placeholder="e.g. Amoxicillin 500mg" 
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800"
                    />
                  </div>

                  {/* Batch Code */}
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold uppercase tracking-wider text-[9px]">Batch / Lot Code</label>
                    <input 
                      type="text" 
                      required
                      value={newPurchaseReturnForm.batchCode}
                      onChange={(e) => setNewPurchaseReturnForm({ ...newPurchaseReturnForm, batchCode: e.target.value })}
                      placeholder="e.g. BTH-25B-X90" 
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-850 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Qty Ordered originally */}
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold uppercase tracking-wider text-[9px]">Ordered count</label>
                    <input 
                      type="number" 
                      value={newPurchaseReturnForm.qtyOrdered}
                      onChange={(e) => setNewPurchaseReturnForm({ ...newPurchaseReturnForm, qtyOrdered: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 text-center"
                    />
                  </div>

                  {/* Qty Returned */}
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold uppercase tracking-wider text-[9px]">Returned count</label>
                    <input 
                      type="number" 
                      value={newPurchaseReturnForm.qtyReturned}
                      onChange={(e) => setNewPurchaseReturnForm({ ...newPurchaseReturnForm, qtyReturned: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 text-center"
                    />
                  </div>

                  {/* Unit cost */}
                  <div>
                    <label className="block text-slate-500 mb-1 font-bold uppercase tracking-wider text-[9px]">Unit Cost (₱)</label>
                    <input 
                      type="number" 
                      value={newPurchaseReturnForm.unitCost}
                      onChange={(e) => setNewPurchaseReturnForm({ ...newPurchaseReturnForm, unitCost: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 text-right"
                    />
                  </div>

                </div>

                {/* Reason Picker */}
                <div>
                  <label className="block text-slate-500 mb-1 font-bold uppercase tracking-wider text-[9px]">Reason for Manufacturer Refusal</label>
                  <select 
                    value={newPurchaseReturnForm.reason}
                    onChange={(e) => setNewPurchaseReturnForm({ ...newPurchaseReturnForm, reason: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800"
                  >
                    <option value="Short Expiry (Less than 3 mo)">Short Expiry (Less than 3 mo)</option>
                    <option value="Cold-chain temperature warning breached">Cold-chain temperature warning breached</option>
                    <option value="Damaged shipping containers on transit">Damaged shipping containers on transit</option>
                    <option value="Recall of component by active FDA notice">Recall of component by active FDA notice</option>
                    <option value="Overstock return terms agreement">Overstock return terms agreement</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setShowNewPRModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    Dispatch Shipment
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

// Quick state label helper
function itemStatusLabel(status: string) {
  if (status.includes('Pending')) return 'pending';
  if (status.includes('Shipped')) return 'shipped';
  return 'credited';
}
