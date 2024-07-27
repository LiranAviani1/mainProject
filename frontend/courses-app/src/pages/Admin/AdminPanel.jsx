import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Toast from "../../components/ToastMessage/Toast";
import UserTable from "../../components/Tabels/UserTable";
import CourseTable from "../../components/Tabels/CourseTable";
import Modal from "react-modal";
import AddEditCourses from "../Home/AddEditCourses";
import AddEditUser from "../EditUser/Edit";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
    entityType: "course",
  });
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/get-all-users");
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const getAllCourses = async () => {
    try {
      const response = await axiosInstance.get("/get-all-courses");
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/delete-user/${userId}`);
      if (response.data && !response.data.error) {
        showToastMessage("User Deleted Successfully", "delete");
        getAllUsers();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/delete-course/${courseId}`);
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

  const handleEditUser = (user) => {
    navigate("/edit-user", { state: user });
  };

  const handleEditCourse = (course) => {
    setOpenAddEditModal({
      isShown: true,
      data: course,
      type: "edit",
      entityType: "course",
    });
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
    getAllUsers();
    getAllCourses();
  }, []);

  return (
    <>
       <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearchCourse}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <UserTable
            users={users}
            onDeleteUser={deleteUser}
            onEditUser={handleEditUser}
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Courses</h2>
          <CourseTable
            courses={courses}
            onDeleteCourse={deleteCourse}
            onEditCourse={handleEditCourse}
          />
        </div>
      </div>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
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
            <AddEditCourses
              type={openAddEditModal.type}
              courseData={openAddEditModal.data}
              onClose={() =>
                setOpenAddEditModal({
                  isShown: false,
                  type: "add",
                  data: null,
                  entityType: "course",
                })
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
    </>
  );
};

export default AdminPanel;
