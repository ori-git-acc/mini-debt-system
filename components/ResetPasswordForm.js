// components/ResetPasswordForm.js
import { useState } from "react";
import { useRouter } from "next/router";

const ResetPasswordForm = () => {
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { token } = router.query;

	const handleResetPassword = async (e) => {
		e.preventDefault();
		const response = await fetch("/api/reset-password", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ token, password }),
		});
		const result = await response.json();
		if (response.ok) {
			alert("Password reset successful.");
			router.push("/login");
		} else {
			alert(result.message);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900">
			<div className="w-full max-w-96 p-8 rounded-lg shadow-lg bg-gray-800">
				<h1 className="text-3xl font-bold text-center text-white">Reset Password</h1>
				<form onSubmit={handleResetPassword} className="mt-5">
					<div className="mb-4">
						<label className="block text-white text-sm font-bold mb-2" htmlFor="password">
							New Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ResetPasswordForm;
