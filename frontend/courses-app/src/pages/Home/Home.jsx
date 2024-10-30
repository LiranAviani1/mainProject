import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CourseCard from "../../components/Cards/CourseCard";
import Modal from "react-modal";
import AddEditCourses from "./AddEditCourses";
import Toast from "../../components/ToastMessage/Toast";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import AddCoursesImg from "../../assets/images/add-courses.svg";
import NoDataImg from "../../assets/images/no-data.svg";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import moment from "moment"; 
import { MdAdd } from "react-icons/md";

const Home = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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

  const handleEdit = (courseDetails) => {
    setOpenAddEditModal({ isShown: true, data: courseDetails, type: "edit" });
  };

  const handleView = (courseDetails) => {
    navigate("/course-view", { state: { userInfo: userInfo, courseDetails: courseDetails } });
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

  // Get all Courses
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

  // Delete Course
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

  // Get User Info
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

  // Search for a Course
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

  const onAddCourse = () => {
    setOpenAddEditModal({ isShown: true, type: "add", data: null });
  };

  useEffect(() => {
    getAllCourses();
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
      {userInfo &&
                  (userInfo.role === "admin" || userInfo.role === "teacher") &&
                  location.pathname === "/dashboard" && (
                    <button
                      className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full shadow-md transition duration-300"
                      onClick={onAddCourse}
                    >
                      <MdAdd className="text-2xl" />
                      <span className="ml-2">Add Course</span>
                    </button>
                  )}
      </div>

      <div className="container mx-auto p-6">
        {isSearch && (
          <h3 className="text-lg font-medium mt-5">Search Results</h3>
        )}

        {allCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {allCourses
              .filter((item) => moment(item.dateEnd).isAfter(moment())) // Filter out expired courses
              .map((item) => {
                return (
                  <CourseCard
                    userInfo={userInfo ? userInfo : getUserInfo()}
                    userId={item.userId}
                    key={item._id}
                    title={item.title}
                    content={item.content}
                    category={item.category}
                    subCategory={item.subCategory}
                    dateStart={item.dateStart}
                    dateEnd={item.dateEnd}
                    capacity={item.capacity}
                    members={item.members}
                    status={item.status}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => deleteCourse(item)}
                    onView={() => handleView(item)}
                  />
                );
              })}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddCoursesImg}
            message={
              isSearch
                ? `Oops! No courses found matching your search.`
                : `Start creating your first course! Click the 'Add Course' button to add first course on the site`
            }
          />
        )}
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
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            onClick={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          >
          </button>
          <AddEditCourses
            type={openAddEditModal.type}
            courseData={openAddEditModal.data}
            onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
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

export default Home;
