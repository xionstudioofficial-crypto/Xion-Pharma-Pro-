import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import KPIGrid from './KPIGrid';
import SalesChartContainer from './SalesChartContainer';
import AIWidget from './AIWidget';
import InventoryWidget from './InventoryWidget';
import TransactionsTable from './TransactionsTable';
import AlertPanel from './AlertPanel';
import TopProducts from './TopProducts';

export default function Dashboard({ setView }: { setView: (view: 'dashboard' | 'medicine' | 'inventory' | 'pos') => void }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView="dashboard" setView={setView} />
      <div className="flex-1 min-w-0">
        <TopNav />
        <main className="p-4 lg:p-8 space-y-6">
          <KPIGrid />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <SalesChartContainer />
            <AIWidget />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <InventoryWidget />
            <TransactionsTable />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AlertPanel />
            <TopProducts />
          </div>

          <footer className="pt-4 pb-2 text-center text-xs text-slate-400">
            © 2026 Xion Pharma Pro · Built with precision for modern pharmacies
          </footer>
        </main>
      </div>
    </div>
  );
}
