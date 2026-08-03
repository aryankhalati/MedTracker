const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

const sendEmail = async (to, subject, html) => {
    await brevo.transactionalEmails.sendTransacEmail({
        subject,
        htmlContent: html,
        sender: { name: 'MedTracker', email: 'aryankhalati9@gmail.com' },
        to: [{ email: to }]
    });
};

module.exports = sendEmail;