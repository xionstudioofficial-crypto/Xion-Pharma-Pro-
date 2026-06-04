import React from 'react';

const products = [
  { name: 'Panadol Extra', sales: '$12,480' },
  { name: 'Vitamin D3', sales: '$9,820' },
];

export default function TopProducts() {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Top Medicines</h3>
      <div className="space-y-3">
        {products.map(p => (
            <div key={p.name} className="flex justify-between items-center text-sm">
                <span>{p.name}</span>
                <span className="font-semibold">{p.sales}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
