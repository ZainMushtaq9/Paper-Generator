'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import AdBanner from '@/components/AdBanner';

function TeachersContent() {
    const { data: session } = useSession();
    const [teachers, setTeachers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    // Add Teacher Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });
    const [addError, setAddError] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await fetch('/api/institutions/teachers');
            if (res.ok) {
                setTeachers(await res.json());
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        setAddError('');
        setLoading(true);

        try {
            const res = await fetch('/api/institutions/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTeacher),
            });

            if (res.ok) {
                setShowAddModal(false);
                setNewTeacher({ name: '', email: '', password: '' });
                fetchTeachers();
            } else {
                const data = await res.json();
                setAddError(data.error || 'Failed to add teacher');
            }
        } catch (error) {
            setAddError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (teacherId, teacherName) => {
        if (!confirm(`Are you sure you want to reset the password for ${teacherName}?`)) return;

        try {
            const res = await fetch(`/api/institutions/teachers/${teacherId}/reset`, {
                method: 'POST',
            });

            const data = await res.json();

            if (res.ok) {
                // Show the newly generated password to the admin so they can give it to the teacher
                alert(`SUCCESS! Please securely give this new temporary password to ${teacherName}:\n\n🔒 ${data.newPassword}\n\nThey must log in with this password and then they can change it from their dashboard.`);
            } else {
                alert(data.error || 'Failed to reset password');
            }
        } catch (error) {
            alert('An unexpected error occurred');
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
                <ul className="sidebar-nav">
                    <li><Link href="/dashboard/institution"><span className="nav-icon">📊</span><span>Dashboard</span></Link></li>
                    <li><Link href="/dashboard/institution/teachers" className="active"><span className="nav-icon">👩‍🏫</span><span>Teachers</span></Link></li>
                    <li><Link href="/books"><span className="nav-icon">📚</span><span>Book Library</span></Link></li>
                    <li><Link href="/books/upload"><span className="nav-icon">📤</span><span>Upload Books</span></Link></li>
                    <li><Link href="/papers/generate"><span className="nav-icon">📝</span><span>Generate Paper</span></Link></li>
                </ul>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1>Institution <span className="gradient-text">Teachers</span></h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>
                            Manage teachers and reset passwords
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        ➕ Add New Teacher
                    </button>
                </div>

                {/* Teachers List */}
                <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Teacher Name</th>
                                    <th>Email</th>
                                    <th>Papers Generated</th>
                                    <th>Joined Date</th>
                                    <th>Actions / Security</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td style={{ fontWeight: 600 }}>{teacher.name}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher._count?.papers || 0}</td>
                                        <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handleResetPassword(teacher.id, teacher.name)}
                                                title="Generate a new random password if the teacher forgot it"
                                            >
                                                🔑 Reset Password
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {teachers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                                            No teachers added yet. Click "Add New Teacher" above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <AdBanner dataAdSlot="institution_teachers" />

                {/* Add Teacher Modal */}
                {showAddModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div className="glass-card" style={{ padding: 'var(--space-6)', width: '100%', maxWidth: '400px' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>➕ Add Teacher</h3>

                            {addError && <div style={{ color: 'var(--error-500)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>{addError}</div>}

                            <form onSubmit={handleAddTeacher}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text" className="form-control" required
                                        value={newTeacher.name} onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email" className="form-control" required
                                        value={newTeacher.email} onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initial Password</label>
                                    <input
                                        type="text" className="form-control" required minLength="6"
                                        value={newTeacher.password} onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                    />
                                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                        They can change this after logging in.
                                    </small>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                        {loading ? 'Adding...' : 'Save Teacher'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function InstitutionTeachersPage() {
    return (
        <AuthProvider>
            <Navbar />
            <TeachersContent />
        </AuthProvider>
    );
}
