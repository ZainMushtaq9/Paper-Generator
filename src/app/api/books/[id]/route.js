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

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const book = await prisma.book.findUnique({ where: { id } });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Only super admins can delete official books
        if (book.sourceType === 'official' && session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Cannot delete official books' }, { status: 403 });
        }

        // Institution admins can only delete their own books
        if (book.sourceType === 'institution' && session.user.role === 'INSTITUTION_ADMIN' && book.institutionId !== session.user.institutionId) {
            return NextResponse.json({ error: 'Unauthorized to delete this book' }, { status: 403 });
        }

        // Teachers cannot delete any books
        if (session.user.role === 'TEACHER') {
            return NextResponse.json({ error: 'Teachers cannot delete books' }, { status: 403 });
        }

        // Delete associated contents first (Prisma might cascade this depending on schema, but safe to do explicitly or rely on schema)
        await prisma.bookContent.deleteMany({ where: { bookId: id } });
        await prisma.book.delete({ where: { id } });

        return NextResponse.json({ message: 'Book deleted' });
    } catch (error) {
        console.error('Book delete error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
