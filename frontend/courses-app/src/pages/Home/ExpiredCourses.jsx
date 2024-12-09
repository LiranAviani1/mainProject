import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import CourseCard from "../../components/Cards/CourseCard";
import NoDataImg from "../../assets/images/no-data.svg";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ExpiredCourses = () => {
  const [expiredCourses, setExpiredCourses] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Fetch all courses and filter expired ones
  const getExpiredCourses = async () => {
    try {
      const response = await axiosInstance.get("/get-all-courses");
      if (response.data && response.data.courses) {
        const currentTime = moment();
        const filteredCourses = response.data.courses.filter(course =>
          moment(course.dateEnd).isBefore(currentTime)
        );
        setExpiredCourses(filteredCourses);
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
      console.log("Error fetching user info.");
    }
  };



  // Handle delete course
  const deleteCourse = async (data) => {
    const courseId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-course/" + courseId);

      if (response.data && !response.data.error) {
        // Remove deleted course from expiredCourses state
        setExpiredCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
        console.log("Course deleted successfully");
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    getExpiredCourses();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expired Courses</h2>
        {expiredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {expiredCourses.map((course) => (
              <CourseCard
                key={course._id}
                userInfo={userInfo}
                userId={course.userId}
                title={course.title}
                category={course.category}
                subCategory={course.subCategory}
                dateStart={course.dateStart}
                dateEnd={course.dateEnd}
                capacity={course.capacity}
                members={course.members}
                status={course.status}
                onDelete={() => deleteCourse(course)}
                onView={() => navigate("/course-view", {
                  state: { userInfo: userInfo, courseDetails: course },
                })}
              />
            ))}
          </div>
        ) : (
          <EmptyCard imgSrc={NoDataImg} message="No expired courses found." />
        )}
      </div>
    </>
  );
};

export default ExpiredCourses;
