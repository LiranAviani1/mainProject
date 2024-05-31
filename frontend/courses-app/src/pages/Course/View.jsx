import React from "react";
import { useLocation } from "react-router-dom";

const View = () => {
  const location = useLocation();
  const courseInfo = location.state;

  const handleRegister = () => {
    console.log("Registering for course");
    };
  return (
    <div className="container mx-auto mt-10">
      <div className="border rounded text-center p-4 bg-white hover:shadow-xl transition-all ease-in-out">
        <div className="text-center justify-between">
          <div>
            <h6 className="text-sm font-bold underline">{courseInfo.title}</h6>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-1">
          <div className="text-xs text-black font-semibold">
            Category: {courseInfo.category}
          </div>
          <div className="text-xs text-black font-semibold">
            Sub-Category: {courseInfo.subCategory}
          </div>
        </div>
        <p className="text-xs text-black font-semibold mt-2">
          Content: {courseInfo.content}
        </p>
        <div className="flex justify-center gap-3 mt-2">
          <div className="text-xs text-black font-semibold">
            Date Start: {courseInfo.dateStart}
          </div>
          <div className="text-xs text-black font-semibold">
            Date End: {courseInfo.dateEnd}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-2">
          <div className="text-xs text-black font-semibold">
            Members: {courseInfo.members.length}
          </div>
          <div className="text-xs text-black font-semibold">
            Capacity: {courseInfo.capacity}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-2">
          <div className="text-xs text-black font-semibold">
            Status: {courseInfo.status}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-2">
          <button className="btn-primary" onClick={handleRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default View;
