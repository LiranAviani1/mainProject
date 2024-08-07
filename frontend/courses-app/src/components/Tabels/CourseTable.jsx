import React from "react";

const CourseTable = ({ courses, onDeleteCourse, onEditCourse, onViewCourse }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/5 py-3 px-4 text-center">Title</th>
            <th className="w-1/5 py-3 px-4 text-center">Category</th>
            <th className="w-1/5 py-3 px-4 text-center">Sub-Category</th>
            <th className="w-1/5 py-3 px-4 text-center">Teacher</th>
            <th className="w-1/5 py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 font-semibold">
          {courses.map((course) => (
            <tr
              key={course._id}
              className="hover:bg-gray-100 transition-colors duration-200"
            >
              <td className="py-3 px-4 border-b text-center">{course.title}</td>
              <td className="py-3 px-4 border-b text-center">{course.category}</td>
              <td className="py-3 px-4 border-b text-center">{course.subCategory}</td>
              <td className="py-3 px-4 border-b text-center">{course.teacher?.fullName || "N/A"}</td>
              <td className="py-3 px-4 border-b flex justify-center space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
                  onClick={() => onViewCourse(course)}
                >
                  View
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
                  onClick={() => onEditCourse(course)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
                  onClick={() => onDeleteCourse(course._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
