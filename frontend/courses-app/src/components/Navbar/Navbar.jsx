import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import {
  FaHome,
  FaInfoCircle,
  FaChalkboardTeacher,
  FaUserShield,
  FaBars,
  FaTimes,
  FaBook,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";

const Navbar = ({ userInfo }) => {
  const isToken = localStorage.getItem("token");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg py-3 md:py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <h2 className="text-lg md:text-xl font-bold tracking-tight mr-4">
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

        {/* Mobile menu toggle button */}
        <button
          onClick={toggleMobileMenu}
          className="xl:hidden ml-auto text-2xl focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop nav items */}
        <div className="hidden xl:flex items-center flex-grow justify-evenly">
          {isToken && (
            <>
              <NavItem to="/dashboard" icon={FaHome} label="Home" />
              <NavItem to="/about" icon={FaInfoCircle} label="About" />
              <NavItem
                to="/apply-teacher"
                icon={FaChalkboardTeacher}
                label="Teacher Application"
              />
              <NavItem to="/contact-us" icon={MdAdd} label="Contact Us" />
              {userInfo?.role === "admin" && (
                <>
                  <NavItem
                    to="/expired-courses"
                    icon={FaBook}
                    label="Expired Courses"
                  />
                  <NavItem to="/admin" icon={FaUserShield} label="Admin Panel" />
                </>
              )}
              <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
            </>
          )}
        </div>

        {/* Mobile nav items */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-0 left-0 w-full h-full bg-gray-800 text-white py-4 shadow-lg z-50">
            {/* Close button for mobile menu */}
            <button
              onClick={toggleMobileMenu}
              className="absolute top-4 right-6 text-2xl focus:outline-none"
            >
              <FaTimes />
            </button>
            <div className="container mx-auto flex flex-col items-start space-y-3 px-6 mt-12">
              {isToken && (
                <>
                  <NavItem to="/dashboard" icon={FaHome} label="Home" mobile />
                  <NavItem to="/about" icon={FaInfoCircle} label="About" mobile />
                  <NavItem
                    to="/apply-teacher"
                    icon={FaChalkboardTeacher}
                    label="Teacher Application"
                    mobile
                  />
                  <NavItem to="/contact-us" icon={MdAdd} label="Contact Us" mobile />
                  {userInfo?.role === "admin" && (
                    <>
                      <NavItem
                        to="/expired-courses"
                        icon={FaBook}
                        label="Expired Courses"
                        mobile
                      />
                      <NavItem
                        to="/admin"
                        icon={FaUserShield}
                        label="Admin Panel"
                        mobile
                      />
                    </>
                  )}
                  <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Component for a navigation item with responsive styling
const NavItem = ({ to, icon: Icon, label, mobile = false }) => (
  <Link
    to={to}
    className={`relative flex items-center text-base font-semibold transition duration-300 ${
      mobile
        ? "w-full py-2 text-left pl-4 pr-8 bg-gray-700 rounded-md mb-1 hover:bg-gray-600"
        : "group px-2 hover:text-yellow-300"
    }`}
  >
    <Icon className="mr-2 text-lg" />
    <span>{label}</span>
    {!mobile && (
      <span className="absolute left-0 bottom-0 w-full h-1 bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
    )}
  </Link>
);

export default Navbar;
