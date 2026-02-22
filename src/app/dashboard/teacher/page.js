'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';
import ChangePassword from '@/components/ChangePassword';

function TeacherContent() {
    const { data: session } = useSession();
    const [papers, setPapers] = useState([]);
    const [dailyCount, setDailyCount] = useState(0);
    const MAX_DAILY = 5;

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            const res = await fetch('/api/papers');
            if (res.ok) {
                const data = await res.json();
                setPapers(data.papers || []);
                setDailyCount(data.dailyCount || 0);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <ul className="sidebar-nav">
                    <li><Link href="/dashboard/teacher" className="active"><span className="nav-icon">📊</span><span>Dashboard</span></Link></li>
                    <li><Link href="/books"><span className="nav-icon">📚</span><span>Book Library</span></Link></li>
                    <li><Link href="/papers/generate"><span className="nav-icon">📝</span><span>Generate Paper</span></Link></li>
                    <li><Link href="/dashboard/teacher"><span className="nav-icon">📋</span><span>My Papers</span></Link></li>
                    <li><a href="#" onClick={() => signOut({ callbackUrl: '/' })}><span className="nav-icon">🚪</span><span>Logout</span></a></li>
                </ul>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>Teacher <span className="gradient-text">Dashboard</span></h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                            Welcome, {session?.user?.name} • {session?.user?.institutionName || 'ExamGen AI'}
                        </p>
                    </div>
                    <Link href="/papers/generate" className="btn btn-primary btn-lg">
                        📝 Generate New Paper
                    </Link>
                </div>

                {/* Daily Limit */}
                <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                        <h4>📊 Daily Paper Limit</h4>
                        <span className={`badge ${dailyCount >= MAX_DAILY ? 'badge-error' : 'badge-success'}`}>
                            {dailyCount} / {MAX_DAILY} used
                        </span>
                    </div>
                    <div className="ai-progress">
                        <div className="ai-progress-bar" style={{ width: `${(dailyCount / MAX_DAILY) * 100}%` }}></div>
                    </div>
                    {dailyCount >= MAX_DAILY && (
                        <p style={{ color: 'var(--warning-400)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            ⚠️ Daily limit reached. Resets at midnight.
                        </p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-3" style={{ marginBottom: 'var(--space-6)' }}>
                    <Link href="/papers/generate" className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', textDecoration: 'none' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🧠</div>
                        <h4>AI Paper Generator</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            Generate exam papers with AI
                        </p>
                    </Link>
                    <Link href="/books" className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center', textDecoration: 'none' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📚</div>
                        <h4>Browse Books</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            Official & institution books
                        </p>
                    </Link>
                    <div className="glass-card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📋</div>
                        <h4>My Papers</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                            {papers.length} papers generated
                        </p>
                    </div>
                </div>

                {/* Recent Papers */}
                <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>📋 Recent Papers</h3>
                    {papers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📝</div>
                            <p>No papers generated yet</p>
                            <Link href="/papers/generate" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                                Generate Your First Paper →
                            </Link>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Subject</th>
                                        <th>Class</th>
                                        <th>Marks</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {papers.slice(0, 10).map((paper) => (
                                        <tr key={paper.id}>
                                            <td style={{ fontWeight: 600 }}>{paper.title}</td>
                                            <td>{paper.subject || '—'}</td>
                                            <td>{paper.classLevel || '—'}</td>
                                            <td>{paper.totalMarks}</td>
                                            <td>
                                                <span className={`badge ${paper.status === 'exported' ? 'badge-success' :
                                                    paper.status === 'validated' ? 'badge-primary' :
                                                        'badge-warning'
                                                    }`}>
                                                    {paper.status}
                                                </span>
                                            </td>
                                            <td>{new Date(paper.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Link href={`/papers/${paper.id}`} className="btn btn-ghost btn-sm">
                                                    View →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <ChangePassword />
                <AdBanner dataAdSlot="teacher_bottom" style={{ marginTop: 'var(--space-6)' }} />
            </main>
        </div>
    );
}

export default function TeacherDashboard() {
    return (
        <AuthProvider>
            <Navbar />
            <TeacherContent />
        </AuthProvider>
    );
}
