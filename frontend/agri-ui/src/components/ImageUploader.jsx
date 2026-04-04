import { useState } from 'react';

export default function ImageUploader({ onImageSelect, color }) {
    const [preview, setPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const activeColor = color || 'var(--accent-green)';

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(file));
            onImageSelect(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    return (
        <div>
            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                    border: `2px dashed ${dragOver ? activeColor : 'var(--border-color)'}`,
                    borderRadius: 12,
                    padding: 32,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: dragOver ? 'rgba(255,255,255,0.02)' : 'var(--bg-color)',
                    transition: 'all 0.2s'
                }}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, margin: '0 auto', display: 'block' }}
                    />
                ) : (
                    <div>
                        <div style={{ fontSize: 48, marginBottom: 8, filter: 'grayscale(1)', opacity: 0.5 }}>📷</div>
                        <p style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 500 }}>
                            Drag and drop your image here
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
                            or click to browse
                        </p>
                    </div>
                )}
            </div>
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
            />
            {preview && (
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setPreview(null); onImageSelect(null); }}
                        style={{
                            marginTop: 12,
                            padding: '8px 16px',
                            background: 'transparent',
                            color: 'var(--error-red)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            display: 'inline-block'
                        }}
                        className="hover:bg-red-500/10 transition-colors"
                    >
                        Remove Image
                    </button>
                </div>
            )}
        </div>
    );
}