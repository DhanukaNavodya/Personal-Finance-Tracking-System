import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`✅ Email sent to ${to}`);
    return { success: true, message: `Email sent to ${to}` };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    return { success: false, message: "Error sending email" };
  }
};

/**
 * Sends an email notification when the budget is exceeded.
 * @param {string} to - Recipient email
 * @param {string} budgetName - The budget category
 * @param {number} spent - Total spent amount
 * @param {number} limit - Budget limit
 */

export const sendBudgetExceededEmail = async (to, budgetName, spent, limit) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Budget Exceeded Alert!",
      html: `
        <h2>Budget Exceeded Alert</h2>
        <p>Your budget for <strong>${budgetName}</strong> has been exceeded.</p>
        <p>Total Spent: <strong>${spent}</strong></p>
        <p>Budget Limit: <strong>${limit}</strong></p>
        <p>Please review your expenses.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Budget exceeded email sent to:", to);
  } catch (error) {
    console.error("Error sending budget exceeded email:", error);
  }
};
