import Script from 'next/script';
import AuthProvider from '@/components/AuthProvider';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://aiclinix.online'),
  title: {
    default: 'AiClinix — Free AI Exam Paper Generator for Pakistani Schools | Class 1-12',
    template: '%s | AiClinix - AI Exam Paper Generator'
  },
  description: 'Free AI exam paper generator for Pakistani schools. Create exam papers from PCTB textbooks in seconds. Supports Class 1 to 12, Urdu and English, MCQs, short questions, and long questions. 100+ official Punjab Textbook Board books pre-loaded. No typing needed — just select a book and generate.',
  keywords: [
    'exam paper generator', 'AI exam paper maker', 'free exam generator Pakistan',
    'PCTB exam paper', 'Punjab textbook paper generator', 'online paper generator',
    'Class 9 exam paper', 'Class 10 exam paper', 'Class 11 exam paper', 'Class 12 exam paper',
    'MCQ generator from book', 'Urdu exam paper maker', 'English exam paper generator',
    'matric exam paper generator', 'inter exam paper maker', 'FSC paper generator',
    'AI question generator', 'automatic exam paper from PDF', 'school test maker',
    'teacher exam tool Pakistan', 'generate paper from textbook', 'board exam paper creator',
    'past paper generator', 'smart paper generator', 'AI education tool Pakistan',
    'exam paper PDF download', 'bilingual exam paper', 'exam paper with answer key',
    'free online test maker for teachers', 'PCTB books online', 'Punjab school books PDF',
    'aiclinix', 'exam gen AI', 'paper generation AI',
  ],
  authors: [{ name: 'ExamGen AI' }],
  creator: 'Zain Mushtaq',
  publisher: 'ExamGen AI',
  category: 'Education',
  classification: 'Education/Exam Tools',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: 'https://aiclinix.online' },
  openGraph: {
    title: 'AiClinix — Free AI Exam Paper Generator for Pakistani Schools',
    description: 'Create exam papers from PCTB textbooks in seconds. 100+ official Punjab books pre-loaded. Supports Class 1-12, Urdu and English. Free for teachers.',
    url: 'https://aiclinix.online',
    siteName: 'AiClinix',
    locale: 'en_PK',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AiClinix - Free AI Exam Paper Generator for Pakistan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiClinix — Free AI Exam Paper Generator',
    description: 'Generate exam papers from any Pakistani textbook in seconds. 100+ PCTB books pre-loaded. Free for teachers. Supports Urdu and English.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
    'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a1a" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ExamGen AI',
              url: 'https://aiclinix.online',
              description: 'Free AI-powered bilingual exam paper generator. Supports Class 1-12 in Urdu and English.',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web Browser',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
              author: { '@type': 'Organization', name: 'ExamGen AI' },
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '250' },
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && process.env.NEXT_PUBLIC_ADSENSE_ID !== 'ca-pub-XXXXXXXXXXXXXXXX' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
