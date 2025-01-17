import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import About from "./pages/About/About";
import SignUp from "./pages/SignUp/SignUp";
import Edit from "./pages/EditUser/Edit";
import Profile from "./pages/UserProfile/Profile";
import View from "./pages/Course/View";
import Admin from "./pages/Admin/AdminPanel.jsx"
import ApplyTeacher from "./pages/ApplyTeacher/ApplyTeacher.jsx";
import PaymentPage from "./pages/Payment/PaymentPage.jsx";
import ExpiredCourses from "./pages/Home/ExpiredCourses.jsx"
import RegisteredCourses from "./pages/UserProfile/RegisteredCourses.jsx"
import ContactUs from "./pages/ContactUs/ContactUs.jsx";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/edit-user" exact element={<Edit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/course-view" element={<View />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/apply-teacher" element={<ApplyTeacher />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/expired-courses" element={<ExpiredCourses />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/registered-courses" element={<RegisteredCourses />} />
        </Routes>
      </Router>
    </div>
  );
}

// Define the Root component to handle the initial redirect
const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
