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
        <div className="w-96 border rounded bg-white px-7 py-10">
          <h1 className="text-xl text-black font-semibold text-center underline">
            User Profile
          </h1>
          <h3 className="text-m text-center"><b className="underline">Email:</b> {userInfo.email}</h3>
          <h3 className="text-m text-center"><b className="underline">Full Name:</b> {userInfo.fullName}</h3>
          <h3 className="text-m text-center"><b className="underline">Age:</b> {userInfo.age}</h3>
          <h3 className="text-m text-center"><b className="underline">Phone:</b> {userInfo.phone}</h3>
          <h3 className="text-m text-center"><b className="underline">Address:</b> {userInfo.address}</h3>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: "60%" }}
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
