import Navbar from "./components/navbar";
import './App.css';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import useAuth from "./hooks/useAuth";
import Login from "./pages/Login";

function App() {
  const {isAuthenticated, login} = useAuth();
  return (
    <div>

        {isAuthenticated ? (
          <Navbar login = "true" name = "user386" />
        ) : ( 
          <Navbar login = "false" />
        )}

      <Router>
        <Routes>
          {/* <Route exact path="/" element={<HomePage />} /> */}
          <Route path="/login/" element={<Login />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
        </Routes>
      </Router>
	
    </div>
  );
}

export default App;
