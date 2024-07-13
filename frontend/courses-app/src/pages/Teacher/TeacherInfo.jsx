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
      <div className="p-8 bg-gray-100">
      <div className="bg-white text-center px-8 py-2 shadow-md flex justify-center gap-4 rounded-lg">
        <Link
          to="/teacher-info"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Teacher info
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded transition-colors duration-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100"
          
        >
          Course info
        </button>
      </div>
      </div>
      <div>
        {teacherInfo && (
          <>
            <div className="bg-gray-100 p-4 pb-12">
              <div className="container mx-auto mt-10 text-center">
                <h3 className="text-3xl font-bold underline">Teacher Info</h3>
                <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                  <div className="mb-4">
                    <div className="text-xl mb-4 text-gray-600">
                      <b className="underline">Full Name:</b>{" "}
                      {teacherInfo.fullName}
                    </div>
                    <div className="text-xl mb-4 text-gray-600">
                      <b className="underline">Age:</b> {teacherInfo.age}
                    </div>
                  </div>
                  <p className="text-xl mb-4 text-gray-700 mb-4">
                    <b className="underline">Phone:</b> {teacherInfo.phone}
                  </p>
                  <div className="mb-4">
                    <div className="text-xl mb-4 text-gray-600">
                      <b className="underline">Address:</b>{" "}
                      {teacherInfo.address}
                    </div>
                    <div className="text-xl mb-4 text-gray-600">
                      <b className="underline">Email:</b> {teacherInfo.email}
                    </div>
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
