// src/pages/Profile/RegisteredCourses.jsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import CourseCard from "../../components/Cards/CourseCard";

export default function RegisteredCourses() {
  const location = useLocation();
  const userInfo = location.state;
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    getRegisteredCourses();
  }, []);

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
                onEdit={() => console.log(`Edit course ${course._id}`)}
                onDelete={() => console.log(`Delete course ${course._id}`)}
                onView={() => console.log(`View course ${course._id}`)}
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
