import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET all teachers for the logged-in institution admin
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'INSTITUTION_ADMIN' || !session.user.institutionId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const teachers = await prisma.user.findMany({
            where: {
                institutionId: session.user.institutionId,
                role: 'TEACHER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: { select: { papers: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(teachers);
    } catch (error) {
        console.error('Fetch teachers error:', error);
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
    }
}

// POST create a new teacher for the institution
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'INSTITUTION_ADMIN' || !session.user.institutionId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const teacher = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'TEACHER',
                institutionId: session.user.institutionId
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: { select: { papers: true } }
            }
        });

        return NextResponse.json(teacher);
    } catch (error) {
        console.error('Create teacher error:', error);
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}
