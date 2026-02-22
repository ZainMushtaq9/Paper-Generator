import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>ExamGen <span className="gradient-text">AI</span></h3>
                        <p>
                            Free AI-powered bilingual exam paper generator for Punjab Board (PCTB) curriculum.
                            Generate professional exam papers from Class 1-12 textbooks in Urdu & English.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <Link href="/books">Book Library</Link>
                        <Link href="/papers/generate">Generate Paper</Link>
                        <Link href="/dashboard">Dashboard</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Legal</h4>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/sitemap.xml">Sitemap</Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ExamGen AI. All rights reserved.</p>
                    <p>
                        Books sourced from{' '}
                        <a href="https://ptbb.punjab.gov.pk/E-Books" target="_blank" rel="noopener noreferrer">
                            Punjab Curriculum & Textbook Board (PCTB)
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
