import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const userInfo = location.state;
  return (
    //user profile
    <div>
      <h1>User Profile</h1>
      <h3>Email: {userInfo.email}</h3>
      <h3>Full Name: {userInfo.fullName}</h3>
      <h3>Age: {userInfo.age}</h3>
      <h3>Phone: {userInfo.phone}</h3>
      <h3>Address: {userInfo.address}</h3>
      <button type="submit" className="btn-primary">
        <Link to="/edit" state={userInfo}>Edit Account</Link>
      </button>
    </div>
  );
}
