import React from 'react';

const transactions = [
  { id: '#INV-2104', customer: 'Ahmed Raza', items: 'Panadol', amount: '$148.50', status: 'Paid' },
  { id: '#INV-2103', customer: 'Fatima Noor', items: 'Amoxicillin', amount: '$284.00', status: 'Paid' },
];

export default function TransactionsTable() {
  return (
    <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Transactions</h3>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-slate-500"><th>Invoice</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-t">
              <td className="py-3 font-mono">{t.id}</td>
              <td className="py-3">{t.customer}</td>
              <td className="py-3">{t.amount}</td>
              <td className="py-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">{t.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
