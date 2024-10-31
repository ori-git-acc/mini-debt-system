// pages/api/debts/[id]/pay.js
import db from "../../../../database";

export default function handler(req, res) {
	const { id } = req.query;

	if (req.method === "POST") {
		const { paymentAmount } = req.body;

		db.get("SELECT * FROM debts WHERE id = ?", [id], (err, debt) => {
			if (err) {
				res.status(500).json({ message: "Error finding debt", error: err });
			} else if (debt) {
				if (paymentAmount > debt.remainingBalance) {
					res.status(400).json({ message: "Payment amount exceeds remaining balance" });
				} else {
					const newTotalPaid = debt.totalPaid + paymentAmount;
					const newRemainingBalance = debt.remainingBalance - paymentAmount;
					const newStatus = newRemainingBalance > 0 ? "unpaid" : "paid";
					const now = new Date().toISOString();

					db.run(
						"UPDATE debts SET totalPaid = ?, remainingBalance = ?, lastPaymentDate = ?, status = ? WHERE id = ?",
						[newTotalPaid, newRemainingBalance, now, newStatus, id],
						function (err) {
							if (err) {
								res.status(500).json({ message: "Error updating debt", error: err });
							} else {
								res.status(200).json({ message: "Payment successful" });
							}
						}
					);
				}
			} else {
				res.status(404).json({ message: "Debt not found" });
			}
		});
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
