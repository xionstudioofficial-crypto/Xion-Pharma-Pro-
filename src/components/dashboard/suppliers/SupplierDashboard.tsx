import React, { useState } from 'react';
import { 
  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell, BarChart
} from 'recharts';
import { 
  Search, Plus, Bell, MessageSquare, Download, Filter, MoreHorizontal, Phone, Mail, 
  ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, CheckCircle2, Clock, 
  AlertTriangle, CreditCard, Users, FileText, Activity
} from 'lucide-react';
import Sidebar from '../Sidebar';

const spendData = [
  { name: 'Jan', Spend: 320, Orders: 140 },
  { name: 'Feb', Spend: 410, Orders: 165 },
  { name: 'Mar', Spend: 380, Orders: 150 },
  { name: 'Apr', Spend: 450, Orders: 180 },
  { name: 'May', Spend: 520, Orders: 200 },
  { name: 'Jun', Spend: 480, Orders: 190 },
  { name: 'Jul', Spend: 560, Orders: 220 },
  { name: 'Aug', Spend: 610, Orders: 240 },
  { name: 'Sep', Spend: 540, Orders: 210 },
  { name: 'Oct', Spend: 490, Orders: 195 },
  { name: 'Nov', Spend: 580, Orders: 230 },
  { name: 'Dec', Spend: 620, Orders: 250 },
];

const ledgerDonutData = [
  { name: 'Pharmaceuticals', value: 48, color: '#2563eb' },
  { name: 'Equipment', value: 29, color: '#0d9488' },
  { name: 'Consumables', value: 23, color: '#d97706' },
];

const categoryBarData = [
  { name: 'Q1', Pharma: 35, Equipment: 12, Consumables: 8 },
  { name: 'Q2', Pharma: 42, Equipment: 14, Consumables: 10 },
  { name: 'Q3', Pharma: 38, Equipment: 16, Consumables: 9 },
  { name: 'Q4', Pharma: 45, Equipment: 15, Consumables: 11 },
];

const suppliersData = [
  { id: '1', initials: 'MH', name: 'MediHealth Labs', code: 'SUP-001', category: 'Pharmaceuticals', catColor: 'text-purple-600 bg-purple-100', contactName: 'Dr. James Wilson', contactEmail: 'james@medihealth.com', orders: 342, spend: '$892,450', status: 'Active', statusColor: 'text-emerald-600 bg-emerald-50', statusDot: 'bg-emerald-500', avatarColor: 'from-blue-600 to-blue-400' },
  { id: '2', initials: 'PD', name: 'PharmaDistro Inc.', code: 'SUP-002', category: 'Pharmaceuticals', catColor: 'text-purple-600 bg-purple-100', contactName: 'Lisa Chen', contactEmail: 'lisa@pharmadistro.com', orders: 287, spend: '$756,200', status: 'Active', statusColor: 'text-emerald-600 bg-emerald-50', statusDot: 'bg-emerald-500', avatarColor: 'from-teal-600 to-teal-400' },
  { id: '3', initials: 'EQ', name: 'EquipMed Solutions', code: 'SUP-003', category: 'Medical Equipment', catColor: 'text-teal-600 bg-teal-50', contactName: 'Robert Taylor', contactEmail: 'robert@equipmed.com', orders: 98, spend: '$1,234,800', status: 'Active', statusColor: 'text-emerald-600 bg-emerald-50', statusDot: 'bg-emerald-500', avatarColor: 'from-indigo-600 to-purple-500' },
  { id: '4', initials: 'CS', name: 'CareSupply Group', code: 'SUP-004', category: 'Consumables', catColor: 'text-amber-600 bg-amber-50', contactName: 'Amanda Foster', contactEmail: 'amanda@caresupply.com', orders: 456, spend: '$345,670', status: 'Pending Review', statusColor: 'text-amber-600 bg-amber-50', statusDot: 'bg-amber-500', avatarColor: 'from-amber-500 to-yellow-400' },
  { id: '5', initials: 'GW', name: 'Global Wellness Pharma', code: 'SUP-005', category: 'Pharmaceuticals', catColor: 'text-purple-600 bg-purple-100', contactName: 'Dr. Michael Brown', contactEmail: 'michael@globalwellness.com', orders: 198, spend: '$567,890', status: 'Active', statusColor: 'text-emerald-600 bg-emerald-50', statusDot: 'bg-emerald-500', avatarColor: 'from-rose-500 to-red-400' },
  { id: '6', initials: 'SC', name: 'SteriCare Corp', code: 'SUP-006', category: 'Medical Equipment', catColor: 'text-teal-600 bg-teal-50', contactName: 'Katherine Lee', contactEmail: 'katherine@stericare.com', orders: 134, spend: '$412,300', status: 'Inactive', statusColor: 'text-slate-500 bg-slate-100', statusDot: 'bg-slate-400', avatarColor: 'from-purple-500 to-purple-300' },
];

export default function SupplierDashboard({ setView }: { setView: (view: 'dashboard' | 'medicine' | 'inventory' | 'pos' | 'suppliers') => void }) {
  const [search, setSearch] = useState('');

  const filteredSuppliers = suppliersData.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Sidebar currentView="suppliers" setView={setView} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Supplier Management</h1>
            <p className="text-sm text-slate-500">Manage your pharmaceutical suppliers & purchase orders</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto space-y-7">

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search suppliers, PO numbers, contacts..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                    <option>All Categories</option>
                    <option>Pharmaceuticals</option>
                    <option>Medical Equipment</option>
                  </select>
                  <select className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                    <option>All Status</option>
                    <option>Active</option>
                  </select>
                  <select className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                    <option>This Year</option>
                    <option>Last Year</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition">
                    <Plus className="w-4 h-4" /> Add Supplier
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-transparent hover:border-blue-200 cursor-pointer transition">
                  All Suppliers
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-transparent hover:border-slate-200 cursor-pointer transition">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Only
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-transparent hover:border-slate-200 cursor-pointer transition">
                  High Value ({'>'}$50K)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-transparent hover:border-slate-200 cursor-pointer transition">
                  Preferred
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-transparent hover:border-slate-200 cursor-pointer transition">
                  <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alert
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-t-4 border-t-blue-500 hover:shadow-md transition">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-5 h-5" /></div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">↑ 12.5%</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">248</div>
                <div className="text-sm font-medium text-slate-500">Total Active Suppliers</div>
              </div>
              
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-t-4 border-t-teal-500 hover:shadow-md transition">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">↑ 8.3%</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">1,842</div>
                <div className="text-sm font-medium text-slate-500">Purchase Orders (YTD)</div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 hover:shadow-md transition">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
                  <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">↑ 23.1%</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">$4.2M</div>
                <div className="text-sm font-medium text-slate-500">Total Spend (YTD)</div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-t-4 border-t-indigo-500 hover:shadow-md transition">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
                  <span className="text-xs font-semibold px-2 py-1 bg-rose-50 text-rose-600 rounded-md">↓ 2.1%</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">96.8%</div>
                <div className="text-sm font-medium text-slate-500">Delivery On-Time Rate</div>
              </div>
            </div>

            {/* Chart + Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Monthly Spend Overview</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Supplier payments over the last 12 months</p>
                  </div>
                  <select className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                    <option>This Year</option>
                  </select>
                </div>
                <div className="p-5">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={spendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `$${val}K`} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Bar yAxisId="left" dataKey="Spend" fill="#bfdbfe" radius={[4, 4, 0, 0]} barSize={32} />
                        <Line yAxisId="right" type="monotone" dataKey="Orders" stroke="#0f766e" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Payment Status</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Current payment summary</p>
                  </div>
                  <button className="text-xs text-slate-500 hover:text-slate-700">View All</button>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-3.5">
                  <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 text-center flex-1 flex flex-col items-center justify-center hover:shadow-sm transition">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="text-xl font-extrabold text-emerald-600 mb-0.5">$1.8M</div>
                    <div className="text-xs font-medium text-slate-500">Paid Invoices (186)</div>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 text-center flex-1 flex flex-col items-center justify-center hover:shadow-sm transition">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-xl font-extrabold text-amber-600 mb-0.5">$624K</div>
                    <div className="text-xs font-medium text-slate-500">Pending Payments (47)</div>
                  </div>
                  <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 text-center flex-1 flex flex-col items-center justify-center hover:shadow-sm transition">
                    <div className="w-10 h-10 rounded-lg bg-rose-500 text-white flex items-center justify-center mb-2">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="text-xl font-extrabold text-rose-600 mb-0.5">$89K</div>
                    <div className="text-xs font-medium text-slate-500">Overdue Invoices (11)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Supplier Directory</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Showing {filteredSuppliers.length} active suppliers across all categories</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="py-3 px-4 w-12"><input type="checkbox" className="rounded accent-blue-600" /></th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Supplier</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spend</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredSuppliers.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4"><input type="checkbox" className="rounded accent-blue-600" /></td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                              {s.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{s.name}</div>
                              <div className="text-[11px] text-slate-400">{s.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${s.catColor}`}>
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-[13px] text-slate-800">{s.contactName}</div>
                          <div className="text-[11px] text-slate-400">{s.contactEmail}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-800">{s.orders}</strong>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800">{s.spend}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${s.statusColor}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.statusDot}`}></span> {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                <div>Showing 1-{filteredSuppliers.length} of {suppliersData.length} suppliers</div>
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-400 disabled:opacity-50" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-md bg-blue-600 text-white font-semibold">1</button>
                  <button className="w-8 h-8 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-semibold">2</button>
                  <span className="px-1 text-slate-400">...</span>
                  <button className="w-8 h-8 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Ledger Insights */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Supplier Ledger Insights</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Recent financial activities</p>
                  </div>
                  <button className="text-xs text-slate-500 hover:text-slate-700">Export</button>
                </div>
                <div className="p-5">
                  <div className="h-48 relative mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={ledgerDonutData} innerRadius="65%" outerRadius="90%" paddingAngle={2} dataKey="value" stroke="none">
                          {ledgerDonutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-2xl font-extrabold text-slate-900 leading-tight">$4.2M</div>
                      <div className="text-[11px] font-medium text-slate-500">Total Ledger</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 flex-wrap mb-5">
                    {ledgerDonutData.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }}></div>
                        {d.name} ({d.value}%)
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-800">Payment — MediHealth Labs</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Dec 18, 2024 · Invoice #INV-4521</div>
                      </div>
                      <div className="font-bold text-sm text-emerald-600">+$24,580</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <ArrowDownRight className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-800">Outstanding — EquipMed Solutions</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Dec 15, 2024 · Invoice #INV-4518</div>
                      </div>
                      <div className="font-bold text-sm text-rose-600">-$67,340</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-800">Credit Note — PharmaDistro</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Dec 14, 2024 · CN-892</div>
                      </div>
                      <div className="font-bold text-sm text-emerald-600">+$3,200</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Order Tracking */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Purchase Order Tracking</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Recent orders awaiting processing</p>
                  </div>
                  <button className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">View All</button>
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-3">
                    
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition cursor-pointer hover:shadow-sm">
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-bold shrink-0">PO-1842</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-slate-800 truncate">MediHealth Labs</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">56 items · Dec 18, 2024</div>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-emerald-500 h-full w-full"></div>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hidden sm:block">Delivered</div>
                      <div className="font-bold text-sm text-slate-900 shrink-0">$24,580</div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition cursor-pointer hover:shadow-sm">
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-bold shrink-0">PO-1841</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-slate-800 truncate">PharmaDistro Inc.</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">34 items · Dec 16, 2024</div>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-blue-500 h-full w-[65%]"></div>
                      </div>
                      <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hidden sm:block">Processing</div>
                      <div className="font-bold text-sm text-slate-900 shrink-0">$18,920</div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition cursor-pointer hover:shadow-sm">
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-bold shrink-0">PO-1840</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-slate-800 truncate">EquipMed Solutions</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">12 items · Dec 15, 2024</div>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-amber-500 h-full w-[30%]"></div>
                      </div>
                      <div className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded hidden sm:block">In Transit</div>
                      <div className="font-bold text-sm text-slate-900 shrink-0">$67,340</div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition cursor-pointer hover:shadow-sm">
                      <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-bold shrink-0">PO-1839</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] text-slate-800 truncate">CareSupply Group</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">78 items · Dec 14, 2024</div>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-blue-500 h-full w-[85%]"></div>
                      </div>
                      <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hidden sm:block">Processing</div>
                      <div className="font-bold text-sm text-slate-900 shrink-0">$8,450</div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
