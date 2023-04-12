import './App.css';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
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
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import MyProperty from "./pages/MyProperty";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import PropertyImages from "./pages/PropertyImages";
import Reservation from "./pages/Reservation";
import PropertyAvailabilities from './pages/PropertyAvailabilities';

function App() {
  const { isLoggedin } = useAuth();
  return (
    <div>

      {isLoggedin ? (
        <LoginNavBar name={localStorage.username} avatar={localStorage.avatar} />
      ) : (
        <LogoutNavBar />
      )}

      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/my_home/" element={<MyProperty />} />
          <Route path="/setting/" element={<Setting />} />
          <Route path="/reservations/" element={<Reservation />} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/notifications/host/" element={<HostNotifications />} />
          <Route path="/notifications/tenant/" element={<TenantNotifications />} />
          <Route path="/comments/user/:id/" element={<UserComments />} />
          <Route path="/comments/property/:id/" element={<PropertyComments />} />
          <Route path="/property/view/:id/" element={<ViewProperty />} />
          <Route path="/property/add/" element={<AddProperty />} />
          <Route path="/property/edit/:id/" element={<EditProperty />} />
          <Route path="/property/:id/images/" element={<PropertyImages />} />
          <Route path="/property/:id/availabilities/" element={<PropertyAvailabilities />} />
          <Route path="*" element={<h1>404: Not Found</h1>} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
