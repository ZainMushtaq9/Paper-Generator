import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
    // You must add GMAIL_APP_PASSWORD to your .env.local or Render environment
    // It should be a 16-character App Password generated from your Google Account
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'g72662271@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: '"ExamGen AI" <g72662271@gmail.com>',
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
