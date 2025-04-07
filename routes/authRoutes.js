const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const sendMail = require("../utils/mailer"); // Adjust path if needed
const { User } = require("../models"); // Sequelize User model

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "No user with that email" });
        }

        // Create a secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetUrl = `http://localhost:5500/reset-password.html?token=${resetToken}`;

        // Store token in DB (or temp store, like Redis or in a 'resetToken' column)
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 1000 * 60 * 15; // expires in 15 min
        await user.save();

        const subject = "Password Reset Request";
        const htmlContent = `
      <p>Hello ${user.firstName || "there"},</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `;

        await sendMail(email, subject, htmlContent);

        res.json({ message: "Reset email sent successfully" });

    } catch (error) {
        console.error("Error in forgot-password:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
