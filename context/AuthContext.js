import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const userLoggedIn = localStorage.getItem("isLoggedIn");
		const storedName = localStorage.getItem("name");
		const storedUsername = localStorage.getItem("username");
		const storedUserType = localStorage.getItem("userType");
		const storedUserId = localStorage.getItem("userId"); // Retrieve stored userId

		if (userLoggedIn === "true") {
			setIsLoggedIn(true);
			setUser({ name: storedName, username: storedUsername, userType: storedUserType, userId: storedUserId });
		}
	}, []);

	const login = (userData) => {
		setIsLoggedIn(true);
		setUser(userData);
		localStorage.setItem("isLoggedIn", "true");
		localStorage.setItem("name", userData.name);
		localStorage.setItem("username", userData.username);
		localStorage.setItem("userType", userData.userType);
		localStorage.setItem("userId", userData.userId); // Store userId
		router.push("/");
	};

	const logout = () => {
		setIsLoggedIn(false);
		setUser(null);
		localStorage.removeItem("isLoggedIn");
		localStorage.removeItem("name");
		localStorage.removeItem("username");
		localStorage.removeItem("userType");
		localStorage.removeItem("userId"); // Remove userId
		router.push("/login");
	};

	return <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>{children}</AuthContext.Provider>;
};
