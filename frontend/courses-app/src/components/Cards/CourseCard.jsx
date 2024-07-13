import moment from "moment";
import React from "react";
import { MdCreate, MdDelete } from "react-icons/md";

const CourseCard = ({
  userInfo,
  userId,
  title,
  content,
  category,
  subCategory,
  dateStart,
  dateEnd,
  capacity,
  members,
  status,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="border rounded text-center p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="text-center justify-between">
        <div>
          <h6 className="text-sm font-bold underline">{title}</h6>
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-1">
        <div className="text-xs text-black font-semibold">
          Category: {category}
        </div>
        <div className="text-xs text-black font-semibold">
          Sub-Category: {subCategory}
        </div>
      </div>
      
      <div className="flex justify-center gap-3 mt-2">
        <div className="text-xs text-black font-semibold">
          Date Start: {moment(dateStart).format("DD-MM-YYYY")}
        </div>
        <div className="text-xs text-black font-semibold">
          Date End: {moment(dateEnd).format("DD-MM-YYYY")}
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2">
        <div className="text-xs text-black font-semibold">
          Members: {members.length}
        </div>
        <div className="text-xs text-black font-semibold">
          Capacity: {capacity}
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2">
        <div
          className={`text-xs font-semibold ${
            status === "open" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {status}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-2">
        <button
          className="btn-primary"
          style={{ width: "40%" }}
          onClick={onView}
        >
          View Course
        </button>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        {userInfo &&
          (userInfo.role === "admin" ||
            (userInfo.role === "teacher" && userId === userInfo._id)) && (
            <>
              <MdCreate
                className="icon-btn hover:text-green-600"
                onClick={onEdit}
              />
              <MdDelete
                className="icon-btn hover:text-red-500"
                onClick={onDelete}
              />
            </>
          )}
      </div>
    </div>
  );
};

export default CourseCard;
