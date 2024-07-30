import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Toast from "../../components/ToastMessage/Toast";
import UserTable from "../../components/Tabels/UserTable";
import CourseTable from "../../components/Tabels/CourseTable";
import TeacherApplicationsTable from "../../components/Tabels/TeacherApplicationsTable";
import Modal from "react-modal";
import AddEditCourses from "../Home/AddEditCourses";
import AddEditUser from "../EditUser/Edit";

Modal.setAppElement("#root");

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
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
  const [viewApplication, setViewApplication] = useState({
    isShown: false,
    data: null,
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
        const coursesWithTeacherInfo = await Promise.all(
          response.data.courses.map(async (course) => {
            const teacherResponse = await axiosInstance.get(
              `/get-user/${course.userId}`
            );
            return {
              ...course,
              teacher: teacherResponse.data.user,
            };
          })
        );
        setCourses(coursesWithTeacherInfo);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const getAllApplications = async () => {
    try {
      const response = await axiosInstance.get("/get-all-teacher-applications");
      if (response.data && response.data.applications) {
        setApplications(response.data.applications);
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

  const approveApplication = async (applicationId) => {
    try {
      const response = await axiosInstance.put(
        `/approve-application/${applicationId}`
      );
      if (response.data && !response.data.error) {
        showToastMessage("Application Approved Successfully", "approve");
        setTimeout(() => {
          window.location.reload();
        }, 700);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const denyApplication = async (applicationId) => {
    try {
      const response = await axiosInstance.put(
        `/deny-application/${applicationId}`
      );
      if (response.data && !response.data.error) {
        showToastMessage("Application Denied and Deleted Successfully", "deny");
        getAllApplications();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const changeUserRoleToUser = async (userId) => {
    try {
      const response = await axiosInstance.put(`/change-user-role/${userId}`, {
        role: "user",
      });
      if (response.data && !response.data.error) {
        showToastMessage("User role updated to 'user' successfully", "success");
        getAllUsers();
        setTimeout(() => {
          window.location.reload();
        }, 700);
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

  const handleViewApplication = (application) => {
    setViewApplication({
      isShown: true,
      data: application,
    });
  };

  const onSearch = async () => {
    try {
      if (filter === "users") {
        const response = await axiosInstance.get("/search-users", {
          params: { query: searchQuery },
        });
        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setIsSearch(true);
        }
      } else if (filter === "courses") {
        const response = await axiosInstance.get("/search-courses", {
          params: { query: searchQuery },
        });
        if (response.data && response.data.courses) {
          const coursesWithTeacherInfo = await Promise.all(
            response.data.courses.map(async (course) => {
              const teacherResponse = await axiosInstance.get(
                `/get-user/${course.userId}`
              );
              return {
                ...course,
                teacher: teacherResponse.data.user,
              };
            })
          );
          setCourses(coursesWithTeacherInfo);
          setIsSearch(true);
        }
      } else if (filter === "applications") {
        const response = await axiosInstance.get("/search-applications", {
          params: { query: searchQuery },
        });
        if (response.data && response.data.applications) {
          setApplications(response.data.applications);
          setIsSearch(true);
        }
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    setFilter("");
    getAllUsers();
    getAllCourses();
    getAllApplications();
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
    getAllApplications();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchCourse={onSearch}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 underline">
          Admin Panel
        </h1>
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex justify-center space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                filter === "users"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("users")}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 rounded ${
                filter === "courses"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("courses")}
            >
              Courses
            </button>
            <button
              className={`px-4 py-2 rounded ${
                filter === "applications"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setFilter("applications")}
            >
              Applications
            </button>
            <button
              onClick={onSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
        {filter === "users" && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Users</h2>
            <UserTable
              users={users}
              onDeleteUser={deleteUser}
              onEditUser={handleEditUser}
              onChangeUserRole={changeUserRoleToUser}
            />
          </div>
        )}
        {filter === "courses" && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Courses
            </h2>
            <CourseTable
              courses={courses}
              onDeleteCourse={deleteCourse}
              onEditCourse={handleEditCourse}
            />
          </div>
        )}
        {filter === "applications" && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Teacher Applications
            </h2>
            <TeacherApplicationsTable
              applications={applications}
              onApprove={approveApplication}
              onDeny={denyApplication}
              onView={handleViewApplication}
            />
          </div>
        )}
      </div>
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
      <Modal
        isOpen={viewApplication.isShown}
        onRequestClose={() =>
          setViewApplication({ isShown: false, data: null })
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
            maxWidth: "800px",
            margin: "auto",
            background: "transparent",
          },
        }}
        contentLabel="View Application Modal"
      >
        <div className="relative bg-white rounded-lg shadow-lg p-8 max-h-[80vh] overflow-auto">
          {viewApplication.data && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center underline">
                Application Details
              </h2>
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Full Name:</strong> {viewApplication.data.fullName}
                </p>
                <p className="text-lg">
                  <strong>Email:</strong> {viewApplication.data.email}
                </p>
                <p className="text-lg">
                  <strong>Phone:</strong> {viewApplication.data.phone}
                </p>
                <p className="text-lg">
                  <strong>Qualifications:</strong>
                </p>
                <div className="border border-gray-300 rounded p-4 bg-gray-50">
                  {viewApplication.data.qualifications}
                </div>
                <p className="text-lg">
                  <strong>Experience:</strong>
                </p>
                <div className="border border-gray-300 rounded p-4 bg-gray-50">
                  {viewApplication.data.experience}
                </div>
                {viewApplication.data.fileUrl && (
                  <div className="mt-4">
                    <p className="text-lg"><strong>Uploaded Image:</strong></p>
                    <img
                      src={`http://localhost:8000${viewApplication.data.fileUrl}`}
                      alt="Uploaded file"
                      className="border border-gray-300 rounded p-2 mt-2"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={() =>
                  setViewApplication({ isShown: false, data: null })
                }
                className="mt-6 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 block mx-auto"
              >
                Close
              </button>
            </>
          )}
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
