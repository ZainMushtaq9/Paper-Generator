import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Delete associated users first
        await prisma.user.deleteMany({
            where: { institutionId: id },
        });

        // Then delete the institution
        await prisma.institution.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Institution deleted successfully' });
    } catch (error) {
        console.error('Delete institution error:', error);
        return NextResponse.json({ error: 'Failed to delete institution' }, { status: 500 });
    }
}
