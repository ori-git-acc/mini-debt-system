// components/LoginForm.js
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useContext(AuthContext);
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		const response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});
		const result = await response.json();
		if (response.ok) {
			login({
				name: result.user.name,
				username: result.user.username,
				userType: result.user.userType,
				userId: result.user.id,
			});

			if (result.user.userType === "Administrator") {
				router.push("/"); // Redirect to home page for admins
			} else {
				router.push("/tracker"); // Redirect to tracker page for non-admins
			}
		} else {
			alert(result.message);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900">
			<div className="w-full max-w-96 p-8 rounded-lg shadow-lg bg-gray-800">
				<h1 className="text-3xl font-bold text-center text-white">Login</h1>
				<form onSubmit={handleLogin} className="mt-5">
					<div className="mb-4">
						<label className="block text-white text-sm font-bold mb-2" htmlFor="username">
							Username
						</label>
						<input
							id="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-white text-sm font-bold mb-2" htmlFor="password">
							Password
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
							Login
						</button>
					</div>
				</form>
				<div className="mt-2 text-center">
					<a href="/forgot-password" className="text-blue-500 hover:underline">
						Forgot Password?
					</a>
				</div>
				<div className="mt-5 text-center">
					<a href="/signup" className="text-blue-500 hover:underline">
						Don't have an account? Signup
					</a>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
