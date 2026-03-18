import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { detectDisease } from '../api/agriApi';

export default function DiseaseDetection() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (!image) {
            setError('Please upload a plant leaf image');
            return;
        }
        setError(null);
        setLoading(true);
        setResult(null);
        try {
            const data = await detectDisease(image);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Something went wrong. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 90) return '#4ade80';
        if (confidence >= 70) return 'var(--warning-amber)';
        return 'var(--error-red)';
    };

    return (
        <div className="animate-fade-up" style={{ maxWidth: 860, margin: '0 auto', padding: '64px 24px' }}>
            <h1 style={{ marginBottom: 16, fontSize: 48, fontWeight: 800 }}>
                <span className="gradient-text-orange">Disease Detection</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 48, fontSize: 18, maxWidth: 600 }}>
                Upload a photo of your plant leaf to detect diseases and receive a personalized treatment plan powered by visual AI models.
            </p>

            {/* Upload Card */}
            <div className="animate-fade-up delay-100 glass-panel-heavy responsive-card-inner" style={{ borderRadius: 32, marginBottom: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                <h3 className="gradient-text-orange" style={{ marginBottom: 32, fontSize: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16, width: '100%', display: 'block' }}>
                    Plant Leaf Photo
                </h3>
                <ImageUploader onImageSelect={setImage} color="var(--accent-orange)" />
                <div className="glass-panel-light" style={{ marginTop: 32, padding: '20px', borderRadius: 16, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--accent-orange)' }}>💡 Tip:</strong> Upload a clear close-up photo of a single plant leaf showing the affected or diseased area.
                </div>

                {error && (
                    <div className="animate-fade-in glass-panel-light" style={{ marginTop: 32, padding: '20px', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: 12, color: 'var(--error-red)', fontSize: 15, fontWeight: 500 }}>
                        ⚠️ {error}
                    </div>
                )}

                <button
                    className={loading ? "glass-panel-heavy" : "btn-orange-gradient"}
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        marginTop: 40, width: '100%', padding: '20px', borderRadius: 16, fontSize: 18, fontWeight: '700', color: loading ? 'var(--text-secondary)' : 'white', transition: 'all 0.3s'
                    }}
                >
                    {loading ? 'Running Network Analysis...' : 'Run Diagnosis →'}
                </button>
            </div>

            <div className="animate-fade-in" style={{ marginTop: 40, marginBottom: 40 }}>
                {loading && <LoadingSpinner message="AI is diagnosing the issue..." color="var(--accent-orange)" />}
            </div>

            {result && (
                <div className="animate-fade-up glass-panel-heavy responsive-card-inner" style={{ borderRadius: 32, marginTop: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                    {result.status !== 'success' && (
                        <div style={{ textAlign: 'center' }}>
                            <div className="animate-fade-in delay-100" style={{ fontSize: 72, marginBottom: 32, filter: 'drop-shadow(0 0 30px rgba(231,76,60,0.6))' }}>{result.status === 'invalid_image' ? '🚫' : '⚠️'}</div>
                            <h3 style={{ color: 'var(--error-red)', marginBottom: 20, fontSize: 36, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 800 }}>
                                {result.status === 'invalid_image' ? 'Invalid Image' : 'Not A Leaf Image'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 40px auto', fontSize: 18 }}>
                                {result.message}
                            </p>
                            <div className="glass-panel-light" style={{ borderRadius: 20, padding: 32, textAlign: 'left', maxWidth: 600, margin: '0 auto 40px auto' }}>
                                <strong style={{ color: 'var(--warning-amber)', fontSize: 15, display: 'block', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Photography Tips</strong>
                                <ul style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 2.2, paddingLeft: 24 }}>
                                    <li>Place the leaf flat on a clean surface</li>
                                    <li>Take photo directly above the leaf</li>
                                    <li>Leaf should fill the entire frame</li>
                                    <li>Use natural daylight — avoid flash</li>
                                </ul>
                            </div>
                            <button className="card-hover glass-panel-light orange" onClick={() => { setResult(null); setError(null); }} style={{ padding: '16px 40px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 16, fontWeight: 'bold' }}>
                                ↻ Try Again
                            </button>
                        </div>
                    )}

                    {result.status === 'success' && (
                        <>
                            <div className="animate-fade-in responsive-flex-row" style={{ alignItems: 'center', marginBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 24 }}>
                                <h2 className="responsive-h3" style={{ color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>Diagnosis Result</h2>
                                <div className="glass-panel" style={{ padding: '8px 24px', borderRadius: 30, fontSize: 14, color: '#fb923c', letterSpacing: '1px', fontWeight: 'bold', border: '1px solid rgba(230,126,34,0.3)' }}>ANALYSIS COMPLETE</div>
                            </div>
                            
                            <div className="animate-fade-up delay-100 glass-panel responsive-card-inner responsive-flex-row" style={{ border: '1px solid rgba(230,126,34,0.3)', borderRadius: 24, marginBottom: 48 }}>
                                <div>
                                    <div style={{ fontSize: 15, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12, fontWeight: 600 }}>Detected Pathogen</div>
                                    <h3 className="responsive-h2 gradient-text-orange" style={{ margin: 0, textTransform: 'capitalize', fontWeight: 800 }}>{result.disease.replace(/___/g, ' — ').replace(/_/g, ' ')}</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div className="responsive-h3 glass-panel-light" style={{ color: getConfidenceColor(result.confidence), padding: '16px 32px', borderRadius: 24, fontWeight: '800', border: `2px solid ${getConfidenceColor(result.confidence)}`, boxShadow: `0 8px 20px rgba(0,0,0,0.3)` }}>
                                        {result.confidence}%
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 16, letterSpacing: '3px', fontWeight: 'bold' }}>CONFIDENCE</div>
                                </div>
                            </div>

                            <div className="animate-fade-up delay-200" style={{ marginBottom: 24 }}>
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: 24, fontSize: 24, fontWeight: 700 }}>AI Treatment Advisory</h3>
                                <div className="glass-panel markdown-body" style={{ padding: 40, borderRadius: 24 }}>
                                    <ReactMarkdown>{result.treatment}</ReactMarkdown>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}