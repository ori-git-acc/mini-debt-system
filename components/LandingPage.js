// components/LandingPage.js
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

const LandingPage = () => {
	return (
		<div
			className={`${geistSans.variable} ${geistMono.variable} grid place-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)]`}
		>
			<main className="flex flex-col gap-8 items-center sm:items-center">
				<h1 className="text-3xl font-bold text-center">Welcome to GIZA mini debt system!</h1>
				<div className="flex flex-col sm:flex-row items-center gap-4">
					<a
						href="/login"
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
					>
						Login
					</a>
					<a
						href="/signup"
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
					>
						Signup
					</a>
				</div>
			</main>
		</div>
	);
};

export default LandingPage;
