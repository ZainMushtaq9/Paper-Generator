import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const institutions = await prisma.institution.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { users: true, books: true } }
            }
        });
        return NextResponse.json(institutions);
    } catch (error) {
        console.error('Institutions error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
