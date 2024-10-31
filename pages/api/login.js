// pages/api/login.js
import db from "../../database";

export default function handler(req, res) {
	if (req.method === "POST") {
		const { username, password } = req.body;

		db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], function (err, row) {
			if (err) {
				res.status(500).json({ message: "Error querying database" });
			} else if (row) {
				res.status(200).json({ message: "Login successful", user: row });
			} else {
				res.status(401).json({ message: "Invalid credentials" });
			}
		});
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
