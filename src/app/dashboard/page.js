'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import AuthProvider from '@/components/AuthProvider';

function DashboardRedirect() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary)'
            }}>
                <div className="ai-progress" style={{ width: '200px' }}>
                    <div className="ai-progress-bar" style={{ width: '60%' }}></div>
                </div>
            </div>
        );
    }

    if (!session) {
        redirect('/auth/login');
    }

    // Redirect to role-specific dashboard
    switch (session.user.role) {
        case 'SUPER_ADMIN':
            redirect('/dashboard/super-admin');
        case 'INSTITUTION_ADMIN':
            redirect('/dashboard/institution');
        case 'TEACHER':
            redirect('/dashboard/teacher');
        default:
            redirect('/dashboard/teacher');
    }
}

export default function DashboardPage() {
    return (
        <AuthProvider>
            <DashboardRedirect />
        </AuthProvider>
    );
}
