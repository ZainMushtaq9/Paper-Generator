'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';

function UploadContent() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        classLevel: '9',
        subject: '',
        medium: 'english',
        sourceType: 'institution',
    });

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) setFile(dropped);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(p => {
                if (p >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return p + Math.random() * 15;
            });
        }, 500);

        try {
            const data = new FormData();
            data.append('file', file);
            Object.entries(formData).forEach(([key, val]) => data.append(key, val));

            const res = await fetch('/api/books', { method: 'POST', body: data });

            clearInterval(progressInterval);

            if (res.ok) {
                setProgress(100);
                setTimeout(() => router.push('/books'), 1000);
            } else {
                const err = await res.json();
                alert(err.error || 'Upload failed');
                setProgress(0);
            }
        } catch (err) {
            clearInterval(progressInterval);
            alert('Upload failed');
            setProgress(0);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container container-md">
                    <div className="section-header">
                        <h1>📤 Upload <span className="gradient-text">Book</span></h1>
                        <p>Add a new textbook or study material</p>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                        <form onSubmit={handleSubmit}>
                            {/* Drop Zone */}
                            <div
                                className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                style={{ marginBottom: 'var(--space-6)' }}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    style={{ display: 'none' }}
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                                {file ? (
                                    <div>
                                        <div className="upload-icon">✅</div>
                                        <p style={{ fontWeight: 600, color: 'var(--success-400)' }}>{file.name}</p>
                                        <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="upload-icon">📁</div>
                                        <p style={{ fontWeight: 500 }}>Drag & drop your PDF or image here</p>
                                        <p>or click to browse files</p>
                                        <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-2)' }}>
                                            Supports: PDF, JPG, PNG (max 50MB)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar */}
                            {uploading && (
                                <div style={{ marginBottom: 'var(--space-6)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                            🧠 AI Processing Upload...
                                        </span>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-400)' }}>
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                    <div className="ai-progress">
                                        <div className="ai-progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label">Book Title *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., Mathematics Class 9 (2024)"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Class Level *</label>
                                    <select
                                        className="form-select"
                                        value={formData.classLevel}
                                        onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={String(i + 1)}>Class {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., Mathematics"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Medium</label>
                                    <select
                                        className="form-select"
                                        value={formData.medium}
                                        onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                                    >
                                        <option value="english">English</option>
                                        <option value="urdu">Urdu</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Source Type</label>
                                    <select
                                        className="form-select"
                                        value={formData.sourceType}
                                        onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                                    >
                                        <option value="institution">Institution</option>
                                        <option value="official">Official PCTB</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={!file || uploading}
                                style={{ width: '100%' }}
                            >
                                {uploading ? '🧠 Uploading...' : '📤 Upload Book'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function BookUploadPage() {
    return (
        <AuthProvider>
            <UploadContent />
        </AuthProvider>
    );
}
