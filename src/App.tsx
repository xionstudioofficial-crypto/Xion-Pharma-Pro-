/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/dashboard/Dashboard';
import MedicineManagement from './components/dashboard/medicine/MedicineManagement';
import InventoryDashboard from './components/dashboard/inventory/InventoryDashboard';
import POSDashboard from './components/dashboard/pos/POSDashboard';
import SupplierDashboard from './components/dashboard/suppliers/SupplierDashboard';

export default function App() {
  const [view, setView] = useState<'login' | 'signup' | 'dashboard' | 'medicine' | 'inventory' | 'pos' | 'suppliers'>('login');

  if (view === 'signup') return <SignupPage onBack={() => setView('login')} />;
  if (view === 'dashboard') return <Dashboard setView={setView} />;
  if (view === 'medicine') return <MedicineManagement setView={setView} />;
  if (view === 'inventory') return <InventoryDashboard setView={setView} />;
  if (view === 'pos') return <POSDashboard setView={setView} />;
  if (view === 'suppliers') return <SupplierDashboard setView={setView} />;
  return <LoginPage onSignup={() => setView('signup')} onLoginSuccess={() => setView('dashboard')} />;
}
