import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_BASE = path.join(process.cwd(), 'public', 'uploads');

/**
 * Get storage path for a book
 * Structure: /uploads/books/{sourceType}/{classLevel}/{medium}/{filename}
 */
export function getBookStoragePath(sourceType, classLevel, medium, filename) {
    const ext = path.extname(filename);
    const uniqueName = `${uuidv4()}${ext}`;
    return path.join('books', sourceType, `class-${classLevel}`, medium, uniqueName);
}

/**
 * Save uploaded file to storage
 */
export async function saveFile(buffer, relativePath) {
    const fullPath = path.join(UPLOAD_BASE, relativePath);
    const dir = path.dirname(fullPath);

    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }

    await writeFile(fullPath, buffer);
    return `/uploads/${relativePath.replace(/\\/g, '/')}`;
}

/**
 * Get the public URL for a stored file
 */
export function getPublicUrl(storagePath) {
    return `/uploads/${storagePath.replace(/\\/g, '/')}`;
}

/**
 * Ensure upload directories exist
 */
export async function ensureUploadDirs() {
    const dirs = [
        path.join(UPLOAD_BASE, 'books', 'official'),
        path.join(UPLOAD_BASE, 'books', 'institution'),
        path.join(UPLOAD_BASE, 'exports'),
        path.join(UPLOAD_BASE, 'logos'),
    ];

    for (const dir of dirs) {
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }
    }
}
