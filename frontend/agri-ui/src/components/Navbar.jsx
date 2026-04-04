import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, loading } = useAuth();

    if (loading) return null;

    if (location.pathname === '/signin' || location.pathname === '/signup' || location.pathname === '/auth') {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const linkClass = (path, colorClass = '') => {
        let classes = 'nav-link ';
        if (colorClass) classes += colorClass + ' ';
        return classes;
    };

    const linkStyle = (path) => ({
        color: location.pathname === path ? 'var(--text-primary)' : 'var(--text-secondary)',
        padding: '8px 20px',
        fontWeight: location.pathname === path ? '600' : '500',
        fontSize: 15,
        whiteSpace: 'nowrap',
        transition: 'all 0.3s'
    });

    return (
        <nav className="navbar-container" style={{
            background: 'rgba(10, 13, 11, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: '20px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'all 0.3s'
        }}>
            <div className="w-full flex items-center justify-between">
                <Link to="/" style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(39,174,96,0.4))' }}>🌱</span>
                    <span className="gradient-text-green" style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1 }}>AgriAI</span>
                </Link>
                <div className="md:hidden">
                    <button className="text-white text-2xl font-bold relative z-[110] bg-transparent border-none p-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
                <Link to="/" className={linkClass('/')} style={linkStyle('/')}>Home</Link>
                <Link to="/soil" className={linkClass('/soil')} style={linkStyle('/soil')}>Soil Analysis</Link>
                <Link to="/disease" className={linkClass('/disease', 'orange')} style={linkStyle('/disease')}>Disease Detection</Link>
                {user ? (
                    <div style={{ position: 'relative', marginLeft: '16px' }}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7fda96 0%, #1e7d44 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '800', color: '#003919', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(127,218,150,0.2)' }}
                            title={user.name}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </button>

                        {isProfileOpen && (
                            <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: '0', background: 'rgba(20, 24, 22, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', minWidth: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '10px', color: '#7fda96', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '800', marginBottom: '4px' }}>VERIFIED USER</div>
                                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                                </div>
                                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', color: '#ffb4ab', fontSize: '14px', fontWeight: '600', backgroundColor: 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: 'none' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,180,171,0.1)'; e.currentTarget.style.color = '#ffdad6'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffb4ab'; }}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    LOGOUT
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/signin" className="btn-green-gradient" style={{ padding: '8px 24px', borderRadius: '12px', fontWeight: '600', color: 'white', marginLeft: '16px' }}>
                        Sign In
                    </Link>
                )}
            </div>

            {/* Mobile Full-Screen Floating Menu Overlay */}
            <div className={`md:hidden fixed inset-0 z-[105] bg-[#080a09] transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col pt-24 px-8 pb-12 h-[100dvh]`}>
                <div className="flex flex-col gap-6">
                    <Link onClick={() => setIsOpen(false)} to="/" className="block text-2xl font-bold text-white border-b border-white/5 pb-4 hover:translate-x-4 hover:text-[#7fda96] active:scale-[0.98] origin-left active:opacity-60 transition-all duration-300">Home</Link>
                    <Link onClick={() => setIsOpen(false)} to="/soil" className="block text-2xl font-bold text-[#becabd] border-b border-white/5 pb-4 hover:translate-x-4 hover:text-[#7fda96] active:scale-[0.98] origin-left active:opacity-60 transition-all duration-300">Soil Analysis</Link>
                    <Link onClick={() => setIsOpen(false)} to="/disease" className="block text-2xl font-bold text-orange-400 border-b border-white/5 pb-4 hover:translate-x-4 hover:text-orange-300 active:scale-[0.98] origin-left active:opacity-60 transition-all duration-300">Disease Detection</Link>

                    {user ? (
                        <div className="mt-6 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(39,174,96,0.05)]">
                            <div className="text-[10px] uppercase tracking-[0.15em] text-[#7fda96] font-black mb-3">VERIFIED USER</div>
                            <div className="text-xl font-bold text-white mb-6 truncate">{user.name}</div>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-xl border border-red-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <Link onClick={() => setIsOpen(false)} to="/signin" className="mt-8 block text-center text-[#003919] font-black py-4 rounded-xl tracking-tight hover:scale-105 hover:shadow-[0_8px_32px_rgba(127,218,150,0.3)] active:scale-95 active:opacity-80 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #7fda96 0%, #1e7d44 100%)' }}>
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}