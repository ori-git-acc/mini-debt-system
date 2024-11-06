// pages/api/forgot-password.js
import db from "../../database";
import nodemailer from "nodemailer";
import crypto from "crypto";

export default function handler(req, res) {
	const { email } = req.body;

	console.log("Received forgot password request for email:", email);

	db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
		if (err) {
			console.error("Error querying database:", err);
			res.status(500).json({ message: "Error querying database" });
		} else if (user) {
			const token = crypto.randomBytes(20).toString("hex");
			const expiry = Date.now() + 3600000; // 1 hour

			console.log("User found. Generating token:", token);

			db.run(
				"UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?",
				[token, expiry, email],
				(err) => {
					if (err) {
						console.error("Error setting reset token:", err);
						res.status(500).json({ message: "Error setting reset token" });
					} else {
						console.log("Reset token set. Preparing to send email.");

						// Send email
						const transporter = nodemailer.createTransport({
							service: "gmail",
							auth: {
								user: "shin.dev.acc@gmail.com",
								pass: "dugw phyo irym zxlk",
							},
						});

						const mailOptions = {
							from: "shin.dev.acc@gmail.com",
							to: email,
							subject: "Password Reset",
							text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://${req.headers.host}/reset-password?token=${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
						};

						transporter.sendMail(mailOptions, (error, info) => {
							if (error) {
								console.error("Error sending email:", error);
								res.status(500).json({ message: "Error sending email", error });
							} else {
								console.log("Email sent:", info.response);
								res.status(200).json({ message: "Password reset link has been sent to your email." });
							}
						});
					}
				}
			);
		} else {
			console.log("No account with that email address exists.");
			res.status(404).json({ message: "No account with that email address exists." });
		}
	});
}
