import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const { institutionName, name, email, password } = await request.json();

        // Validate
        if (!institutionName || !name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        // Check if email exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create institution
        const institution = await prisma.institution.create({
            data: {
                name: institutionName,
                email: email,
                approved: false,
            },
        });

        // Create institution admin user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'INSTITUTION_ADMIN',
                institutionId: institution.id,
            },
        });

        // Log analytics
        await prisma.analytics.create({
            data: {
                eventType: 'user_registered',
                userId: user.id,
                metadata: JSON.stringify({ institutionName, role: 'INSTITUTION_ADMIN' }),
            },
        });

        return NextResponse.json({
            message: 'Registration successful. Pending admin approval.',
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
