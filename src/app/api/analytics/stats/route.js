import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const [institutions, teachers, books, papers] = await Promise.all([
            prisma.institution.count(),
            prisma.user.count({ where: { role: 'TEACHER' } }),
            prisma.book.count(),
            prisma.paper.count(),
        ]);

        return NextResponse.json({ institutions, teachers, books, papers });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ institutions: 0, teachers: 0, books: 0, papers: 0 });
    }
}
