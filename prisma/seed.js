const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create Super Admin
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const superAdmin = await prisma.user.upsert({
        where: { email: 'zainmushtaq5439@gmail.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'zainmushtaq5439@gmail.com',
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

    // Seed Global Settings
    const setting = await prisma.systemSetting.upsert({
        where: { key: 'autoApproveInstitutions' },
        update: {},
        create: {
            key: 'autoApproveInstitutions',
            value: 'false'
        }
    });
    console.log(`✅ SystemSetting created: autoApproveInstitutions = ${setting.value}`);

    console.log('\n📋 Test Credentials (all passwords: admin123):');
    console.log('   Super Admin: zainmushtaq5439@gmail.com');
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
