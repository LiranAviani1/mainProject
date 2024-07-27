import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { FaHome, FaInfoCircle, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";

const Navbar = ({
  userInfo,
  onSearchCourse,
  handleClearSearch,
  onAddCourse,
}) => {
  const isToken = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchCourse(searchQuery);
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <nav className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white shadow-lg py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-6">
          <h2 className="text-3xl font-bold tracking-tight">
            {isToken ? (
              <Link
                to="/dashboard"
                className="hover:text-yellow-300 transition duration-300"
              >
                Courses
              </Link>
            ) : (
              <span>Courses</span>
            )}
          </h2>
        </div>
        <div className="flex items-center space-x-8">
          {isToken && (
            <>
              <Link
                to="/dashboard"
                className="relative text-lg font-semibold hover:font-bold transition-all duration-300 flex items-center group"
              >
                <FaHome className="mr-1" />
                Home
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
              </Link>
              <Link
                to="/about"
                className="relative text-lg font-semibold hover:font-bold transition-all duration-300 flex items-center group"
              >
                <FaInfoCircle className="mr-1" />
                About
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
              </Link>
              {userInfo && userInfo.role === "admin" && (
                <Link
                  to="/admin"
                  className="relative text-lg font-semibold hover:font-bold transition-all duration-300 flex items-center group"
                >
                  <FaInfoCircle className="mr-1" />
                  Admin Panel
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
                </Link>
              )}
            </>
          )}
        </div>

        {isToken && (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                className="bg-white text-black rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                placeholder="Search..."
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 top-0 mt-2 mr-2"
              >
                <FaSearch className="text-gray-500 hover:text-gray-700" />
              </button>
              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="absolute right-8 top-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
            {userInfo && (userInfo.role === "admin" || userInfo.role === "teacher") && location.pathname === "/dashboard" && (
              <button
                className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full shadow-md transition duration-300"
                onClick={onAddCourse}
              >
                <MdAdd className="text-2xl" />
                <span className="ml-2">Add Course</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
