import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function TeacherInfo() {
  const location = useLocation();
  const userId = location.state.userId;
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const getTeacherInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user/" + userId);
      if (response.data && response.data.user) {
        setTeacherInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
      }
    }
  };

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
    getTeacherInfo();
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

      <div>
        <h1>Teacher Info</h1>
        {teacherInfo && (
          <>
            <h3>Full Name: {teacherInfo.fullName}</h3>
            <h3>Age: {teacherInfo.age}</h3>
            <h3>Phone: {teacherInfo.phone}</h3>
            <h3>Address: {teacherInfo.address}</h3>
            <h3>Email: {teacherInfo.email}</h3>
          </>
        )}
      </div>
    </>
  );
}

export default TeacherInfo;
