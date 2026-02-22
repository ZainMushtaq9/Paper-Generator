'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';

export default function BookLibraryPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        class: '',
        subject: '',
        medium: '',
        source: '',
        search: '',
    });
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchBooks();
    }, [filters, page]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.class) params.set('class', filters.class);
            if (filters.subject) params.set('subject', filters.subject);
            if (filters.medium) params.set('medium', filters.medium);
            if (filters.source) params.set('source', filters.source);
            if (filters.search) params.set('search', filters.search);
            params.set('page', page.toString());

            const res = await fetch(`/api/books?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setBooks(data.books || []);
                setTotal(data.total || 0);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const classes = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Pakistan Studies', 'Islamiat', 'Computer Science', 'General Science'];

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container">
                    {/* Header */}
                    <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
                        <h1>📚 Book <span className="gradient-text">Library</span></h1>
                        <p>Browse official Punjab Board textbooks and institution materials</p>
                    </div>

                    {/* Filters */}
                    <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label">🔍 Search</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search books..."
                                    value={filters.search}
                                    onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">📚 Class</label>
                                <select
                                    className="form-select"
                                    value={filters.class}
                                    onChange={(e) => { setFilters({ ...filters, class: e.target.value }); setPage(1); }}
                                >
                                    <option value="">All Classes</option>
                                    {classes.map(c => (
                                        <option key={c} value={c}>Class {c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">📖 Subject</label>
                                <select
                                    className="form-select"
                                    value={filters.subject}
                                    onChange={(e) => { setFilters({ ...filters, subject: e.target.value }); setPage(1); }}
                                >
                                    <option value="">All Subjects</option>
                                    {subjects.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">🌐 Medium</label>
                                <select
                                    className="form-select"
                                    value={filters.medium}
                                    onChange={(e) => { setFilters({ ...filters, medium: e.target.value }); setPage(1); }}
                                >
                                    <option value="">All</option>
                                    <option value="english">English</option>
                                    <option value="urdu">Urdu</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">📂 Source</label>
                                <select
                                    className="form-select"
                                    value={filters.source}
                                    onChange={(e) => { setFilters({ ...filters, source: e.target.value }); setPage(1); }}
                                >
                                    <option value="">All Sources</option>
                                    <option value="official">Official PCTB</option>
                                    <option value="institution">Institution</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                            {total} book{total !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {/* Book Grid */}
                    {loading ? (
                        <div className="feature-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="glass-card" style={{ padding: 'var(--space-6)' }}>
                                    <div className="skeleton" style={{ height: '120px', marginBottom: 'var(--space-4)' }}></div>
                                    <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: 'var(--space-2)' }}></div>
                                    <div className="skeleton" style={{ height: '16px', width: '60%' }}></div>
                                </div>
                            ))}
                        </div>
                    ) : books.length === 0 ? (
                        <div className="glass-card" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📚</div>
                            <h3>No Books Found</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                                This section does not have any books from PTBB pre-loaded.
                                <br />Please download official PDFs from the <a href="https://ptbb.punjab.gov.pk/E-Books" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-400)' }}>PCTB e-Books portal</a> and upload them.
                            </p>
                            <Link href="/books/upload" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                                📤 Upload Official Book
                            </Link>
                        </div>
                    ) : (
                        <div className="feature-grid">
                            {books.map((book, i) => (
                                <Link
                                    key={book.id}
                                    href={`/books/${book.id}`}
                                    className="glass-card feature-card animate-fade-in-up"
                                    style={{ animationDelay: `${i * 0.05}s`, opacity: 0, textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                        <span className={`badge ${book.sourceType === 'official' ? 'badge-primary' : 'badge-success'}`}>
                                            {book.sourceType === 'official' ? '🏛️ Official' : '🏫 Institution'}
                                        </span>
                                        <span className={`badge ${book.medium === 'urdu' ? 'badge-warning' : 'badge-primary'}`}>
                                            {book.medium === 'urdu' ? 'اردو' : 'English'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)', textAlign: 'center' }}>📘</div>
                                    <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{book.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                        Class {book.classLevel} • {book.subject}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: 'var(--space-4)',
                                        paddingTop: 'var(--space-3)',
                                        borderTop: '1px solid var(--border-color)',
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--text-muted)'
                                    }}>
                                        <span>📄 {book._count?.contents || 0} indexed pages</span>
                                        <span>📊 {book.ocrStatus}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Ad Banner */}
                    <AdBanner dataAdSlot="books_bottom" style={{ margin: 'var(--space-8) 0' }} />
                </div>
            </div>
            <Footer />
        </>
    );
}
