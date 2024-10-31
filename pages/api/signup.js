// pages/api/signup.js
import db from "../../database";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { name, username, email, password, userType } = req.body;

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
		})
			.then(() => {
				res.status(200).json({ message: "User created successfully" });
			})
			.catch((err) => {
				res.status(500).json({ message: "Error saving user to database" });
			});
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
