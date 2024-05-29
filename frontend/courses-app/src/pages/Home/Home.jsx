import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CourseCard from "../../components/Cards/CourseCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditCourses from "./AddEditCourses";
import Toast from "../../components/ToastMessage/Toast";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import AddCoursesImg from "../../assets/images/add-courses.svg";
import NoDataImg from "../../assets/images/no-data.svg";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

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

      <div className="container mx-auto">
        {isSearch && (
          <h3 className="text-lg font-medium mt-5">Search Results</h3>
        )}

        {allCourses.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allCourses.map((item) => {
              return (
                <CourseCard
                  userInfo={userInfo? userInfo : getUserInfo()}
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
                : `Start creating your first course! Click the 'Add' button to jot down your
          thoughts, ideas, and reminders. Let's get started!`
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Example Modal"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditCourses
          type={openAddEditModal.type}
          courseData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          showToastMessage={showToastMessage}
          getAllCourses={getAllCourses}
        />
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
