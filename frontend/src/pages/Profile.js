import {useState} from "react";
import {Link, Navigate} from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import '../styles/common.css';
import '../styles/profile.css';
import logo2 from '../assets/property_images/logo2.jpeg'
import backgroundImage from '../assets/profile_bg/bg2.jpg'

export default function Profile() {
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
    <div style={profileBg2Style} className="d-flex justify-content-center align-items-center">
      <div className="card" style={{ width: '18rem', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="card-body">
          <h5 className="card-title">Username: {profile.username}</h5>
          <p className="card-text">
                Name: {profile.firstName} {profile.lastName}
          </p>
          <p className="card-text">Email: {profile.email}</p>
          <p className="card-text">Phone: {profile.phone}</p>
          <p className="card-text">Location: {profile.location}</p>
          <p className="card-text">Rating: {profile.rating}</p>
        </div>
      </div>
    </div>
  );
}
