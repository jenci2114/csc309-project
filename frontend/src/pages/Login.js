import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import logo2 from '../assets/property_images/logo2.jpeg'
export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { isLoggedin, login } = useAuth();
	const [showErr, setShowError] = useState(false);
	const [errMesg, setErrorMsg] = useState("");

	async function handleAll(e) {
		console.log("handle all");
		await handleSubmit(e);
		await getProfile(e);
	}


    async function getProfile(e) {
		e.preventDefault(); //prevent the web page from automatically submitting the form after we press log in
		await requestProfile()
			.then((queryResult) => {
				setShowError(false)
				localStorage.setItem("avatar", "http://127.0.0.1:8000" + queryResult.avatar_url);
				localStorage.setItem("email", queryResult.email);
				localStorage.setItem("first_name", queryResult.first_name);
				console.log(localStorage.first_name)
				localStorage.setItem("last_name", queryResult.last_name);
				console.log(localStorage.last_name)
				localStorage.setItem("phone", queryResult.phone);
				localStorage.setItem("location", queryResult.location);
				console.log(localStorage.avatar)
				login();
				window.location.href = "/";
			})
			.catch((err) => {
				setShowError(true);
				setErrorMsg("Incorrect Username or Password");
			});
	}


	async function handleSubmit(e) {
		e.preventDefault(); //prevent the web page from automatically submitting the form after we press log in
		await requestAuth()
			.then((queryResult) => {
				setShowError(false)
				localStorage.setItem("username", username);
				localStorage.setItem("token", queryResult.access);
			})
			.catch((err) => {
				setShowError(true);
				setErrorMsg("Incorrect Username or Password");
			});
	}

	async function requestAuth() {
		return new Promise((resolve, reject) => {
			axios({
				method: "post",
				url: "http://127.0.0.1:8000/account/token/",
				data: { 'username': username, 'password': password },
			})
				.then((ret) => {
					console.log(ret.data);
					resolve(ret.data);
				})
				.catch((err) => {
					reject(new Error(err.response.data.message));
				});
		});
	}

	async function requestProfile() {
		return new Promise((resolve, reject) => {
			axios({
				method: "get",
				url: "http://127.0.0.1:8000/account/profile/view/",
				headers: { Authorization: `Bearer ${localStorage.token}` },
			})
				.then((ret) => {
					console.log(ret.data);
					resolve(ret.data);
				})
				.catch((err) => {
					reject(new Error(err.response.data.message));
				});
		});
	}

	if (isLoggedin) {
		return <Navigate to="/" />;
	}
	return (
		<>
			<div className="container">
				<div className="row mb-3" style={{ paddingTop: '0vh' }}>
					<div className="col-lg-4 col-md-3 themed-grid-col"></div>
					<div className="col-lg-4 col-md-6 themed-grid-col">
						<img src={logo2} className="d-block w-100" alt="..."></img>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row mb-3">
					<div className="col-lg-4 themed-grid-col"></div>
					<div className="col-lg-4 themed-grid-col user-form">
						<form onSubmit={handleAll}>
							<div className="mb-3">
								<label htmlFor="username" className="form-label">Username</label>
								<input type="text" className="form-control" id="username" aria-describedby="emailHelp" onChange={(event) => setUsername(event.target.value)}></input>
							</div>
							<div className="mb-3">
								<label htmlFor="passwd" className="form-label">Password</label>
								<input type="password" className="form-control" id="passwd" onChange={(event) => setPassword(event.target.value)}></input>
							</div>

							<div style={{ display: showErr ? "block" : "none" }}>
								<p className="text-red-400"> {errMesg} </p>
							</div>
							<button type="submit" className="btn btn-dark">Login</button>
							<Link to="/register" className="link-secondary" style={{ paddingLeft: '1rem' }}>
								Don't have an account? Register
							</Link>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
