import './App.css';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
 import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import HostNotifications from "./pages/HostNotifications";
import TenantNotifications from "./pages/TenantNotifications";
import LoginNavBar from "./components/LoginNavBar";
import LogoutNavBar from "./components/LogoutNavBar";
import UserComments from "./pages/UserComments";
import Register from "./pages/Register";
import PropertyComments from "./pages/PropertyComments";
import ViewProperty from "./pages/ViewProperty";
// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap/dist/js/bootstrap.bundle.min.js"
import Profile from "./pages/Profile";

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
             <Route path="/register/" element={<Register />} />
            <Route path="/profile/" element={<Profile />} />
          <Route path="/notifications/host/" element={<HostNotifications/>} />
          <Route path="/notifications/tenant/" element={<TenantNotifications/>} />
          <Route path="/comments/user/:id/" element={<UserComments/>} />
          <Route path="/comments/property/:id/" element={<PropertyComments/>} />
            <Route path="/property/view/:id/" element={<ViewProperty/>} />
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
