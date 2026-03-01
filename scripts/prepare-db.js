const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Check if we are running on Render or using a PostgreSQL database URL
const isRender = process.env.RENDER === 'true';
const isPostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres');

if (isRender || isPostgres) {
    console.log('🌍 Production environment detected: Switching Prisma to PostgreSQL');
    schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
} else {
    console.log('🏠 Local environment detected: Ensuring Prisma uses SQLite');
    schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
}

fs.writeFileSync(schemaPath, schema);
