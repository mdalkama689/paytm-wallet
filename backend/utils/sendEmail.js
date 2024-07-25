import nodemailer from "nodemailer";

const sendEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.YOUR_EMAIL,
      pass: process.env.YOUR_EMAIL_APP_PASSWORD,
    },
  });
  const subject = `Paytm Wallet - Password Reset Request`;
  const html = `
      <p>Hi there,</p>
      <p>It looks like you requested a password reset for your Paytm Wallet account. To reset your password, please click the link below:</p>
      <a href="${resetLink}" style="background-color: #f4f4f4; padding: 10px; display: inline-block; text-decoration: none;">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p>Best regards,<br>Paytm Wallet Team</p>`;

  const mailOptions = {
    from: process.env.YOUR_EMAIL,
    to: email,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export default sendEmail;
