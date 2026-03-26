import { useNavigate } from 'react-router-dom';
import LiquidEther from '../components/LiquidEther/LiquidEther';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-up" style={{ width: '100%' }}>

            {/* Hero - Full Screen Width & Height DYP */}
            <div style={{ position: 'relative', width: '100%', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                    {/* User requested green colors for Liquid Ether */}
                    <LiquidEther colors={['#1E8449', '#27AE60', '#2ECC71']} />
                </div>

                <div style={{ position: 'relative', zIndex: 1, padding: '24px', textAlign: 'center', width: '100%', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, rgba(10,13,11,0.2) 0%, rgba(10,13,11,0.85) 100%)' }}>
                    <h1 className="responsive-hero-h1" style={{
                        color: 'var(--text-primary)',
                        marginBottom: 24,
                        fontWeight: 800,
                        letterSpacing: '-1.5px',
                        lineHeight: 1.1
                    }}>
                        Smart Farming <br />
                        <span className="gradient-text-green">Starts Here</span>
                    </h1>
                    <p style={{
                        fontSize: 18,
                        color: 'var(--text-secondary)',
                        maxWidth: 600,
                        margin: '0 auto 40px auto',
                        lineHeight: 1.7
                    }}>
                        Unlock the full potential of your farm with AI-driven insights. From soil composition to disease identification, we provide the tools you need for a healthier, more abundant harvest.
                    </p>
                    <div className="responsive-btn-group" style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                        <button className="btn-green-gradient" style={{
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: 12,
                            fontSize: 16,
                            fontWeight: '600'
                        }} onClick={() => navigate('/soil')}>
                            Start Soil Scan
                        </button>
                        <button className="card-hover glass-panel-light" style={{
                            color: 'var(--text-primary)',
                            padding: '16px 32px',
                            borderRadius: 12,
                            fontSize: 16,
                            fontWeight: '600',
                            transition: 'all 0.3s'
                        }} onClick={() => navigate('/disease')}>
                            Detect Disease
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Container (constrained to 1200px) */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px' }}>
                {/* Feature Stats Cards */}
                <div className="animate-fade-up delay-100 responsive-grid-4" style={{ marginBottom: 80 }}>
                    {[
                        { label: 'Accuracy', value: '99%', icon: '🎯' },
                        { label: 'Crop Types', value: '22+', icon: '🌾' },
                        { label: 'Diseases', value: '38+', icon: '🦠' },
                        { label: 'Farmers', value: '10K+', icon: '👨‍🌾' }
                    ].map((stat, i) => (
                        <div key={i} className="card-hover glass-panel" style={{
                            borderRadius: 20,
                            padding: '32px 24px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 36, marginBottom: 16 }}>{stat.icon}</div>
                            <div className="gradient-text-green" style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.5px' }}>{stat.value}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Sections */}
                <div className="animate-fade-up delay-200" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                    {/* Soil Analysis Section */}
                    <div className="card-hover glass-panel responsive-flex-row responsive-card-inner" style={{ borderRadius: 24 }}>
                        <div className="responsive-half-width">
                            <div className="gradient-text-green" style={{ fontSize: 14, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
                                Soil Analysis
                            </div>
                            <h2 className="responsive-h3" style={{ marginBottom: 20, fontWeight: 800 }}>Optimize Your Land</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16, lineHeight: 1.8 }}>
                                Input your soil parameters or upload a photo to receive AI-powered crop recommendations tailored precisely to your soil's composition. Ensure you plant the right crop at the right time.
                            </p>
                            <button className="btn-green-gradient" style={{
                                color: 'white', padding: '14px 28px', borderRadius: 8, fontSize: 16, fontWeight: '600'
                            }} onClick={() => navigate('/soil')}>
                                Analyze Soil Conditions
                            </button>
                        </div>
                    </div>

                    {/* Disease Detection Section */}
                    <div className="card-hover glass-panel orange responsive-flex-row responsive-card-inner" style={{ borderRadius: 24 }}>
                        <div className="responsive-half-width">
                            <div className="gradient-text-orange" style={{ fontSize: 14, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16 }}>
                                Disease Detection
                            </div>
                            <h2 className="responsive-h3" style={{ marginBottom: 20, fontWeight: 800 }}>Protect Your Harvest</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16, lineHeight: 1.8 }}>
                                Upload a photo of a struggling plant leaf. Our computer vision models provide instant disease identification and detailed, actionable treatment recommendations.
                            </p>
                            <button className="btn-orange-gradient" style={{
                                color: 'white', padding: '14px 28px', borderRadius: 8, fontSize: 16, fontWeight: '600'
                            }} onClick={() => navigate('/disease')}>
                                Identify Pathogens
                            </button>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="animate-fade-up delay-300" style={{ textAlign: 'center', marginTop: 100, marginBottom: 60 }}>
                    <h2 className="responsive-h3" style={{ marginBottom: 60, fontWeight: 800 }}>How it <span className="gradient-text-green">Works</span></h2>
                    <div className="responsive-grid-3">
                        {[
                            { step: '01', title: 'Upload Photo', desc: 'Securely upload a picture of your crop or soil through our web portal.' },
                            { step: '02', title: 'AI Analysis', desc: 'Our advanced neural networks process the image against millions of data points.' },
                            { step: '03', title: 'Get Advice', desc: 'Receive instant diagnostic reports and actionable treatment or optimization plans.' }
                        ].map((item, i) => (
                            <div key={i} className="card-hover glass-panel" style={{ width: '100%', textAlign: 'center', padding: 32, borderRadius: 20 }}>
                                <div className="gradient-text-green" style={{ fontSize: 56, fontWeight: 800, marginBottom: 24, opacity: 0.8 }}>{item.step}</div>
                                <h3 style={{ fontSize: 20, marginBottom: 12 }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Banner */}
                <div className="card-hover glass-panel-heavy animate-fade-up responsive-card-inner" style={{ borderRadius: 24, textAlign: 'center' }}>
                    <h2 className="responsive-h3" style={{ marginBottom: 24, fontWeight: 800 }}>Ready to optimize your harvest?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px auto', fontSize: 18 }}>
                        Join thousands of farmers using AgriAI to increase their yield and protect their livelihood.
                    </p>
                    <button className="btn-green-gradient" style={{
                        color: 'white', padding: '16px 40px', borderRadius: 12, fontSize: 18, fontWeight: '700'
                    }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Start Your Free Scan
                    </button>
                </div>
            </div>
        </div>
    );
}