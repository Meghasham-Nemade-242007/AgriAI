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
      const res = await fetch(`http://localhost:5000${endpoint}`, {
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

  return (
    <div className="flex w-full h-screen bg-[#121412] text-[#e2e3df] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Left Column: Visual Imagery (Swapped to Left per explicit instruction) */}
      <div className="hidden lg:block lg:w-1/2 relative h-full">
        <img alt="Modern sustainable farm" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2000" style={{ filter: 'brightness(0.6)' }} />
        {/* Adjusted gradient to blend correctly with the right column layout mapping seamlessly */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121412]"></div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 z-10 bg-[#121412] h-full overflow-y-auto relative">
        <div className="w-full max-w-md m-auto py-8">
          <div className="p-8 rounded-xl ring-1 ring-white/5 shadow-2xl" style={{ background: 'rgba(30, 32, 30, 0.8)', backdropFilter: 'blur(20px)' }}>

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

            {toast && (
              <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 animate-fade-in shadow-lg ${
                toast.type === 'success' ? 'bg-[#152e1c] text-[#7fda96] border-[#7fda96]/30' : 'bg-[#3b1212] text-[#ffb4ab] border-[#ffb4ab]/30'
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
            )}

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
                  <input name="password" type="password" required placeholder="••••••••" className="w-full bg-[#0d0f0d] border-none outline-1 outline outline-[#3f4940]/15 text-[#e2e3df] rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline focus:outline-[#7fda96] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]" />
                </div>

                <button disabled={loading} type="submit" className="w-full text-[#003919] font-black py-4 rounded-lg tracking-tight active:scale-[0.98] transition-transform mt-4 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #7fda96 0%, #1e7d44 100%)' }}>
                  {loading ? 'Processing...' : (activeTab === 'signin' ? 'Login' : 'Create Account')}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
