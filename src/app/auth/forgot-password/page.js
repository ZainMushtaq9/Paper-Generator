'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordContent() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: data.message });
                setEmail('');
            } else {
                setStatus({ type: 'error', message: data.error || 'Something went wrong' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again later.' });
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
                            Forgot <span className="gradient-text">Password</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                            style={{ width: '100%', marginBottom: 'var(--space-4)' }}
                            disabled={loading || !email}
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                Remember your password? <Link href="/auth/login" style={{ color: 'var(--primary-400)', textDecoration: 'none', fontWeight: 500 }}>Log in</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
