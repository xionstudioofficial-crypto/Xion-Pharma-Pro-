import React from 'react';
import { Bot, MessageSquare } from 'lucide-react';

export default function AIWidget() {
  return (
    <div className="bg-emerald-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <h3 className="font-bold flex items-center gap-2 mb-4"><Bot className="w-5 h-5"/> Xion AI</h3>
        <p className="text-sm text-white/90 mb-4">"Paracetamol 500mg stock will deplete in 4 days. Suggested reorder: 200 units."</p>
        <div className="relative">
          <input type="text" placeholder="Ask Xion AI..." className="w-full pl-4 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm placeholder-white/60" />
        </div>
    </div>
  );
}
