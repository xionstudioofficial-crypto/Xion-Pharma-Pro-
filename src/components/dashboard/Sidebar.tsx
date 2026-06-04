import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, ClipboardList, Wallet, ShieldCheck, PieChart, BotMessageSquare, Settings, LogOut, Box, Truck, Receipt, RotateCcw } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, onClick, badge }: { icon: any, label: string, active?: boolean, onClick?: () => void, badge?: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
    <Icon className="w-5 h-5" />
    {label}
    {badge && <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

export default function Sidebar({ currentView, setView }: { currentView: string, setView: (view: any) => void }) {
  return (
    <>
      {/* 1. DESKTOP/TABLET PERMANENT SIDEBAR - Hidden on mobile screen aspect ratios */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col h-screen sticky top-0 shrink-0 select-none">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md text-white">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">Xion Pharma</h1>
            <p className="text-xs text-emerald-600 font-semibold">PRO ERP</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</p>
          <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={Receipt} label="Purchases" active={currentView === 'purchases'} onClick={() => setView('purchases')} badge="NEW" />
          <NavItem icon={RotateCcw} label="Returns" active={currentView === 'returns'} onClick={() => setView('returns')} />
          <NavItem icon={Package} label="Medicines" active={currentView === 'medicine'} onClick={() => setView('medicine')} badge="1.2k" />
          <NavItem icon={Box} label="Inventory" active={currentView === 'inventory'} onClick={() => setView('inventory')} badge="34" />
          <NavItem icon={ShoppingCart} label="Sales / POS" active={currentView === 'pos'} onClick={() => setView('pos')} />
          <NavItem icon={Users} label="Customers" active={currentView === 'customers'} onClick={() => setView('customers')} badge="2.8K" />
          <NavItem icon={Truck} label="Suppliers" active={currentView === 'suppliers'} onClick={() => setView('suppliers')} />
          <NavItem icon={ClipboardList} label="Prescriptions" />
          <NavItem icon={Wallet} label="Expenses" active={currentView === 'expenses'} onClick={() => setView('expenses')} badge="24" />
          <NavItem icon={ShieldCheck} label="Compliance" />

          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-5">Insights</p>
          <NavItem icon={PieChart} label="Reports & Analytics" active={currentView === 'analytics'} onClick={() => setView('analytics')} />
          <NavItem icon={Settings} label="Settings" active={currentView === 'settings'} onClick={() => setView('settings')} />
        </nav>

        <div className="border-t border-slate-100 p-3 space-y-2">
          {/* Left Bottom AI Assistant Launcher */}
          <button 
            onClick={() => setView('ai_assistant')}
            className={`w-full flex items-center justify-between p-2 rounded-xl transition border cursor-pointer ${
              currentView === 'ai_assistant' 
                ? 'bg-gradient-to-tr from-emerald-600 to-indigo-650 text-white border-transparent shadow-md shadow-emerald-600/10' 
                : 'bg-slate-50 border-slate-150 hover:bg-indigo-50/50 hover:border-indigo-150 text-slate-705'
            }`}
            title="PharmaAI Assistant"
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${currentView === 'ai_assistant' ? 'bg-white/20' : 'bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white'}`}>
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className={`text-[11px] font-bold leading-none ${currentView === 'ai_assistant' ? 'text-white' : 'text-slate-800'}`}>PharmaAI Assistant</p>
                <p className={`text-[9px] mt-0.5 leading-none ${currentView === 'ai_assistant' ? 'text-emerald-100' : 'text-indigo-600 font-semibold'}`}>Xion AI Core Active</p>
              </div>
            </div>
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </button>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            <img src="https://i.pravatar.cc/40?img=12" className="w-9 h-9 rounded-full ring-2 ring-emerald-200" alt="user" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Dr. Sarah Khan</p>
              <p className="text-xs text-slate-500 truncate">Pharmacist</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* 2. ADAPTIVE MOBILE BOTTOM NAVIGATION BAR - Visible on screen dimension layouts < xl/lg */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-45 bg-white border-t border-slate-200 pb-safe lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04),0_-1px_4px_rgba(0,0,0,0.02)] select-none"
        role="navigation" 
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch justify-around px-2 pt-2.5 pb-2">
          {/* Home Tab */}
          <button 
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative transition-all duration-200 ${
              currentView === 'dashboard' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {currentView === 'dashboard' && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
            )}
            <LayoutDashboard className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-bold tracking-tight">Home</span>
          </button>

          {/* Billing (Sales / POS) Tab */}
          <button 
            onClick={() => setView('pos')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative transition-all duration-200 ${
              currentView === 'pos' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {currentView === 'pos' && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
            )}
            <ShoppingCart className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-bold tracking-tight">Billing</span>
          </button>

          {/* Inventory Tab */}
          <button 
            onClick={() => setView('inventory')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative transition-all duration-200 ${
              currentView === 'inventory' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {currentView === 'inventory' && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
            )}
            <Package className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-bold tracking-tight">Inventory</span>
          </button>

          {/* Analytics Tab */}
          <button 
            onClick={() => setView('analytics')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative transition-all duration-200 ${
              currentView === 'analytics' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {currentView === 'analytics' && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
            )}
            <PieChart className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-bold tracking-tight">Analytics</span>
          </button>

          {/* Settings Tab */}
          <button 
            onClick={() => setView('settings')}
            className={`flex flex-col items-center gap-1.5 py-1 px-3.5 relative transition-all duration-200 ${
              currentView === 'settings' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {currentView === 'settings' && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
            )}
            <Settings className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-bold tracking-tight">Settings</span>
          </button>
        </div>
      </nav>

      {/* 3. FLOATING ACTION BUTTON FOR AI SERVICE - Activates the AI Assistant */}
      {currentView !== 'ai_assistant' && (
        <div className="fixed bottom-24 right-5 z-45 lg:hidden">
          <button 
            onClick={() => setView('ai_assistant')} 
            className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-603 hover:to-emerald-703 shadow-lg hover:shadow-emerald-500/25 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 animate-bounce"
            title="Launch Xion AI Assistant"
          >
            <BotMessageSquare className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
