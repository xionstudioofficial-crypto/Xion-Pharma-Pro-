import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', Online: 18000, InStore: 12000 },
  { name: 'Feb', Online: 22000, InStore: 14500 },
  { name: 'Mar', Online: 19500, InStore: 13000 },
  { name: 'Apr', Online: 24000, InStore: 16000 },
  { name: 'May', Online: 28000, InStore: 18500 },
  { name: 'Jun', Online: 26500, InStore: 17500 },
  { name: 'Jul', Online: 31000, InStore: 20000 },
  { name: 'Aug', Online: 33500, InStore: 21500 },
  { name: 'Sep', Online: 30000, InStore: 19500 },
  { name: 'Oct', Online: 36500, InStore: 23500 },
  { name: 'Nov', Online: 39000, InStore: 25000 },
  { name: 'Dec', Online: 42500, InStore: 27000 },
];

export default function SalesChartContainer() {
  return (
    <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Sales Overview</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip />
            <Line type="monotone" dataKey="Online" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{r: 6}} />
            <Line type="monotone" dataKey="InStore" stroke="#cbd5e1" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
