import React from "react";
import { getInitials } from "../../utils/helper";
import { Link } from "react-router-dom";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    userInfo && (
      <div className="flex items-center gap-3">
        <div className="w-12 text-xl h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {getInitials(userInfo ? userInfo.fullName : "")}
        </div>

        <div>
          <p className="text-m font-bold group text-white transition duration-300 hover:font-bolder">
            <Link to="/profile" state={userInfo}>{userInfo.fullName}</Link>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-300"></span>
          </p>
          <button
            className="text-m font-medium group text-red-500 transition duration-30 " onClick={onLogout}>
            Logout
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-yellow-300"></span>
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfo;
