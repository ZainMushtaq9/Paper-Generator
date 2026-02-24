'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        institutionName: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    institutionName: formData.institutionName,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ParticleBackground />
            <Navbar />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-4)',
                paddingTop: '100px'
            }}>
                <div className="glass-card animate-fade-in-up" style={{
                    padding: 'var(--space-10)',
                    width: '100%',
                    maxWidth: '480px'
                }}>
                    {success ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🎉</div>
                            <h2 style={{ marginBottom: 'var(--space-4)' }}>Registration Submitted!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                                Your institution account is pending Super Admin approval. You&apos;ll be able to login once approved.
                            </p>
                            <Link href="/auth/login" className="btn btn-primary btn-lg">
                                Go to Login →
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: 'var(--radius-xl)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.8rem',
                                    margin: '0 auto var(--space-4)',
                                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)'
                                }}>🏫</div>
                                <h2 style={{ marginBottom: 'var(--space-2)' }}>Register Your Institution</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                    Create a free institution account to get started
                                </p>
                            </div>

                            {error && (
                                <div style={{
                                    padding: 'var(--space-3) var(--space-4)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--error-400)',
                                    fontSize: 'var(--text-sm)',
                                    marginBottom: 'var(--space-4)',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                                    <label className="form-label">Institution Name</label>
                                    <input
                                        type="text"
                                        name="institutionName"
                                        className="form-input"
                                        placeholder="e.g., City Grammar School"
                                        value={formData.institutionName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                                    <label className="form-label">Your Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="e.g., Ahmed Khan"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="admin@yourschool.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-input"
                                        placeholder="At least 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-input"
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={loading}
                                    style={{ width: '100%', marginBottom: 'var(--space-4)' }}
                                >
                                    {loading ? (
                                        <>
                                            <span style={{
                                                width: '18px',
                                                height: '18px',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTopColor: '#fff',
                                                borderRadius: '50%',
                                                animation: 'rotate-slow 1s linear infinite',
                                                display: 'inline-block'
                                            }}></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        '🚀 Create Account'
                                    )}
                                </button>
                            </form>

                            <p style={{
                                textAlign: 'center',
                                color: 'var(--text-secondary)',
                                fontSize: 'var(--text-sm)'
                            }}>
                                Already have an account?{' '}
                                <Link href="/auth/login" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
                                    Sign in →
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
