import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useState, useEffect } from "react";
import Toast from "../../components/ToastMessage/Toast";
import moment from "moment";
import Navbar from "../../components/Navbar/Navbar";

const View = () => {
  const location = useLocation();
  const userInfo = location.state.userInfo;
  const courseDetails = location.state.courseDetails;
  const teacherId = courseDetails.userId;
  const [teacherInfo, setTeacherInfo] = useState([]);

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const getTeacherInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user/" + teacherId);
      if (response.data && response.data.user) {
        setTeacherInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
      }
    }
  };

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
        setError("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    getTeacherInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
      />
      {handleRegisterd() ? (
        <div className="bg-gray-100 p-10 pb-12">
          <div className="container mx-auto mt-8 px-4">
            <h3 className="text-4xl font-bold text-center mb-8 text-gray-800">
              Course Details
            </h3>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h6 className="text-3xl underline font-semibold text-gray-800">
                  {courseDetails.title}
                </h6>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold text-xl underline">Category</h4>
                  {courseDetails.category}
                </div>
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold text-xl underline">
                    Sub-Category
                  </h4>
                  {courseDetails.subCategory}
                </div>
              </div>
              <div className="text-lg text-gray-700 mb-6">
                <h4 className="font-semibold text-xl mb-1 underline">
                  Content
                </h4>
                <p>{courseDetails.content}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold text-xl underline">
                    Date Start
                  </h4>
                  <p className="font-bold">
                    {moment(courseDetails.dateStart).format("DD-MM-YYYY")}
                  </p>
                </div>
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold text-xl underline">Date End</h4>
                  <p className="font-bold">
                    {moment(courseDetails.dateEnd).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="text-lg text-gray-600">
                  <b className="font-semibold text-xl underline">Members</b>
                  <p className="font-bold">{courseDetails.members.length}</p>
                </div>
                <div className="text-lg text-gray-600">
                  <b className="font-semibold text-xl underline">Capacity</b>
                  <p className="font-bold">{courseDetails.capacity}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="text-lg text-gray-600">
                  <b className="font-semibold text-xl underline">Price</b>
                  <p className="font-bold">{courseDetails.price} ₪</p>
                </div>

                <div className="text-lg font-semibold">
                  Status:{" "}
                  <span
                    className={
                      courseDetails.status === "open"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {courseDetails.status === "open" ? "OPEN" : "CLOSE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {teacherInfo && (
            <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-12">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold mb-6 text-center underline text-gray-800">
                  Teacher Info
                </h3>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="mb-6">
                    <div className="text-lg mb-4 text-gray-700">
                      <b className="underline">Full Name:</b>{" "}
                      {teacherInfo.fullName}
                    </div>
                    <div className="text-lg mb-4 text-gray-700">
                      <b className="underline">Age:</b> {teacherInfo.age}
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-lg mb-4 text-gray-700">
                      <b className="underline">Phone:</b> {teacherInfo.phone}
                    </div>
                    <div className="text-lg mb-4 text-gray-700">
                      <b className="underline">Email:</b> {teacherInfo.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 p-6 pb-12">
          <div className="container mx-auto mt-6 px-4 text-center">
            <h3 className="text-2xl font-bold mt-6 mb-4 text-gray-800">
              Course Details
            </h3>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-4">
                <h6 className="text-2xl underline font-semibold text-gray-800">
                  {courseDetails.title}
                </h6>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold underline">Category</h4>{" "}
                  {courseDetails.category}
                </div>
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold underline">Sub-Category</h4>{" "}
                  {courseDetails.subCategory}
                </div>
              </div>
              <div className="text-lg text-gray-700 mb-6">
                <h4 className="font-semibold underline">Content</h4>{" "}
                {courseDetails.content}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold underline">Date Start</h4>{" "}
                  {moment(courseDetails.dateStart).format("DD-MM-YYYY")}
                </div>
                <div className="text-lg text-gray-600">
                  <h4 className="font-semibold underline">Date End</h4>{" "}
                  {moment(courseDetails.dateEnd).format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="text-lg text-gray-600">
                  <b className="font-semibold underline">Members:</b>{" "}
                  {courseDetails.members.length}
                </div>
                <div className="text-lg text-gray-600">
                  <b className="font-semibold underline">Capacity:</b>{" "}
                  {courseDetails.capacity}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="text-lg text-gray-600">
                  <b className="font-semibold text-xl underline">Price</b>
                  <p className="font-bold">{courseDetails.price} ₪</p>
                </div>

                <div className="text-lg font-semibold">
                  Status:{" "}
                  <span
                    className={
                      courseDetails.status === "open"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {courseDetails.status === "open" ? "OPEN" : "CLOSE"}
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className="btn-primary text-lg w-[20%] px-4 py-2 rounded-lg transition-colors duration-300"
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
