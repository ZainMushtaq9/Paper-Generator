const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@examgen.pk' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@examgen.pk',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    console.log(`✅ Super Admin created: ${superAdmin.email}`);

    // Create a demo institution
    const institution = await prisma.institution.upsert({
        where: { id: 'demo-institution-001' },
        update: {},
        create: {
            id: 'demo-institution-001',
            name: 'Demo School',
            approved: true,
            email: 'demo@school.pk',
        },
    });

    console.log(`✅ Demo Institution created: ${institution.name}`);

    // Create Institution Admin
    const instAdmin = await prisma.user.upsert({
        where: { email: 'admin@school.pk' },
        update: {},
        create: {
            name: 'Institution Admin',
            email: 'admin@school.pk',
            password: hashedPassword,
            role: 'INSTITUTION_ADMIN',
            institutionId: institution.id,
        },
    });

    console.log(`✅ Institution Admin created: ${instAdmin.email}`);

    // Create Teacher
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@school.pk' },
        update: {},
        create: {
            name: 'Demo Teacher',
            email: 'teacher@school.pk',
            password: hashedPassword,
            role: 'TEACHER',
            institutionId: institution.id,
        },
    });

    console.log(`✅ Teacher created: ${teacher.email}`);

    console.log('\n📋 Test Credentials (all passwords: admin123):');
    console.log('   Super Admin: admin@examgen.pk');
    console.log('   Institution Admin: admin@school.pk');
    console.log('   Teacher: teacher@school.pk');
    console.log('\n🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
