// pages/api/debts.js
import db from "../../database";

export default function handler(req, res) {
	if (req.method === "GET") {
		db.all("SELECT * FROM debts", [], (err, rows) => {
			if (err) {
				res.status(500).json({ message: "Error fetching debts", error: err });
			} else {
				res.status(200).json(rows);
			}
		});
	} else if (req.method === "POST") {
		const { debtorName, originalAmount, remainingBalance, totalPaid, createdAt, lastPaymentDate } = req.body;
		const status = remainingBalance > 0 ? "unpaid" : "paid";
		db.run(
			"INSERT INTO debts (debtorName, originalAmount, remainingBalance, totalPaid, createdAt, lastPaymentDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[debtorName, originalAmount, remainingBalance, totalPaid, createdAt, lastPaymentDate, status],
			function (err) {
				if (err) {
					res.status(500).json({ message: "Error adding debt", error: err });
				} else {
					res.status(200).json({ id: this.lastID });
				}
			}
		);
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
