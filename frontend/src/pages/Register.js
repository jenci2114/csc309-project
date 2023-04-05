import {useState} from "react";
import {Link, Navigate, useResolvedPath} from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
export default function RegisterPage() {
	const host = "http://localhost:8000";
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setusername] = useState("");
	const [country, setCountry] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [IsUserErrorVisible, setIsUserErrorVisible] = useState(false);
	const [IsPassErrorVisible, setIsPassErrorVisible] = useState(false);
	const [OtherErrorDisplay, setOtherErrorDisplay] = useState(false);
	const [OtherErrorMsg, setOtherErrorMsg] = useState(false);
	const {isLoggedin, login} = useAuth();
	async function handleSubmit(e) {
		e.preventDefault(); //prevent the web page from automatically submitting the form after we press log in
		const queryResult = await checkDuplicate();
		console.log(queryResult);
		console.log(`there are ${queryResult} existing user `);
		if (queryResult.data > 0) {
			setIsUserErrorVisible(true);
			setIsPassErrorVisible(false);
			setEmail("");
			setPassword("");
			setusername("");
			setCountry("");
			setConfirmPassword("");
		} else if (confirmPassword !== password) {
			setIsPassErrorVisible(true);
			setIsUserErrorVisible(false);
			setEmail("");
			setPassword("");
			setusername("");
			setCountry("");
			setConfirmPassword("");
		} else {
			setIsPassErrorVisible(false);
			setIsUserErrorVisible(false);
			console.log("registering....");
			const body = {
				country: country,
				email: email,
				username: username,
				password: password,
				account_balance: 0,
				ktc_status: false,
				suspended: false,
			};
			await signupUser(body)
				.then(() => {
					login();
					return;
				})
				.catch((err) => {
					const errorMsg = err.response.data.message;
					setOtherErrorDisplay(true);
					setIsPassErrorVisible(false);
					setIsUserErrorVisible(false);
					setEmail("");
					setPassword("");
					setusername("");
					setCountry("");
					setConfirmPassword("");
					setOtherErrorMsg("An error has occured on our side, please contact our admins or simply try again later");
				});
		}
	}

	async function signupUser(body) {
		await axios.post(`${host}/players`, body);
	}

	async function checkDuplicate() {
		const ret = await axios.get(`${host}/players/${username}/${email}`);
		return ret;
	}
	if (isLoggedin) {
		return <Navigate to="/" />;
	}
	return (
		<div class="border-solid border-2 text-center">
			<form onSubmit={handleSubmit}>
				<label>
					Email:
					<input
						class="border-solid border-2"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="Enter email"
					/>
				</label>
				<br />
				<label>
					Username:
					<input
						class="border-solid border-2 mt-2"
						value={username}
						onChange={(event) => setusername(event.target.value)}
						placeholder="Eneter username"
					/>
				</label>
				<br />
				<label>
					Password:
					<input
						class="border-solid border-2 mt-2"
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder="Enter your password"
					/>
				</label>
				<br />
				<label>
					Confirm Password:
					<input
						class="border-solid border-2 mt-2"
						type="password"
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						placeholder="Confirm Password "
					/>
				</label>
				<br />
				<label>
					country:
					<input
						class="border-solid border-2 mt-2"
						value={country}
						onChange={(event) => setCountry(event.target.value)}
						placeholder="Country"
					/>
				</label>
				<br />
				<br />
				<div style={{display: IsUserErrorVisible ? "block" : "none"}}>
					<p class="text-red-400"> A user already exist with the current email or username </p>
				</div>

				<br />
				<div style={{display: IsPassErrorVisible ? "block" : "none"}}>
					<p class="text-red-400"> Your passwords do not match, please try again with the same passwords</p>
				</div>

				<div style={{display: OtherErrorDisplay ? "block" : "none"}}>
					<p class="text-red-400"> {OtherErrorMsg} </p>
				</div>
				<br />

				<button type="submit">Sign Up</button>
			</form>
			<br></br>
			<Link to="/login">
				<p class="text-sm">
					Have an account? <span class="text-green-500"> Log in </span>
				</p>
			</Link>
			<Link to="/">
				<p class="text-sm">
					<span class="text-green-500"> Home</span>
				</p>
			</Link>
		</div>
	);
}
