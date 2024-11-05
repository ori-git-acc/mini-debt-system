import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const noNavbarRoutes = ["/landing", "/login", "/signup", "/signup-admin"];

	return (
		<AuthProvider>
			{!noNavbarRoutes.includes(router.pathname) && <Navbar />}
			<Component {...pageProps} />
		</AuthProvider>
	);
}
