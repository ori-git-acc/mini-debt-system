import { useState, useEffect } from "react";

const DebtList = () => {
	const [debts, setDebts] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredDebts, setFilteredDebts] = useState([]);
	const [totalRemainingDebt, setTotalRemainingDebt] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [currentDebtId, setCurrentDebtId] = useState(null);
	const [paymentAmount, setPaymentAmount] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);
	const [statusFilter, setStatusFilter] = useState("");

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "short", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const fetchDebts = async () => {
		const response = await fetch("/api/debts");
		const data = await response.json();
		const userType = localStorage.getItem("userType");
		const username = localStorage.getItem("username");
		const updatedDebts = data.map((debt) => {
			if (debt.status !== "waived") {
				debt.status = debt.remainingBalance > 0 ? "unpaid" : "paid";
			}
			return debt;
		});
		const userDebts =
			userType === "Administrator" ? updatedDebts : updatedDebts.filter((debt) => debt.debtorName === username);
		setDebts(userDebts);
		setFilteredDebts(userDebts);
		setTotalRemainingDebt(userDebts.reduce((acc, debt) => acc + debt.remainingBalance, 0));
	};

	useEffect(() => {
		const userType = localStorage.getItem("userType");
		if (userType === "Administrator") {
			setIsAdmin(true);
		}
		fetchDebts();
	}, []);

	useEffect(() => {
		let filtered = debts;
		if (isAdmin && searchTerm) {
			filtered = debts.filter((debt) => debt.debtorName.toLowerCase().includes(searchTerm.toLowerCase()));
		} else if (statusFilter) {
			filtered = debts.filter((debt) => debt.status === statusFilter);
		}
		setFilteredDebts(filtered);
		const totalDebt = filtered.reduce((acc, debt) => acc + debt.remainingBalance, 0);
		setTotalRemainingDebt(totalDebt);
	}, [searchTerm, statusFilter, debts, isAdmin]);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleStatusChange = (e) => {
		setStatusFilter(e.target.value);
	};

	const handlePay = (id) => {
		setCurrentDebtId(id);
		setShowModal(true);
	};

	const handlePayment = async () => {
		if (!paymentAmount) {
			alert("Please enter payment amount!");
			return;
		}
		const currentDebt = debts.find((debt) => debt.id === currentDebtId);
		if (parseFloat(paymentAmount) > currentDebt.remainingBalance) {
			alert("Please enter less or exact amount to remaining balance!");
			return;
		}
		const response = await fetch(`/api/debts/${currentDebtId}/pay`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ paymentAmount: parseFloat(paymentAmount) }),
		});
		if (response.ok) {
			fetchDebts();
			alert("Payment successful!");
		} else {
			alert("Error processing payment. Please try again.");
		}
		setShowModal(false);
		setPaymentAmount("");
	};

	const handleWaive = async (id) => {
		if (confirm("Are you sure you want to waive this debt?")) {
			const response = await fetch(`/api/debts/${id}/waive`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "waived" }),
			});
			if (response.ok) {
				alert("Debt item is waived!");
				fetchDebts();
			} else {
				alert("Error processing waiver. Please try again.");
			}
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-800 p-4">
			<h1 className="text-3xl font-bold text-white mt-32 mb-5">Debt List</h1>
			<div className="w-full max-w-7xl">
				<div className="flex justify-between items-center mb-4">
					{isAdmin ? (
						<input
							type="text"
							value={searchTerm}
							onChange={handleSearchChange}
							className="shadow appearance-none border rounded flex-grow py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
							placeholder="Search by Debtor's Name"
						/>
					) : (
						<select
							value={statusFilter}
							onChange={handleStatusChange}
							className="shadow appearance-none border rounded flex-grow py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
						>
							<option value="">All</option>
							<option value="paid">Paid</option>
							<option value="unpaid">Unpaid</option>
							<option value="waived">Waived</option>
						</select>
					)}
				</div>
				<div className="flex justify-between md:justify-start md:space-x-4 items-center text-white mb-4">
					<span>Total Remaining Debt: {totalRemainingDebt}</span>
					<a href="/add-debt" className="text-blue-500 hover:underline whitespace-nowrap">
						Add Debt
					</a>
				</div>
				<div className="overflow-auto bg-gray-900 rounded-lg shadow-lg">
					<table className="min-w-full bg-gray-700 text-white">
						<thead className="text-center">
							<tr>
								<th className="py-2 px-4 border-b border-gray-600">Debtor's Name</th>
								<th className="py-2 px-4 border-b border-gray-600">Debt Original Amount</th>
								<th className="py-2 px-4 border-b border-gray-600">Remaining Balance</th>
								<th className="py-2 px-4 border-b border-gray-600">Total Paid</th>
								<th className="py-2 px-4 border-b border-gray-600">Date Created</th>
								<th className="py-2 px-4 border-b border-gray-600">Last Payment Date</th>
								<th className="py-2 px-4 border-b border-gray-600">Action</th>
							</tr>
						</thead>
						<tbody className="text-center">
							{Array.isArray(filteredDebts) &&
								filteredDebts.map((debt) => (
									<tr key={debt.id}>
										<td className="py-2 px-4 border-b border-gray-600">{debt.debtorName}</td>
										<td className="py-2 px-4 border-b border-gray-600">{debt.originalAmount}</td>
										<td className="py-2 px-4 border-b border-gray-600">{debt.remainingBalance}</td>
										<td className="py-2 px-4 border-b border-gray-600">{debt.totalPaid}</td>
										<td className="py-2 px-4 border-b border-gray-600">
											{formatDate(debt.createdAt)}
										</td>
										<td className="py-2 px-4 border-b border-gray-600">
											{debt.lastPaymentDate ? formatDate(debt.lastPaymentDate) : ""}
										</td>
										<td className="py-2 px-4 border-b border-gray-600">
											<button
												onClick={() => handlePay(debt.id)}
												className={`bg-green-500 ${
													debt.status !== "unpaid"
														? "opacity-50 cursor-not-allowed"
														: "hover:bg-green-700"
												} text-white font-bold py-1 px-2 rounded mr-2`}
												disabled={debt.status !== "unpaid"}
											>
												Pay
											</button>
											{isAdmin && (
												<button
													onClick={() => handleWaive(debt.id)}
													className={`bg-red-500 ${
														debt.status !== "unpaid"
															? "opacity-50 cursor-not-allowed"
															: "hover:bg-red-700"
													} text-white font-bold py-1 px-2 rounded`}
													disabled={debt.status !== "unpaid"}
												>
													Waive
												</button>
											)}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-gray-700 text-white rounded-lg p-6 w-96">
						<h2 className="text-xl font-bold mb-4">Enter Payment Amount</h2>
						<input
							type="number"
							value={paymentAmount}
							onChange={(e) => setPaymentAmount(e.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mb-4"
						/>
						<div className="flex justify-between w-full">
							<button
								onClick={handlePayment}
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mr-2"
							>
								Pay
							</button>
							<button
								onClick={() => {
									setShowModal(false);
									setPaymentAmount("");
								}}
								className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full"
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

export default DebtList;