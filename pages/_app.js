import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useContext } from "react";

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const noNavbarRoutes = ["/landing", "/login", "/signup", "/signup-admin"];

	return (
		<AuthProvider>
			{!noNavbarRoutes.includes(router.pathname) && <Navbar />}
			<AuthConsumer Component={Component} pageProps={pageProps} noNavbarRoutes={noNavbarRoutes} />
		</AuthProvider>
	);
}

const AuthConsumer = ({ Component, pageProps, noNavbarRoutes }) => {
	const router = useRouter();
	const { isLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		const userLoggedIn = localStorage.getItem("isLoggedIn");
		if (!userLoggedIn && !noNavbarRoutes.includes(router.pathname)) {
			router.push("/landing");
		}
	}, [router.pathname]);

	return <Component {...pageProps} />;
};
