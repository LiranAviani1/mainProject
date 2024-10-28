import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditCourses = ({
  courseData,
  type,
  onClose,
  showToastMessage,
  getAllCourses,
}) => {
  const [title, setTitle] = useState(courseData?.title || "");
  const [content, setContent] = useState(courseData?.content || "");
  const [category, setCategory] = useState(courseData?.category || "");
  const [subCategory, setSubCategory] = useState(courseData?.subCategory || "");
  const [dateStart, setDateStart] = useState(
    courseData?.dateStart || new Date().toISOString().split("T")[0]
  );
  const [dateEnd, setDateEnd] = useState(
    courseData?.dateEnd || new Date().toISOString().split("T")[0]
  );
  const [capacity, setCapacity] = useState(courseData?.capacity || "");
  const [price, setPrice] = useState(courseData?.price || "");
  const [members, setMembers] = useState(courseData?.members || []);
  const [status, setStatus] = useState(courseData?.status || "open");
  const [error, setError] = useState(null);

  const addNewCourse = async (finalStatus) => {
    try {
      const response = await axiosInstance.post("/add-course", {
        title,
        content,
        category,
        subCategory,
        dateStart,
        dateEnd,
        capacity,
        price,
        status: finalStatus,  
      });
  
      if (response.data && response.data.course) {
        showToastMessage("Course Added Successfully");
        getAllCourses();
        onClose();
        clearFields();
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const editCourse = async (finalStatus) => {
    const courseId = courseData._id;
  
    try {
      const response = await axiosInstance.put("/edit-course/" + courseId, {
        title,
        content,
        category,
        subCategory,
        dateStart,
        dateEnd,
        capacity,
        price,
        status: finalStatus,  // Set the status based on the condition
      });
  
      if (response.data && response.data.course) {
        showToastMessage("Course Updated Successfully", "update");
        getAllCourses();
        onClose();
        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleAddCourse = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
  
    if (!content) {
      setError("Please enter the content");
      return;
    }
  
    if (!category) {
      setError("Please enter the category");
      return;
    }
  
    if (!subCategory) {
      setError("Please enter the subCategory");
      return;
    }
  
    if (!dateStart) {
      setError("Please enter the dateStart");
      return;
    }
  
    if (!dateEnd) {
      setError("Please enter the dateEnd");
      return;
    }
  
    if (dateStart > dateEnd) {
      setError("Date Start should be less than Date End");
      return;
    }
  
    if (!capacity) {
      setError("Please enter the capacity");
      return;
    }
  
    if (capacity <= 0) {
      setError("Capacity should be greater than 0");
      return;
    }
  
    if (members.length > capacity) {
      setError("Members should be less than or equal to capacity");
      return;
    }
  
    if (!price) {
      setError("Please enter the price");
      return;
    }
  
    if (price <= 0) {
      setError("Price should be greater than 0");
      return;
    }
  
    // Calculate the current date and the course end date without time
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const courseEndDate = new Date(dateEnd).setHours(0, 0, 0, 0);
  
    // If the course end date is today or in the past, set the status to "closed"
    const finalStatus = courseEndDate <= currentDate ? "close" : status;
  
    setError("");
  
    if (type === "edit") {
      editCourse(finalStatus);
    } else {
      addNewCourse(finalStatus);
    }
  };

  const clearFields = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setSubCategory("");
    setDateStart(new Date().toISOString().split("T")[0]);
    setDateEnd(new Date().toISOString().split("T")[0]);
    setCapacity("");
    setStatus("open");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10">
      <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full mx-auto">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          <MdClose className="text-2xl text-gray-600" />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-center">
          {type === "add" ? "Add New Course" : "Edit Course"}
        </h2>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Title</label>
            <input
              type="text"
              className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Java Script basics"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
            <p className="text-xs text-gray-500">Enter the course title.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Content</label>
            <textarea
              className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-52 resize-none"
              placeholder="Content"
              rows={5}
              value={content}
              onChange={({ target }) => setContent(target.value)}
            />
            <p className="text-xs text-gray-500">
              Provide a detailed description of the course content.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Category</label>
            <input
              type="text"
              className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Programming"
              value={category}
              onChange={({ target }) => setCategory(target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter the main category of the course.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Subcategory</label>
            <input
              type="text"
              className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Java Script"
              value={subCategory}
              onChange={({ target }) => setSubCategory(target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter the subcategory of the course.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">Date Start</label>
              <input
                type="date"
                className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={new Date(dateStart).toISOString().split("T")[0]}
                onChange={({ target }) => setDateStart(target.value)}
              />
              <p className="text-xs text-gray-500">
                Select the start date of the course.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">Date End</label>
              <input
                type="date"
                className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={new Date(dateEnd).toISOString().split("T")[0]}
                onChange={({ target }) => setDateEnd(target.value)}
              />
              <p className="text-xs text-gray-500">
                Select the end date of the course.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Capacity</label>
            <input
              type="number"
              className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="5"
              value={capacity}
              onChange={({ target }) => setCapacity(target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter the maximum number of students allowed.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Price</label>
            <input
              type="number"
              className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="500₪"
              value={price}
              onChange={({ target }) => setPrice(target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter the price of the course.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Status</label>
            <select
              className="text-lg text-gray-900 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={status}
              onChange={({ target }) => setStatus(target.value)}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <p className="text-xs text-gray-500">
              Select the status of the course.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-6">
          <button
            className="w-full bg-indigo-500 text-white font-medium rounded-lg p-3 hover:bg-indigo-600 transition-colors"
            onClick={handleAddCourse}
          >
            {type === "add" ? "Add Course" : "Update Course"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditCourses;
