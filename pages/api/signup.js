// pages/api/signup.js
import db from "../../database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { name, username, email, password, userType } = req.body;

		try {
			const userExists = await new Promise((resolve, reject) => {
				db.get("SELECT COUNT(*) AS count FROM users WHERE username = ?", [username], (err, row) => {
					if (err) {
						reject(err);
					} else {
						resolve(row.count > 0);
					}
				});
			});

			if (userExists) {
				return res.status(400).json({ message: "Username already exists" });
			}

			await new Promise((resolve, reject) => {
				db.run(
					"INSERT INTO users (name, username, email, password, userType) VALUES (?, ?, ?, ?, ?)",
					[name, username, email, password, userType],
					function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					}
				);
			});

			res.status(200).json({ message: "User created successfully" });
		} catch (err) {
			res.status(500).json({ message: "Error saving user to database", error: err.message });
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
