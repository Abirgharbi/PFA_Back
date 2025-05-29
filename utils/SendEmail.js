import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendEmail = async (to, code) => {
  const mailOptions = {
    from: `"MediArchive" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your 2FA Verification Code",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
        <div style="background-color: #007bff; color: white; padding: 16px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
          <h2 style="margin: 0;">MediArchive</h2>
        </div>
        <div style="padding: 24px; color: #333;">
  <p style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Hello,</p>
          <p>Your two-factor authentication (2FA) verification code is:</p>
          <p style="font-size: 28px; font-weight: bold; color: #007bff; letter-spacing: 4px; margin: 20px 0;">${code}</p>
          <p>This code will expire in <span style="color: red; font-weight: bold;">24 hours</span>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="font-size: 12px; color: #999;">If you did not request this code, please ignore this email.</p>
        </div>
        <div style="background-color: #f0f4f8; text-align: center; padding: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 12px; color: #666;">
          &copy; ${new Date().getFullYear()} MediArchive. All rights reserved.
        </div>
      </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
export const sendEmailadding = async (to, code, link) => {
  const mailOptions = {
    from: `"MediArchive" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You're Invited",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f0f4f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
          <div style="background-color: #28a745; color: white; padding: 16px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <h2 style="margin: 0;">MediArchive</h2>
          </div>
          <div style="padding: 24px; color: #333;">
            <p style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">You're Invited!</p>
            <p>A doctor has invited you to link your account.</p>
            <p style="margin: 20px 0;">
              <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Accept Invitation
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${link}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            <p style="font-size: 12px; color: #999;">If you were not expecting this email, you can safely ignore it.</p>
          </div>
          <div style="background-color: #f0f4f8; text-align: center; padding: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 12px; color: #666;">
            &copy; ${new Date().getFullYear()} MediArchive. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

