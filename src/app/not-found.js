import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '80px',
                textAlign: 'center',
            }}>
                <div className="glass-card animate-fade-in-up" style={{ padding: 'var(--space-16)', maxWidth: '500px' }}>
                    <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)' }}>🔍</div>
                    <h1 className="gradient-text" style={{ fontSize: 'var(--text-6xl)', marginBottom: 'var(--space-4)' }}>404</h1>
                    <h2 style={{ marginBottom: 'var(--space-4)' }}>Page Not Found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/" className="btn btn-primary">🏠 Go Home</Link>
                        <Link href="/books" className="btn btn-secondary">📚 Book Library</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
