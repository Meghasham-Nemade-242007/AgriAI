export default function LoadingSpinner({ message, color }) {
    const spinnerColor = color || 'var(--accent-green)';
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40
        }}>
            <div style={{
                width: 50,
                height: 50,
                border: '4px solid var(--border-color)',
                borderTop: `4px solid ${spinnerColor}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: spinnerColor, fontWeight: '600' }}>
                {message || 'Analyzing...'}
            </p>
        </div>
    );
}