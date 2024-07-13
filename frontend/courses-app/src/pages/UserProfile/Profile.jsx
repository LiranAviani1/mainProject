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
      <div className="flex items-center justify-center mt-28 text-center">
        <div className="w-full max-w-lg border border-gray-300 rounded-lg bg-white px-8 py-10 shadow-lg">
          <h1 className="text-3xl mb-6 text-black font-semibold underline">
            User Profile
          </h1>
          <h3 className="text-lg mb-4">
            <span className="font-semibold underline">Email:</span>{" "}
            {userInfo.email}
          </h3>
          <h3 className="text-lg mb-4">
            <span className="font-semibold underline">Full Name:</span>{" "}
            {userInfo.fullName}
          </h3>
          <h3 className="text-lg mb-4">
            <span className="font-semibold underline">Age:</span> {userInfo.age}
          </h3>
          <h3 className="text-lg mb-4">
            <span className="font-semibold underline">Phone:</span>{" "}
            {userInfo.phone}
          </h3>
          <h3 className="text-lg mb-6">
            <span className="font-semibold underline">Address:</span>{" "}
            {userInfo.address}
          </h3>
          <button
            type="submit"
            className="w-3/5 mx-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <Link to="/edit" state={userInfo}>
              Edit Account
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
