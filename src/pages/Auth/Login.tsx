import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock, Chrome, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const uspItems = [
  { title: '30% Cost Reduction', desc: 'Optimize media spend with AI-driven budgeting.', icon: CheckCircle },
  { title: 'Live Offline Notifications', desc: 'Bridge online-to-offline conversions in real time.', icon: Info },
  { title: 'Dynamic Content Scheduling', desc: 'Automate campaigns with rules and real-time signals.', icon: Chrome },
  { title: 'Auto Creative Resizing', desc: 'One upload, all sizes—beautiful on every surface.', icon: Building2 },
];

const featureItems = [
  { title: 'Unified Analytics', icon: Building2 },
  { title: 'Role-based Access', icon: Lock },
  { title: 'SSO & 2FA Ready', icon: Chrome },
  { title: 'Enterprise Security', icon: CheckCircle },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'Admin' ? '/settings' : '/';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  useEffect(() => {
    const val = formData.password;
    const hasNum = /\d/.test(val);
    const hasSym = /[^A-Za-z0-9]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const strong = val.length >= 10 && hasNum && hasSym && hasUpper;
    const medium = val.length >= 8 && ((hasNum && hasUpper) || (hasNum && hasSym));
    setPasswordStrength(!val ? null : strong ? 'strong' : medium ? 'medium' : 'weak');
  }, [formData.password]);

  useEffect(() => {
    if (loginAttempts >= 5) {
      setRateLimited(true);
      const t = setTimeout(() => {
        setRateLimited(false);
        setLoginAttempts(0);
      }, 5 * 60 * 1000);
      return () => clearTimeout(t);
    }
  }, [loginAttempts]);

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // @ts-ignore
    setCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    if (name === 'email') setErrors((er) => ({ ...er, email: validateEmail(formData.email) }));
    if (name === 'password') setErrors((er) => ({ ...er, password: validatePassword(formData.password) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimited) return;

    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;

    try {
      setLoading(true);
      await login(formData.email, formData.password, formData.rememberMe);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setLoginAttempts((c) => c + 1);
      setErrors({ general: err?.message || 'Unable to sign in. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Left: About BMI */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-slate-50 p-8 md:p-10 flex flex-col justify-between">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-16 -left-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-2xl" aria-hidden="true" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 grid place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-white/10">
                  <Building2 className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">BMI Platform</h1>
                  <p className="text-xs text-slate-300">Business Management Intelligence</p>
                </div>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-slate-200">
                Orchestrate campaigns, insights, and operations across channels with one modern platform.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {uspItems.map(({ title, desc, icon: Icon }) => (
                  <div key={title} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-100">{title}</p>
                        <p className="text-xs text-slate-300 mt-1">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-slate-400">Platform features</p>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {featureItems.map(({ title, icon: Icon }) => (
                    <div key={title} className="flex items-center gap-2 rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
                      <Icon className="h-4 w-4 text-indigo-300" />
                      <span className="text-xs text-slate-200">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 text-[11px] text-slate-400">
              © {new Date().getFullYear()} BMI. Secure by design.
            </div>
          </div>

          {/* Right: Login form */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 md:p-8 flex items-center">
            <form onSubmit={handleSubmit} className="w-full" aria-label="Sign in to BMI">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
                <p className="text-sm text-slate-500 mt-1">Sign in to access your dashboard</p>
              </div>

              {errors.general && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <p className="text-sm">{errors.general}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                  <div className="mt-1 relative">
                    <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={!!(touched.email && errors.email)}
                      aria-describedby="email-error"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={formData.email}
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                      placeholder="you@company.com"
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-rose-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  <div className="mt-1 relative">
                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      aria-invalid={!!(touched.password && errors.password)}
                      aria-describedby="password-error password-strength"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onKeyUp={onKeyPress}
                      onKeyDown={onKeyPress}
                      value={formData.password}
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-10 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {capsLockOn && (
                    <p className="mt-1 text-xs text-amber-600">Caps Lock is on</p>
                  )}
                  {touched.password && errors.password && (
                    <p id="password-error" className="mt-1 text-xs text-rose-600">{errors.password}</p>
                  )}
                  {passwordStrength && (
                    <div id="password-strength" className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className={`h-1.5 w-10 rounded ${passwordStrength !== null ? 'bg-slate-200' : ''}`}></span>
                        <span className={`h-1.5 w-10 rounded ${passwordStrength === 'weak' ? 'bg-rose-400' : passwordStrength === 'medium' ? 'bg-amber-400' : passwordStrength === 'strong' ? 'bg-emerald-500' : 'bg-slate-200'}`}></span>
                      </div>
                      <span className="text-xs text-slate-500 capitalize">{passwordStrength} password</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    Remember me
                  </label>
                  <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || rateLimited}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white py-2.5 text-sm font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-2 text-[11px] text-slate-500">Or continue with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2 text-sm hover:bg-slate-50">
                    <img alt="Google" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="h-4 w-4" />
                    Google
                  </button>
                  <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2 text-sm hover:bg-slate-50">
                    <img alt="Microsoft" src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-4 w-4" />
                    Microsoft
                  </button>
                </div>

                {rateLimited && (
                  <p className="text-xs text-amber-600 mt-2">Too many attempts. Try again in a few minutes.</p>
                )}

                <p className="mt-4 text-[11px] text-slate-500">Two-factor authentication is coming soon.</p>
             