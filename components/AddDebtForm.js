// components/AddDebtForm.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useForm from "../hooks/useForm"; // Import the custom hook

const AddDebtForm = () => {
	const initialValues = { debtorName: "", amount: "" };
	const [suggestions, setSuggestions] = useState([]);
	const [debtorList, setDebtorList] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const router = useRouter();

	const fetchRegisteredUsers = async () => {
		try {
			const response = await fetch("/api/users");
			const data = await response.json();
			setDebtorList(data);
		} catch (err) {
			console.error("Failed to fetch users:", err);
		}
	};

	const onSubmit = async (values) => {
		const { debtorName, amount } = values;
		const selectedDebtor = debtorList.find((debtor) => debtor.name === debtorName);
		if (!selectedDebtor) {
			alert("Unable to add debt, user is not registered!");
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
				userId: selectedDebtor.id,
			}),
		});

		if (response.ok) {
			alert(`${debtorName}'s debt is added!`);
			setSuggestions([]);
			setValues({ debtorName: isAdmin ? "" : localStorage.getItem("username"), amount: "" });
		} else {
			alert("Error adding debt. Please try again.");
		}
	};

	const {
		values,
		errors,
		loading,
		handleChange,
		handleSubmit,
		setValues, // Ensure this is destructured
	} = useForm(initialValues, onSubmit);

	useEffect(() => {
		fetchRegisteredUsers();

		const userType = localStorage.getItem("userType");
		const username = localStorage.getItem("username");
		if (userType === "Administrator") {
			setIsAdmin(true);
		} else {
			setValues({ debtorName: username, amount: "" });
			router.push("/tracker"); // Redirect non-admin users to the tracker page
		}
	}, []);

	const handleDebtorNameChange = (e) => {
		const input = e.target.value;
		handleChange(e);
		if (input) {
			const filteredSuggestions = debtorList
				.filter((debtor) => debtor.name.toLowerCase().includes(input.toLowerCase()))
				.map((debtor) => debtor.name);
			setSuggestions(filteredSuggestions);
		} else {
			setSuggestions([]);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900">
			<div className="bg-gray-800 w-full max-w-80 p-8 rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold text-center text-white">Add Debt</h1>
				<form onSubmit={handleSubmit}>
					<div className="mt-5 relative">
						<label className="block text-white text-sm font-bold mb-2" htmlFor="debtorName">
							Debtor's Name
						</label>
						<input
							id="debtorName"
							name="debtorName"
							type="text"
							value={values.debtorName}
							onChange={handleDebtorNameChange}
							disabled={!isAdmin}
							className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
								isAdmin ? "text-black" : "text-white"
							}`}
							required
						/>
						{errors.debtorName && <p className="error text-red-500">{errors.debtorName}</p>}
						{isAdmin && suggestions.length > 0 && (
							<ul className="absolute bg-white border border-gray-300 mt-1 w-full rounded shadow-lg z-10 text-black">
								{suggestions.map((suggestion) => (
									<li
										key={suggestion}
										onClick={() => {
											setValues({ ...values, debtorName: suggestion });
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
							name="amount"
							type="number"
							value={values.amount}
							onChange={handleChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
						{errors.amount && <p className="error text-red-500">{errors.amount}</p>}
					</div>
					<div className="flex items-center justify-between mt-5">
						<button
							type="submit"
							disabled={loading}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
						>
							{loading ? "Loading..." : "Add Debt"}
						</button>
					</div>
				</form>
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
