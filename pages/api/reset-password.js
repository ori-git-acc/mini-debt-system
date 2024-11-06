// pages/api/reset-password.js
import db from "../../database";
import crypto from "crypto";

export default function handler(req, res) {
	const { token, password } = req.body;

	db.get(
		"SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?",
		[token, Date.now()],
		(err, user) => {
			if (err) {
				res.status(500).json({ message: "Error querying database" });
			} else if (user) {
				db.run(
					"UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?",
					[password, user.id],
					(err) => {
						if (err) {
							res.status(500).json({ message: "Error resetting password" });
						} else {
							res.status(200).json({ message: "Password reset successful" });
						}
					}
				);
			} else {
				res.status(400).json({ message: "Password reset token is invalid or has expired" });
			}
		}
	);
}
