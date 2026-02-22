'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus({ type: 'error', message: 'Invalid or missing password reset token.' });
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: data.message });
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => router.push('/auth/login'), 2000);
            } else {
                setStatus({ type: 'error', message: data.error || 'Failed to reset password.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>
                            Choose New <span className="gradient-text">Password</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Enter a secure new password for your account.
                        </p>
                    </div>

                    {!token ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--error-500)', marginBottom: 'var(--space-4)' }}>
                                ❌ Invalid Reset Link
                            </div>
                            <Link href="/auth/forgot-password" className="btn btn-secondary">Request New Link</Link>
                        </div>
                    ) : (status.type === 'success' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--success-500)', marginBottom: 'var(--space-4)' }}>
                                ✅ Password Reset Successful!
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>Redirecting to login...</p>
                            <Link href="/auth/login" className="btn btn-primary">Go to Login</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            {status.message && (
                                <div style={{
                                    padding: 'var(--space-4)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-6)',
                                    backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                    color: status.type === 'error' ? 'var(--error-500)' : 'var(--success-500)',
                                    border: `1px solid ${status.type === 'error' ? 'var(--error-500)' : 'var(--success-500)'}`,
                                    fontSize: 'var(--text-sm)',
                                    textAlign: 'center'
                                }}>
                                    {status.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%' }}
                                disabled={loading || !password || !confirmPassword}
                            >
                                {loading ? 'Saving...' : 'Reset Password'}
                            </button>
                        </form>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </>
    );
}
