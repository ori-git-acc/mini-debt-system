// pages/api/users.js
import db from "../../database";

export default function handler(req, res) {
	if (req.method === "GET") {
		db.all("SELECT username FROM users", [], (err, rows) => {
			if (err) {
				res.status(500).json({ message: "Error fetching users", error: err });
			} else {
				res.status(200).json(rows);
			}
		});
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
