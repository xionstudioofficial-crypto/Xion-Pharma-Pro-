import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, X } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('xion_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let valid = true;
    if (!email) { setEmailError('Please enter your email address.'); valid = false; }
    else if (!validateEmail(email)) { setEmailError('Enter a valid email (e.g., you@company.com).'); valid = false; }

    if (!password) { setPasswordError('Please enter your password.'); valid = false; }
    else if (password.length < 8) { setPasswordError('Password must be at least 8 characters.'); valid = false; }

    if (!valid) return;

    if (remember) localStorage.setItem('xion_remember_email', email);
    else localStorage.removeItem('xion_remember_email');

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setIsLoading(false);
    alert('Demo: Authentication not connected.');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F3] font-sans text-[#1E1E1E] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Placeholder for header and remaining content structure based on provided design... */}
        {/* Simplified for now, will expand as needed. */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F7A5A] flex items-center justify-center">
            <span className="text-white text-xl">X</span>
          </div>
          <h1 className="text-sm font-semibold text-[#1E1E1E]">Xion Pharma Pro</h1>
        </div>
        
        <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1F7A5A] outline-none" />
              {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1F7A5A] outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-600 mt-1">{passwordError}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#1F7A5A] text-white rounded-lg font-medium hover:bg-[#1a664c] transition">
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
