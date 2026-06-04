import React, { useState } from 'react';
import {
  Search, Barcode, Plus, Bell, Mail, HelpCircle, Calendar,
  ChevronDown, Download, X, Eye, Edit, Printer, Trash2, Pill, HeartPulse,
  Activity, Droplet, FlaskConical, Bug, ChevronLeft, ChevronRight, Package, Clock
} from 'lucide-react';
import Sidebar from '../Sidebar';

const medicinesData = [
  {
    id: 1,
    name: "Amoxil 500mg", generic: "Amoxicillin", barcode: "BAR-8942015673",
    icon: Pill, iconWrapperClass: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600",
    category: "Antibiotic", catClass: "bg-blue-50 text-blue-700",
    batch: "BT-2024-A45", mfg: "Jan 2024",
    expiry: "Aug 2025", expLeft: "10 months left", expClass: "text-green-600",
    stock: "1,250", stockPct: 75, stockClass: "bg-green-500", stockTextClass: "text-slate-800",
    purchase: "$2.40", selling: "$3.50", margin: "+45% margin"
  },
  {
    id: 2,
    name: "Cardizem 120mg", generic: "Diltiazem HCl", barcode: "BAR-7842159632",
    icon: HeartPulse, iconWrapperClass: "bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600",
    category: "Cardiac", catClass: "bg-rose-50 text-rose-700",
    batch: "BT-2024-B12", mfg: "Feb 2024",
    expiry: "Mar 2025", expLeft: "5 months left", expClass: "text-amber-600",
    stock: "85", stockPct: 25, stockClass: "bg-amber-500", stockTextClass: "text-amber-600",
    purchase: "$8.20", selling: "$12.50", margin: "+52% margin"
  },
  {
    id: 3,
    name: "Ventolin Inhaler", generic: "Salbutamol", barcode: "BAR-3214569870",
    icon: Activity, iconWrapperClass: "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600",
    category: "Respiratory", catClass: "bg-emerald-50 text-emerald-700",
    batch: "BT-2024-C89", mfg: "Mar 2024",
    expiry: "Dec 2024", expLeft: "2 months left", expClass: "text-rose-600",
    stock: "450", stockPct: 60, stockClass: "bg-green-500", stockTextClass: "text-slate-800",
    purchase: "$5.80", selling: "$8.90", margin: "+53% margin"
  },
  {
    id: 4,
    name: "Glucophage 850mg", generic: "Metformin HCl", barcode: "BAR-6541239870",
    icon: Droplet, iconWrapperClass: "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600",
    category: "Diabetes", catClass: "bg-amber-50 text-amber-700",
    batch: "BT-2024-D56", mfg: "Apr 2024",
    expiry: "Oct 2025", expLeft: "12 months left", expClass: "text-green-600",
    stock: "2,100", stockPct: 95, stockClass: "bg-green-500", stockTextClass: "text-slate-800",
    purchase: "$1.80", selling: "$2.75", margin: "+52% margin"
  },
  {
    id: 5,
    name: "Paracetamol 500mg", generic: "Acetaminophen", barcode: "BAR-1478523690",
    icon: FlaskConical, iconWrapperClass: "bg-gradient-to-br from-violet-100 to-violet-200 text-violet-600",
    category: "Analgesic", catClass: "bg-violet-50 text-violet-700",
    batch: "BT-2024-E34", mfg: "May 2024",
    expiry: "Jul 2026", expLeft: "21 months left", expClass: "text-green-600",
    stock: "0", stockPct: 0, stockClass: "bg-rose-500", stockTextClass: "text-rose-600",
    purchase: "$0.80", selling: "$1.20", margin: "+50% margin"
  },
  {
    id: 6,
    name: "Tamiflu 75mg", generic: "Oseltamivir Phosphate", barcode: "BAR-9638527410",
    icon: Bug, iconWrapperClass: "bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-600",
    category: "Antiviral", catClass: "bg-cyan-50 text-cyan-700",
    batch: "BT-2024-F78", mfg: "Jun 2024",
    expiry: "Nov 2025", expLeft: "13 months left", expClass: "text-green-600",
    stock: "320", stockPct: 45, stockClass: "bg-green-500", stockTextClass: "text-slate-800",
    purchase: "$15.00", selling: "$22.50", margin: "+50% margin"
  },
  {
    id: 7,
    name: "Centrum Adult", generic: "Multivitamins", barcode: "BAR-8521479630",
    icon: Pill, iconWrapperClass: "bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600",
    category: "Vitamins", catClass: "bg-pink-50 text-pink-700",
    batch: "BT-2024-G23", mfg: "Jul 2024",
    expiry: "Sep 2026", expLeft: "23 months left", expClass: "text-green-600",
    stock: "850", stockPct: 85, stockClass: "bg-green-500", stockTextClass: "text-slate-800",
    purchase: "$6.50", selling: "$9.90", margin: "+52% margin"
  }
];

export default function MedicineManagement({ setView }: { setView: (view: any) => void }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic (simple)
  const filteredMedicines = medicinesData.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.generic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar currentView="medicine" setView={setView} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Medicine Management</h2>
            <p className="text-xs text-slate-500">Manage your pharmacy inventory and medicines</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition">
              <Mail className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-6 border-l border-slate-200"></div>
            <button className="flex items-center px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm transition">
              <Calendar className="mr-2 text-slate-500 w-4 h-4" />
              <span className="text-slate-700">Last 30 days</span>
              <ChevronDown className="ml-2 text-slate-500 w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Pill className="text-blue-600 w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">1,284</p>
              <p className="text-xs text-slate-500 mt-1">Total Medicines</p>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Package className="text-green-600 w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">In Stock</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">45,892</p>
              <p className="text-xs text-slate-500 mt-1">Total Units</p>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Activity className="text-amber-600 w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Alert</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">23</p>
              <p className="text-xs text-slate-500 mt-1">Low Stock Items</p>
            </div>
            
            <div className="bg-white rounded-xl p-5 border border-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                  <Clock className="text-rose-600 w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">Action</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">17</p>
              <p className="text-xs text-slate-500 mt-1">Expiring Soon</p>
            </div>
          </div>

          {/* Main Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-200 bg-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3 flex-wrap">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-[280px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, generic, or batch..." 
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                  </div>
                  
                  {/* Barcode Scanner */}
                  <button 
                    onClick={() => setShowBarcodeModal(true)} 
                    className="flex items-center px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 transition"
                  >
                    <Barcode className="mr-2 text-slate-600 w-4 h-4" /> Scan Barcode
                  </button>
                  
                  {/* Filter Dropdown 1 */}
                  <div className="relative">
                    <select className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                      <option value="all">All Categories</option>
                      <option value="antibiotic">Antibiotics</option>
                      <option value="analgesic">Analgesics</option>
                      <option value="antiviral">Antivirals</option>
                      <option value="cardiac">Cardiac</option>
                      <option value="vitamin">Vitamins</option>
                      <option value="diabetes">Diabetes</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                  
                  {/* Filter Dropdown 2 */}
                  <div className="relative">
                    <select className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer">
                      <option value="all">All Stock</option>
                      <option value="in-stock">In Stock</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 lg:mt-0">
                  <button className="flex items-center px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 transition">
                    <Download className="mr-2 w-4 h-4" /> Export
                  </button>
                  <button 
                    onClick={() => setShowAddModal(true)} 
                    className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                  >
                    <Plus className="mr-1.5 w-4 h-4" /> Add Medicine
                  </button>
                </div>
              </div>
              
              {/* Active Filter Tags */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="text-xs text-slate-500">Active filters:</span>
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  All Categories <button className="ml-1.5 hover:text-blue-900"><X className="w-3 h-3" /></button>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  In Stock <button className="ml-1.5 hover:text-blue-900"><X className="w-3 h-3" /></button>
                </span>
                <button className="text-xs text-slate-500 hover:text-slate-700 ml-1">Clear all</button>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left w-12">
                      <input type="checkbox" className="rounded accent-blue-600 cursor-pointer" />
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Medicine Info</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Batch No.</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Expiry</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Price (P/S)</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 text-right uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMedicines.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4"><input type="checkbox" className="rounded accent-blue-600 cursor-pointer" /></td>
                      <td className="px-4 py-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.iconWrapperClass}`}>
                          <m.icon className="w-5 h-5" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{m.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{m.generic}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${m.catClass}`}>
                          {m.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-800">{m.batch}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Mfg: {m.mfg}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm font-medium ${m.expClass}`}>{m.expiry}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{m.expLeft}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm font-bold ${m.stockTextClass}`}>{m.stock}</div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div className={`h-full ${m.stockClass}`} style={{ width: `${m.stockPct}%` }}></div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-slate-800">{m.selling}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{m.margin}</div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded"><Edit className="w-4 h-4" /></button>
                          <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500">Showing 1 to {filteredMedicines.length} of {medicinesData.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                <button className="px-3 py-1 bg-blue-50 text-blue-600 font-medium text-sm rounded">1</button>
                <button className="p-1.5 rounded border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}