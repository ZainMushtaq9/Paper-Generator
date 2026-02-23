import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const baseUrl = 'https://aiclinix.online';

    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
        { url: '/terms', priority: '0.5', changefreq: 'yearly' },
        { url: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
        { url: '/books', priority: '0.9', changefreq: 'daily' },
        { url: '/auth/login', priority: '0.6', changefreq: 'monthly' },
        { url: '/auth/register', priority: '0.6', changefreq: 'monthly' },
    ];

    try {
        const books = await prisma.book.findMany({
            select: { id: true, createdAt: true },
            where: { sourceType: 'official' }
        });

        books.forEach(book => {
            staticPages.push({
                url: `/books/${book.id}`,
                priority: '0.8',
                changefreq: 'weekly',
                lastmod: book.createdAt.toISOString().split('T')[0]
            });
        });
    } catch (e) { console.error('Sitemap DB Error:', e); }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}
