import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "035c80666fbc74",
    pass: "bf3a28dda72c95"
  }
});

export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
      from: '"ShopeeLaunch" <noreply@shopelaunch.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>You requested a password reset</h1>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
        <p>This link is valid for 1 hour</p>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};