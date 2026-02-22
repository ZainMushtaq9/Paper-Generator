'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import AdBanner from '@/components/AdBanner';

function PaperViewContent() {
    const params = useParams();
    const router = useRouter();
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    useEffect(() => {
        fetchPaper();
    }, [params.id]);

    const fetchPaper = async () => {
        try {
            const res = await fetch(`/api/papers/${params.id}`);
            if (res.ok) setPaper(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleExport = async (format = 'pdf') => {
        setExporting(true);
        setExportProgress(0);

        const msgs = ['Rendering paper layout...', 'Embedding fonts...', 'Generating QR code...', 'Finalizing PDF...'];
        let i = 0;
        const interval = setInterval(() => {
            setExportProgress(p => Math.min(p + 25, 90));
            i++;
            if (i >= msgs.length) clearInterval(interval);
        }, 800);

        try {
            const res = await fetch(`/api/papers/${params.id}/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ format }),
            });

            clearInterval(interval);

            if (res.ok) {
                setExportProgress(100);
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${paper?.title || 'exam-paper'}.${format}`;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                alert('Export failed. Please try again.');
            }
        } catch (err) {
            clearInterval(interval);
            alert('Export failed');
        } finally {
            setExporting(false);
            setTimeout(() => setExportProgress(0), 2000);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="ai-progress" style={{ width: '200px', margin: '0 auto var(--space-4)' }}>
                        <div className="ai-progress-bar ai-progress-indeterminate"></div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading paper...</p>
                </div>
            </div>
        );
    }

    if (!paper) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                    <h2>Paper Not Found</h2>
                    <Link href="/dashboard" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Group questions by section
    const grouped = {};
    (paper.questions || []).forEach(q => {
        if (!grouped[q.section]) grouped[q.section] = [];
        grouped[q.section].push(q);
    });

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: 'var(--space-12)' }}>
                <div className="container">
                    {/* Header */}
                    <div className="dashboard-header">
                        <div>
                            <h1 className="gradient-text">{paper.title}</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                                Class {paper.classLevel} • {paper.subject} • {paper.totalMarks} Marks • {paper.timeDuration}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={() => handleExport('pdf')} disabled={exporting}>
                                {exporting ? '⏳ Exporting...' : '📥 Export PDF'}
                            </button>
                            <Link href="/papers/generate" className="btn btn-secondary">📝 New Paper</Link>
                        </div>
                    </div>

                    {/* Export Progress */}
                    {exporting && (
                        <div className="glass-card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>🧠 Generating PDF...</span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-400)' }}>{exportProgress}%</span>
                            </div>
                            <div className="ai-progress"><div className="ai-progress-bar" style={{ width: `${exportProgress}%` }}></div></div>
                        </div>
                    )}

                    {/* Ad Banner */}
                    <AdBanner dataAdSlot="paper_view_top" style={{ marginBottom: 'var(--space-6)' }} />

                    {/* Paper Preview */}
                    <div className="glass-card" style={{ padding: 'var(--space-8)' }} id="paper-preview">
                        {/* Paper Header */}
                        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>{paper.title}</h2>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                                {paper.schoolName && <span><strong>School:</strong> {paper.schoolName}</span>}
                                {paper.paperPurpose && <span><strong>Purpose:</strong> {paper.paperPurpose}</span>}
                                <span><strong>Class:</strong> {paper.classLevel}</span>
                                <span><strong>Subject:</strong> {paper.subject}</span>
                                <span><strong>Total Marks:</strong> {paper.totalMarks}</span>
                                <span><strong>Time:</strong> {paper.timeDuration}</span>
                                {paper.bookName && <span><strong>Book/Test:</strong> {paper.bookName}</span>}
                            </div>
                            {paper.instructions && (
                                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                    {paper.instructions}
                                </p>
                            )}
                        </div>

                        {/* Sections */}
                        {Object.entries(grouped).map(([section, questions]) => (
                            <div key={section} style={{ marginBottom: 'var(--space-8)' }}>
                                <h3 style={{ color: 'var(--primary-400)', marginBottom: 'var(--space-2)' }}>
                                    Section {section}
                                </h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                                    {questions[0]?.questionType === 'mcq'
                                        ? 'Choose the correct answer.'
                                        : `Attempt ${questions.length} questions.`}
                                </p>

                                {questions.map((q, i) => (
                                    <div key={q.id} style={{
                                        padding: 'var(--space-4)',
                                        borderBottom: '1px solid var(--border-color)',
                                        marginBottom: 'var(--space-3)',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                                            <div style={{ flex: 1 }}>
                                                <p><strong>Q{q.questionNumber}.</strong> {q.questionText}</p>

                                                {/* MCQ Options */}
                                                {q.options && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-3)', paddingLeft: 'var(--space-6)' }}>
                                                        {(() => {
                                                            try {
                                                                return JSON.parse(q.options).map((opt, k) => (
                                                                    <span key={k} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                                                        ({String.fromCharCode(97 + k)}) {opt}
                                                                    </span>
                                                                ));
                                                            } catch { return null; }
                                                        })()}
                                                    </div>
                                                )}

                                                {/* Page Reference */}
                                                {q.pageReference && (
                                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-500)', marginTop: 'var(--space-2)' }}>
                                                        📄 Generated from Page {q.pageReference}
                                                    </p>
                                                )}

                                                {/* Confidence Score */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                                    <div style={{ width: '60px', height: '4px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                                        <div style={{ width: `${(q.confidence || 0.85) * 100}%`, height: '100%', background: 'var(--success-500)', borderRadius: 'var(--radius-full)' }}></div>
                                                    </div>
                                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                                        AI confidence: {Math.round((q.confidence || 0.85) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <span style={{
                                                whiteSpace: 'nowrap',
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--text-muted)',
                                                padding: 'var(--space-1) var(--space-3)',
                                                background: 'var(--bg-tertiary)',
                                                borderRadius: 'var(--radius-full)',
                                            }}>
                                                {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Download Confirmation Ad */}
                    <AdBanner dataAdSlot="paper_view_bottom" style={{ marginTop: 'var(--space-6)' }} />
                </div>
            </div>
        </>
    );
}

export default function PaperViewPage() {
    return (
        <AuthProvider>
            <PaperViewContent />
        </AuthProvider>
    );
}
