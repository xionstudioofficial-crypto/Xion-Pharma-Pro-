import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Search, Plus, Bell, MessageSquare, Download, Filter, MoreHorizontal, Phone, Mail, 
  MapPin, Calendar, Clock, CheckCircle2, ChevronLeft, ChevronRight, Users, 
  ArrowUpRight, ArrowDownRight, CreditCard, Send, PlusCircle, Activity, Heart, Bookmark,
  TrendingUp, Award, UserPlus, X, HeartPulse, Check, Settings
} from 'lucide-react';
import Sidebar from '../Sidebar';

// Recharts structures
interface RevenueDataPoint {
  name: string;
  Revenue: number;
  Patients: number;
}

const revenueData: RevenueDataPoint[] = [
  { name: 'Jan', Revenue: 28000, Patients: 180 },
  { name: 'Feb', Revenue: 32000, Patients: 210 },
  { name: 'Mar', Revenue: 29000, Patients: 195 },
  { name: 'Apr', Revenue: 38000, Patients: 240 },
  { name: 'May', Revenue: 42000, Patients: 265 },
  { name: 'Jun', Revenue: 39000, Patients: 250 },
  { name: 'Jul', Revenue: 45000, Patients: 290 },
  { name: 'Aug', Revenue: 48000, Patients: 310 },
  { name: 'Sep', Revenue: 44000, Patients: 285 },
  { name: 'Oct', Revenue: 52000, Patients: 340 },
  { name: 'Nov', Revenue: 49000, Patients: 320 },
  { name: 'Dec', Revenue: 58000, Patients: 375 },
];

const serviceDistribution = [
  { name: 'General Checkup', value: 34, color: '#0d9488' },
  { name: 'Specialist Visits', value: 28, color: '#3b82f6' },
  { name: 'Lab & Diagnostics', value: 22, color: '#f59e0b' },
  { name: 'Therapy & Rehab', value: 16, color: '#8b5cf6' },
];

const growthBarData = [
  { name: 'Jul', Patients: 290 },
  { name: 'Aug', Patients: 310 },
  { name: 'Sep', Patients: 285 },
  { name: 'Oct', Patients: 340 },
  { name: 'Nov', Patients: 320 },
  { name: 'Dec', Patients: 375 },
];

interface Patient {
  id: string;
  name: string;
  status: 'Active' | 'Pending' | 'Inactive';
  imgUrl: string;
  phone: string;
  email: string;
  address: string;
  lastVisit: string;
}

const initialPatients: Patient[] = [
  { id: 'PT-2024-0847', name: 'Margaret Wilson', status: 'Active', imgUrl: 'https://picsum.photos/seed/patient1/100/100.jpg', phone: '(555) 234-8912', email: 'm.wilson@email.com', address: '742 Evergreen Terrace, Springfield', lastVisit: 'Dec 18, 2024' },
  { id: 'PT-2024-0923', name: 'James Rodriguez', status: 'Active', imgUrl: 'https://picsum.photos/seed/patient2/100/100.jpg', phone: '(555) 876-5432', email: 'j.rodriguez@email.com', address: '1600 Pennsylvania Ave, Washington', lastVisit: 'Dec 15, 2024' },
  { id: 'PT-2024-1102', name: 'Linda Park', status: 'Pending', imgUrl: 'https://picsum.photos/seed/patient3/100/100.jpg', phone: '(555) 345-6712', email: 'l.park@email.com', address: '221B Baker Street, London', lastVisit: 'Nov 28, 2024' },
  { id: 'PT-2023-0561', name: 'Robert Thompson', status: 'Inactive', imgUrl: 'https://picsum.photos/seed/patient4/100/100.jpg', phone: '(555) 987-2345', email: 'r.thompson@email.com', address: '350 Fifth Avenue, New York', lastVisit: 'Sep 03, 2024' },
];

interface PurchaseHistoryItem {
  id: string;
  patientName: string;
  patientImg: string;
  service: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const initialPurchaseHistory: PurchaseHistoryItem[] = [
  { id: '#INV-4821', patientName: 'Margaret Wilson', patientImg: 'https://picsum.photos/seed/patient1/40/40.jpg', service: 'Annual Checkup', date: 'Dec 18, 2024', amount: 350.00, status: 'Paid' },
  { id: '#INV-4820', patientName: 'James Rodriguez', patientImg: 'https://picsum.photos/seed/patient2/40/40.jpg', service: 'Dental Cleaning', date: 'Dec 15, 2024', amount: 225.00, status: 'Paid' },
  { id: '#INV-4819', patientName: 'Emily Carter', patientImg: 'https://picsum.photos/seed/patient5/40/40.jpg', service: 'Lab Work + X-Ray', date: 'Dec 12, 2024', amount: 580.00, status: 'Pending' },
  { id: '#INV-4818', patientName: 'Linda Park', patientImg: 'https://picsum.photos/seed/patient3/40/40.jpg', service: 'Physical Therapy (3 sessions)', date: 'Dec 08, 2024', amount: 420.00, status: 'Paid' },
  { id: '#INV-4817', patientName: 'David Kim', patientImg: 'https://picsum.photos/seed/patient6/40/40.jpg', service: 'Eye Examination', date: 'Dec 05, 2024', amount: 175.00, status: 'Overdue' },
];

export default function CustomerDashboard({ setView }: { setView: (view: any) => void }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>(initialPurchaseHistory);
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending'>('All');
  const [search, setSearch] = useState('');
  
  // Modal state for Add Patient
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    status: 'Active' as 'Active' | 'Pending' | 'Inactive',
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.name || !newPatientForm.phone) {
      alert('Please fill at least name and phone');
      return;
    }
    const newId = `PT-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const formattedPatient: Patient = {
      id: newId,
      name: newPatientForm.name,
      phone: newPatientForm.phone,
      email: newPatientForm.email || 'n/a@email.com',
      address: newPatientForm.address || 'Springfield, USA',
      status: newPatientForm.status,
      imgUrl: `https://picsum.photos/seed/${newPatientForm.name}/100/100.jpg`,
      lastVisit: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date()),
    };

    setPatients([formattedPatient, ...patients]);
    
    // Add an entry in invoice history too as dummy checkup purchase
    const newInvoice: PurchaseHistoryItem = {
      id: `#INV-${Math.floor(4822 + Math.random() * 1000)}`,
      patientName: formattedPatient.name,
      patientImg: formattedPatient.imgUrl,
      service: 'Inbound Registration Checkup',
      date: formattedPatient.lastVisit,
      amount: 150.00,
      status: formattedPatient.status === 'Active' ? 'Paid' : 'Pending',
    };
    setPurchaseHistory([newInvoice, ...purchaseHistory]);

    setNewPatientForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      status: 'Active',
    });
    setShowAddModal(false);
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.id.toLowerCase().includes(search.toLowerCase()) ||
                          p.email.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && p.status === activeTab;
  });

  const filteredHistory = purchaseHistory.filter(h => 
    h.patientName.toLowerCase().includes(search.toLowerCase()) || 
    h.id.toLowerCase().includes(search.toLowerCase()) || 
    h.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Sidebar currentView="customers" setView={setView} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 py-3.5 shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={() => setView('dashboard')}>Dashboard</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-medium">Customers</span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 -mt-0.5">Customer Management</h1>
          </div>

          {/* Search Bar inside Header */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients, records, invoices..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">⌘K</kbd>
            </div>
          </div>

          {/* Right Area Actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-600">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-600">
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
            <button className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-600">
              <Settings className="w-4.5 h-4.5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm shadow-teal-600/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </header>

        {/* Dashboard Frame Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-h-screen">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-350">
                <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition duration-350 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Users className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +12.5%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">2,847</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">Total Patients</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-350">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition duration-350 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +8.2%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">1,204</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">Active This Month</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-350">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition duration-350 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    -2.1%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">$384,290</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">Revenue (MTD)</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 relative overflow-hidden group hover:shadow-md transition duration-350">
                <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-110 transition duration-350 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +3.4%
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">94.2%</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">Satisfaction Rate</p>
              </div>

            </div>

            {/* Profile Grid and Loyalty widgets */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Patient Profile Cards (Tabbed) */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Patient Profiles</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Recent newly active or updated files in CRM</p>
                  </div>
                  
                  {/* Category Status tabs: All, Active, Pending */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    {(['All', 'Active', 'Pending'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          activeTab === tab ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-540 hover:text-slate-800'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPatients.length === 0 ? (
                    <div className="col-span-2 bg-white rounded-2xl border border-slate-200/50 p-10 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-semibold">No patients found</p>
                      <p className="text-xs mt-1">Try adjusting your filters or adding a new patient</p>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredPatients.map((patient) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          key={patient.id}
                          className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start gap-4">
                              <img 
                                src={patient.imgUrl} 
                                alt={patient.name} 
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shrink-0" 
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5">
                                  <h3 className="text-sm font-bold text-slate-800 truncate" title={patient.name}>{patient.name}</h3>
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    patient.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                    patient.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                    'bg-rose-50 text-rose-500'
                                  }`}>
                                    <span className={`w-1 h-1 rounded-full ${
                                      patient.status === 'Active' ? 'bg-emerald-500' :
                                      patient.status === 'Pending' ? 'bg-amber-500' :
                                      'bg-rose-500'
                                    }`}></span>
                                    {patient.status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">ID: {patient.id}</p>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                              <div className="flex items-center gap-2.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{patient.phone}</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{patient.email}</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate block" title={patient.address}>{patient.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Last Visit</p>
                              <p className="text-xs text-slate-700 font-semibold">{patient.lastVisit}</p>
                            </div>
                            <button 
                              onClick={() => alert(`Showing mini-health profile parameters for ${patient.name} (MedCore ID ${patient.id}).\nPatient is on file and compliant.`)}
                              className="text-xs font-bold text-teal-600 hover:text-teal-700 transition flex items-center gap-1 hover:underline"
                            >
                              <span>View Profile</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* Right Sidebar widgets */}
              <div className="space-y-4">
                
                {/* Loyalty points ring custom SVG */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loyalty Points</h3>
                    <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">Tier: Gold</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="34" 
                          fill="none" 
                          stroke="url(#loyaltyGrad)" 
                          strokeWidth="6" 
                          strokeLinecap="round" 
                          strokeDasharray="213.6" 
                          strokeDashoffset="42.7" 
                        />
                        <defs>
                          <linearGradient id="loyaltyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#14b8a6" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-800">80%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-extrabold text-slate-800">12,450</p>
                      <p className="text-xs text-slate-400 mt-0.5">of 15,000 for Platinum</p>
                      <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold mt-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+1,230 pts this month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Balance Card */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">CRM Billing</h3>
                  <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-5 text-white relative overflow-hidden shadow-sm">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none"></div>
                    <p className="text-[11px] font-medium text-teal-100">Outstanding Balance</p>
                    <p className="text-3xl font-extrabold mt-1">$2,847.50</p>
                    <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-white/20">
                      <div>
                        <p className="text-[9px] text-teal-100 uppercase tracking-widest">Next Due Date</p>
                        <p className="text-xs font-bold">Jan 15, 2025</p>
                      </div>
                      <button 
                        onClick={() => alert('Launching Secure MedCore Payment Gateway integration...\nOutstanding CRM invoices verified.')}
                        className="bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition backdrop-blur-sm shadow-sm"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick actions widget */}
                <div className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => alert('Quick scheduling triggered.\nSelect patient and slot from master database appointments.')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition group text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Schedule Appointment</p>
                        <p className="text-[10px] text-slate-400">Book new clinical visit slot</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => alert('New invoice editor console loaded.\nPlease select items from the Sales / POS module.')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition group text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition">
                        <Bookmark className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Generate Invoice</p>
                        <p className="text-[10px] text-slate-400">Create checkout bill</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => alert('Compiling medical history reports...\nReady for HIPAA compliance transfer.')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition group text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-100 transition">
                        <Send className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Send Report</p>
                        <p className="text-[10px] text-slate-400">Export clinical history PDF</p>
                      </div>
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Purchase History Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition duration-300">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Purchase History</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Recent clinical checkouts, invoice receipts, and service billing records</p>
                </div>
                <div className="flex items-center gap-1.5 self-end">
                  <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                  </select>
                  <button 
                    onClick={() => alert('Exporting billing spreadsheet...\nMedCore billing reports CSV loaded.')}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition"
                  >
                    <Download className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10.5px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-5">Invoice</th>
                      <th className="py-3 px-5">Patient</th>
                      <th className="py-3 px-5">Service / Item Check</th>
                      <th className="py-3 px-5">Checkout Date</th>
                      <th className="py-3 px-5 text-right">Amount</th>
                      <th className="py-3 px-5 text-center">Status</th>
                      <th className="py-3 px-5 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-5 text-xs font-bold text-teal-600">{item.id}</td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={item.patientImg} 
                              alt={item.patientName} 
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-100" 
                            />
                            <span className="text-xs font-semibold text-slate-800">{item.patientName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-600">{item.service}</td>
                        <td className="py-3.5 px-5 text-xs text-slate-500">{item.date}</td>
                        <td className="py-3.5 px-5 text-xs font-bold text-slate-800 text-right">${item.amount.toFixed(2)}</td>
                        <td className="py-3.5 px-5 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            item.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                            item.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-500'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button 
                            onClick={() => alert(`Reviewing receipts for invoice: ${item.id}\nPatient: ${item.patientName}\nAmount: $${item.amount.toFixed(2)}`)}
                            className="p-1 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded transition"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Showing 1-{filteredHistory.length} of {purchaseHistory.length} entries</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <button className="p-1 rounded-md bg-white border border-slate-200 text-slate-400 hover:bg-slate-50" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="px-2.5 py-1 rounded-md bg-teal-600 text-white font-bold">1</button>
                  <button className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
                  <button className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Line graph: Revenue vs New Patients */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Revenue Overview</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Monthly business revenue trends versus new patient registration lines</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                      <span>Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                      <span>New Patients</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Line type="monotone" dataKey="Revenue" stroke="#0d9488" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Patients" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Service Distribution Pie Chart */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Service Distribution</h3>
                  <p className="text-xs text-slate-400 mt-0.5">CRM checkouts classified by quarterly medical categories</p>
                </div>
                
                <div className="h-44 relative my-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceDistribution}
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                    <span className="text-lg font-bold text-slate-800">MedCore</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Services</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {serviceDistribution.map(item => (
                    <div key={item.name} className="flex items-center gap-2 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="truncate">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Row: Patient Registration growth and Appointments */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Patient growth bar chart */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Patient Growth</h3>
                    <p className="text-xs text-slate-400 mt-0.5">New registration tallies by preceding month</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +18.3% YoY
                  </span>
                </div>
                
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={growthBarData} margin={{ top: 10, right: 5, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="Patients" fill="#14b8a6" radius={[6, 6, 0, 0]} maxBarSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#115e59]">Upcoming Appointments</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Assigned clinical consultations – Next 24 Hours</p>
                    </div>
                    <button 
                      onClick={() => alert('Accessing CRM master calendar scheduling records...')}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 transition"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-teal-50/50 border border-teal-100">
                      <div className="text-center min-w-[44px]">
                        <p className="text-lg font-extrabold text-teal-700 leading-none">09</p>
                        <p className="text-[10px] font-bold text-teal-500 uppercase mt-0.5">AM</p>
                      </div>
                      <div className="w-px h-10 bg-teal-200"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">Margaret Wilson</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Follow-up consultation</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Confirmed</span>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-150">
                      <div className="text-center min-w-[44px]">
                        <p className="text-lg font-extrabold text-slate-700 leading-none">10</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">AM</p>
                      </div>
                      <div className="w-px h-10 bg-slate-250"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">David Kim</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Eye examination</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-120">Pending</span>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-150">
                      <div className="text-center min-w-[44px]">
                        <p className="text-lg font-extrabold text-slate-700 leading-none">11</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">AM</p>
                      </div>
                      <div className="w-px h-10 bg-slate-250"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">Emily Carter</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Lab results review</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Confirmed</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 text-right">
                  Interactive real-time scheduling synchronizer active.
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer Area */}
        <footer className="px-8 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
          <p>MedCore CRM v3.2.1 — HIPAA Compliant Secure Server Encryption</p>
          <div className="flex items-center gap-4 mt-1 sm:mt-0">
            <a href="#" className="hover:text-teal-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-teal-600 transition">Terms of Service</a>
            <a href="#" className="hover:text-teal-600 transition">Support</a>
          </div>
        </footer>

      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <UserPlus className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Add New Patient</h3>
                    <p className="text-[10px] text-slate-400 leading-none mt-0.5">Register new CRM record entry</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="p-5 space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newPatientForm.name}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                    placeholder="e.g. Margaret Wilson"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number *</label>
                    <input 
                      type="text" 
                      required
                      value={newPatientForm.phone}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                      placeholder="e.g. (555) 234-8912"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={newPatientForm.email}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, email: e.target.value })}
                      placeholder="e.g. m.wilson@email.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Clinic Address</label>
                  <input 
                    type="text" 
                    value={newPatientForm.address}
                    onChange={(e) => setNewPatientForm({ ...newPatientForm, address: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace, Springfield"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Account CRM Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Active', 'Pending', 'Inactive'] as const).map(statusVal => (
                      <button
                        key={statusVal}
                        type="button"
                        onClick={() => setNewPatientForm({ ...newPatientForm, status: statusVal })}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                          newPatientForm.status === statusVal 
                            ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {statusVal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-teal-500/10 transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Create Record</span>
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
