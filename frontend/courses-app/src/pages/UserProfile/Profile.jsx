import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";


export default function Profile() {
  const location = useLocation();
  const userInfo = location.state;
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  
  const getAllCourses = async () => {
    try {
      const response = await axiosInstance.get("/get-all-courses");

      if (response.data && response.data.courses) {
        setAllCourses(response.data.courses);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const onSearchCourse = async (query) => {
    try {
      const response = await axiosInstance.get("/search-courses", {
        params: { query },
      });

      if (response.data && response.data.courses) {
        setIsSearch(true);
        setAllCourses(response.data.courses);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllCourses();
  };

  return (
    <>
    <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
      />
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
    </>
  );
}
