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
let patchedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Backend getServerSession bypass
    if (content.match(/import\s+{\s*getServerSession\s*}\s+from\s+['"]next-auth['"];?/)) {
        content = content.replace(/import\s+{\s*getServerSession\s*}\s+from\s+['"]next-auth['"];?/, 
            "// --- AUTH BYPASS ---\n" +
            "// import { getServerSession } from 'next-auth';\n" +
            "const getServerSession = async () => ({ user: { id: 'test-admin', role: 'SUPER_ADMIN', email: 'admin@test.com', name: 'Test Admin' } });\n" +
            "// --- END AUTH BYPASS ---"
        );
        changed = true;
    }

    // 2. Middleware bypass
    if (file.replace(/\\/g, '/').endsWith('src/middleware.js') && !content.includes('AUTH BYPASS')) {
        content = content.replace(/export async function middleware\(request\) \{/, 
            "export async function middleware(request) {\n    // --- AUTH BYPASS ---\n    return NextResponse.next();\n    // --- END AUTH BYPASS ---"
        );
        changed = true;
    }

    // 3. Frontend SessionProvider bypass
    if (file.replace(/\\/g, '/').endsWith('src/components/AuthProvider.js') && !content.includes('AUTH BYPASS')) {
        content = content.replace(/return <SessionProvider>\{children\}<\/SessionProvider>;/, 
            "// --- AUTH BYPASS ---\n" +
            "    const mockSession = { user: { id: 'test-admin', role: 'SUPER_ADMIN', email: 'admin@test.com', name: 'Test Admin' }, expires: '2099-01-01T00:00:00.000Z' };\n" +
            "    return <SessionProvider session={mockSession}>{children}</SessionProvider>;\n" +
            "    // --- END AUTH BYPASS ---"
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Patched ${file}`);
        patchedCount++;
    }
});

console.log(`\nSuccessfully patched ${patchedCount} files to bypass authentication.`);
