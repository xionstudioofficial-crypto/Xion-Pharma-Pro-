import React from 'react';
import { Package, TrendingUp, AlertTriangle, AlertOctagon, Wallet, Users } from 'lucide-react';

const KPICard = ({ icon: Icon, title, value, sub, iconBg, iconColor, trendColor }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <span className={`text-xs font-semibold ${trendColor === 'red' ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'} px-2 py-0.5 rounded-full`}>
        {trendColor === 'red' ? <AlertOctagon className="w-3 h-3 inline" /> : <TrendingUp className="w-3 h-3 inline" />}
        {" 12%"}
      </span>
    </div>
    <p className="mt-3 text-xs text-slate-500 font-medium">{title}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
  </div>
);

export default function KPIGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard icon={TrendingUp} title="Total Sales" value="$248,950" sub="vs last month" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      <KPICard icon={Package} title="Medicines" value="1,284" sub="62 categories" iconBg="bg-blue-50" iconColor="text-blue-600" />
      <KPICard icon={AlertTriangle} title="Low Stock" value="47" sub="needs reorder" iconBg="bg-amber-50" iconColor="text-amber-600" trendColor="red" />
      <KPICard icon={AlertOctagon} title="Expiring" value="23" sub="30 days" iconBg="bg-rose-50" iconColor="text-rose-600" trendColor="red" />
      <KPICard icon={Wallet} title="Profit" value="$84,210" sub="33.8% margin" iconBg="bg-violet-50" iconColor="text-violet-600" />
      <KPICard icon={Users} title="Customers" value="8,432" sub="+127 this week" iconBg="bg-cyan-50" iconColor="text-cyan-600" />
    </div>
  );
}
