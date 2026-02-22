import './globals.css';

export const metadata = {
  title: 'ExamGen AI — Bilingual Exam Paper Generator | Punjab Board',
  description: 'Free AI-powered bilingual exam paper generator for Punjab Board (PCTB) curriculum. Generate professional exam papers from Class 1-12 textbooks in Urdu & English with AI validation.',
  keywords: 'exam paper generator, Punjab board, PCTB, bilingual, AI, Urdu, English, Class 9, Class 10, MCQs, past papers',
  authors: [{ name: 'Zain Mushtaq' }],
  openGraph: {
    title: 'ExamGen AI — Bilingual Exam Paper Generator',
    description: 'Free AI-powered exam paper generator for Punjab Board curriculum.',
    type: 'website',
    locale: 'en_PK',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a1a" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
