import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST generate a new password for a teacher
export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'INSTITUTION_ADMIN' || !session.user.institutionId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const teacherId = params.id;

        // Verify the teacher belongs to this institution
        const teacher = await prisma.user.findFirst({
            where: {
                id: teacherId,
                institutionId: session.user.institutionId,
                role: 'TEACHER'
            }
        });

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        // Generate a random 8-character password
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        let newPassword = '';
        for (let i = 0; i < 8; i++) {
            newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the teacher password
        await prisma.user.update({
            where: { id: teacherId },
            data: { password: hashedPassword }
        });

        // Return the new password to show on screen once
        return NextResponse.json({
            success: true,
            newPassword,
            message: `Password reset successfully. New password is: ${newPassword}`
        });

    } catch (error) {
        console.error('Reset teacher password error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
