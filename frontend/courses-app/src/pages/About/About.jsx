import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function About() {
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
      />
      <div>About</div>
    </>
  );
}

export default About;
