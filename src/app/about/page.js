import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'About ExamGen AI | Punjab Board Exam Paper Generator',
    description: 'Learn about ExamGen AI, a free AI-powered bilingual exam paper generator for Punjab Board (PCTB) curriculum. Built for Pakistani teachers.',
};

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container container-md" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
                    <h1 style={{ marginBottom: 'var(--space-4)' }}>About <span className="gradient-text">ExamGen AI</span></h1>

                    <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                            ExamGen AI is a free, AI-powered bilingual exam paper generator built specifically for the
                            Pakistan education system. Our platform helps teachers create professional, curriculum-aligned
                            exam papers from official Punjab Curriculum &amp; Textbook Board (PCTB) textbooks in minutes,
                            not hours.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            We believe every teacher in Pakistan deserves access to modern AI tools that save time and
                            improve the quality of education. That&apos;s why ExamGen AI is completely free, powered by
                            Google AdSense for sustainability.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>What We Offer</h2>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {[
                                '📚 Official PCTB textbooks from Class 1–12 pre-loaded',
                                '🧠 AI-powered question generation with page references',
                                '🌐 Full bilingual support (Urdu & English with RTL)',
                                '🔬 Advanced OCR for scanned textbook PDFs',
                                '✅ AI validation engine with confidence scoring',
                                '📄 Professional PDF export with institution branding',
                                '🏫 Multi-institution support with role-based access',
                                '🆓 Completely free for all teachers',
                            ].map((item, i) => (
                                <li key={i} style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
                        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Book Sources</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            All official Punjab Board textbooks are sourced from the official{' '}
                            <a href="https://ptbb.punjab.gov.pk/E-Books" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-400)' }}>
                                Punjab Curriculum &amp; Textbook Board (PCTB) E-Books Portal
                            </a>
                            . These books are free for educational use as provided by the Government of Punjab.
                            We do not host any copyrighted materials and comply fully with PCTB guidelines.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Technology</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                            Built with Next.js, powered by Groq&apos;s LLaMA AI model, with Tesseract OCR for scanned
                            PDFs. Our anti-hallucination system ensures every question is grounded in actual book content
                            with page references.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            <strong>Developer:</strong> Zain Mushtaq &mdash;{' '}
                            <a href="mailto:mushtaqzain180@gmail.com" style={{ color: 'var(--primary-400)' }}>
                                mushtaqzain180@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
