import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = params;

        const book = await prisma.book.findUnique({
            where: { id },
            include: {
                contents: {
                    orderBy: { pageNumber: 'asc' },
                },
                createdBy: { select: { name: true, email: true } },
                institution: { select: { name: true } },
                _count: { select: { contents: true, papers: true } },
            },
        });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json(book);
    } catch (error) {
        console.error('Book detail error:', error);
        return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        const book = await prisma.book.findUnique({ where: { id } });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        if (book.sourceType === 'official') {
            return NextResponse.json({ error: 'Cannot delete official books' }, { status: 403 });
        }

        await prisma.book.delete({ where: { id } });

        return NextResponse.json({ message: 'Book deleted' });
    } catch (error) {
        console.error('Book delete error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
