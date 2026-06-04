import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AlertPanel() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Alerts</h3>
      <div className="space-y-3">
        <div className="p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5"/> Critical Stock Alert
        </div>
      </div>
    </div>
  );
}
