const nodemailer = require('nodemailer');
const config = require('../config/email');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }

  // Specific email methods
  async sendWelcomeEmail(user) {
    return this.sendEmail({
      email: user.email,
      subject: 'Welcome to our platform',
      html: `<h1>Welcome ${user.name}!</h1><p>We're glad to have you on board.</p>`
    });
  }

  async sendPasswordReset(user, resetToken) {
    return this.sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">here</a> to reset your password.</p>`
    });
  }
}

module.exports = new EmailService(); 