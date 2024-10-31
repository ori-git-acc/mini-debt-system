import { useState, useEffect } from "react";

const AddDebtForm = () => {
	const [debtorName, setDebtorName] = useState("");
	const [amount, setAmount] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [debtorList, setDebtorList] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const fetchRegisteredUsers = async () => {
			try {
				const response = await fetch("/api/users");
				const data = await response.json();
				setDebtorList(data.map((user) => user.username));
			} catch (err) {
				console.error("Failed to fetch users:", err);
			}
		};

		fetchRegisteredUsers();

		const userType = localStorage.getItem("userType");
		const username = localStorage.getItem("username");
		if (userType === "Administrator") {
			setIsAdmin(true);
		} else {
			setDebtorName(username);
		}
	}, []);

	const handleDebtorNameChange = (e) => {
		const input = e.target.value;
		setDebtorName(input);
		if (input) {
			const filteredSuggestions = debtorList.filter((debtor) =>
				debtor.toLowerCase().includes(input.toLowerCase())
			);
			setSuggestions(filteredSuggestions);
		} else {
			setSuggestions([]);
		}
	};

	const handleAddDebt = async () => {
		if (!debtorName || !amount) {
			alert("Debtor's name and debt amount cannot be blank!");
			return;
		}

		const response = await fetch("/api/debts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				debtorName,
				originalAmount: parseFloat(amount),
				remainingBalance: parseFloat(amount),
				totalPaid: 0,
				createdAt: new Date().toISOString(),
				lastPaymentDate: null,
				status: "Unpaid",
			}),
		});

		if (response.ok) {
			alert(`${debtorName}'s debt is added!`);
			setDebtorName(isAdmin ? "" : localStorage.getItem("username"));
			setAmount("");
			setSuggestions([]);
		} else {
			alert("Error adding debt. Please try again.");
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="bg-gray-700 w-full max-w-80 p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold text-center text-white">Add Debt</h1>
				<div className="mt-5 relative">
					<label className="block text-white text-sm font-bold mb-2" htmlFor="debtorName">
						Debtor's Name
					</label>
					<input
						id="debtorName"
						type="text"
						value={debtorName}
						onChange={handleDebtorNameChange}
						disabled={!isAdmin}
						className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
							isAdmin ? "text-black" : "text-white"
						}`}
						required
					/>
					{isAdmin && suggestions.length > 0 && (
						<ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded shadow-lg z-10 text-black">
							{suggestions.map((suggestion) => (
								<li
									key={suggestion}
									onClick={() => {
										setDebtorName(suggestion);
										setSuggestions([]);
									}}
									className="cursor-pointer px-4 py-2 hover:bg-gray-200"
								>
									{suggestion}
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="mt-5">
					<label className="block text-white text-sm font-bold mb-2" htmlFor="amount">
						Amount
					</label>
					<input
						id="amount"
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
						required
					/>
				</div>
				<div className="flex items-center justify-between mt-5">
					<button
						onClick={handleAddDebt}
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
					>
						Add Debt
					</button>
				</div>
				<div className="mt-5 text-center">
					<a href="/tracker" className="text-blue-500 hover:underline">
						View Debt List
					</a>
				</div>
			</div>
		</div>
	);
};

export default AddDebtForm;
