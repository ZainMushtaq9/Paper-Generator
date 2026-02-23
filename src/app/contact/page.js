'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate send (add email API in production)
        setTimeout(() => setStatus('sent'), 1500);
    };

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container container-md" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
                    <h1 style={{ marginBottom: 'var(--space-4)' }}>Contact <span className="gradient-text">Us</span></h1>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
                        <div>
                            <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                                <h3 style={{ marginBottom: 'var(--space-6)' }}>Send a Message</h3>
                                {status === 'sent' ? (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                                        <h4>Message Sent!</h4>
                                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-2)' }}>We&apos;ll get back to you within 24 hours.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Your Name</label>
                                                <input type="text" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ahmed Khan" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Email Address</label>
                                                <input type="email" className="form-input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@school.pk" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Subject</label>
                                                <input type="text" className="form-input" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Question about..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Message</label>
                                                <textarea className="form-textarea" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your message..." />
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'}>
                                                {status === 'sending' ? '⏳ Sending...' : '📨 Send Message'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            {[
                                { icon: '📧', label: 'Email', value: 'mushtaqzain180@gmail.com', href: 'mailto:mushtaqzain180@gmail.com' },
                                { icon: '🌐', label: 'Website', value: 'examgen.pk', href: '#' },
                            ].map((item, i) => (
                                <div key={i} className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                                    <div>
                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                                        <a href={item.href} style={{ color: 'var(--primary-400)', fontSize: 'var(--text-sm)' }}>{item.value}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
