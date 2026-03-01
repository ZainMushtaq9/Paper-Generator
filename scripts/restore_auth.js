const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let restoredCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Backend getServerSession restore
    if (content.includes('// --- AUTH BYPASS ---')) {
        content = content.replace(
            /\/\/ --- AUTH BYPASS ---\n\/\/ import { getServerSession } from 'next-auth';\nconst getServerSession = async \(\) => \(\{ user: \{ id: 'test-admin', role: 'SUPER_ADMIN', email: 'admin@test.com', name: 'Test Admin' \} \}\);\n\/\/ --- END AUTH BYPASS ---/g, 
            "import { getServerSession } from 'next-auth';"
        );
        
        // 2. Middleware restore
        content = content.replace(
            /export async function middleware\(request\) \{\n    \/\/ --- AUTH BYPASS ---\n    return NextResponse\.next\(\);\n    \/\/ --- END AUTH BYPASS ---/g,
            "export async function middleware(request) {"
        );

        // 3. Frontend SessionProvider restore
        content = content.replace(
            /\/\/ --- AUTH BYPASS ---\n    const mockSession = \{ user: \{ id: 'test-admin', role: 'SUPER_ADMIN', email: 'admin@test.com', name: 'Test Admin' \}, expires: '2099-01-01T00:00:00.000Z' \};\n    return <SessionProvider session=\{mockSession\}>\{children\}<\/SessionProvider>;\n    \/\/ --- END AUTH BYPASS ---/g,
            "return <SessionProvider>{children}</SessionProvider>;"
        );

        fs.writeFileSync(file, content, 'utf8');
        console.log(`Restored ${file}`);
        restoredCount++;
    }
});

console.log(`\nSuccessfully restored ${restoredCount} files to use original authentication.`);
