// src/pages/Profile/Profile.jsx

import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";

export default function Profile() {
  const location = useLocation();
  const userInfo = location.state;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="flex flex-col items-center mt-20 text-center px-4 space-y-8">
        <div className="w-full max-w-lg border border-gray-200 rounded-lg bg-white px-8 py-10 shadow-lg">
          <h1 className="text-3xl mb-6 text-gray-900 font-semibold underline">User Profile</h1>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Email:</span> {userInfo.email}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Full Name:</span> {userInfo.fullName}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Age:</span> {userInfo.age}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Phone:</span> {userInfo.phone}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Birthday:</span> {formatDate(userInfo.birthday)}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Gender:</span> {userInfo.gender}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Address:</span> {userInfo.address}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Registerd courses:</span> {userInfo.courses.length}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Role:</span> {userInfo.role}
            </p>
          </div>
          <div className="flex flex-col items-center mt-8 space-y-4">
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <Link to="/edit-user" state={userInfo}>
                Edit Account
              </Link>
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <Link to="/registered-courses" state={userInfo}>
                View Registered Courses
              </Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
