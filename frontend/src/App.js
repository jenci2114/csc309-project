import Navbar from "./components/navbar";
import './App.css';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
// import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";

function App() {
  // const {isLoggedin, login} = useAuth();
  return (
    <div>

        {localStorage.username ? (
          <Navbar login = "true" name = {localStorage.username} avatar = {localStorage.avatar} />
        ) : ( 
          <Navbar login = "false" />
        )}

      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login/" element={<Login />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
        </Routes>
      </Router>
	
    </div>
  );
}

export default App;
