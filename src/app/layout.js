import Script from 'next/script';
import AuthProvider from '@/components/AuthProvider';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://examgen.pk'),
  title: {
    default: 'ExamGen AI — Free AI Exam Paper Generator | Urdu & English',
    template: '%s | ExamGen AI'
  },
  description: 'Free AI-powered bilingual exam paper generator for any curriculum. Generate professional exam papers from Class 1-12 textbooks, notes, or uploaded PDFs in Urdu & English with AI validation, MCQs, short & long questions.',
  keywords: [
    'exam paper generator', 'any board', 'bilingual', 'AI exam creator',
    'Urdu exam paper', 'English exam paper', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
    'MCQs generator', 'past papers', 'Pakistan education',
    'free exam paper maker', 'AI question generator', 'online paper generator Pakistan',
    'exam paper PDF download', 'bilingual paper generator', 'smart exam creator',
    'teacher exam tool Pakistan', 'generate paper from book', 'automatic exam paper',
    'school exam paper generator', 'board exam questions', 'AI education Pakistan',
    'matric exam paper', 'inter exam paper', 'FSC exam paper generator',
  ],
  authors: [{ name: 'Zain Mushtaq', url: 'https://github.com/ZainMushtaq9' }],
  creator: 'Zain Mushtaq',
  publisher: 'ExamGen AI',
  category: 'Education',
  classification: 'Education/Exam Tools',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: 'https://examgen.pk' },
  openGraph: {
    title: 'ExamGen AI — Free AI Exam Paper Generator',
    description: 'Create professional bilingual exam papers from any textbooks or notes. AI-powered with anti-hallucination & page references. Free forever.',
    url: 'https://examgen.pk',
    siteName: 'ExamGen AI',
    locale: 'en_PK',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ExamGen AI — Free AI Exam Paper Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExamGen AI — Free AI Exam Paper Generator',
    description: 'Generate professional bilingual exam papers from any uploaded textbooks or notes. Free, AI-powered, supports Urdu & English.',
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
              url: 'https://examgen.pk',
              description: 'Free AI-powered bilingual exam paper generator. Supports Class 1-12 in Urdu and English.',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web Browser',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
              author: { '@type': 'Person', name: 'Zain Mushtaq', url: 'https://github.com/ZainMushtaq9' },
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
