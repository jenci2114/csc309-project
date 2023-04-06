import {useState} from "react";

function useAuth() {
	const [isLoggedin, setIsLoggedIn] = useState(localStorage.getItem("isLoggedin") === "true" ? true : false);

	function login() {
		setIsLoggedIn(true);
		localStorage.setItem("isLoggedin", "true");
	}

	function logout() {
		setIsLoggedIn(false);
		localStorage.removeItem("isLoggedin");
		localStorage.removeItem("token");
		localStorage.removeItem("username");
	}

	return {isLoggedin, login, logout};
}

export default useAuth;
