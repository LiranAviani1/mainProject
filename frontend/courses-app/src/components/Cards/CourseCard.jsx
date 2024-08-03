import moment from "moment";
import React, { useEffect, useState } from "react";
import { MdCreate, MdDelete } from "react-icons/md";
import CourseImage from "../../assets/images/course-image.jpg";

const CourseCard = ({
  userInfo,
  userId,
  title,
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
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    if (moment(dateEnd).isBefore(moment())) {
      setCurrentStatus("close");
    }
  }, [dateEnd]);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300">
      <div className="relative">
        <img
          src={CourseImage}
          alt="Course"
          className="w-full h-45 object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 w-full text-center">
          <h6 className="text-xl font-bold">{title}</h6>
        </div>
      </div>
      <div className="p-4">
        <div className="text-center">
          <div className="text-gray-600 text-m mb-2">
            <span className="font-bold">Category:</span> {category}
          </div>
          <div className="text-gray-600 text-m mb-2">
            <span className="font-semibold">Sub-Category:</span> {subCategory}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="text-gray-600 text-m">
            <span className="font-semibold">Start:</span>{" "}
            {moment(dateStart).format("DD-MM-YYYY")}
          </div>
          <div className="text-gray-600 text-m">
            <span className="font-semibold">End:</span>{" "}
            {moment(dateEnd).format("DD-MM-YYYY")}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <div className="text-gray-600 text-m">
            <span className="font-semibold">Members:</span> {members.length}
          </div>
          <div className="text-gray-600 text-m">
            <span className="font-semibold">Capacity:</span> {capacity}
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="text-m font-semibold">
            Status:{" "}
            <span
              className={
                currentStatus === "open" ? "text-green-600" : "text-red-600"
              }
            >
              {currentStatus === "open" ? "OPEN" : "CLOSE"}
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 ${
              currentStatus === "close" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            onClick={onView}
            disabled={currentStatus === "close" && moment(dateEnd).isBefore(moment())}
          >
            View Course
          </button>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {userInfo &&
            (userInfo.role === "admin" ||
              (userInfo.role === "teacher" && userId === userInfo._id)) && (
              <>
                <MdCreate
                  className="text-2xl cursor-pointer hover:text-green-600 transition-colors duration-300"
                  onClick={onEdit}
                />
                <MdDelete
                  className="text-2xl cursor-pointer hover:text-red-600 transition-colors duration-300"
                  onClick={onDelete}
                />
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
