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
import CustomerDashboard from './components/dashboard/customers/CustomerDashboard';
import PurchaseDashboard from './components/dashboard/purchases/PurchaseDashboard';
import ReturnDashboard from './components/dashboard/returns/ReturnDashboard';
import ExpenseDashboard from './components/dashboard/expenses/ExpenseDashboard';
import ReportsAnalyticsDashboard from './components/dashboard/analytics/ReportsAnalyticsDashboard';
import AIAssistantDashboard from './components/dashboard/AIAssistantDashboard';
import SettingsDashboard from './components/dashboard/settings/SettingsDashboard';
import SuperAdminDashboard from './components/dashboard/superadmin/SuperAdminDashboard';
import { authService } from './lib/authService';

export default function App() {
  const [view, setView] = useState<'login' | 'signup' | 'dashboard' | 'medicine' | 'inventory' | 'pos' | 'suppliers' | 'customers' | 'purchases' | 'returns' | 'expenses' | 'analytics' | 'ai_assistant' | 'settings' | 'super_admin'>(() => {
    if (authService.isAuthenticated()) {
      return authService.getRole() === 'super_admin' ? 'super_admin' : 'dashboard';
    }
    return 'login';
  });

  if (view === 'signup') return <SignupPage onBack={() => setView('login')} />;
  if (view === 'dashboard') return <Dashboard setView={setView} />;
  if (view === 'medicine') return <MedicineManagement setView={setView} />;
  if (view === 'inventory') return <InventoryDashboard setView={setView} />;
  if (view === 'pos') return <POSDashboard setView={setView} />;
  if (view === 'suppliers') return <SupplierDashboard setView={setView} />;
  if (view === 'customers') return <CustomerDashboard setView={setView} />;
  if (view === 'purchases') return <PurchaseDashboard setView={setView} />;
  if (view === 'returns') return <ReturnDashboard setView={setView} />;
  if (view === 'expenses') return <ExpenseDashboard setView={setView} />;
  if (view === 'analytics') return <ReportsAnalyticsDashboard setView={setView} />;
  if (view === 'ai_assistant') return <AIAssistantDashboard setView={setView} />;
  if (view === 'settings') return <SettingsDashboard setView={setView} />;
  if (view === 'super_admin') return <SuperAdminDashboard setView={setView} />;

  return (
    <LoginPage 
      onSignup={() => setView('signup')} 
      onLoginSuccess={() => {
        const role = authService.getRole();
        setView(role === 'super_admin' ? 'super_admin' : 'dashboard');
      }} 
    />
  );
}
