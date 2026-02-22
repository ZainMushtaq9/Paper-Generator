import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms of Service | ExamGen AI',
    description: 'Terms of Service for ExamGen AI - the free bilingual exam paper generator for Punjab Board.',
};

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container container-md" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
                    <h1 style={{ marginBottom: 'var(--space-8)' }}>Terms of <span className="gradient-text">Service</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>
                        Last updated: February 2026
                    </p>

                    {[
                        {
                            title: '1. Acceptance of Terms',
                            body: 'By using ExamGen AI, you agree to these Terms of Service. If you do not agree, please do not use the platform. These terms apply to all users including teachers, institution admins, and super administrators.',
                        },
                        {
                            title: '2. Permitted Use',
                            body: 'ExamGen AI is provided for legitimate educational purposes only. You may use the platform to generate exam papers for classes you teach, upload educational materials you own the rights to, and share generated papers with your students.',
                        },
                        {
                            title: '3. Prohibited Activities',
                            body: 'You may NOT: upload copyrighted books or materials you do not have rights to; use the platform to generate content for cheating or academic fraud; attempt to bypass rate limits or security measures; share your account credentials with others; scrape or bulk download content; use the service for any illegal purpose.',
                        },
                        {
                            title: '4. Official Book Content',
                            body: 'All official PCTB textbooks are sourced from the official Punjab Curriculum & Textbook Board portal and are provided free for educational use under government authorization. Teachers may not modify, remove, or misrepresent official book content.',
                        },
                        {
                            title: '5. Usage Limits',
                            body: 'Free accounts are limited to 5 paper generations per teacher per day. These limits exist to prevent abuse and ensure the service remains available for all users. Attempting to circumvent limits will result in account suspension.',
                        },
                        {
                            title: '6. Content Ownership',
                            body: 'You retain ownership of papers you generate using this platform. ExamGen AI claims no ownership over generated exam papers. However, you grant us a non-exclusive license to store generated papers on our servers to provide the service.',
                        },
                        {
                            title: '7. Advertising',
                            body: 'ExamGen AI is free and supported by Google AdSense advertising. By using the service, you consent to the display of advertisements. Ad blockers may affect functionality. We are not responsible for the content of third-party advertisements.',
                        },
                        {
                            title: '8. Disclaimer of Warranties',
                            body: 'ExamGen AI is provided "as is" without warranties of any kind. We do not guarantee 100% accuracy of AI-generated questions. Always review generated papers before distribution. We are not liable for any errors in generated content.',
                        },
                        {
                            title: '9. Account Termination',
                            body: 'We reserve the right to terminate accounts that violate these terms. Institution accounts may be suspended if the institution\'s approval is revoked by the Super Administrator.',
                        },
                        {
                            title: '10. Contact',
                            body: 'For questions about these terms, contact: zainmushtaq5439@gmail.com',
                        },
                    ].map((section, i) => (
                        <div key={i} className="glass-card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-lg)' }}>{section.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--text-sm)' }}>{section.body}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
