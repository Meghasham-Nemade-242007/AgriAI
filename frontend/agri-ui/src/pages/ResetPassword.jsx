import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setToast(null);

    if (password.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000';
      const res = await fetch(`${AUTH_API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setToast({ type: 'success', message: data.message });
      setSuccess(true);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-[100dvh] h-[100dvh] bg-[#121412] text-[#e2e3df] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Left Column: Visual Imagery */}
      <div className="hidden lg:block lg:w-1/2 relative h-full">
        <img alt="Modern sustainable farm" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2000" style={{ filter: 'brightness(0.6)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121412]"></div>
      </div>

      {/* Right Column: Reset Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 z-10 bg-[#121412] h-full overflow-y-auto relative">
        <div className="w-full max-w-md m-auto py-8">
          <div className="p-8 rounded-xl ring-1 ring-white/5 shadow-2xl" style={{ background: 'rgba(30, 32, 30, 0.8)', backdropFilter: 'blur(20px)' }}>

            {/* Toast */}
            {toast && (
              <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 animate-fade-in shadow-lg ${toast.type === 'success' ? 'bg-[#152e1c] text-[#7fda96] border-[#7fda96]/30' : 'bg-[#3b1212] text-[#ffb4ab] border-[#ffb4ab]/30'}`}>
                {toast.type === 'success' ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-[14px] font-semibold tracking-tight leading-snug">{toast.message}</span>
              </div>
            )}

            {success ? (
              /* ─── Success State ─── */
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#152e1c] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#7fda96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-[#e2e3df] mb-3">Password Reset!</h1>
                <p className="text-[#becabd] text-sm tracking-tight mb-8 leading-relaxed">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
                <button
                  onClick={() => navigate('/signin')}
                  className="w-full text-[#003919] font-black py-4 rounded-lg tracking-tight active:scale-[0.98] transition-transform disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #7fda96 0%, #1e7d44 100%)' }}
                >
                  Go to Sign In
                </button>
              </div>
            ) : (
              /* ─── Reset Form ─── */
              <div className="animate-fade-in">
                <header className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#152e1c] flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-[#7fda96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-black tracking-tighter text-[#e2e3df] mb-2">
                    Set New Password
                  </h1>
                  <p className="text-[#becabd] text-sm tracking-tight leading-relaxed">
                    Enter your new password below. Make sure it's at least 6 characters.
                  </p>
                </header>

                <form className="space-y-5" onSubmit={handleReset}>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[#7fda96] opacity-80">New Password: </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0d0f0d] border-none outline-1 outline outline-[#3f4940]/15 text-[#e2e3df] rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline focus:outline-[#7fda96] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#7fda96] transition-colors focus:outline-none">
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-[#7fda96] opacity-80">Confirm Password: </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0d0f0d] border-none outline-1 outline outline-[#3f4940]/15 text-[#e2e3df] rounded-lg px-4 py-3 placeholder:text-zinc-600 focus:outline focus:outline-[#7fda96] transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
                    />
                  </div>

                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div className="animate-fade-in">
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: password.length >= level * 3
                                ? password.length >= 12 ? '#7fda96' : password.length >= 8 ? '#fbbf24' : '#ffb4ab'
                                : '#1e2420'
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] tracking-tight" style={{
                        color: password.length >= 12 ? '#7fda96' : password.length >= 8 ? '#fbbf24' : '#ffb4ab'
                      }}>
                        {password.length >= 12 ? 'Strong password' : password.length >= 8 ? 'Fair password' : password.length >= 6 ? 'Weak password' : 'Too short'}
                      </p>
                    </div>
                  )}

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
                        Resetting...
                      </span>
                    ) : 'Reset Password'}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
