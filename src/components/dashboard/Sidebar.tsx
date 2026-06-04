import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, ClipboardList, Wallet, ShieldCheck, PieChart, BotMessageSquare, Settings, LogOut, Box } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, onClick, badge }: { icon: any, label: string, active?: boolean, onClick?: () => void, badge?: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
    <Icon className="w-5 h-5" />
    {label}
    {badge && <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

export default function Sidebar({ currentView, setView }: { currentView: string, setView: (view: 'dashboard' | 'medicine' | 'inventory' | 'pos') => void }) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
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
        <NavItem icon={Package} label="Medicines" active={currentView === 'medicine'} onClick={() => setView('medicine')} badge="1.2k" />
        <NavItem icon={Box} label="Inventory" active={currentView === 'inventory'} onClick={() => setView('inventory')} badge="34" />
        <NavItem icon={ShoppingCart} label="Sales / POS" active={currentView === 'pos'} onClick={() => setView('pos')} />
        <NavItem icon={Users} label="Suppliers" active={currentView === 'suppliers'} onClick={() => setView('suppliers')} />
        <NavItem icon={ClipboardList} label="Prescriptions" />
        <NavItem icon={Wallet} label="Finance" />
        <NavItem icon={ShieldCheck} label="Compliance" />

        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-5">Insights</p>
        <NavItem icon={PieChart} label="Analytics" />
        <NavItem icon={BotMessageSquare} label="AI Assistant" badge="NEW" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      <div className="border-t border-slate-100 p-3">
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
  );
}
