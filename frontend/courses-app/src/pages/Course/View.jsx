import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";
import Toast from "../../components/ToastMessage/Toast";
import moment from "moment";
import Navbar from "../../components/Navbar/Navbar";

const View = () => {
  const location = useLocation();
  const userInfo = location.state.userInfo;
  const courseDetails = location.state.courseDetails;
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

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

  const handleRegisterd = () => {
    const userCourses = userInfo.courses;
    const courseId = courseDetails._id;
    if (userCourses.includes(courseId)) {
      return true;
    }
    return false;
  };

  // handleRegister function
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        "/register-course/" + courseDetails._id,
        {
          userId: userInfo._id,
        }
      );

      if (response.data.error === false) {
        showToastMessage("Successfully registered", "add");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        showToastMessage(response.data.message, "delete");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured");
      }
    }
  };
  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
      />
      {handleRegisterd() ? (
        <div className="bg-gray-100 p-10 pb-12">
          <div className="bg-white text-center px-8 py-2 shadow-md flex justify-center gap-4 rounded-lg">
            <Link
              to="/teacher-info"
              state={courseDetails}
              className="text-blue-500 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded transition-colors duration-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-100"
            >
              Teacher info
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Course info
            </button>
          </div>
          <div className="container mx-auto mt-6 px-4 text-center">
            <h3 className="text-3xl font-bold text-center mt-6 mb-2">
              Course Details
            </h3>
            <div className="bg-white rounded-lg shadow-md h3-6 p-6">
              <div className="mb-4">
                <h6 className="text-xl font-semibold">{courseDetails.title}</h6>
              </div>
              <div className="mb-4">
                <div className="text-l text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Category</h3>{" "}
                  {courseDetails.category}
                </div>
                <div className="text-l text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Sub-Category</h3>{" "}
                  {courseDetails.subCategory}
                </div>
              </div>
              <div className="text-l text-gray-700 mb-4">
                <h3 className="font-semibold underline">Content</h3>{" "}
                {courseDetails.content}
              </div>
              <div>
                <div className="text-l text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Date Start</h3>{" "}
                  {moment(courseDetails.dateStart).format("DD-MM-YYYY")}
                </div>

                <div className="text-l text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Date End</h3>{" "}
                  {moment(courseDetails.dateEnd).format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-l text-gray-600 mb-4">
                  <b className="font-semibold underline">Members:</b>{" "}
                  {courseDetails.members.length}
                </div>
                <div className="text-l text-gray-600">
                  <b className="font-semibold underline">Capacity:</b>{" "}
                  {courseDetails.capacity}
                </div>
              </div>
              <div className="text-l text-gray-600 mb-4">
                <b className="font-semibold underline">Status:</b>{" "}
                <span
                  className={
                    courseDetails.status === "open"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {courseDetails.status}
                </span>
              </div>
            </div>
          </div>
          <div>
            
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 p-6 pb-12">
          <div className="container mx-auto mt-6 px-4 text-center">
            <h3 className="text-2xl font-bold mt-6 mb-2">Course Details</h3>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h6 className="text-lg font-semibold">{courseDetails.title}</h6>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Category</h3>{" "}
                  {courseDetails.category}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Sub-Category</h3>{" "}
                  {courseDetails.subCategory}
                </div>
              </div>
              <h3 className="text-sm text-gray-700 mb-4">
                <h3 className="font-semibold underline">Content</h3>{" "}
                {courseDetails.content}
              </h3>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Date Start</h3>{" "}
                  {moment(courseDetails.dateStart).format("DD-MM-YYYY")}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <h3 className="font-semibold underline">Date End</h3>{" "}
                  {moment(courseDetails.dateEnd).format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-4">
                  <b className="font-semibold underline">Members:</b>{" "}
                  {courseDetails.members.length}
                </div>
                <div className="text-sm text-gray-600">
                  <b className="font-semibold underline">Capacity:</b>{" "}
                  {courseDetails.capacity}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <b className="font-semibold underline">Status:</b>{" "}
                <span
                  className={
                    courseDetails.status === "open"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {courseDetails.status}
                </span>
              </div>
              <div className="flex justify-center">
                <button
                  className="btn-primary"
                  style={{ width: "15%" }}
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default View;
