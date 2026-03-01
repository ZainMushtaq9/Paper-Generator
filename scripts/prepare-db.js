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

    // Render build phase sometimes lacks env vars; inject dummy URL for Prisma Generation to pass
    if (!process.env.DATABASE_URL) {
        console.log('⚠️ DATABASE_URL is missing during build context. Injecting dummy URL for Prisma Validation.');
        schema = schema.replace(/url\s*=\s*env\("DATABASE_URL"\)/, 'url = "postgresql://dummy:dummy@localhost:5432/dummy"');
    }

} else {
    console.log('🏠 Local environment detected: Ensuring Prisma uses SQLite');
    schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
}

fs.writeFileSync(schemaPath, schema);
