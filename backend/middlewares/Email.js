import { transporter } from "../config/emailConfig.js";
import {
    generatePasswordResetTemplate,
    generateVerificationEmailTemplate,
    generateWelcomeEmailTemplate,
} from "../templetes/emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationCode = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Blogify" <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Verify Your Email ✔", // Subject line
      text: "Email Verification", // plain text body
      html: generateVerificationEmailTemplate(otp), // html body
    });
  } catch (error) {
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, fullName) => {
  try {
    const info = await transporter.sendMail({
      from: `"Blogify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Blogify! 🎉",
      text: `Welcome to Blogify, ${fullName}!`,
      html: generateWelcomeEmailTemplate(fullName),
    });
    return true;
  } catch (error) {
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Blogify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: generatePasswordResetTemplate(otp),
    });
  } catch (error) {
    throw new Error("Failed to send password reset email");
  }
};
