'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.error) {
                setError(result.error);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--error-400)',
                    fontSize: 'var(--text-sm)',
                    marginBottom: 'var(--space-4)',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}
            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="you@school.pk"
                    value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                    <Link href="/auth/forgot-password" style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-400)', textDecoration: 'none' }}>
                        Forgot Password?
                    </Link>
                </div>
                <input type="password" className="form-input" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
                style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
                {loading ? (
                    <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'rotate-slow 1s linear infinite', display: 'inline-block', marginRight: 8 }}></span>Signing In...</>
                ) : '→ Sign In'}
            </button>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" style={{ color: 'var(--primary-400)', fontWeight: 600 }}>Create one free →</Link>
            </p>

        </form>
    );
}

export default function LoginPage() {
    return (
        <>
            <ParticleBackground />
            <Navbar />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', paddingTop: '100px' }}>
                <div className="glass-card animate-fade-in-up" style={{ padding: 'var(--space-10)', width: '100%', maxWidth: '440px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                        <div style={{ width: 64, height: 64, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto var(--space-4)', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>🔐</div>
                        <h2 style={{ marginBottom: 'var(--space-2)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Sign in to your ExamGen AI account</p>
                    </div>
                    <Suspense fallback={<div className="ai-progress"><div className="ai-progress-bar" style={{ width: '60%' }}></div></div>}>
                        <LoginForm />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
