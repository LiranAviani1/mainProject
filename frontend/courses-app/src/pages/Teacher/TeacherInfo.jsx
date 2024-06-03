import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function TeacherInfo() {
  const location = useLocation();
  const userId = location.state.userId ? location.state.userId : location.state;
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
      <div className="bg-white flex items-center justify-between px-20 py-2 drop-shadow">
        <Link to="/teacher-info" className='disabled-link'>
          Teacher info
        </Link>
        <button onClick={() => navigate(-1)}>Course info</button>
        <Link to="/grades">Grades</Link>
      </div>

      <div>
        {teacherInfo && (
          <>
           
            <div className="container mx-auto mt-10 text-center">
            <h3 className="text-2xl font-bold text-center underline">
            Teacher Info
            </h3>
            <div>
              <div>
                <div>Full Name: {teacherInfo.fullName}</div>
                <div>Age: {teacherInfo.age}</div>
              </div>
              <p>Phone: {teacherInfo.phone}</p>
              <div>
                <div>
                Address: {teacherInfo.address}
                </div>
                <div>
                Email: {teacherInfo.email}
                </div>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default TeacherInfo;
