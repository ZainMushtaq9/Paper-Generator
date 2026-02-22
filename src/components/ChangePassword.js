'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ChangePassword() {
    const { data: session } = useSession();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    if (!session) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match', type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ text: 'New password must be at least 6 characters', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: 'Password updated successfully!', type: 'success' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage({ text: data.error || 'Failed to update password', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>🔒 Change Password</h3>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {message.text && (
                    <div style={{
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-4)',
                        backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        color: message.type === 'error' ? 'var(--error-500)' : 'var(--success-500)',
                        border: `1px solid ${message.type === 'error' ? 'var(--error-500)' : 'var(--success-500)'}`,
                        fontSize: 'var(--text-sm)'
                    }}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                >
                    {loading ? '⏳ Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}
