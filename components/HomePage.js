// components/HomePage.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import localFont from "next/font/local";

const geistSans = localFont({
	src: "../pages/fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "../pages/fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const HomePage = () => {
	const router = useRouter();
	const { isLoggedIn, user } = useContext(AuthContext);
	const [isMounted, setIsMounted] = useState(false);
	const [username, setUsername] = useState("User");

	useEffect(() => {
		setIsMounted(true);

		if (!isLoggedIn) {
			router.push("/landing");
		} else {
			const storedUsername = localStorage.getItem("username");
			setUsername(storedUsername || "User");
		}
	}, [isLoggedIn, router]);

	const handleAddDebtClick = () => {
		if (isLoggedIn) {
			router.push("/add-debt");
		} else {
			router.push("/login");
		}
	};

	const handleViewDebtListClick = () => {
		if (isLoggedIn) {
			router.push("/tracker");
		} else {
			router.push("/login");
		}
	};

	if (!isMounted) {
		return null; // Or a loading spinner
	}

	return (
		<div
			className={`${geistSans.variable} ${geistMono.variable} grid place-items-center bg-gray-900 min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]`}
		>
			<main className="flex flex-col gap-8 items-center sm:items-center bg-gray-900">
				<h1 className="text-3xl font-bold text-center">Hi {username}, welcome to my mini debt system!</h1>
				<div className="flex gap-4 items-center flex-row flex-wrap justify-center">
					<button
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#b3b3b3] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
						onClick={handleAddDebtClick}
					>
						Add Debt
					</button>
					<button
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-gray-700 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
						onClick={handleViewDebtListClick}
					>
						View Debt List
					</button>
				</div>
			</main>
		</div>
	);
};

export default HomePage;
