import React, { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = ({ userInfo, onSearchCourse, handleClearSearch }) => {
  const isToken = localStorage.getItem("token");
  

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchCourse(searchQuery)
    }
  };

  const onClearSearch = ()=>{
    handleClearSearch()
    setSearchQuery("")
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-bold text-black py-2">Courses</h2>
      <div className="flex items-center space-x-6">
        <h3 className="text-xl font-medium text-black py-2 group hover:font-bold">
          <Link to="/dashboard" className="relative">
            Home
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
          </Link>
        </h3>
        <h3 className="text-xl font-medium text-black py-2 group hover:font-bold">
          <Link to="/about" className="relative">
            About
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></span>
          </Link>
        </h3>
      </div>


      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />

          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

export default Navbar;
