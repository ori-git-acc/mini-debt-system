import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const DebtHistory = () => {
	const [debts, setDebts] = useState([]);
	const [selectedDebts, setSelectedDebts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("debtorName");
	const [totalDebts, setTotalDebts] = useState(0); // State to keep track of total debts count
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation dialog
	const [isSelectAllChecked, setIsSelectAllChecked] = useState(false); // State for header checkbox
	const router = useRouter();

	useEffect(() => {
		const userType = localStorage.getItem("userType");
		if (userType !== "Administrator") {
			router.push("/tracker");
		} else {
			const fetchDebts = async () => {
				const response = await fetch("/api/debts?userType=Administrator");
				if (!response.ok) {
					throw new Error("Failed to fetch debts");
				}
				const data = await response.json();
				setDebts(data);
				setTotalDebts(data.length);
			};
			fetchDebts();
		}
	}, [router]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSelectDebt = (id) => {
		let newSelectedDebts;
		if (selectedDebts.includes(id)) {
			newSelectedDebts = selectedDebts.filter((debtId) => debtId !== id);
		} else {
			newSelectedDebts = [...selectedDebts, id];
		}
		setSelectedDebts(newSelectedDebts);
		setIsSelectAllChecked(newSelectedDebts.length === debts.length);
	};

	const handleSelectAll = () => {
		if (isSelectAllChecked) {
			setSelectedDebts([]);
			setIsSelectAllChecked(false);
		} else {
			setSelectedDebts(debts.map((debt) => debt.id));
			setIsSelectAllChecked(true);
		}
	};

	const handleDeleteSelected = () => {
		if (selectedDebts.length === 0) {
			alert("Please select a debt to delete.");
		} else {
			setShowDeleteConfirm(true);
		}
	};

	const handleConfirmDelete = async () => {
		const promises = selectedDebts.map((id) => fetch(`/api/debts/${id}`, { method: "DELETE" }));
		await Promise.all(promises);
		setSelectedDebts([]);
		const response = await fetch("/api/debts?userType=Administrator");
		const data = await response.json();
		setDebts(data);
		setTotalDebts(data.length);
		setShowDeleteConfirm(false);
		setIsSelectAllChecked(false);
	};

	const handleCancelDelete = () => {
		setShowDeleteConfirm(false);
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
		.sort((a, b) => {
			if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
				return a[sortBy].localeCompare(b[sortBy]);
			}
			return a[sortBy] - b[sortBy];
		});

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
					>
						Delete Selected
					</button>
				</div>
				<div className="flex justify-between items-center text-white mb-4">
					<span>Number of Debts: {totalDebts}</span> {/* Display total debts count */}
				</div>
				<div className="overflow-auto bg-gray-800 rounded-lg shadow-lg max-h-[450px]">
					<table className="min-w-full bg-gray-700 text-white">
						<thead className="text-center sticky top-0 bg-gray-700">
							<tr>
								<th className="py-2 px-4 border-b border-gray-600">
									<input type="checkbox" checked={isSelectAllChecked} onChange={handleSelectAll} />
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
									Total Paid
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
						<tbody className="text-center">
							{sortedDebts.map((debt) => (
								<tr
									key={debt.id}
									className={
										debt.status === "paid"
											? "bg-green-100 text-black"
											: debt.status === "unpaid"
											? "bg-red-100 text-black"
											: "bg-blue-100 text-black"
									}
								>
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
									<td className="py-2 px-4 border-b border-gray-600">
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
			{showDeleteConfirm && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-gray-700 text-white rounded-lg p-6 w-96">
						<h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
						<p>Are you sure you want to delete the selected debts?</p>
						<div className="flex justify-end w-full mt-4 gap-2">
							<button
								onClick={handleConfirmDelete}
								className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
							>
								Delete
							</button>
							<button
								onClick={handleCancelDelete}
								className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DebtHistory;
