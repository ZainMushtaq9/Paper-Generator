import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/lib/email';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Return success even if user not found to prevent email enumeration
            return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
        }

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        // Delete any existing tokens for this email
        await prisma.resetToken.deleteMany({ where: { email } });

        await prisma.resetToken.create({
            data: { email, token, expiresAt }
        });

        // Ensure we handle absolute URLs correctly
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #6366f1;">ExamGen AI Password Reset</h2>
                <p>Hello ${user.name},</p>
                <p>We received a request to reset your password. Click the button below to choose a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetLink}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888; text-align: center;">ExamGen AI — Bilingual Exam Paper Generator</p>
            </div>
        `;

        const result = await sendEmail(user.email, 'ExamGen AI - Password Reset Request', html);

        if (!result.success) {
            console.error('Email Error:', result.error);
            return NextResponse.json({ error: 'Failed to send reset email. Make sure GMAIL_APP_PASSWORD is set correctly.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'If that email exists, a reset link has been sent.' });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
