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
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [filter, setFilter] = useState("all");
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
    navigate("/course-view", {
      state: { userInfo: userInfo, courseDetails: courseDetails },
    });
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
        setFilteredCourses(response.data.courses); // Initialize filtered courses
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const filterCourses = (filterType) => {
    setFilter(filterType);
    let filtered = allCourses;

    if (filterType === "myCourses") {
      // Filter courses where the logged-in user is in the members list
      filtered = allCourses.filter((course) =>
        course.members.includes(userInfo?._id)
      );
    } else if (filterType === "notRegistered") {
      filtered = allCourses.filter(
        (course) => !course.members.includes(userInfo?._id)
      );
    } else if (filterType === "openCourses") {
      filtered = allCourses.filter((course) => course.status === "open");
    } else if (filterType === "ownCourses") {
      // Filter courses created by the logged-in user
      filtered = allCourses.filter((course) => course.userId === userInfo?._id);
    }

    // If there's an active search query, apply it
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  // Handle search query change
  const handleSearchQueryChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      filterCourses(filter);
    } else {
      const filtered = allCourses.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
      setIsSearch(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    setFilteredCourses(allCourses);
  };

  const onAddCourse = () => {
    setOpenAddEditModal({ isShown: true, type: "add", data: null });
  };

  useEffect(() => {
    getAllCourses();
    getUserInfo();
  }, []);

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

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto my-8">
        {/* Filter and Add Course Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          {/* Buttons Section */}
          <div className="flex flex-wrap gap-4">
            {userInfo &&
              (userInfo.role === "admin" || userInfo.role === "teacher") && (
                <button
                  className="flex items-center px-5 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
                  onClick={onAddCourse}
                >
                  <MdAdd className="text-2xl mr-2" />
                  <span>Add Course</span>
                </button>
              )}
            <button
              onClick={() => filterCourses("all")}
              className={`px-4 py-2 rounded-lg shadow-md font-medium ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => filterCourses("myCourses")}
              className={`px-4 py-2 rounded-lg shadow-md font-medium ${
                filter === "myCourses"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => filterCourses("notRegistered")}
              className={`px-4 py-2 rounded-lg shadow-md font-medium ${
                filter === "notRegistered"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Not Registered
            </button>
            <button
              onClick={() => filterCourses("openCourses")}
              className={`px-4 py-2 rounded-lg shadow-md font-medium ${
                filter === "openCourses"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Open Courses
            </button>
            {userInfo?.role === "teacher" && (
              <button
                onClick={() => filterCourses("ownCourses")}
                className={`px-4 py-2 rounded-lg shadow-md font-medium ${
                  filter === "ownCourses"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Own Courses
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              placeholder="Search courses..."
              className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {filteredCourses
              .filter((item) => moment(item.dateEnd).isAfter(moment()))
              .map((item) => (
                <CourseCard
                  userInfo={userInfo}
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
              ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImg : AddCoursesImg}
            message={
              isSearch
                ? `Oops! No courses found matching your search.`
                : `Start creating your first course! Click the 'Add Course' button to add your first course.`
            }
          />
        )}
      </div>

      {/* Add/Edit Modal */}
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
    </>
  );
};

export default Home;
