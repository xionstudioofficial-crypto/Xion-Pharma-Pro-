import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { authService } from '../lib/authService';

const loginSchema = z.object({
  email: z.string().email("Enter a valid email (e.g., you@company.com)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage({ onSignup, onLoginSuccess }: { onSignup: () => void, onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const savedEmail = localStorage.getItem("xion_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      if (errors.email) setEmailError(errors.email[0]);
      if (errors.password) setPasswordError(errors.password[0]);
      return;
    }

    if (remember) localStorage.setItem("xion_remember_email", email);
    else localStorage.removeItem("xion_remember_email");

    setIsLoading(true);
    try {
      await authService.login(email, password);
      onLoginSuccess();
    } catch (error) {
      setPasswordError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_25%_10%,rgba(16,185,129,.16)_0%,rgba(16,185,129,0)_42%),radial-gradient(circle_at_70%_30%,rgba(16,185,129,.12)_0%,rgba(16,185,129,0)_40%),radial-gradient(circle_at_40%_90%,rgba(2,132,199,.08)_0%,rgba(2,132,199,0)_45%),linear-gradient(to bottom,rgba(255,255,255,1)_0%,rgba(250,252,255,1)_100%)] font-sans text-slate-900">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http:%2F%2Fwww.w3.org%2F2000%2Fsvg%27 width=%27160%27 height=%27160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.85%27 numOctaves=%273%27 stitchTiles=%27stitch%27%2F%3E%3C%2Ffilter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27 opacity=%27.38%27%2F%3E%3C%2Fsvg%3E')] bg-[length:160px_160px]"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <header className="flex items-center justify-between">
            <a href="#" className="group inline-flex items-center gap-3 rounded-xl px-2 py-1.5">
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-[0_10px_30px_rgba(2,6,23,.10),0_2px_8px_rgba(2,6,23,.05)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2.5c3.2 0 5.8 2.6 5.8 5.8 0 4.55-5.8 12.2-5.8 12.2S6.2 12.85 6.2 8.3C6.2 5.1 8.8 2.5 12 2.5Z" fill="rgba(255,255,255,.92)"/>
                  <path d="M10.2 7.6h3.6v2.0h2.0v3.6h-2.0v2.0h-3.6v-2.0h-2.0V9.6h2.0v-2.0Z" fill="#059669"/>
                </svg>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white ring-4 ring-emerald-600"></span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight text-slate-900">Xion Pharma Pro</div>
                <div className="text-xs text-slate-500">Pharmacy ERP Platform</div>
              </div>
            </a>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-500">Need help?</span>
              <a className="text-xs font-semibold text-emerald-700 hover:text-emerald-800" href="#">Contact support</a>
            </div>
          </header>

          <main className="mt-6 sm:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
            <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_10px_30px_rgba(2,6,23,.10),0_2px_8px_rgba(2,6,23,.05)]">
              <div className="absolute inset-0">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl"></div>
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:18px_18px] opacity-50"></div>
              </div>

              <div className="relative p-6 sm:p-10 lg:p-12 h-full flex flex-col">
                <div className="max-w-xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                    Secure • Compliant • Built for enterprise pharmacies
                  </p>

                  <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
                    Run your pharmacy operations with clarity and control.
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                    Xion Pharma Pro centralizes inventory, billing, procurement, and compliance—so your team can focus on patient care.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative">
              <div className="lg:sticky lg:top-10">
                <div className="bg-[rgba(255,255,255,0.72)] backdrop-blur-[18px] rounded-3xl shadow-[0_10px_30px_rgba(2,6,23,.10),0_2px_8px_rgba(2,6,23,.05)] ring-1 ring-white/50 overflow-hidden">
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Sign in to your Xion Pharma Pro workspace.
                    </p>

                    <button type="button" onClick={onLoginSuccess} className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-3 font-semibold text-sm hover:bg-slate-50 transition">
                      <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.86 2.08-1.82 2.74v2.24h2.9c1.69-1.57 2.68-3.88 2.68-6.62Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.81.54-1.85.86-3.06.86-2.34 0-4.32-1.58-5.02-3.7H1.02v2.3C2.5 15.65 5.48 18 9 18Z" fill="#34A853"/><path d="M3.98 10.74c-.18-.54-.28-1.12-.28-1.74s.1-1.2.28-1.74V4.96H1.02C.37 6.26 0 7.74 0 9.28s.37 3.02 1.02 4.32l2.96-2.86Z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.47.88 11.43 0 9 0 5.48 0 2.5 2.35 1.02 5.26l2.96 2.34c.7-2.12 2.68-3.7 5.02-3.7Z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                    <div className="my-6 text-center text-xs text-slate-500">or</div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-800">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value); setEmailError('')}} placeholder="you@company.com"
                          className="w-full mt-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-200/80 focus:border-emerald-500/55 transition" />
                        {emailError && <p className="mt-2 text-xs font-medium text-rose-600">{emailError}</p>}
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <label htmlFor="password" className="block text-sm font-semibold text-slate-800">Password</label>
                          <a href="#" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Forgot password?</a>
                        </div>
                        <div className="mt-2 relative">
                          <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => {setPassword(e.target.value); setPasswordError('')}} placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-200/80 focus:border-emerald-500/55 transition" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2.5 my-1.5 inline-flex items-center justify-center rounded-lg px-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100/70"
                            aria-label={showPassword ? "Hide password" : "Show password"}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {passwordError && <p className="mt-2 text-xs font-medium text-rose-600">{passwordError}</p>}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-700"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"/>Remember me</label>
                        <div className="text-slate-700">
                          Don't have an account? <button type="button" onClick={() => { console.log('Signup clicked'); onSignup(); }} className="font-semibold text-emerald-700 hover:underline">Sign up</button>
                        </div>
                      </div>

                      <button type="submit" disabled={isLoading}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(16,185,129,.18)] hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 active:scale-[0.99] transition">
                        {isLoading ? 'Signing in...' : 'Login'}
                      </button>
                    </form>
                    <div className="mt-6 text-xs text-slate-500">© {currentYear} Xion Pharma Pro. All rights reserved.</div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
