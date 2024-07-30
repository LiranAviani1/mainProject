import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function About() {
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 underline">
          About Us
        </h1>
        <div className="text-lg text-gray-700 mb-6 space-y-6">
          <p className="mb-4">
            Welcome to our platform, where private teachers can create and
            manage their own courses. Whether you are students looking for
            one-on-one or group lessons, we provide a place for you to connect
            and grow.
          </p>
          <p className="mb-4">
            Our mission is to empower teachers to offer their services directly
            to students without intermediaries. We believe in the value of
            personalized education and strive to make it accessible to everyone.
          </p>
          <p className="mb-4">
            Teachers can easily publish their courses, set their schedules, and
            manage their students. Students can browse through a variety of
            subjects and find the perfect teacher for them.
          </p>
          <p className="mb-4">
            If you are a teacher and interested in joining our platform, please
            fill out an application form. We would love to welcome you to our
            community!
          </p>
          <div className="text-center">
            <Link
              to="/apply-teacher"
              className="inline-block bg-blue-500 text-white py-2 px-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
              Apply to be a Teacher
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
