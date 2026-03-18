import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { analyzeSoil } from '../api/agriApi';

const FIELDS = [
    { key: 'N', label: 'Nitrogen (N)'},
    { key: 'P', label: 'Phosphorus (P)'},
    { key: 'K', label: 'Potassium (K)'},
    { key: 'temperature', label: 'Temperature (°C)'},
    { key: 'humidity', label: 'Humidity (%)'},
    { key: 'ph', label: 'Soil pH'},
    { key: 'rainfall', label: 'Rainfall (mm)'}
];

export default function SoilAnalysis() {
    const [form, setForm] = useState({ N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '' });
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        const missing = FIELDS.filter(f => !form[f.key]);
        if (missing.length > 0) {
            setError(`Please fill in: ${missing.map(f => f.label.split(' ')[0]).join(', ')}`);
            return;
        }
        if (!image) {
            setError('Please upload a soil image');
            return;
        }
        setError(null);
        setLoading(true);
        setResult(null);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => formData.append(k, v));
            formData.append('image', image);
            const data = await analyzeSoil(formData);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Something went wrong. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-up" style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>
            <h1 style={{ marginBottom: 16, fontSize: 48, fontWeight: 800 }}>
                <span className="gradient-text-green">Soil Analysis</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 48, fontSize: 18, maxWidth: 600 }}>
                Enter your soil parameters and upload a photo to get AI-powered crop recommendations mapped directly to your land's profile.
            </p>

            <div className="animate-fade-up delay-100 glass-panel-heavy responsive-card-inner" style={{ borderRadius: 32, marginBottom: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                <div className="responsive-grid-2">
                    {/* Left — Form */}
                    <div>
                        <h3 className="gradient-text-green" style={{ marginBottom: 32, fontSize: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16, width: '100%', display: 'block' }}>
                            Soil Parameters
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {FIELDS.map(field => (
                                <div key={field.key} className="responsive-input-row">
                                    <label style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                        {field.label}
                                    </label>
                                    <input
                                        type="number"
                                        value={form[field.key]}
                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        style={{
                                            width: 140, padding: '12px 16px', background: 'rgba(10, 13, 11, 0.6)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 16, color: 'var(--text-primary)', outline: 'none', transition: 'all 0.3s'
                                        }}
                                        onFocus={e => {e.target.style.border = '1px solid var(--accent-green)'; e.target.style.boxShadow = '0 0 12px rgba(39,174,96,0.2)'; e.target.style.background = 'rgba(10, 13, 11, 0.8)';}}
                                        onBlur={e => {e.target.style.border = '1px solid var(--border-color)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(10, 13, 11, 0.6)';}}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Image Upload */}
                    <div>
                        <h3 className="gradient-text-green" style={{ marginBottom: 32, fontSize: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16, width: '100%', display: 'block' }}>
                            Soil Photo
                        </h3>
                        <ImageUploader onImageSelect={setImage} color="var(--accent-green)" />
                        <div className="glass-panel-light" style={{ marginTop: 32, padding: '20px', borderRadius: 16, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <strong style={{ color: 'var(--accent-green)' }}>💡 Tip:</strong> Upload a clear close-up photo of your soil in natural daylight for accurate evaluation.
                        </div>
                    </div>
                </div>

                {/* Submit area */}
                <div style={{ marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40 }}>
                    {error && (
                        <div className="animate-fade-in glass-panel-light" style={{ padding: '20px', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: 12, color: 'var(--error-red)', fontSize: 15, marginBottom: 32, fontWeight: 500 }}>
                            ⚠️ {error}
                        </div>
                    )}
                    <button
                        className={loading ? "glass-panel-heavy" : "btn-green-gradient"}
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '20px', borderRadius: 16, fontSize: 18, fontWeight: '700', color: loading ? 'var(--text-secondary)' : 'white', transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'Analyzing Profile...' : 'Analyze Soil Composition →'}
                    </button>
                </div>
            </div>

            <div className="animate-fade-in" style={{ marginTop: 40, marginBottom: 40 }}>
                {loading && <LoadingSpinner message="AI is processing your soil composition map..." color="var(--accent-green)" />}
            </div>

            {result && (
                <div className="animate-fade-up glass-panel-heavy responsive-card-inner" style={{ borderRadius: 32, marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                    {result.status !== 'success' && (
                        <div style={{ textAlign: 'center' }}>
                            <div className="animate-fade-in delay-100" style={{ fontSize: 72, marginBottom: 32, filter: 'drop-shadow(0 0 30px rgba(231,76,60,0.6))' }}>{result.status === 'invalid_image' ? '🚫' : '⚠️'}</div>
                            <h3 style={{ color: 'var(--error-red)', marginBottom: 20, fontSize: 36, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 800 }}>
                                {result.status === 'invalid_image' ? 'Invalid Image' : 'Not A Soil Image'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px auto', fontSize: 18 }}>
                                {result.message}
                            </p>
                            <div className="glass-panel-light" style={{ borderRadius: 20, padding: 32, textAlign: 'left', maxWidth: 600, margin: '0 auto 40px auto' }}>
                                <strong style={{ color: 'var(--warning-amber)', fontSize: 15, display: 'block', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Photography Tips</strong>
                                <ul style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 2.2, paddingLeft: 24 }}>
                                    <li>Take photo directly above the soil</li>
                                    <li>Use natural daylight</li>
                                    <li>Make sure soil fills the entire frame</li>
                                    <li>Avoid shadows or reflections</li>
                                </ul>
                            </div>
                            <button className="card-hover glass-panel-light" onClick={() => { setResult(null); setError(null); }} style={{ padding: '16px 40px', color: 'white', borderRadius: 12, fontSize: 16, fontWeight: 'bold' }}>
                                ↻ Try Again
                            </button>
                        </div>
                    )}

                    {result.status === 'success' && (
                        <>
                            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 24 }}>
                                <h2 className="responsive-h3" style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>Analysis Complete</h2>
                                <div className="glass-panel" style={{ padding: '8px 24px', borderRadius: 30, fontSize: 14, color: '#4ade80', letterSpacing: '1px', fontWeight: 'bold', border: '1px solid rgba(39,174,96,0.3)' }}>SUCCESS</div>
                            </div>
                            
                            <div className="animate-fade-up delay-100 glass-panel responsive-card-inner" style={{ display: 'flex', flexDirection: 'column', gap: 24, border: '1px solid rgba(39,174,96,0.3)', borderRadius: 24, marginBottom: 48 }}>
                                <div>
                                    <div style={{ fontSize: 15, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Detected Profile</div>
                                    <h3 className="responsive-h2 gradient-text-green" style={{ margin: 0, textTransform: 'uppercase', fontWeight: 800 }}>{result.soil_type}</h3>
                                </div>
                                <div>
                                    <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', padding: '10px 24px', borderRadius: 30, fontSize: 16, fontWeight: '800', boxShadow: '0 8px 20px rgba(39,174,96,0.4)', textTransform: 'uppercase' }}>
                                        {result.soil_confidence}% Match
                                    </div>
                                </div>
                            </div>

                            <div className="animate-fade-up delay-200" style={{ marginBottom: 56 }}>
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: 24, fontSize: 24, fontWeight: 700 }}>AI Strategic Advisory</h3>
                                <div className="glass-panel markdown-body" style={{ padding: 40, borderRadius: 24 }}>
                                    <ReactMarkdown>{result.advisory}</ReactMarkdown>
                                </div>
                            </div>

                            <h3 className="animate-fade-up delay-300" style={{ color: 'var(--text-primary)', marginBottom: 32, fontSize: 24, fontWeight: 700 }}>Top Crop Recommendations</h3>
                            <div className="animate-fade-up delay-300 responsive-grid-3">
                                {result.recommended_crops.map((item, i) => (
                                    <div key={i} className="card-hover glass-panel" style={{ borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div className="glass-panel-light" style={{ width: 90, height: 90, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, marginBottom: 24, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>{i === 0 ? '🏆' : '🌱'}</div>
                                        <div style={{ fontSize: 26, fontWeight: '800', textTransform: 'capitalize', color: 'var(--text-primary)', marginBottom: 12 }}>{item.crop}</div>
                                        <div className="gradient-text-green" style={{ fontSize: 18, fontWeight: 700 }}>{item.confidence}% Match</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}