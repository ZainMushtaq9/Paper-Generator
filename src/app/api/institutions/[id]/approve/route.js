import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        await prisma.institution.update({
            where: { id },
            data: { approved: true },
        });

        return NextResponse.json({ message: 'Institution approved' });
    } catch (error) {
        console.error('Approve error:', error);
        return NextResponse.json({ error: 'Failed to approve' }, { status: 500 });
    }
}
