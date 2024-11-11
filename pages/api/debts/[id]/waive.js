import db from "../../../../database";

export default function handler(req, res) {
	const { id } = req.query;

	if (req.method === "POST") {
		db.run("UPDATE debts SET status = 'waived', remainingBalance = 0 WHERE id = ?", [id], function (err) {
			if (err) {
				res.status(500).json({ message: "Error waiving debt", error: err });
			} else {
				res.status(200).json({ message: "Debt waived successfully" });
			}
		});
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
