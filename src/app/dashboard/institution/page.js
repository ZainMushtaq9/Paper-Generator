'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';
import ChangePassword from '@/components/ChangePassword';

function InstitutionContent() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ teachers: 0, books: 0, papers: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/analytics/stats');
            if (res.ok) setStats(await res.json());
        } catch (e) { console.error(e); }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <ul className="sidebar-nav">
                    <li><Link href="/dashboard/institution" className="active"><span className="nav-icon">📊</span><span>Dashboard</span></Link></li>
                    <li><Link href="/dashboard/institution/teachers"><span className="nav-icon">👩‍🏫</span><span>Teachers</span></Link></li>
                    <li><Link href="/books"><span className="nav-icon">📚</span><span>Book Library</span></Link></li>
                    <li><Link href="/books/upload"><span className="nav-icon">📤</span><span>Upload Books</span></Link></li>
                    <li><Link href="/papers/generate"><span className="nav-icon">📝</span><span>Generate Paper</span></Link></li>
                    <li><a href="#" onClick={() => signOut({ callbackUrl: '/' })}><span className="nav-icon">🚪</span><span>Logout</span></a></li>
                </ul>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>Institution <span className="gradient-text">Dashboard</span></h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                            {session?.user?.institutionName || 'Your Institution'} • {session?.user?.name}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Link href="/papers/generate" className="btn btn-primary">📝 Generate Paper</Link>
                        <Link href="/books/upload" className="btn btn-secondary">📤 Upload Book</Link>
                    </div>
                </div>

                <div className="stats-grid">
                    {[
                        { label: 'Teachers', value: stats.teachers, icon: '👩‍🏫' },
                        { label: 'Books Available', value: stats.books, icon: '📚' },
                        { label: 'Papers Generated', value: stats.papers, icon: '📄' },
                        { label: 'This Month', value: Math.floor(stats.papers * 0.3), icon: '📊' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{stat.icon}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-3" style={{ marginBottom: 'var(--space-6)' }}>
                    <Link href="/papers/generate" className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', textDecoration: 'none' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📝</div>
                        <h4>Generate Paper</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            Create a new exam paper using AI
                        </p>
                    </Link>
                    <Link href="/books" className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', textDecoration: 'none' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📚</div>
                        <h4>Book Library</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            Browse official & private books
                        </p>
                    </Link>
                    <Link href="/books/upload" className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', textDecoration: 'none' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📤</div>
                        <h4>Upload Material</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            Upload private books & notes
                        </p>
                    </Link>
                </div>

                <ChangePassword />
                <AdBanner dataAdSlot="institution_bottom" style={{ marginTop: 'var(--space-6)' }} />
            </main>
        </div>
    );
}

export default function InstitutionDashboard() {
    return (
        <AuthProvider>
            <Navbar />
            <InstitutionContent />
        </AuthProvider>
    );
}
