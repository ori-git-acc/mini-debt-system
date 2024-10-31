// context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const userLoggedIn = localStorage.getItem("isLoggedIn");
		const storedUsername = localStorage.getItem("username");
		const storedUserType = localStorage.getItem("userType");

		if (userLoggedIn === "true") {
			setIsLoggedIn(true);
			setUser({ username: storedUsername, userType: storedUserType });
		}
	}, []);

	const login = (userData) => {
		setIsLoggedIn(true);
		setUser(userData);
		localStorage.setItem("isLoggedIn", "true");
		localStorage.setItem("username", userData.username);
		localStorage.setItem("userType", userData.userType);
		router.push("/");
	};

	const logout = () => {
		setIsLoggedIn(false);
		setUser(null);
		localStorage.removeItem("isLoggedIn");
		localStorage.removeItem("username");
		localStorage.removeItem("userType");
		router.push("/login");
	};

	return <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>{children}</AuthContext.Provider>;
};
