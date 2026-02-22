import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { id } = await params;
        const paper = await prisma.paper.findUnique({
            where: { id },
            include: {
                questions: { orderBy: [{ section: 'asc' }, { questionNumber: 'asc' }] },
                book: { select: { title: true, classLevel: true, subject: true } },
                createdBy: { select: { name: true } },
            },
        });

        if (!paper) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Only allow owner or admins to view
        if (paper.createdById !== session.user.id && session.user.role === 'TEACHER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(paper);
    } catch (error) {
        console.error('Paper detail error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
