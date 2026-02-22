import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const where = {};
        if (session.user.role === 'TEACHER') {
            where.createdById = session.user.id;
        } else if (session.user.role === 'INSTITUTION_ADMIN') {
            where.createdBy = { institutionId: session.user.institutionId };
        }

        const papers = await prisma.paper.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                book: { select: { title: true } },
                _count: { select: { questions: true } },
            },
        });

        // Count today's papers for rate limiting
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const dailyCount = await prisma.paper.count({
            where: {
                createdById: session.user.id,
                createdAt: { gte: todayStart },
            },
        });

        return NextResponse.json({ papers, dailyCount });
    } catch (error) {
        console.error('Papers list error:', error);
        return NextResponse.json({ papers: [], dailyCount: 0 }, { status: 500 });
    }
}
