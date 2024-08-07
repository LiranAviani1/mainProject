import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import {
  FaHome,
  FaInfoCircle,
  FaSearch,
  FaChalkboardTeacher,
  FaUserShield,
  FaBars,
  FaTimes,
  FaBook,
} from "react-icons/fa";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.removeItem("token");
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <FaBook className="text-2xl" />
          <h2 className="text-xl font-bold tracking-tight">
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
        <div className="hidden xl:flex items-center space-x-8">
          {isToken && (
            <>
              <NavItem to="/dashboard" icon={FaHome} label="Home" />
              <NavItem to="/about" icon={FaInfoCircle} label="About" />
              <NavItem
                to="/apply-teacher"
                icon={FaChalkboardTeacher}
                label="Teacher Application"
              />
              {userInfo && userInfo.role === "admin" && (
                <>
                  <NavItem to="/admin" icon={FaUserShield} label="Admin Panel" />
                </>
              )}
            </>
          )}
        </div>

        {isToken && (
          <div className="hidden xl:flex items-center space-x-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
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
        )}

        <div className="xl:hidden flex items-center">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden bg-gray-800 text-white py-4">
          <div className="container mx-auto flex flex-col space-y-4 px-6">
            {isToken && (
              <>
                <NavItem to="/dashboard" icon={FaHome} label="Home" />
                <NavItem to="/about" icon={FaInfoCircle} label="About" />
                <NavItem
                  to="/apply-teacher"
                  icon={FaChalkboardTeacher}
                  label="Teacher Application"
                />
                {userInfo && userInfo.role === "admin" && (
                  <>
                    <NavItem to="/admin" icon={FaUserShield} label="Admin Panel" />
                  </>
                )}
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                  onClearSearch={onClearSearch}
                />
                <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="relative text-lg font-semibold hover:font-bold transition-all duration-300 flex items-center group"
  >
    <Icon className="mr-2 text-xl" />
    {label}
    <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
  </Link>
);

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  onClearSearch,
}) => (
  <div className="relative">
    <input
      type="text"
      value={searchQuery}
      onChange={({ target }) => setSearchQuery(target.value)}
      className="bg-gray-200 text-black rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
      placeholder="Search..."
    />
    <button onClick={handleSearch} className="absolute right-0 top-0 mt-2 mr-2">
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
);

export default Navbar;
