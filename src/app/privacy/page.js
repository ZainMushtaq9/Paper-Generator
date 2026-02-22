import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy | ExamGen AI',
    description: 'Privacy Policy for ExamGen AI - the free bilingual exam paper generator.',
};

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container container-md" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
                    <h1 style={{ marginBottom: 'var(--space-8)' }}>Privacy <span className="gradient-text">Policy</span></h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-sm)' }}>
                        Last updated: February 2026
                    </p>

                    {[
                        {
                            title: '1. Information We Collect',
                            body: 'We collect information you provide when registering an account (name, email, institution name). We also collect usage data such as papers generated, books accessed, and session information to improve our service and prevent abuse.',
                        },
                        {
                            title: '2. How We Use Your Information',
                            body: 'Your information is used to provide the exam paper generation service, enforce daily usage limits (5 papers/day per teacher), send important service notifications, and improve the platform. We do not sell your personal data to third parties.',
                        },
                        {
                            title: '3. Google AdSense',
                            body: 'ExamGen AI uses Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out of personalized advertising by visiting Google\'s Ads Settings. For more information, see Google\'s Privacy & Terms.',
                        },
                        {
                            title: '4. Cookies',
                            body: 'We use cookies to maintain your login session, remember your theme preference (dark/light mode), and cache book data for faster loading. Google AdSense also places cookies for ad personalization. You can control cookies through your browser settings.',
                        },
                        {
                            title: '5. Book Content',
                            body: 'All official PCTB textbooks used in this platform are sourced from the official Punjab Curriculum & Textbook Board (PCTB) portal and are provided free for educational use by the Government of Punjab. We do not claim ownership of these materials.',
                        },
                        {
                            title: '6. Data Security',
                            body: 'We implement industry-standard security measures including password hashing (bcrypt), secure HTTPS connections, and protected API routes. Your password is never stored in plain text.',
                        },
                        {
                            title: '7. Data Retention',
                            body: 'Your account data and generated papers are retained as long as your account is active. You may request deletion of your account and all associated data by contacting us at zainmushtaq5439@gmail.com.',
                        },
                        {
                            title: '8. Children\'s Privacy',
                            body: 'ExamGen AI is designed for teachers and educational administrators. We do not knowingly collect information from children under 13. If you believe a child has provided us with information, please contact us immediately.',
                        },
                        {
                            title: '9. Contact Us',
                            body: 'If you have any questions about this Privacy Policy, please contact us at: zainmushtaq5439@gmail.com',
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
