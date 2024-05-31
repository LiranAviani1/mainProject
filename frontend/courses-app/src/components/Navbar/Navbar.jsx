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
      <h2 className="text-m font-medium text-black py-2">Courses</h2>
      <h3 className="text-m font-medium text-black py-2"><Link to="/dashboard">Home</Link></h3>
      <h3 className="text-m font-medium text-black py-2"><Link to="/about">About</Link></h3>
    


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
