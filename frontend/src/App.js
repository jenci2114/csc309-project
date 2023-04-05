import Navbar from "./components/navbar";
import './App.css';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
 import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import HostNotifications from "./pages/HostNotifications";

function App() {
   const {isLoggedin} = useAuth();
  return (
    <div>

        {isLoggedin ? (
          <Navbar login = "true" name = {localStorage.username} avatar = {localStorage.avatar} />
        ) : ( 
          <Navbar login = "false" />
        )}

      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/notifications/host/" element={<HostNotifications/>} />
        </Routes>
      </Router>
	
    </div>
  );
}

export default App;
