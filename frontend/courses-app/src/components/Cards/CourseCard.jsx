import moment from "moment";
import React from "react";
import { MdCreate, MdDelete } from "react-icons/md";
import CourseImage from "../../assets/images/course-image.jpg";

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
      <div>
        <img
          src={CourseImage}
          alt="Course"
          className="h-45 mb-6 rounded-lg shadow-lg"
        />
      </div>
      <div className="text-center justify-between">
        <div>
          <h6 className="text-xl mb-2 font-bold underline">{title}</h6>
        </div>
      </div>

      <div className="text-s mb-2 text-black font-semibold">
        Category: {category}
      </div>
      <div className="text-s mb-2 text-black font-semibold">
        Sub-Category: {subCategory}
      </div>

      <div className="flex justify-center gap-3 mt-2">
        <div className="text-s text-black font-semibold">
          Date Start: {moment(dateStart).format("DD-MM-YYYY")}
        </div>
        <div className="text-s text-black font-semibold">
          Date End: {moment(dateEnd).format("DD-MM-YYYY")}
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2">
        <div className="text-s text-black font-semibold">
          Members: {members.length}
        </div>
        <div className="text-s text-black font-semibold">
          Capacity: {capacity}
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2">
        <div
          className={`text-s mb-4 font-semibold ${
            status === "open" ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {status}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-2">
        <button
          className="btn-primary mb-3 text-lg"
          style={{ width: "45%" }}
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
                className="text-2xl icon-btn hover:text-green-600"
                onClick={onEdit}
              />
              <MdDelete
                className="text-2xl icon-btn hover:text-red-500"
                onClick={onDelete}
              />
            </>
          )}
      </div>
    </div>
  );
};

export default CourseCard;
