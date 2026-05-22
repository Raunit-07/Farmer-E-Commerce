import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * ================= REQUIRED ENV CHECK =================
 */

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`⚠ Missing email env: ${key}`);
  }
}

/**
 * ================= MAIL TRANSPORTER =================
 * Production-safe Railway/Gmail config
 */

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",

  port: Number(process.env.SMTP_PORT || 587),

  secure: false, // true only for port 465

  requireTLS: true,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  tls: {
    rejectUnauthorized: false,
    family: 4, // Force IPv4 (fixes Railway IPv6 ENETUNREACH issue)
  },
});

/**
 * ================= VERIFY SMTP =================
 */

export const verifyMailer = async () => {
  try {
    await transporter.verify();

    console.log("✅ SMTP SERVER READY");
  } catch (error) {
    console.error("❌ SMTP ERROR:", error.message);

    if (error.code) {
      console.error("Code:", error.code);
    }

    if (error.response) {
      console.error("Response:", error.response);
    }
  }
};

verifyMailer();

/**
 * ================= SEND MAIL =================
 */

export const sendMail = async ({
  to,
  subject,
  html,
  text,
}) => {
  try {
    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      throw new Error(
        "SMTP credentials missing"
      );
    }

    const mailOptions = {
      from: `"AgroMitra" <${
        process.env.SMTP_FROM ||
        process.env.SMTP_USER
      }>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(
      mailOptions
    );

    console.log(
      "📩 Email sent:",
      info.messageId
    );

    return info;
  } catch (error) {
    console.error(
      "❌ Send Mail Error:",
      error.message
    );

    throw error;
  }
};