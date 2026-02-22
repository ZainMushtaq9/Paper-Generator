import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST generate a new password for an Institution Admin
export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const institutionId = params.id;

        // Find the admin user for this institution
        const adminUser = await prisma.user.findFirst({
            where: {
                institutionId: institutionId,
                role: 'INSTITUTION_ADMIN'
            }
        });

        if (!adminUser) {
            return NextResponse.json({ error: 'Institution Admin account not found' }, { status: 404 });
        }

        // Generate a random 8-character password
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        let newPassword = '';
        for (let i = 0; i < 8; i++) {
            newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the password
        await prisma.user.update({
            where: { id: adminUser.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({
            success: true,
            newPassword,
            message: `Password reset successfully. New password is: ${newPassword}`
        });

    } catch (error) {
        console.error('Reset institution admin password error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
