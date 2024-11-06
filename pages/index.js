// pages/index.js
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";
import HomePage from "../components/HomePage";

const Index = () => {
	const { user } = useContext(AuthContext);
	const router = useRouter();

	useEffect(() => {
		if (user && user.userType !== "Administrator") {
			router.push("/tracker");
		}
	}, [user, router]);

	// Show loading or some fallback UI while checking user
	if (!user) {
		return <div>Loading...</div>;
	}

	return <HomePage />;
};

export default Index;
