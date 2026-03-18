import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

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
            <div className="navbar-header">
                <Link to="/" style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(39,174,96,0.4))' }}>🌱</span> 
                    <span className="gradient-text-green" style={{ fontSize: 24, fontWeight: 800, letterSpacing: 1 }}>AgriAI</span>
                </Link>
                <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>

            <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
                <Link to="/" className={linkClass('/')} style={linkStyle('/')}>Home</Link>
                <Link to="/soil" className={linkClass('/soil')} style={linkStyle('/soil')}>Soil Analysis</Link>
                <Link to="/disease" className={linkClass('/disease', 'orange')} style={linkStyle('/disease')}>Disease Detection</Link>
            </div>
        </nav>
    );
}