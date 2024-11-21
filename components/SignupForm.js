// components/SignupForm.js
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const SignupForm = () => {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		const userLoggedIn = localStorage.getItem("isLoggedIn");
		if (userLoggedIn === "true") {
			router.push("/");
		}
	}, [router]);

	const handleSignup = async (e) => {
		e.preventDefault();
		const response = await fetch("/api/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				username,
				email,
				password,
				userType: "non-administrator",
			}),
		});

		if (response.ok) {
			alert("Account created successfully!");
			const loginNow = confirm("Do you want to login now?");
			if (loginNow) {
				const loginResponse = await fetch("/api/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				if (loginResponse.ok) {
					const result = await loginResponse.json();
					login({ name: result.user.name, username: result.user.username, userType: result.user.userType });
					router.push("/"); // Redirect to home page
				} else {
					alert("Error logging in. Please try again.");
				}
			} else {
				router.push("/login");
			}
		} else {
			const errorData = await response.json();
			if (errorData.message === "Username already exists") {
				alert("Username already exists. Please choose a different username.");
			} else {
				alert("Error creating account. Please try again.");
			}
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-900">
			<div className="w-full max-w-96 p-8 rounded-lg shadow-lg bg-gray-800">
				<h1 className="text-3xl font-bold text-center text-white">Signup</h1>
				<form onSubmit={handleSignup} className="mt-5">
					<div className="mb-4">
						<label className="block text-white text-sm font-bold mb-2" htmlFor="name">
							Name
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
					</div>
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
						<label className="block text-white text-sm font-bold mb-2" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
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
							Signup
						</button>
					</div>
				</form>
				<div className="mt-5 text-center">
					<a href="/login" className="text-blue-500 hover:underline">
						Already have an account? Login
					</a>
				</div>
				<div className="mt-5 text-center">
					<a href="/signup-admin" className="text-gray-500 hover:underline">
						Signup as Administrator
					</a>
				</div>
			</div>
		</div>
	);
};

export default SignupForm;
