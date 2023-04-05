import Navbar from "./components/navbar";
import './App.css';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
 import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import HostNotifications from "./pages/HostNotifications";
import TenantNotifications from "./pages/TenantNotifications";
import LoginNavBar from "./components/LoginNavBar";
import LogoutNavBar from "./components/LogoutNavBar";

function App() {
   const {isLoggedin} = useAuth();
  return (
    <div>

        {isLoggedin ? (
          <LoginNavBar name = {localStorage.username} avatar = {localStorage.avatar} />
        ) : ( 
          <LogoutNavBar/>
        )}

      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/notifications/host/" element={<HostNotifications/>} />
          <Route path="/notifications/tenant/" element={<TenantNotifications/>} />
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
      </Router>
	
    </div>
  );
}

export default App;
