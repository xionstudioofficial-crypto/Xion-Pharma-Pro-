import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Building, User, Mail, Phone, Lock, ChevronRight, Check, ChevronLeft } from 'lucide-react';

export default function SignupPage({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    pharmacyName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    plan: 'starter',
    terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passMatch, setPassMatch] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Password Strength
    const val = formData.password;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setPasswordStrength(score);

    // Pass match
    setPassMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (v.length > 6) v = `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
    else if (v.length > 3) v = `(${v.slice(0, 3)}) ${v.slice(3)}`;
    else if (v.length > 0) v = `(${v}`;
    setFormData(prev => ({ ...prev, phone: v }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-800 font-sans">
      <div className="min-h-screen grid lg:grid-cols-[1.05fr_1.3fr]">
        <aside className="hidden lg:flex flex-col bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-white p-10 relative overflow-hidden">
          {/* Brand/Hero content simplified */}
          <div className="relative z-10 flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">X</div>
            <div>
              <p className="font-semibold">Xion Pharma Pro</p>
              <p className="text-xs text-emerald-100">Enterprise Pharmacy OS</p>
            </div>
          </div>
          <h1 className="text-5xl font-serif leading-tight">Pharmacy operations, perfected.</h1>
        </aside>

        <main className="flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-[720px] bg-white rounded-[28px] shadow-lg border border-slate-200">
            <header className="px-10 pt-10 pb-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create your pharmacy account</h2>
                <p className="mt-2 text-slate-600">Start your free trial today.</p>
              </div>
              <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeft/></button>
            </header>

            <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1">Pharmacy Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input className="w-full pl-10 pr-3 h-12 rounded-xl border border-slate-300 focus:ring-4 focus:ring-emerald-100" 
                      value={formData.pharmacyName} onChange={e => setFormData(prev => ({...prev, pharmacyName: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Owner Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input className="w-full pl-10 pr-3 h-12 rounded-xl border border-slate-300 focus:ring-4 focus:ring-emerald-100"
                      value={formData.ownerName} onChange={e => setFormData(prev => ({...prev, ownerName: e.target.value}))} />
                  </div>
                </div>
              </div>

              {/* Email / Phone */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1">Work Email</label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                     <input className="w-full pl-10 pr-3 h-12 rounded-xl border border-slate-300 focus:ring-4 focus:ring-emerald-100"
                        type="email" value={formData.email} onChange={e => setFormData(prev => ({...prev, email: e.target.value}))} />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input className="w-full pl-10 pr-3 h-12 rounded-xl border border-slate-300 focus:ring-4 focus:ring-emerald-100"
                            value={formData.phone} onChange={handlePhone} />
                    </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-1">Password</label>
                  <div className="relative">
                     <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                     <input type={showPassword ? 'text' : 'password'} className="w-full pl-10 pr-11 h-12 rounded-xl border border-slate-300 focus:ring-4 focus:ring-emerald-100"
                        value={formData.password} onChange={e => setFormData(prev => ({...prev, password: e.target.value}))} />
                     <button type="button" className="absolute right-3 top-3 text-slate-500" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
                  <div className="mt-2 flex gap-1.5 ">
                      {[1,2,3,4].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= passwordStrength ? 'bg-emerald-600' : 'bg-slate-200'}`} />)}
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input type={showConfirmPassword ? 'text' : 'password'} className={`w-full pl-10 pr-11 h-12 rounded-xl border ${passMatch ? 'border-slate-300' : 'border-red-500'} focus:ring-4 focus:ring-emerald-100`}
                          value={formData.confirmPassword} onChange={e => setFormData(prev => ({...prev, confirmPassword: e.target.value}))} />
                        <button type="button" className="absolute right-3 top-3 text-slate-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
              </div>

              <button type="submit" className="w-full h-13 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
                Create account & start free trial
              </button>
            </form>
          </div>

          {/* Success Modal */}
          {showSuccess && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-8 text-center max-w-sm">
                    <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4"><Check size={32} className="text-emerald-600" /></div>
                    <h3 className="text-2xl font-bold">Welcome!</h3>
                    <button onClick={() => setShowSuccess(false)} className="mt-6 w-full h-12 rounded-xl bg-slate-900 text-white">Go to Dashboard</button>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
