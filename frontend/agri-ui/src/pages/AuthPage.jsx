import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState(location.pathname === '/signup' ? 'signup' : 'signin');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = activeTab === 'signup' ? formData.get('name') : null;

    const endpoint = activeTab === 'signup' ? '/api/auth/register' : '/api/auth/login';
    const payload = activeTab === 'signup' ? { name, email, password } : { email, password };

    try {
      const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000';
      const res = await fetch(`${AUTH_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (activeTab === 'signup') {
        setToast({ type: 'success', message: 'Account created successfully! Switching to login...' });
        setTimeout(() => {
          setActiveTab('signin');
          navigate('/signin', { replace: true });
          setToast(null);
          setLoading(false);
        }, 2000);
      } else {
        setToast({ type: 'success', message: 'Login successful! Entering the platform...' });
        setTimeout(() => {
          login(data.token, data.user);
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000';
      const res = await fetch(`${AUTH_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setToast({ type: 'success', message: data.message });
      setLoading(false);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
      setLoading(false);
    }
  };

  // Shared toast component
  const ToastBar = () => toast && (
    <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 animate-fade-in shadow-lg ${toast.type === 'success' ? 'bg-[#152e1c] text-[#7fda96] border-[#7fda96]/30' : 'bg-[#3b1212] text-[#ffb4ab] border-[#ffb4ab]/30'
      }`}>
      {toast.type === 'success' ? (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span className="text-[14px] font-semibold tracking-tight leading-snug">{toast.message}</span>
    </div>
  );

  return (
    <div className="flex w-full min-h-[100dvh] h-[100dvh] bg-[#121412] text-[#e2e3df] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Left Column: Visual Imagery */}
      <div className="hidden lg:block lg:w-1/2 relative h-full">
        <img alt="Modern sustainable farm" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2000" style={{ filter: 'brightness(0.6)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121412]"></div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 z-10 bg-[#121412] h-full overflow-y-auto relative">
        <div className="w-full max-w-md m-auto py-8">
          <div className="p-8 rounded-xl ring-1 ring-white/5 shadow-2xl" style={{ background: 'rgba(30, 32, 30, 0.8)', backdropFilter: 'blur(20px)' }}>

            {/* ─── Forgot Password View ─── */}
            {showForgotPassword ? (
              <div className="animate-fade-in">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setToast(null); setForgotEmail(''); }}
                  className="flex items-center gap-2 text-[#becabd] hover:text-[#7fda96] transition-colors mb-8 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sign In
                </button>

                <ToastBar />

                <header className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#152e1c] flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-[#7fda96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-black tracking-tighter text-[#e2e3df] mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-[#becabd] text-sm tracking-tight leading-relaxed">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </p>
                </header>

                <form className="space-y-5" onSubmit={handleForgotPassword}>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[#7fda96] opacity-80">Email Address: </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@digitalearth.com"
                      className="w-full bg-[#0d0f0d] border-none outline-1 outline outline-[#3f4940]/15 text-[#e2e3df] rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline focus:outline-[#7fda96] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
                    />
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full text-[#003919] font-black py-4 rounded-lg tracking-tight active:scale-[0.98] transition-transform mt-4 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #7fda96 0%, #1e7d44 100%)' }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Reset Link'}
                  </button>
                </form>
              </div>
            ) : (
              /* ─── Normal Sign In / Sign Up View ─── */
              <>
                {/* Tabbed Menu */}
                <div className="flex mb-10 bg-[#0d0f0d] p-1 rounded-lg">
                  <button
                    type="button"
                    className={`flex-1 py-3 text-sm tracking-tight rounded-lg transition-all ${activeTab === 'signin' ? 'font-bold text-[#7fda96] bg-[#292a28]' : 'font-medium text-zinc-500 hover:text-[#e2e3df]'}`}
                    onClick={() => { setActiveTab('signin'); setToast(null); navigate('/signin', { replace: true }); }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 text-sm tracking-tight rounded-lg transition-all ${activeTab === 'signup' ? 'font-bold text-[#7fda96] bg-[#292a28]' : 'font-medium text-zinc-500 hover:text-[#e2e3df]'}`}
                    onClick={() => { setActiveTab('signup'); setToast(null); navigate('/signup', { replace: true }); }}
                  >
                    Create Account
                  </button>
                </div>

                <ToastBar />

                {/* Form View Body */}
                <div className="space-y-6">
                  <header className="mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-[#e2e3df] mb-2">
                      {activeTab === 'signin' ? 'Welcome Back.' : 'New User.'}
                    </h1>
                    <p className="text-[#becabd] text-sm tracking-tight">
                      {activeTab === 'signin' ? 'Enter your credentials to access the Platform.' : 'Join the platform of digital Agriculture.'}
                    </p>
                  </header>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {activeTab === 'signup' && (
                      <div className="space-y-2 animate-fade-in">
                        <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[#7fda96] opacity-80">Full Name: </label>
                        <input name="name" type="text" required placeholder="Alex Morgan" className="w-full bg-[#0d0f0d] border-none outline-1 outline outline-[#3f4940]/15 text-[#e2e3df] rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline focus:outline-[#7fda96] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]" />
                      </div>
                    )}

                    <div className="space-y-2 animate-fade-in">
                      <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[#7fda96] opacity-80">Email: </label>
                      <input name="email" type="email" required placeholder="name@digitalearth.com" className="w-full bg-[#0d0f0d] border-none outline-1 outline outline-[#3f4940]/15 text-[#e2e3df] rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline focus:outline-[#7fda96] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]" />
                    </div>

                    <div className="space-y-2 animate-fade-in">
                      <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[#7fda96] opacity-80">
                        {activeTab === 'signin' ? 'Password: ' : 'Create Password: '}
                      </label>
                      <div className="relative">
                        <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className="w-full bg-[#0d0f0d] border-none outline-1 outline outline-[#3f4940]/15 text-[#e2e3df] rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline focus:outline-[#7fda96] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] pr-12" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#7fda96] transition-colors focus:outline-none">
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password link — only on sign in */}
                    {activeTab === 'signin' && (
                      <div className="flex justify-end animate-fade-in">
                        <button
                          type="button"
                          onClick={() => { setShowForgotPassword(true); setToast(null); }}
                          className="text-[13px] font-semibold text-[#7fda96]/70 hover:text-[#7fda96] transition-colors tracking-tight"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <button disabled={loading} type="submit" className="w-full text-[#003919] font-black py-4 rounded-lg tracking-tight active:scale-[0.98] transition-transform mt-4 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #7fda96 0%, #1e7d44 100%)' }}>
                      {loading ? 'Processing...' : (activeTab === 'signin' ? 'Login' : 'Create Account')}
                    </button>
                  </form>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
