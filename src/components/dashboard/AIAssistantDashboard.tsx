import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Sparkles, X, Minus, Paperclip, Mic, Send, 
  Trash2, AlertCircle, AlertTriangle, TrendingUp, TrendingDown,
  Clock, CheckCircle, ArrowRight, RefreshCw, Layers, Plus, 
  ChevronRight, Calendar, Pill, DollarSign, Search, ShieldAlert,
  Download, FileText, Check, Play, User, Users, ClipboardCheck, Info
} from 'lucide-react';
import Sidebar from './Sidebar';

// Type definitions for internal state
interface AttachmentFile {
  name: string;
  ext: string;
  size: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  cardType?: 'low_stock' | 'expiring' | 'sales_summary' | null;
  attachments?: AttachmentFile[];
  isSystem?: boolean;
}

interface DispensingItem {
  rxId: string;
  patient: string;
  medication: string;
  qty: number;
  status: 'Dispensed' | 'Pending' | 'Insurance Check';
  time: string;
}

export default function AIAssistantDashboard({ setView }: { setView: (view: any) => void }) {
  // Mobile responsive sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chat panel state
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  
  // Drag bounds and state using Framer Motion
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  // DRAGGING STATE COORDINATES OVERRIDE
  // Note: framer-motion manages its own drag state, so we can use drag constraints

  // Operational Background ERP mock data
  const [dispensings, setDispensings] = useState<DispensingItem[]>([
    { rxId: 'RX-78231', patient: 'Ahmed Khalil', medication: 'Amoxicillin 500mg', qty: 21, status: 'Dispensed', time: '10:42 AM' },
    { rxId: 'RX-78230', patient: 'Layla Mansoor', medication: 'Metformin 850mg', qty: 60, status: 'Pending', time: '10:38 AM' },
    { rxId: 'RX-78229', patient: 'Omar Radwan', medication: 'Atorvastatin 20mg', qty: 30, status: 'Insurance Check', time: '10:31 AM' },
    { rxId: 'RX-78228', patient: 'Fatima Salim', medication: 'Salbutamol Inhaler', qty: 1, status: 'Dispensed', time: '10:24 AM' },
    { rxId: 'RX-78227', patient: 'John Doe', medication: 'Lisinopril 10mg', qty: 14, status: 'Dispensed', time: '09:55 AM' },
    { rxId: 'RX-78226', patient: 'Mariam Ali', medication: 'Ibuprofen 400mg', qty: 20, status: 'Pending', time: '09:12 AM' }
  ]);

  // States for live adding of prescription in ERP backdrop
  const [showAddDispensation, setShowAddDispensation] = useState(false);
  const [newPatient, setNewPatient] = useState('');
  const [newMed, setNewMed] = useState('');
  const [newQty, setNewQty] = useState(30);

  // Active chat inputs
  const [inputValue, setInputValue] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('Online · Ready to help');
  const [isThinking, setIsThinking] = useState(false);
  
  // File attachments state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachmentFile[]>([]);

  // State for message list
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello Sarah! I'm your **PharmaAI** assistant. I can help with inventory checks, prescription queries, drug interactions, supplier lookups, and daily reports.",
      time: '10:40 AM'
    },
    {
      id: 'm1_user',
      role: 'user',
      content: "Show me low stock items today",
      time: '10:43 AM'
    },
    {
      id: 'm1_assistant',
      role: 'assistant',
      content: "I found **8 critical items** below reorder threshold. Here are the top priorities:",
      time: '10:43 AM',
      cardType: 'low_stock'
    }
  ]);

  // Chat scroller
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isMinimized, isOpen]);

  // Character counter helper
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputValue(text);
    setCharCount(text.length);
  };

  // Auto-resize search/textarea input box
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dispatch message sending sequence
  const handleSendMessage = async (customPrompt?: string) => {
    const text = (customPrompt || inputValue).trim();
    if (!text && attachedFiles.length === 0) return;

    // Clear main input
    if (!customPrompt) {
      setInputValue('');
      setCharCount(0);
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'msg_' + Date.now();
    
    // Add User message
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
      time: timeString,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined
    };

    setMessages(prev => [...prev, newUserMsg]);
    setAttachedFiles([]); // reset attachments
    setIsThinking(true);
    setStatusText('PharmaAI is thinking...');

    try {
      // Connect to full-stack Express service running real Gemini API or mock parser
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      });

      if (response.ok) {
        const data = await response.json();
        setIsThinking(false);
        setStatusText('Online · Ready to help');

        let cardType: Message['cardType'] = null;
        if (data.cardType === 'low_stock') cardType = 'low_stock';
        if (data.cardType === 'expiring') cardType = 'expiring';
        if (data.cardType === 'sales_summary') cardType = 'sales_summary';

        setMessages(prev => [...prev, {
          id: 'reply_' + Date.now(),
          role: 'assistant',
          content: data.text || "I processed your request, but could not retrieve further details.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cardType: cardType
        }]);
      } else {
        throw new Error('Server responded with error');
      }
    } catch (err) {
      // Robust client fallback logic if server is starting or backend fails
      setTimeout(() => {
        setIsThinking(false);
        setStatusText('Online · Ready to help');
        
        let replyContent = `I understand you're asking about "${text}". I can query our medication ledger and operations directly.`;
        let cardType: Message['cardType'] = null;

        const lower = text.toLowerCase();
        if (lower.includes('low stock') || lower.includes('limit') || lower.includes('alert') || lower.includes('reorder')) {
          replyContent = "I found **8 critical items** below reorder threshold. Here are the top priorities:";
          cardType = 'low_stock';
        } else if (lower.includes('expir') || lower.includes('batch') || lower.includes('expired') || lower.includes('antibiotic')) {
          replyContent = "I scanned all **142 antibiotics** in local Downtown Central stock directory. **3 batches** expire within 30 days:";
          cardType = 'expiring';
        } else if (lower.includes('sales') || lower.includes('summary') || lower.includes('revenue') || lower.includes('gross')) {
          replyContent = "Here is the sales performance and financial index metrics snapshot for today:";
          cardType = 'sales_summary';
        } else if (lower.includes('pharmacist') || lower.includes('sara') || lower.includes('who are you')) {
          replyContent = "I'm **PharmaAI**, your real-time agent built specifically for Xion Pharma. I monitor active prescriptions, pharmacy inventory compliance, insurance parameters, and supplier shipping networks.";
        } else if (lower.includes('interaction') || lower.includes('amoxicillin') || lower.includes('rx-78230')) {
          replyContent = "I performed an automated interaction check for **Rx-78230 (Metformin 850mg)**. Note that: \n\n* **No critical contraindications** exist in clinical databases for Amoxicillin & Metformin together. \n* Consider recommending vitamin B12 supplementation monitoring for Metformin long-term use. \n* Ensure patient hydration parameters are within range.";
        } else {
          replyContent = `Processed query: **${text}**. For automated medical business operations, you can easily ask me to: \n\n1. *"Show me low stock items today"* \n2. *"Show me expired batches"* \n3. *"Generate today's sales summary"* \n4. *"Check drug interactions on prescription RX-78230"*`;
        }

        setMessages(prev => [...prev, {
          id: 'reply_fallback_' + Date.now(),
          role: 'assistant',
          content: replyContent,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cardType: cardType
        }]);
      }, 1200);
    }
  };

  // Suggestion action triggers
  const handleSuggestionClick = (promptText: string) => {
    handleSendMessage(promptText);
  };

  // Simulator for simulated recording pulse
  const startVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setStatusText('Online · Ready to help');
      return;
    }

    setIsRecording(true);
    setStatusText('Listening... speak now');
    
    // Auto complete with simulated speech
    setTimeout(() => {
      setIsRecording(false);
      setStatusText('Online · Ready to help');
      setInputValue('Check expiry dates for all antibiotics');
      setCharCount(39);
    }, 2800);
  };

  // Simulator for attachment actions
  const triggerAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    
    const converted: AttachmentFile[] = files.map(f => {
      const ext = f.name.split('.').pop()?.toUpperCase() || 'FILE';
      const sizeMb = (f.size / (1024 * 1024)).toFixed(2) + ' MB';
      return {
        name: f.name,
        ext: ext.slice(0, 4),
        size: sizeMb
      };
    });

    setAttachedFiles(prev => [...prev, ...converted]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Reset/Clear messages
  const clearChatHistory = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: "👋 Conversation history reset. I am ready to handle new prescription lookups, drug interaction checks, or revenue queries.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Operations background additions
  const handleAddDispensing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient || !newMed) return;

    const newObj: DispensingItem = {
      rxId: 'RX-' + Math.floor(10000 + Math.random() * 90000),
      patient: newPatient,
      medication: newMed,
      qty: newQty,
      status: 'Pending',
      time: 'Just Now'
    };

    setDispensings(prev => [newObj, ...prev]);
    setNewPatient('');
    setNewMed('');
    setShowAddDispensation(false);

    // Notify user in system-like toast
    setHasNotif(true);
    setMessages(prev => [...prev, {
      id: 'system_' + Date.now(),
      role: 'assistant',
      content: `System Alert: Added new prescription dispensing record for **${newPatient}** in the background database ledger. Ask me if you need an automatic compliance check or drug audit!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    }]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased" ref={constraintsRef}>
      {/* Sidebar Component */}
      <Sidebar currentView="ai_assistant" setView={setView} />

      {/* Main Backing Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        
        {/* Sub Header Bar */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>PRO ERP Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
              <span>Special Operations</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
              <span className="text-slate-800 font-bold">Xion AI Core</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Integration Active
              </span>
            </div>
          </div>
        </header>

        {/* Outer background section containing the beautiful Operations Overview Mock ERP */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-28">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Operations Overview
                <span className="bg-indigo-100 text-indigo-705 text-xs font-bold px-2 rounded-lg py-0.5">Downtown Central</span>
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Centralized dispense metrics, safety parameters, and real-time inventory compliance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAddDispensation(true)}
                className="btn btn-primary bg-emerald-600 border-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Prescription</span>
              </button>
            </div>
          </div>

          {/* KPI grid of mock ERP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
              <div className="text-xs text-slate-450 font-bold uppercase tracking-wider">Active Prescriptions</div>
              <div className="text-2xl font-black text-slate-900 mt-2">1,284</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 8.2% from yesterday</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl" />
              <div className="text-xs text-slate-450 font-bold uppercase tracking-wider">Low Stock SKUs</div>
              <div className="text-2xl font-black text-slate-900 mt-2">37</div>
              <div className="text-[11px] text-red-550 font-bold mt-1.5 flex items-center gap-1 cursor-pointer" onClick={() => handleSendMessage("Show me low stock items")}>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                <span className="underline hover:text-red-750 text-amber-600">Action recommended · check AI</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
              <div className="text-xs text-slate-455 font-bold uppercase tracking-wider">Pending Approvals</div>
              <div className="text-2xl font-black text-slate-900 mt-2">12</div>
              <div className="text-[11px] text-indigo-554 font-semibold mt-1.5">3 awaiting review &gt; 24h</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
              <div className="text-xs text-slate-450 font-bold uppercase tracking-wider font-sans">Today's Revenue</div>
              <div className="text-2xl font-black text-slate-900 mt-2">$48,290</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>↑ 12% vs last week</span>
              </div>
            </div>
          </div>

          {/* Main ERP table panel */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Recent Dispensing Activity</h3>
                <p className="text-xs text-slate-400 font-sans">Real-time prescription dispensing flow monitoring</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider rounded-lg">
                <span>Database Synced</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-slate-700 text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/50 text-slate-450 uppercase font-bold text-[10px] tracking-wider">
                    <th className="px-6 py-3">Rx #</th>
                    <th className="px-6 py-3">Patient Name</th>
                    <th className="px-6 py-3">Prescribed Medication</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Time</th>
                    <th className="px-6 py-3 text-center">Interactive Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dispensings.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-3 text-indigo-701 font-mono font-bold">{item.rxId}</td>
                      <td className="px-6 py-3 font-semibold text-slate-950">{item.patient}</td>
                      <td className="px-6 py-3 font-medium text-slate-600 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{item.medication}</span>
                      </td>
                      <td className="px-6 py-3 text-center font-bold font-mono">{item.qty}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                          item.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-slate-450 font-medium">{item.time}</td>
                      <td className="px-6 py-3 text-center">
                        <button 
                          onClick={() => handleSendMessage(`Check drug interaction and verify prescription details for ${item.patient} taking ${item.medication}`)}
                          className="px-2 py-1 text-[10px] bg-slate-100 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-650 font-bold rounded-lg transition"
                        >
                          Send to AI Check
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* MODAL POPUP FOR NEW DISPENSATION BACKDROP */}
        <AnimatePresence>
          {showAddDispensation && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100"
              >
                <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-sm tracking-tight">Create Prescription Dispensing</h3>
                  </div>
                  <button onClick={() => setShowAddDispensation(false)} className="text-slate-400 hover:text-white transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddDispensing} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Patient Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sara Jones" 
                      value={newPatient} 
                      onChange={e => setNewPatient(e.target.value)} 
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Prescribed Medication</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Paracetamol 500mg" 
                      value={newMed} 
                      onChange={e => setNewMed(e.target.value)} 
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Quantity</label>
                      <input 
                        type="number" 
                        required
                        min={1} 
                        value={newQty} 
                        onChange={e => setNewQty(Number(e.target.value))} 
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Branch Location</label>
                      <input 
                        type="text" 
                        disabled 
                        value="Downtown Central" 
                        className="w-full px-3.5 py-2 bg-slate-50 text-slate-450 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddDispensation(false)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition hover:bg-slate-800"
                    >
                      Process & Record
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* FAB FLOATING ACTION TRIGGER */}
        {/* ========================================================= */}
        <button 
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setHasNotif(false);
          }}
          className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-650 text-white border-0 z-40 flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-2xl shadow-indigo-500/30 ${isOpen ? 'hidden' : 'flex animate-pulse'}`}
          aria-label="Open AI Assistant"
        >
          <Bot className="w-7 h-7" />
          {hasNotif && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
          )}
        </button>

        {/* ========================================================= */}
        {/* CHAT PANEL WITH DRAGGING AND MINIMIZING */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              drag 
              dragMomentum={false}
              dragConstraints={constraintsRef}
              dragElastic={0}
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className={`fixed z-40 bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden bottom-6 right-6 ${
                isMinimized ? 'h-16 w-80 md:w-96' : 'h-[640px] w-96 max-w-full md:w-[420px]'
              }`}
              style={{
                touchAction: 'none'
              }}
            >
              
              {/* HEADER (DRAG HANDLE) */}
              <div className="chat-header-drag bg-slate-900 border-b border-slate-800 px-4 py-3 cursor-grab active:cursor-grabbing shrink-0 flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-indigo-550 rounded-lg flex items-center justify-center text-white font-extrabold relative shadow-md shadow-emerald-500/10">
                    <Bot className="w-5 h-5" />
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-405 rounded-full border border-slate-900 animate-ping"></span>
                    <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900"></span>
                  </div>
                  <div>
                    <h3 className="text-white text-xs font-black flex items-center gap-1.5 font-sans leading-none">
                      PharmaAI Assistant
                      <span className="bg-indigo-600/30 text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      <span>{statusText}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 px-1.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-705 transition cursor-pointer"
                    title={isMinimized ? 'Expand' : 'Minimize'}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded bg-slate-800 text-slate-450 hover:text-red-400 hover:bg-slate-700 transition cursor-pointer"
                    title="Close Assistant"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* DYNAMIC CHAT AREA (ONLY SHOW IF NOT MINIMIZED) */}
              {!isMinimized && (
                <>
                  {/* CONVERSATION SCROLL CHANNEL */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((msg, index) => (
                      <div key={msg.id || index} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-black shadow-sm ${
                          msg.role === 'user' ? 'bg-gradient-to-tr from-amber-500 to-red-500 text-white' : 'bg-gradient-to-tr from-emerald-600 to-indigo-650 text-white'
                        }`}>
                          {msg.role === 'user' ? 'SM' : 'AI'}
                        </div>

                        {/* Speech Bubble */}
                        <div className="flex-1 max-w-[80%] space-y-1">
                          
                          {/* Inner formatting style */}
                          <div className={`px-3 py-2.5 text-xs inline-block leading-relaxed select-text rounded-xl ${
                            msg.role === 'user' 
                              ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm shadow-emerald-700/10' 
                              : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-sm'
                          }`}>
                            
                            {/* System Tag */}
                            {msg.isSystem && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-500 block mb-1">Synergy Database Alert</span>
                            )}

                            {/* Standard message output formatting */}
                            <p className="whitespace-pre-line">
                              {/* Simple parsing for block highlight markers to look extremely polished in React */}
                              {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-indigo-650">{part}</strong> : part)}
                            </p>

                            {/* Render suggestion buttons inside custom message bubble if index is welcome */}
                            {msg.id === 'welcome' && (
                              <div className="grid grid-cols-2 gap-2 mt-3 text-slate-800 select-none">
                                <button 
                                  onClick={() => handleSuggestionClick("Show me low stock items today")}
                                  className="p-2 border border-slate-200/50 hover:border-indigo-500 bg-white/50 text-left rounded-xl transition cursor-pointer hover:shadow-sm"
                                >
                                  <div className="w-6 h-6 bg-red-50/50 text-red-650 rounded-md flex items-center justify-center mb-1">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="font-bold text-[10.5px]">Low stock alerts</div>
                                  <p className="text-[9px] text-slate-400 mt-0.5">Priorities for reorder</p>
                                </button>
                                
                                <button 
                                  onClick={() => handleSuggestionClick("Check Amoxicillin availability")}
                                  className="p-2 border border-slate-200/50 hover:border-indigo-500 bg-white/50 text-left rounded-xl transition cursor-pointer hover:shadow-sm"
                                >
                                  <div className="w-6 h-6 bg-indigo-50 text-indigo-700 rounded-md flex items-center justify-center mb-1">
                                    <Search className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="font-bold text-[10.5px]">Check Drug Stock</div>
                                  <p className="text-[9px] text-slate-400 mt-0.5">Active ledger lookup</p>
                                </button>

                                <button 
                                  onClick={() => handleSuggestionClick("Check drug interactions for Rx-78230")}
                                  className="p-2 border border-slate-200/50 hover:border-indigo-500 bg-white/50 text-left rounded-xl transition cursor-pointer hover:shadow-sm"
                                >
                                  <div className="w-6 h-6 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center mb-1">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="font-bold text-[10.5px]">Drug Interactions</div>
                                  <p className="text-[9px] text-slate-400 mt-0.5">Clinical safety screen</p>
                                </button>

                                <button 
                                  onClick={() => handleSuggestionClick("Generate today's sales summary")}
                                  className="p-2 border border-slate-200/50 hover:border-indigo-500 bg-white/50 text-left rounded-xl transition cursor-pointer hover:shadow-sm"
                                >
                                  <div className="w-6 h-6 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center mb-1">
                                    <DollarSign className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="font-bold text-[10.5px]">Sales Summary</div>
                                  <p className="text-[9px] text-slate-400 mt-0.5">Finances performance</p>
                                </button>
                              </div>
                            )}

                          </div>

                          {/* Interactive High-Fidelity Cards within chat timeline */}
                          {msg.cardType && (
                            <div className="mt-2 text-slate-800 self-start w-full">
                              
                              {/* 1. Low stock active card */}
                              {msg.cardType === 'low_stock' && (
                                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-md mt-1.5 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-650 flex items-center justify-center">
                                      <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs">Low Stock — Critical alerts</div>
                                      <div className="text-[10px] text-slate-450">8 items below buffer target • Downtown Central</div>
                                    </div>
                                  </div>
                                  
                                  <div className="text-[11px] divide-y divide-slate-50 space-y-2">
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Insulin Glargine 100u/ml</span>
                                      <span className="font-bold text-red-650 font-mono bg-red-50 px-2 py-0.5 rounded-full text-[10px]">3 left</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Salbutamol Inhaler 100mcg</span>
                                      <span className="font-bold text-amber-605 font-mono bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">7 left</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Atorvastatin 40mg</span>
                                      <span className="font-bold text-amber-605 font-mono bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">12 left</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Paracetamol 1g tablets</span>
                                      <span className="font-bold text-amber-605 font-mono bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">18 left</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                                    <button 
                                      onClick={() => {
                                        setMessages(prev => [...prev, {
                                          id: 'sys_notif_lst_' + Date.now(),
                                          role: 'assistant',
                                          content: "Active check: Loading low-stock ledger parameters. Routing to inventory controls...",
                                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        }]);
                                        setView('inventory');
                                      }}
                                      className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 transition text-center cursor-pointer"
                                    >
                                      View all (8)
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setMessages(prev => [...prev, {
                                          id: 'sys_notif_lst_po_' + Date.now(),
                                          role: 'assistant',
                                          content: "Drafted Purchase Order #PO-9418 for Critical low stock replenishment. Directing you to Purchases section.",
                                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        }]);
                                        setView('purchases');
                                      }}
                                      className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition text-center cursor-pointer"
                                    >
                                      Create Purchase Order
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 2. Expiring batches card */}
                              {msg.cardType === 'expiring' && (
                                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-md mt-1.5 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-650 flex items-center justify-center">
                                      <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs">Expiring Soon — Antibiotics</div>
                                      <div className="text-[10px] text-slate-450">3 active batches near threshold cutoff</div>
                                    </div>
                                  </div>

                                  <div className="text-[11px] divide-y divide-slate-50 space-y-2">
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-650">Amoxicillin 500mg · batch #B-2381</span>
                                      <span className="font-bold text-red-601 bg-red-50 px-2 py-0.5 rounded text-[10px]">12 days left</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-650">Ciprofloxacin 250mg · batch #B-2394</span>
                                      <span className="font-bold text-amber-705 bg-amber-50 px-2 py-0.5 rounded text-[10px]">24 days left</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-650">Azithromycin 500mg · batch #B-2410</span>
                                      <span className="font-bold text-amber-705 bg-amber-50 px-2 py-0.5 rounded text-[10px]">28 days left</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                                    <button 
                                      onClick={() => {
                                        setMessages(prev => [...prev, {
                                          id: 'notif_ret_' + Date.now(),
                                          role: 'assistant',
                                          content: "Marked batches Amoxicillin #B-2381 for physical removal. Ready to dispatch details to Supplier return form.",
                                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        }]);
                                      }}
                                      className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 transition text-center cursor-pointer"
                                    >
                                      Mark for Return
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setMessages(prev => [...prev, {
                                          id: 'notif_ret_doc_' + Date.now(),
                                          role: 'assistant',
                                          content: "Compiled automated return paperwork. Redirecting you to returns management ledger.",
                                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        }]);
                                        setView('returns');
                                      }}
                                      className="py-1.5 px-3 bg-red-600 hover:bg-red-750 text-white rounded-lg text-[11px] font-bold transition text-center cursor-pointer"
                                    >
                                      Generate Return Form
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* 3. Daily sales summary report */}
                              {msg.cardType === 'sales_summary' && (
                                <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-md mt-1.5 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                                      <DollarSign className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-xs">Daily Sales Summary</div>
                                      <div className="text-[10px] text-slate-450">Active performance as of today's date</div>
                                    </div>
                                  </div>

                                  <div className="text-[11px] divide-y divide-slate-50 space-y-2">
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Total revenue generated / gross</span>
                                      <span className="font-bold font-mono text-slate-900">$48,290</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Prescriptions filled successfully</span>
                                      <span className="font-bold font-mono text-slate-950">187 scripts</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Counter Over-The-Counter (OTC) sales</span>
                                      <span className="font-bold font-mono text-slate-900">$12,440</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                      <span className="font-medium text-slate-600">Average ticket payout size</span>
                                      <span className="font-bold font-mono text-slate-900">$258.20</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                                    <button 
                                      onClick={() => {
                                        setMessages(prev => [...prev, {
                                          id: 'notif_rep_down_' + Date.now(),
                                          role: 'assistant',
                                          content: "Compiled Downtown Central performance PDF. Clean ledger index ready. Download started.",
                                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        }]);
                                      }}
                                      className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600 transition text-center cursor-pointer"
                                    >
                                      Export PDF Report
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setMessages(prev => [...prev, {
                                          id: 'notif_rep_an_' + Date.now(),
                                          role: 'assistant',
                                          content: "Dispatching detailed trend graph analytics in Reports room.",
                                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        }]);
                                        setView('analytics');
                                      }}
                                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition text-center cursor-pointer"
                                    >
                                      Interactive Analysis
                                    </button>
                                  </div>
                                </div>
                              )}

                            </div>
                          )}

                          {/* Print attachments on message box if user attached something */}
                          {msg.attachments && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {msg.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-slate-105 border border-slate-200 rounded px-2 py-1 text-[9.5px] font-medium text-slate-600">
                                  <span className="font-black text-indigo-700">{file.ext}</span>
                                  <span className="max-w-[120px] truncate">{file.name}</span>
                                  <span className="text-slate-400">({file.size})</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Time Stamp */}
                          <div className={`text-[10px] text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.time}
                          </div>

                        </div>
                      </div>
                    ))}

                    {/* THINKING SPINNER INDICATOR */}
                    {isThinking && (
                      <div className="flex gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 text-xs font-black animate-bounce shrink-0">
                          AI
                        </div>
                        <div className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-sans shadow-sm inline-block">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="text-[11px] mt-0.5 ml-1 text-slate-450">PharmaAI is analyzing ledger...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dummy scroll anchor */}
                    <div ref={chatEndRef} />
                  </div>

                  {/* QUICK ACCESS ACTIONS HORIZONTAL BAR */}
                  <div className="flex px-4 py-2 bg-slate-50 border-t border-b border-indigo-50 overflow-x-auto gap-2 scrollbar-none select-none shrink-0">
                    <button 
                      onClick={() => handleSuggestionClick("Reorder Paracetamol pills")}
                      className="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-full py-1.5 px-3 text-[10.5px] font-bold text-slate-600 hover:text-indigo-650 hover:border-indigo-550 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-emerald-500" />
                      Reorder
                    </button>
                    <button 
                      onClick={() => handleSuggestionClick("Today's expired batches check")}
                      className="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-full py-1.5 px-3 text-[10.5px] font-bold text-slate-600 hover:text-indigo-650 hover:border-indigo-550 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <Clock className="w-3 h-3 text-amber-500" />
                      Expiry check
                    </button>
                    <button 
                      onClick={() => handleSuggestionClick("Top 5 selling drugs this week")}
                      className="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-full py-1.5 px-3 text-[10.5px] font-bold text-slate-600 hover:text-indigo-650 hover:border-indigo-550 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <TrendingUp className="w-3 h-3 text-blue-500" />
                      Top sellers
                    </button>
                    <button 
                      onClick={() => handleSuggestionClick("Open supplier contacts information")}
                      className="flex items-center gap-1 shrink-0 bg-white border border-slate-200 rounded-full py-1.5 px-3 text-[10.5px] font-bold text-slate-600 hover:text-indigo-650 hover:border-indigo-550 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <Users className="w-3 h-3 text-indigo-500" />
                      Suppliers
                    </button>
                  </div>

                  {/* BOTTOM RECTANGLE INPUT SHUTTLE */}
                  <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    
                    {/* Attachment preview array */}
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2 px-1">
                        {attachedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 rounded-lg px-2 py-1 text-[10px] font-bold">
                            <span className="w-6 py-0.5 rounded bg-indigo-600 text-white font-extrabold text-[8px] text-center inline-block">{file.ext}</span>
                            <span className="max-w-[150px] truncate">{file.name}</span>
                            <button 
                              onClick={() => removeAttachment(idx)} 
                              className="text-indigo-400 hover:text-indigo-900 transition ml-1"
                              title="Delete file"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="relative border-2 border-slate-200 rounded-xl bg-slate-50/50 flex flex-col focus-within:border-indigo-600 focus-within:bg-white transition px-2">
                      
                      <textarea 
                        rows={1}
                        placeholder="Ask PharmaAI anything about operations, inventory..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        className="w-full bg-transparent border-0 text-slate-800 text-xs focus:ring-0 focus:outline-none py-3 resize-none pr-28 select-text"
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                      />

                      {/* Tool shuttle actions within textbox */}
                      <div className="absolute right-2 top-1.5 flex items-center gap-1 z-10">
                        <button 
                          type="button"
                          onClick={triggerAttachment}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                          title="Attach files (.pdf, .jpg, .csv)"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        
                        <button 
                          type="button"
                          onClick={startVoiceRecording}
                          className={`p-1.5 rounded-lg transition ${isRecording ? 'bg-red-100 text-red-650 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`}
                          title="Simulate Voice Input"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        <button 
                          type="submit"
                          disabled={!inputValue.trim() && attachedFiles.length === 0}
                          onClick={() => handleSendMessage()}
                          className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-200 disabled:text-slate-400 rounded-lg transition"
                          title="Send message"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* Info keys line foot */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-2 leading-none">
                      <div className="flex items-center gap-1.5">
                        <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200/60 rounded text-[9px] font-mono shadow-sm">Enter</kbd> to send</span>
                        <span className="text-slate-300">•</span>
                        <span><kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200/60 rounded text-[9px] font-mono shadow-sm">Shift</kbd>+<kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200/60 rounded text-[9px] font-mono shadow-sm">Enter</kbd> for newline</span>
                      </div>
                      <div className={`font-semibold ${charCount > 1800 ? 'text-red-550' : ''}`}>
                        {charCount} / 2000
                      </div>
                    </div>

                  </div>
                </>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden attachment handler input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept=".pdf,.jpg,.png,.csv,.xlsx" 
          onChange={handleFileChange} 
          className="hidden" 
        />

      </div>
    </div>
  );
}
