import React from "react";

const CourseTable = ({ courses, onDeleteCourse, onEditCourse, onViewCourse }) => {
  return (
    <table className="min-w-full bg-white">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="w-1/5 py-2">Title</th>
          <th className="w-1/5 py-2">Category</th>
          <th className="w-1/5 py-2">Sub-Category</th>
          <th className="w-1/5 py-2">Teacher</th>
          <th className="w-1/5 py-2">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 font-bold text-center">
        {courses.map((course) => (
          <tr key={course._id}>
            <td className="py-2">{course.title}</td>
            <td className="py-2">{course.category}</td>
            <td className="py-2">{course.subCategory}</td>
            <td className="py-2">{course.teacher?.fullName || "N/A"}</td>
            <td className="py-2">
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => onViewCourse(course)}
              >
                View
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => onEditCourse(course)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => onDeleteCourse(course._id)}
              >
                Delete
              </button>
              
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CourseTable;
