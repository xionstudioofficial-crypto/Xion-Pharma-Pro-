import React from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200/70">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-8 py-3">
        <div className="flex items-center gap-3 flex-1">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search medicines, customers, invoices..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-slate-100">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <HelpCircle className="w-5 h-5 text-slate-600" />
        </div>
      </div>
    </header>
  );
}
