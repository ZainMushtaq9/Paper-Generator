import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
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
