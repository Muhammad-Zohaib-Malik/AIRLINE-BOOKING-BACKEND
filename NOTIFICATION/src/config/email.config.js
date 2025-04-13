import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export const mailSender = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

// Optional: verify transporter works
mailSender.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter is ready to send messages");
  }
});

// Optional: Send email function
export const sendEmail = async (to, subject, text) => {
  try {
    const info = await mailSender.sendMail({
      from: process.env.GMAIL_EMAIL,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
