import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Plus, ArrowRight, Download, Package, Filter, MoreHorizontal,
  TrendingUp, AlertTriangle, Clock, AlertOctagon, ChevronLeft, ChevronRight
} from 'lucide-react';
import Sidebar from '../Sidebar';
import TopNav from '../TopNav';

// Data Mock
const stats = [
  { label: 'Total Items', value: '2,847', trend: '+12.5%', desc: 'from last month', trendClass: 'text-green-600 bg-green-50', valueClass: 'text-gray-900', icon: <Package className="w-5 h-5 text-green-600" />, iconBg: 'bg-green-50' },
  { label: 'Low Stock', value: '34', trend: '+8 items', desc: 'needs attention', trendClass: 'text-orange-600 bg-orange-50', valueClass: 'text-orange-600', icon: <AlertTriangle className="w-5 h-5 text-orange-600" />, iconBg: 'bg-orange-50' },
  { label: 'Expiring Soon', value: '18', trend: '5 this week', desc: 'within 30 days', trendClass: 'text-amber-600 bg-amber-50', valueClass: 'text-amber-600', icon: <Clock className="w-5 h-5 text-amber-600" />, iconBg: 'bg-amber-50' },
  { label: 'Out of Stock', value: '7', trend: 'Critical', desc: 'restock ASAP', trendClass: 'text-red-600 bg-red-50', valueClass: 'text-red-600', icon: <AlertOctagon className="w-5 h-5 text-red-600" />, iconBg: 'bg-red-50' },
];

const alertsData = [
  { id: 1, type: 'Rx', name: 'Amoxicillin 500mg', sku: 'AMX-500', units: 3, typeClass: 'bg-red-100 text-red-700' },
  { id: 2, type: 'Rx', name: 'Metformin 850mg', sku: 'MET-850', units: 5, typeClass: 'bg-red-100 text-red-700' },
  { id: 3, type: 'OTC', name: 'Ibuprofen 400mg', sku: 'IBU-400', units: 8, typeClass: 'bg-amber-100 text-amber-700' },
  { id: 4, type: 'Rx', name: 'Lisinopril 10mg', sku: 'LIS-10', units: 2, typeClass: 'bg-red-100 text-red-700' },
  { id: 5, type: 'Rx', name: 'Omeprazole 20mg', sku: 'OME-20', units: 4, typeClass: 'bg-red-100 text-red-700' },
  { id: 6, type: 'OTC', name: 'Cetirizine 10mg', sku: 'CET-10', units: 6, typeClass: 'bg-amber-100 text-amber-700' },
];

const chartData = [
  { name: 'Mon', Incoming: 120, Outgoing: 98 },
  { name: 'Tue', Incoming: 95, Outgoing: 112 },
  { name: 'Wed', Incoming: 142, Outgoing: 105 },
  { name: 'Thu', Incoming: 88, Outgoing: 134 },
  { name: 'Fri', Incoming: 165, Outgoing: 120 },
  { name: 'Sat', Incoming: 78, Outgoing: 65 },
  { name: 'Sun', Incoming: 132, Outgoing: 89 },
];

const tableData = [
  { id: 1, type: 'Rx', name: 'Amoxicillin 500mg', desc: 'Capsules • 30 pack', sku: 'AMX-500', batch: 'B2024-0892', expiry: 'Mar 2025', qty: 3, status: 'Low Stock', statusClass: 'bg-red-50 text-red-700', statusDot: 'bg-red-500', supplier: 'MediSupply', iconBg: 'bg-green-50 text-green-700' },
  { id: 2, type: 'Rx', name: 'Metformin 850mg', desc: 'Tablets • 60 pack', sku: 'MET-850', batch: 'B2024-0745', expiry: 'Jun 2025', qty: 5, status: 'Low Stock', statusClass: 'bg-red-50 text-red-700', statusDot: 'bg-red-500', supplier: 'PharmaGlobal', iconBg: 'bg-blue-50 text-blue-700' },
  { id: 3, type: 'Rx', name: 'Atorvastatin 20mg', desc: 'Tablets • 30 pack', sku: 'ATV-20', batch: 'B2024-0623', expiry: 'Feb 2025', qty: 42, status: 'Expiring', statusClass: 'bg-amber-50 text-amber-700', statusDot: 'bg-amber-500', supplier: 'HealthDirect', iconBg: 'bg-purple-50 text-purple-700' },
  { id: 4, type: 'OTC', name: 'Ibuprofen 400mg', desc: 'Tablets • 20 pack', sku: 'IBU-400', batch: 'B2024-0901', expiry: 'Sep 2026', qty: 156, status: 'In Stock', statusClass: 'bg-green-50 text-green-700', statusDot: 'bg-green-500', supplier: 'VitaPharm', iconBg: 'bg-green-50 text-green-700' },
  { id: 5, type: 'Rx', name: 'Lisinopril 10mg', desc: 'Tablets • 90 pack', sku: 'LIS-10', batch: 'B2024-0412', expiry: 'Jan 2025', qty: 0, status: 'Out of Stock', statusClass: 'bg-gray-100 text-gray-600', statusDot: 'bg-gray-400', supplier: 'GenericRx', iconBg: 'bg-red-50 text-red-700' },
];

export default function InventoryDashboard({ setView }: { setView: (view: any) => void }) {
  const [chartRange, setChartRange] = useState('7d');

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      <Sidebar currentView="inventory" setView={setView} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          
          {/* Page Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Overview of your pharmacy stock and movements</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Live Sync
              </div>
              <button className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm shadow-green-600/20">
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-1 ${stat.valueClass}`}>{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${stat.trendClass}`}>{stat.trend}</span>
                      <span className="text-xs text-gray-400">{stat.desc}</span>
                    </div>
                  </div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Low Stock Alert Section */}
          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 rounded-2xl border border-red-100/60 p-5 lg:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-500">Items requiring immediate restocking attention</p>
                </div>
              </div>
              <button className="text-sm text-green-600 font-medium hover:text-green-700 hidden sm:flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {alertsData.map((alert) => (
                <div key={alert.id} className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/60 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.typeClass}`}>
                    <span className="text-xs font-bold">{alert.type}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{alert.name}</p>
                    <p className="text-xs text-gray-500">SKU: {alert.sku} • Only <span className="text-red-600 font-semibold">{alert.units} units</span> left</p>
                  </div>
                  <button className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex-shrink-0">
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chart + Filter Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Stock Movement Chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-gray-900">Stock Movement</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Incoming vs outgoing inventory trends</p>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  <button onClick={() => setChartRange('7d')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartRange === '7d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>7D</button>
                  <button onClick={() => setChartRange('30d')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartRange === '30d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>30D</button>
                  <button onClick={() => setChartRange('90d')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${chartRange === '90d' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>90D</button>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderRadius: '10px', color: '#fff', border: 'none' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="Incoming" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncoming)" activeDot={{ r: 6 }} />
                    <Area type="monotone" dataKey="Outgoing" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOutgoing)" activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500 font-medium">Incoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-500 font-medium">Outgoing</span>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button className="text-xs text-green-600 font-medium hover:text-green-700">Reset All</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
                  <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400">
                    <option>All Categories</option>
                    <option>Antibiotics</option>
                    <option>Cardiovascular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Stock Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                      <span className="text-xs text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-xs text-gray-700">Low</span>
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-amber-300 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                      <span className="text-xs text-gray-700">Expiring</span>
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                      <span className="text-xs text-gray-700">Out</span>
                    </label>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors mt-2">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 lg:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Inventory Items</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Showing {tableData.length} of 2,847 items</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Bulk Actions
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    </th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine Name</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableData.map(row => (
                    <tr key={row.id} className="hover:bg-green-50/30 transition-colors">
                      <td className="py-3.5 px-5">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${row.iconBg}`}>
                            <span className="text-[10px] font-bold">{row.type}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{row.name}</p>
                            <p className="text-xs text-gray-400">{row.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5"><span className="text-sm text-gray-600 font-mono">{row.sku}</span></td>
                      <td className="py-3.5 px-5"><span className="text-sm text-gray-600">{row.batch}</span></td>
                      <td className="py-3.5 px-5"><span className="text-sm text-gray-600">{row.expiry}</span></td>
                      <td className="py-3.5 px-5"><span className="text-sm font-semibold text-gray-900">{row.qty}</span></td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${row.statusClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.statusDot}`}></span>{row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5"><span className="text-sm text-gray-600">{row.supplier}</span></td>
                      <td className="py-3.5 px-5">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 lg:px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">Page 1 of 356</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">Previous</button>
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg">1</button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">2</button>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">3</button>
                <span className="px-1 text-xs text-gray-400">...</span>
                <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
