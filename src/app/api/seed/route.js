import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// This route auto-seeds the database if no Super Admin exists.
// Credentials are read from environment variables for security.
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

        // Read credentials from env or use secure defaults
        const adminEmail = process.env.ADMIN_EMAIL || 'superadmin@aiclinix.online';
        const adminPassword = process.env.ADMIN_PASSWORD || 'AiClinix@2026!';

        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create Super Admin
        const superAdmin = await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
            },
        });

        // Create demo institution
        const institution = await prisma.institution.create({
            data: {
                name: 'Demo School',
                approved: true,
                email: 'info@aiclinix.online',
            },
        });

        // Create Institution Admin
        const instPassword = process.env.INST_ADMIN_PASSWORD || 'InstAdmin@2026!';
        await prisma.user.create({
            data: {
                name: 'Institution Admin',
                email: process.env.INST_ADMIN_EMAIL || 'admin@aiclinix.online',
                password: await bcrypt.hash(instPassword, 12),
                role: 'INSTITUTION_ADMIN',
                institutionId: institution.id,
            },
        });

        // Create Teacher
        const teacherPassword = process.env.TEACHER_PASSWORD || 'Teacher@2026!';
        await prisma.user.create({
            data: {
                name: 'Demo Teacher',
                email: process.env.TEACHER_EMAIL || 'teacher@aiclinix.online',
                password: await bcrypt.hash(teacherPassword, 12),
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
        });

    } catch (error) {
        console.error('Auto-seed error:', error);
        return NextResponse.json({ error: 'Seed failed: ' + error.message }, { status: 500 });
    }
}
