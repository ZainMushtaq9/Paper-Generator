'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Load theme from cookie/localStorage
        const saved = localStorage.getItem('examgen-theme') || 'dark';
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('examgen-theme', newTheme);
        document.cookie = `theme=${newTheme};path=/;max-age=${365 * 24 * 60 * 60}`;
    };

    const getDashboardUrl = () => {
        if (!session?.user?.role) return '/dashboard';
        const roleMap = {
            'SUPER_ADMIN': '/dashboard/super-admin',
            'INSTITUTION_ADMIN': '/dashboard/institution',
            'TEACHER': '/dashboard/teacher',
        };
        return roleMap[session.user.role] || '/dashboard';
    };

    const isLoggedIn = status === 'authenticated' && session?.user;

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">
                        <div className="navbar-brand-icon">📝</div>
                        <span>ExamGen <span className="gradient-text">AI</span></span>
                    </Link>

                    <ul className={`navbar-nav ${mobileOpen ? 'open' : ''}`}>
                        <li><Link href="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
                        <li><Link href="/books" onClick={() => setMobileOpen(false)}>Book Library</Link></li>
                        <li><Link href="/about" onClick={() => setMobileOpen(false)}>About</Link></li>
                        <li><Link href="/contact" onClick={() => setMobileOpen(false)}>Contact</Link></li>
                    </ul>

                    <div className="navbar-actions">
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {isLoggedIn ? (
                            <>
                                <Link href={getDashboardUrl()} className="btn btn-secondary btn-sm">
                                    📊 Dashboard
                                </Link>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="btn btn-secondary btn-sm">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="btn btn-primary btn-sm">
                                    Get Started
                                </Link>
                            </>
                        )}

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? '✕' : '☰'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
