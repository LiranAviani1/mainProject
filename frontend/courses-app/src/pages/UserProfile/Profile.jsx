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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
      />
      <div className="flex items-center justify-center mt-20 text-center">
        <div className="w-full max-w-lg border border-gray-200 rounded-lg bg-white px-8 py-10 shadow-lg">
          <h1 className="text-3xl mb-6 text-gray-900 font-semibold underline">
            User Profile
          </h1>
          <h3 className="text-lg mb-4 text-gray-700">
            <span className="font-semibold">Email:</span> {userInfo.email}
          </h3>
          <h3 className="text-lg mb-4 text-gray-700">
            <span className="font-semibold">Full Name:</span> {userInfo.fullName}
          </h3>
          <h3 className="text-lg mb-4 text-gray-700">
            <span className="font-semibold">Age:</span> {userInfo.age}
          </h3>
          <h3 className="text-lg mb-4 text-gray-700">
            <span className="font-semibold">Phone:</span> {userInfo.phone}
          </h3>
          <h3 className="text-lg mb-4 text-gray-700">
            <span className="font-semibold">Birthday:</span> {formatDate(userInfo.birthday)}
          </h3>
          <h3 className="text-lg mb-4 text-gray-700">
            <span className="font-semibold">Gender:</span> {userInfo.gender}
          </h3>
          <h3 className="text-lg mb-6 text-gray-700">
            <span className="font-semibold">Address:</span> {userInfo.address}
          </h3>
          <button
            type="submit"
            className="w-3/5 mx-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <Link to="/edit-user" state={userInfo}>
              Edit Account
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
