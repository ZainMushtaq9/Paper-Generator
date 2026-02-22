'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

function SuperAdminContent() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ institutions: 0, teachers: 0, books: 0, papers: 0 });
    const [institutions, setInstitutions] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchInstitutions();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/analytics/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) { console.error(e); }
    };

    const fetchInstitutions = async () => {
        try {
            const res = await fetch('/api/institutions');
            if (res.ok) {
                const data = await res.json();
                setInstitutions(data);
            }
        } catch (e) { console.error(e); }
    };

    const approveInstitution = async (id) => {
        try {
            const res = await fetch(`/api/institutions/${id}/approve`, { method: 'POST' });
            if (res.ok) fetchInstitutions();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
                <ul className="sidebar-nav">
                    <li>
                        <Link href="/dashboard/super-admin" className="active">
                            <span className="nav-icon">📊</span>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/super-admin">
                            <span className="nav-icon">🏫</span>
                            <span>Institutions</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/books">
                            <span className="nav-icon">📚</span>
                            <span>Book Library</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/books/upload">
                            <span className="nav-icon">📤</span>
                            <span>Upload Books</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/super-admin">
                            <span className="nav-icon">📈</span>
                            <span>Analytics</span>
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={() => signOut({ callbackUrl: '/' })}>
                            <span className="nav-icon">🚪</span>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>Super Admin <span className="gradient-text">Dashboard</span></h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                            Welcome back, {session?.user?.name}
                        </p>
                    </div>
                    <Link href="/books/upload" className="btn btn-primary">
                        📤 Upload Official Book
                    </Link>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {[
                        { label: 'Total Institutions', value: stats.institutions, icon: '🏫' },
                        { label: 'Total Teachers', value: stats.teachers, icon: '👩‍🏫' },
                        { label: 'Total Books', value: stats.books, icon: '📚' },
                        { label: 'Papers Generated', value: stats.papers, icon: '📄' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>{stat.icon}</div>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Pending Institutions */}
                <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>🏫 Institution Approval Queue</h3>
                    {institutions.filter(i => !i.approved).length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
                            ✅ No pending approvals
                        </p>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Institution</th>
                                        <th>Email</th>
                                        <th>Registered</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {institutions.filter(i => !i.approved).map((inst) => (
                                        <tr key={inst.id}>
                                            <td style={{ fontWeight: 600 }}>{inst.name}</td>
                                            <td>{inst.email}</td>
                                            <td>{new Date(inst.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => approveInstitution(inst.id)}
                                                >
                                                    ✅ Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* All Institutions */}
                <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>📋 All Institutions</h3>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {institutions.map((inst) => (
                                    <tr key={inst.id}>
                                        <td style={{ fontWeight: 600 }}>{inst.name}</td>
                                        <td>{inst.email || '—'}</td>
                                        <td>
                                            <span className={`badge ${inst.approved ? 'badge-success' : 'badge-warning'}`}>
                                                {inst.approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>{new Date(inst.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {institutions.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                                            No institutions yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Ad */}
                <div className="ad-container" style={{ marginTop: 'var(--space-6)' }}>
                    <span className="ad-label">Advertisement</span>
                </div>
            </main>
        </div>
    );
}

export default function SuperAdminDashboard() {
    return (
        <AuthProvider>
            <Navbar />
            <SuperAdminContent />
        </AuthProvider>
    );
}
