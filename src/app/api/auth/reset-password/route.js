import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Find the valid token
        const resetRecord = await prisma.resetToken.findUnique({
            where: { token }
        });

        if (!resetRecord) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        if (new Date() > resetRecord.expiresAt) {
            await prisma.resetToken.delete({ where: { token } });
            return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password
        await prisma.user.update({
            where: { email: resetRecord.email },
            data: { password: hashedPassword }
        });

        // Delete the token so it can't be reused
        await prisma.resetToken.delete({ where: { token } });

        return NextResponse.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
