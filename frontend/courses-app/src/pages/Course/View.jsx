import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";
import Toast from "../../components/ToastMessage/Toast";
import moment from "moment";

const View = () => {
  const location = useLocation();
  const userInfo = location.state.userInfo;
  const courseDetails = location.state.courseDetails;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <div className="container mx-auto mt-10">
        <div className="border rounded text-center p-4 bg-white hover:shadow-xl transition-all ease-in-out">
          <div className="text-center justify-between">
            <div>
              <h6 className="text-sm font-bold underline">
                {courseDetails.title}
              </h6>
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-1">
            <div className="text-xs text-black font-semibold">
              Category: {courseDetails.category}
            </div>
            <div className="text-xs text-black font-semibold">
              Sub-Category: {courseDetails.subCategory}
            </div>
          </div>
          <p className="text-xs text-black font-semibold mt-2">
            Content: {courseDetails.content}
          </p>
          <div className="flex justify-center gap-3 mt-2">
            <div className="text-xs text-black font-semibold">
              Date Start: {moment(courseDetails.dateStart).format("DD-MM-YYYY")}
            </div>
            <div className="text-xs text-black font-semibold">
              Date End: {moment(courseDetails.dateEnd).format("DD-MM-YYYY")}
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            <div className="text-xs text-black font-semibold">
              Members: {courseDetails.members.length}
            </div>
            <div className="text-xs text-black font-semibold">
              Capacity: {courseDetails.capacity}
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            <div className="text-xs text-black font-semibold">
              Status: {courseDetails.status}
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-2">
            <div className="flex justify-center gap-3 mt-2">
              {handleRegisterd() ? (
                <button className="btn-primary" disabled>
                  Already Registered
                </button>
              ) : (
                <button className="btn-primary" onClick={handleRegister}>
                  Register
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
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
