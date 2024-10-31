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

const Navbar = ({ userInfo, onSearchCourse, handleClearSearch }) => {
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
      <div className=" flex items-center ml-4 mr-4 justify-between">
        <div className="flex items-center space-x-2 mr-3">
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
        <NavItemsContainer>
          {isToken && (
            <>
              
              <NavItem to="/about" icon={FaHome} label="Home" />
              <NavItem to="/dashboard" icon={FaBook} label="Courses" /><NavItem
                to="/apply-teacher"
                icon={FaChalkboardTeacher}
                label="Teacher Application"
              />
              {userInfo && userInfo.role === "admin" && (
                <>
                  <NavItem to="/expired-courses" icon={FaBook} label="Expired Courses" />
                  <NavItem to="/admin" icon={FaUserShield} label="Admin Panel" />
                </>
              )}
            </>
          )}
        </NavItemsContainer>

        {isToken && (
          <div className="hidden xl:flex items-center space-x-4">
            {location.pathname === "/dashboard" && (
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
              />
            )}
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
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
                    <NavItem to="/expired-courses" icon={FaBook} label="Expired Courses" />
                    <NavItem to="/admin" icon={FaUserShield} label="Admin Panel" />
                  </>
                )}
                {location.pathname === "/dashboard" && (
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    onClearSearch={onClearSearch}
                  />
                )}
                <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Component for a navigation item with responsive styling
const NavItem = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="relative text-base lg:text-lg xl:text-xl font-semibold hover:font-bold transition-all duration-300 flex items-center group px-1 sm:px-2 lg:px-3 xl:px-4"
  >
    <Icon className="mr-1 sm:mr-2 text-sm lg:text-lg xl:text-xl" />
    <span>{label}</span>
    <span
      className="absolute left-0 bottom-0 w-full h-1 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"
    ></span>
  </Link>
);

// Container component to manage responsive layout and spacing of NavItems
const NavItemsContainer = ({ children }) => (
  <div className="hidden xl:flex items-center gap-0 md:gap-0 lg:gap-0 xl:gap-1 2xl:gap-4">
    {children}
  </div>
);

// Search bar component for searching courses
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
