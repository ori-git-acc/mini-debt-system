// pages/api/debts/[id].js
import db from "../../../database";

export default function handler(req, res) {
	const { id } = req.query;

	if (req.method === "DELETE") {
		db.run("DELETE FROM debts WHERE id = ?", [id], function (err) {
			if (err) {
				res.status(500).json({ message: "Error deleting debt", error: err });
			} else {
				res.status(200).json({ message: "Debt deleted successfully" });
			}
		});
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
