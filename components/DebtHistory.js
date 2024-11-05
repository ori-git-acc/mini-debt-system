import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const DebtHistory = () => {
	const [debts, setDebts] = useState([]);
	const [selectedDebts, setSelectedDebts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("debtorName");
	const router = useRouter();

	useEffect(() => {
		const userType = localStorage.getItem("userType");
		if (userType !== "Administrator") {
			router.push("/tracker");
		}

		const fetchDebts = async () => {
			const response = await fetch("/api/debts");
			const data = await response.json();
			setDebts(data);
		};
		fetchDebts();
	}, [router]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSelectDebt = (id) => {
		if (selectedDebts.includes(id)) {
			setSelectedDebts(selectedDebts.filter((debtId) => debtId !== id));
		} else {
			setSelectedDebts([...selectedDebts, id]);
		}
	};

	const handleDeleteSelected = async () => {
		const promises = selectedDebts.map((id) => fetch(`/api/debts/${id}`, { method: "DELETE" }));
		await Promise.all(promises);
		setSelectedDebts([]);
		const response = await fetch("/api/debts");
		const data = await response.json();
		setDebts(data);
	};

	const handleSortChange = (field) => {
		setSortBy(field);
	};

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const sortedDebts = debts
		.filter((debt) => debt.debtorName.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-900 p-4">
			<h1 className="text-3xl font-bold text-white mt-32 mb-5">Debt History</h1>
			<div className="w-full max-w-7xl">
				<div className="flex justify-between items-center mb-4">
					<input
						type="text"
						value={searchTerm}
						onChange={handleSearchChange}
						className="shadow appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
						placeholder="Search by Debtor's Name"
					/>
					<button
						onClick={handleDeleteSelected}
						className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						disabled={selectedDebts.length === 0}
					>
						Delete Selected
					</button>
				</div>
				<div className="overflow-auto bg-gray-800 rounded-lg shadow-lg max-h-[450px]">
					<table className="min-w-full bg-gray-700 text-white">
						<thead className="text-center sticky top-0 bg-gray-700">
							<tr>
								<th className="py-2 px-4 border-b border-gray-600">
									<input
										type="checkbox"
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedDebts(debts.map((debt) => debt.id));
											} else {
												setSelectedDebts([]);
											}
										}}
									/>
								</th>
								<th
									className="py-2 px-4 border-b border-gray-600 cursor-pointer"
									onClick={() => handleSortChange("debtorName")}
								>
									Debtor's Name
								</th>
								<th
									className="py-2 px-4 border-b border-gray-600 cursor-pointer"
									onClick={() => handleSortChange("originalAmount")}
								>
									Debt Original Amount
								</th>
								<th
									className="py-2 px-4 border-b border-gray-600 cursor-pointer"
									onClick={() => handleSortChange("remainingBalance")}
								>
									Remaining Balance
								</th>
								<th
									className="py-2 px-4 border-b border-gray-600 cursor-pointer"
									onClick={() => handleSortChange("totalPaid")}
								>
									Total Payment
								</th>
								<th
									className="py-2 px-4 border-b border-gray-600 cursor-pointer"
									onClick={() => handleSortChange("createdAt")}
								>
									Date Created
								</th>
								<th
									className="py-2 px-4 border-b border-gray-600 cursor-pointer"
									onClick={() => handleSortChange("lastPaymentDate")}
								>
									Last Payment Date
								</th>
								<th
									className="py-2 px-4 border-b border-gray-600 cursor-pointer"
									onClick={() => handleSortChange("status")}
								>
									Status
								</th>
							</tr>
						</thead>
						<tbody className="text-center bg-gray-800">
							{sortedDebts.map((debt) => (
								<tr key={debt.id}>
									<td className="py-2 px-4 border-b border-gray-600">
										<input
											type="checkbox"
											checked={selectedDebts.includes(debt.id)}
											onChange={() => handleSelectDebt(debt.id)}
										/>
									</td>
									<td className="py-2 px-4 border-b border-gray-600">{debt.debtorName}</td>
									<td className="py-2 px-4 border-b border-gray-600">{debt.originalAmount}</td>
									<td className="py-2 px-4 border-b border-gray-600">{debt.remainingBalance}</td>
									<td className="py-2 px-4 border-b border-gray-600">{debt.totalPaid}</td>
									<td className="py-2 px-4 border-b border-gray-600">{formatDate(debt.createdAt)}</td>
									<td className="py-2 px-4 border-b border-gray-600">
										{debt.lastPaymentDate ? formatDate(debt.lastPaymentDate) : ""}
									</td>
									<td
										className={`py-2 px-4 border-b border-gray-600 ${
											debt.status === "paid"
												? "text-green-500"
												: debt.status === "unpaid"
												? "text-red-500"
												: "text-blue-500"
										}`}
									>
										{debt.status === "paid"
											? "Paid"
											: debt.status === "unpaid"
											? "Unpaid"
											: "Waived"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default DebtHistory;
