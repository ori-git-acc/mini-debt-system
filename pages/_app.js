import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
	return (
		<AuthProvider>
			<Navbar />
			<Component {...pageProps} />
		</AuthProvider>
	);
}
