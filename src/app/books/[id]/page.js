'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BookDetailPage() {
    const params = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/books/${params.id}`)
            .then(r => r.json())
            .then(setBook)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) return (
        <><Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
                <div className="ai-progress" style={{ width: '200px' }}><div className="ai-progress-bar ai-progress-indeterminate"></div></div>
            </div>
        </>
    );

    if (!book) return (
        <><Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
                <div className="glass-card" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
                    <h2>Book Not Found</h2>
                    <Link href="/books" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>← Back to Library</Link>
                </div>
            </div>
        </>
    );

    // Group content by chapter
    const chapters = {};
    (book.contents || []).forEach(c => {
        const ch = c.chapterName || 'General';
        if (!chapters[ch]) chapters[ch] = [];
        chapters[ch].push(c);
    });

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: 'var(--space-12)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-8)', alignItems: 'start' }}>
                        {/* Main */}
                        <div>
                            <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                                    <span className={`badge ${book.sourceType === 'official' ? 'badge-primary' : 'badge-success'}`}>
                                        {book.sourceType === 'official' ? '🏛️ Official PCTB' : '🏫 Institution'}
                                    </span>
                                    <span className={`badge ${book.ocrStatus === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                        OCR: {book.ocrStatus}
                                    </span>
                                    <span className="badge badge-primary">{book.medium}</span>
                                </div>
                                <h1 style={{ marginBottom: 'var(--space-4)' }}>{book.title}</h1>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    <p><strong>Class:</strong> {book.classLevel}</p>
                                    <p><strong>Subject:</strong> {book.subject}</p>
                                    <p><strong>Board:</strong> {book.board}</p>
                                    <p><strong>Medium:</strong> {book.medium}</p>
                                    <p><strong>Indexed Pages:</strong> {book._count?.contents || 0}</p>
                                    <p><strong>Papers Generated:</strong> {book._count?.papers || 0}</p>
                                </div>
                                <Link href={`/papers/generate?bookId=${book.id}`} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 'var(--space-3)', textAlign: 'center', display: 'block' }}>
                                    🚀 Generate Exam Paper from This Book
                                </Link>
                                <a href={book.storagePath} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                                    📄 View / Download PDF
                                </a>
                            </div>

                            {/* Content Index */}
                            {Object.keys(chapters).length > 0 && (
                                <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-4)' }}>📑 Book Content Index</h3>
                                    {Object.entries(chapters).map(([chapter, items], i) => (
                                        <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                            <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--primary-400)' }}>{chapter}</h4>
                                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                                {items.slice(0, 3).map((item, j) => (
                                                    <p key={j} style={{ marginBottom: 'var(--space-1)' }}>
                                                        📄 Page {item.pageNumber}: {item.textContent?.slice(0, 80)}...
                                                    </p>
                                                ))}
                                                {items.length > 3 && <p style={{ color: 'var(--text-muted)' }}>+{items.length - 3} more pages</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div>
                            <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                                <h4 style={{ marginBottom: 'var(--space-4)' }}>Quick Generate</h4>
                                <Link href={`/papers/generate?bookId=${book.id}`} className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center', marginBottom: 'var(--space-3)' }}>
                                    📝 Full Paper
                                </Link>
                                <Link href={`/papers/generate?bookId=${book.id}&type=mcq`} className="btn btn-secondary" style={{ width: '100%', display: 'block', textAlign: 'center', marginBottom: 'var(--space-3)' }}>
                                    ☑️ MCQ Only
                                </Link>
                                <Link href={`/papers/generate?bookId=${book.id}&type=short`} className="btn btn-secondary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                                    📝 Short Questions
                                </Link>
                            </div>
                            <div className="ad-container">
                                <span className="ad-label">Advertisement</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
