// src/pages/Profile/RegisteredCourses.jsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import CourseCard from "../../components/Cards/CourseCard";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import AddEditCourses from "../Home/AddEditCourses";
import Toast from "../../components/ToastMessage/Toast";

export default function RegisteredCourses() {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = location.state;
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });


  useEffect(() => {
    getRegisteredCourses();
  }, []);

  
  const handleEdit = (courseDetails) => {
    setOpenAddEditModal({ isShown: true, data: courseDetails, type: "edit" });
  };

  const handleView = (courseDetails) => {
    navigate("/course-view", {
      state: { userInfo: userInfo, courseDetails: courseDetails },
    });
  };

  const deleteCourse = async (data) => {
    const courseId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-course/" + courseId);

      if (response.data && !response.data.error) {
        showToastMessage("Course Deleted Successfully", "delete");
        getAllCourses();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
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

  const getRegisteredCourses = async () => {
    try {
      const response = await axiosInstance.get("/get-all-courses");

      if (response.data && response.data.courses) {
        const registered = response.data.courses.filter(
          (course) => course.members && course.members.includes(userInfo._id)
        );
        setRegisteredCourses(registered);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar userInfo={userInfo} />
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          content: {
            inset: "10%",
            border: "none",
            borderRadius: "1rem",
            padding: "0",
            maxWidth: "1000px",
            margin: "auto",
            background: "transparent",
          },
        }}
        contentLabel="Add/Edit Course Modal"
      >
        <div className="relative bg-white rounded-lg shadow-lg p-8 max-h-[80vh] overflow-auto">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            onClick={() =>
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }
          ></button>
          <AddEditCourses
            type={openAddEditModal.type}
            courseData={openAddEditModal.data}
            onClose={() =>
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }
            showToastMessage={showToastMessage}
            getAllCourses={getAllCourses}
          />
        </div>
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
      <div className="w-full max-w-screen-lg mx-auto px-4 mt-10">
        <h2 className="text-3xl font-semibold text-center mb-8 underline">Registered Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {registeredCourses.length > 0 ? (
            registeredCourses.map((course) => (
              <CourseCard
                userInfo={userInfo}
                userId={course.userId}
                key={course._id}
                title={course.title}
                content={course.content}
                category={course.category}
                subCategory={course.subCategory}
                dateStart={course.dateStart}
                dateEnd={course.dateEnd}
                capacity={course.capacity}
                members={course.members}
                status={course.status}
                onEdit={() => handleEdit(course)}
                onDelete={() => deleteCourse(course)}
                onView={() => handleView(course)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center text-lg">No registered courses found.</p>
          )}
        </div>
      </div>
    </>
  );
}
