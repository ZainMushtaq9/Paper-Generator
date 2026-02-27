const fetch = require('node-fetch');

async function testGenerate() {
    const seedRes = await fetch('http://localhost:3000/api/seed-books');
    console.log('Seed Books:', await seedRes.text());

    // Wait 1 second
    await new Promise(r => setTimeout(r, 1000));

    console.log('Testing Paper Generation from Syllabus Knowledge...');
    const res = await fetch('http://localhost:3000/api/papers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bookId: 'dummy-not-needed-for-this-test', // We'll mock it by just bypassing bookId check mentally, wait, we need a real bookId
            title: 'Class 9 Physics Test',
            classLevel: '9',
            subject: 'Physics',
            language: 'english',
            difficulty: 'Easy',
            sections: [{ type: 'mcq', count: 3, marks: 1 }],
            bookName: 'Physics 9 PCTB'
        })
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
}

// But I need a book ID. Let's do a direct Prisma query for a book id first.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const book = await prisma.book.findFirst({ where: { classLevel: "9", subject: "Physics" } });
    console.log("Found book:", book?.id);

    const res = await fetch('http://localhost:3000/api/papers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bookId: book.id,
            title: 'Class 9 Physics Test',
            classLevel: '9',
            subject: 'Physics',
            language: 'english',
            difficulty: 'Easy',
            sections: [{ type: 'mcq', count: 2, marks: 1, attemptCount: 2 }],
            bookName: 'Physics 9 PCTB'
        })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Generation Result:', JSON.stringify(data, null, 2));
}

run();
