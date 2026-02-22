const fs = require('fs');
const path = require('path');
const https = require('https');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(resolve);
            });
        }).on('error', function (err) {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function main() {
    console.log('Downloading sample PDF...');
    const uploadDir = path.join(__dirname, '../public/uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `sample-physics-class9-${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    // Using a known reliable small public PDF
    await downloadFile('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', filePath);
    console.log(`Saved sample PDF to: ${filePath}`);

    // Create a dummy user if none exists to assign 'createdBy'
    const superAdmin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (!superAdmin) {
        console.error('Super admin not found. Cannot add official book.');
        process.exit(1);
    }

    // Add book to DB
    const book = await prisma.book.create({
        data: {
            title: 'Physics (Class 9 - Demo)',
            classLevel: '9',
            subject: 'Physics',
            medium: 'english',
            board: 'PCTB',
            sourceType: 'official',
            uploadType: 'pdf_text',
            storagePath: `/uploads/${fileName}`,
            ocrStatus: 'completed',
            createdById: superAdmin.id
        }
    });

    console.log(`✅ Added Book to DB: ${book.title}`);

    // Add some sample BookContent to simulate indexed text
    const sampleText = `Newton's laws of motion are three basic laws of classical mechanics that describe the relationship between the motion of an object and the forces acting on it. 
    First law: In an inertial frame of reference, an object either remains at rest or continues to move at a constant velocity, unless acted upon by a force.
    Second law: In an inertial frame of reference, the vector sum of the forces F on an object is equal to the mass m of that object multiplied by the acceleration a of the object: F = ma.
    Third law: When one body exerts a force on a second body, the second body simultaneously exerts a force equal in magnitude and opposite in direction on the first body.`;

    await prisma.bookContent.createMany({
        data: [
            {
                bookId: book.id,
                chapterName: 'Chapter 3: Dynamics',
                topicName: 'Newton\'s Laws',
                pageNumber: 1,
                textContent: sampleText,
                contentType: 'paragraph',
                confidence: 99.5
            },
            {
                bookId: book.id,
                chapterName: 'Chapter 3: Dynamics',
                topicName: 'Momentum',
                pageNumber: 2,
                textContent: 'Momentum is the product of the mass and velocity of an object. It is a vector quantity, possessing a magnitude and a direction. If m is an object\'s mass and v is its velocity (also a vector quantity), then the object\'s momentum p is: p = mv.',
                contentType: 'definition',
                confidence: 98.2
            }
        ]
    });

    console.log(`✅ Added indexed content for ${book.title}`);
    console.log('\nBook added successfully. You can view and delete it from the frontend UI.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
