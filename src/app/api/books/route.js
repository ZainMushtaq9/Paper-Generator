import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const classLevel = searchParams.get('class');
        const subject = searchParams.get('subject');
        const medium = searchParams.get('medium');
        const sourceType = searchParams.get('source');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where = {};
        if (classLevel) where.classLevel = classLevel;
        if (subject) where.subject = { contains: subject };
        if (medium) where.medium = medium;
        if (sourceType) where.sourceType = sourceType;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { subject: { contains: search } },
            ];
        }

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: { select: { contents: true } },
                    createdBy: { select: { name: true } },
                },
            }),
            prisma.book.count({ where }),
        ]);

        return NextResponse.json({
            books,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Books list error:', error);
        return NextResponse.json({ books: [], total: 0 }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const title = formData.get('title');
        const classLevel = formData.get('classLevel');
        const subject = formData.get('subject');
        const medium = formData.get('medium') || 'english';
        const sourceType = formData.get('sourceType') || 'institution';

        if (!file || !title || !classLevel || !subject) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = path.extname(file.name) || '.pdf';
        const uniqueName = `${uuidv4()}${ext}`;
        const relativePath = path.join('books', sourceType, `class-${classLevel}`, medium, uniqueName);
        const fullPath = path.join(process.cwd(), 'public', 'uploads', relativePath);
        const dir = path.dirname(fullPath);

        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }

        await writeFile(fullPath, buffer);

        // Create book record
        const book = await prisma.book.create({
            data: {
                title,
                classLevel,
                subject,
                medium,
                sourceType,
                storagePath: `/uploads/${relativePath.replace(/\\/g, '/')}`,
                fileSize: buffer.length,
                uploadType: ext === '.pdf' ? 'pdf_text' : 'image',
            },
        });

        // Log analytics
        await prisma.analytics.create({
            data: {
                eventType: 'book_uploaded',
                metadata: JSON.stringify({ bookId: book.id, title, sourceType }),
            },
        });

        return NextResponse.json({ book, message: 'Book uploaded successfully' });
    } catch (error) {
        console.error('Book upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
