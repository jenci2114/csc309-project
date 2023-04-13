import {useState} from "react";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import '../styles/common.css';
import '../styles/setting.css';
import logo2 from '../assets/property_images/logo2.jpeg'
import backgroundImage from '../assets/profile_bg/bg2.jpg'

export default function Setting() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {isLoggedin, login} = useAuth();
    const [showErr, setShowError] = useState(false);
    const [errMesg, setErrorMsg] = useState("");

    if (!isLoggedin) {
        return <Navigate to="/login"/>;
    }

    function fetchProfileData() {
        console.log("profile1")
        fetch("http://127.0.0.1:8000/account/profile/view/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error fetching profile data");
                }
            })
            .then((queryResult) => {
                localStorage.setItem("avatar", "http://127.0.0.1:8000" + queryResult.avatar_url);
                localStorage.setItem("email", queryResult.email);
                localStorage.setItem("first_name", queryResult.first_name);
                console.log(localStorage.first_name)
                localStorage.setItem("last_name", queryResult.last_name);
                console.log(localStorage.last_name)
                localStorage.setItem("phone", queryResult.phone);
                localStorage.setItem("location", queryResult.location);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    function handleProfileChange() {
        const updatedFirstName = document.getElementById("first_name").value;
        const updatedLastName = document.getElementById("last_name").value;
        const updatedPhone = document.getElementById("phone").value;
        const updatedEmail = document.getElementById("email").value;
        const updatedLocation = document.getElementById("location").value;
        const avatarFile = document.getElementById("avatar").files[0];

        // Email validation
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (updatedEmail && !emailRegex.test(updatedEmail)) {
            alert("Please enter a valid email address");
            return;
        }

        // Phone validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (updatedPhone && !phoneRegex.test(updatedPhone)) {
            alert("Please enter a valid 10-digit phone number");
            return;
        }

        console.log(
            "Updated values:",
            updatedFirstName,
            updatedLastName,
            updatedPhone,
            updatedEmail,
            updatedLocation
        );

        // let updatedAvatarUrl = localStorage.avatar;
        if (avatarFile) {
            console.log("avatar uploading:");
            const formData = new FormData();
            formData.append("avatar_url", avatarFile);

            axios
                .put("http://127.0.0.1:8000/account/profile/edit/", formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`,
                    },
                })
                .then((response) => {
                    console.log("avatar updated successfully:", response.data);
                })
                .catch((error) => {
                    console.error("Error updating avatar:", error);
                });
        }

        const payload = {
            ...(updatedFirstName && {first_name: updatedFirstName}),
            ...(updatedLastName && {last_name: updatedLastName}),
            ...(updatedPhone && {phone: updatedPhone}),
            ...(updatedEmail && {email: updatedEmail}),
            ...(updatedLocation && {location: updatedLocation}),
        };

        axios
            .put("http://127.0.0.1:8000/account/profile/edit/", payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                },
            })
            .then((response) => {
                console.log("Profile updated successfully:", response.data);
                fetchProfileData();
                alert("Profile updated successfully");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
                alert("Error updating profile");
            });

    }

    function handlePasswordChange(event) {
        event.preventDefault();

        const newPassword = document.getElementById("password").value;
        const confirmPassword = document.getElementById("password2").value;

         if (newPassword.length < 8) {
            alert("New password must be at least 8 characters long");
            return;
          }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }

        const payload = {
            password: newPassword,
            password2: confirmPassword,
        };

        axios
            .put("http://127.0.0.1:8000/account/profile/edit/", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.token}`,
                },
            })
            .then((response) => {
                console.log("Password changed successfully:", response.data);
                alert("Password changed successfully");
                // Perform any other actions after a successful password change
            })
            .catch((error) => {
                console.error("Error changing password:", error);
                alert("Error changing password");
            });
    }

// Call the function to fetch the profile data and update the local storage
    fetchProfileData();

    const profileBg2Style = {
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };

    const profile = {
        username: localStorage.username,
        firstName: localStorage.first_name,
        lastName: localStorage.last_name,
        email: localStorage.email,
        phone: localStorage.phone,
        location: localStorage.location,
        rating: 4.5,
        photo: localStorage.avatar,
    };

    return (
        <>
        <div className="container" style={{paddingTop: "5vw"}}>
            <div className="row gutters-sm">
                <div className="col-md-4 d-none d-md-block">
                    <div className="card">
                        <div className="card-body">
                            <nav className="nav flex-column nav-pills nav-gap-y-1">
                                <a
                                    href="#profile"
                                    data-toggle="tab"
                                    className="nav-item nav-link has-icon nav-link-faded active"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-user mr-2"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Profile Information
                                </a>
                                <a
                                    href="#security"
                                    data-toggle="tab"
                                    className="nav-item nav-link has-icon nav-link-faded"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-shield mr-2"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    Security
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header border-bottom mb-3 d-flex d-md-none">
                            <ul
                                className="nav nav-tabs card-header-tabs nav-gap-x-1"
                                role="tablist"
                            >
                                <li className="nav-item">
                                    <a
                                        href="#profile"
                                        data-toggle="tab"
                                        className="nav-link has-icon active"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-user"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        href="#security"
                                        data-toggle="tab"
                                        className="nav-link has-icon"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-shield"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body tab-content">
                            <div className="tab-pane active" id="profile">
                                <h6>YOUR PROFILE INFORMATION</h6>
                                <hr/>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="first_name">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="first_name"
                                            placeholder="Enter your First Name"
                                            defaultValue={profile.firstName}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last_name">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="last_name"
                                            placeholder="Enter your Lasr Name"
                                            defaultValue={profile.lastName}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phone"
                                            placeholder="Your phone number"
                                            defaultValue={profile.phone}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Enter your email"
                                            defaultValue={profile.email}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="location">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="location"
                                            placeholder="Enter your location"
                                            defaultValue={profile.location}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="avatar">Change Avatar</label>
                                        <input type="file" className="form-control-file" id="avatar"/>
                                    </div>
                                    <hr/>
                                    <button type="button" className="btn btn-dark" onClick={handleProfileChange}>
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                            <div className="tab-pane" id="security">
                                <h6>SECURITY SETTINGS</h6>
                                <hr/>
                                <form>
                                    <div className="form-group">
                                        <label className="d-block">Change Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control mt-1"
                                            placeholder="New password (at least 8 characters)"
                                        />
                                        <input
                                            type="password"
                                            id="password2"
                                            className="form-control mt-1"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <button className="btn btn-dark" type="button" onClick={handlePasswordChange}>
                                        Confirm
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div></>
    );
}
