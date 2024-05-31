import React from "react";
import { useLocation } from "react-router-dom";

const View = () => {
  const location = useLocation();
  const userInfo = location.state.userInfo;
  const courseDetails = location.state.courseDetails;
  

  const handleRegister = () => {
    console.log("Registering for course");
  };
  return (
    <div className="container mx-auto mt-10">
      <div className="border rounded text-center p-4 bg-white hover:shadow-xl transition-all ease-in-out">
        <div className="text-center justify-between">
          <div>
            <h6 className="text-sm font-bold underline">{courseDetails.title}</h6>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-1">
          <div className="text-xs text-black font-semibold">
            Category: {courseDetails.category}
          </div>
          <div className="text-xs text-black font-semibold">
            Sub-Category: {courseDetails.subCategory}
          </div>
        </div>
        <p className="text-xs text-black font-semibold mt-2">
          Content: {courseDetails.content}
        </p>
        <div className="flex justify-center gap-3 mt-2">
          <div className="text-xs text-black font-semibold">
            Date Start: {courseDetails.dateStart}
          </div>
          <div className="text-xs text-black font-semibold">
            Date End: {courseDetails.dateEnd}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-2">
          <div className="text-xs text-black font-semibold">
            Members: {courseDetails.members.length}
          </div>
          <div className="text-xs text-black font-semibold">
            Capacity: {courseDetails.capacity}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-2">
          <div className="text-xs text-black font-semibold">
            Status: {courseDetails.status}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-2">
          <button className="btn-primary" onClick={handleRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default View;
