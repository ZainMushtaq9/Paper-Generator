import Script from 'next/script';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://examgen.pk'),
  title: {
    default: 'ExamGen AI — Bilingual Exam Paper Generator | Punjab Board',
    template: '%s | ExamGen AI'
  },
  description: 'Free AI-powered bilingual exam paper generator for Punjab Board (PCTB) curriculum. Generate professional exam papers from Class 1-12 textbooks in Urdu & English with AI validation.',
  keywords: ['exam paper generator', 'Punjab board', 'PCTB', 'bilingual', 'AI exam creator', 'Urdu', 'English', 'Class 9', 'Class 10', 'MCQs', 'past papers'],
  authors: [{ name: 'Zain Mushtaq' }],
  creator: 'Zain Mushtaq',
  publisher: 'ExamGen AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ExamGen AI — Bilingual Exam Paper Generator',
    description: 'Free AI-powered exam paper generator for Punjab Board curriculum.',
    url: 'https://examgen.pk',
    siteName: 'ExamGen AI',
    locale: 'en_PK',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a1a" />
        <link rel="icon" href="/favicon.ico" />
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
        {children}
      </body>
    </html>
  );
}
