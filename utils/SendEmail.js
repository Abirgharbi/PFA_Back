import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const sendEmail = async (to, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your 2FA Verification Code',
    text: `Your 2FA code is: ${code}. It expires in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
