import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// This route auto-seeds the database if no Super Admin exists.
// It runs safely — if users already exist, it does nothing.
export async function GET() {
    try {
        // Check if Super Admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'SUPER_ADMIN' }
        });

        if (existingAdmin) {
            return NextResponse.json({
                message: 'Database already seeded',
                admin: existingAdmin.email
            });
        }

        // Seed the database
        const hashedPassword = await bcrypt.hash('admin123', 12);

        // Create Super Admin
        const superAdmin = await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: 'zainmushtaq5439@gmail.com',
                password: hashedPassword,
                role: 'SUPER_ADMIN',
            },
        });

        // Create demo institution
        const institution = await prisma.institution.create({
            data: {
                name: 'Demo School',
                approved: true,
                email: 'demo@school.pk',
            },
        });

        // Create Institution Admin
        await prisma.user.create({
            data: {
                name: 'Institution Admin',
                email: 'admin@school.pk',
                password: hashedPassword,
                role: 'INSTITUTION_ADMIN',
                institutionId: institution.id,
            },
        });

        // Create Teacher
        await prisma.user.create({
            data: {
                name: 'Demo Teacher',
                email: 'teacher@school.pk',
                password: hashedPassword,
                role: 'TEACHER',
                institutionId: institution.id,
            },
        });

        // Create default system setting
        await prisma.systemSetting.upsert({
            where: { key: 'autoApproveInstitutions' },
            update: {},
            create: { key: 'autoApproveInstitutions', value: 'false' },
        });

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully!',
            admin: superAdmin.email,
            credentials: {
                superAdmin: 'zainmushtaq5439@gmail.com / admin123',
                institutionAdmin: 'admin@school.pk / admin123',
                teacher: 'teacher@school.pk / admin123',
            }
        });

    } catch (error) {
        console.error('Auto-seed error:', error);
        return NextResponse.json({ error: 'Seed failed: ' + error.message }, { status: 500 });
    }
}
