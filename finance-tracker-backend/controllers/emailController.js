import { sendEmail } from "../utils/emailService.js";

export const sendEmailController = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await sendEmail(email, subject, message);

    if (result.success) {
      res.status(200).json({ message: "Email sent successfully" });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: `Error sending email: ${error.message}` });
  }
};
