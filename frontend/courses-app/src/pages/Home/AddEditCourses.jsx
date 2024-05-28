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
  const [members, setMembers] = useState(courseData?.members || []);
  const [status, setStatus] = useState(courseData?.status || "open");
  const [error, setError] = useState(null);

  const addNewCourse = async () => {
    try {
      const response = await axiosInstance.post("/add-course", {
        title,
        content,
        category,
        subCategory,
        dateStart,
        dateEnd,
        capacity,
        status,
      });

      if (response.data && response.data.course) {
        showToastMessage("Course Added Successfully");
        getAllCourses();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const editCourse = async () => {
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
        status,
      });

      if (response.data && response.data.course) {
        showToastMessage("Course Updated Successfully", "update");
        getAllCourses();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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

    if(members.length > capacity) {
      setError("Members should be less than or equal to capacity");
      return;
    }

    if (!status) {
      setError("Please enter the status");
      return;
    }

    setError("");

    if (type === "edit") {
      editCourse();
    } else {
      addNewCourse();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Java Script basics"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="input-label">CATEGORY</label>
        <input
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Programming"
          value={category}
          onChange={({ target }) => setCategory(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="input-label">SUBCATEGORY</label>
        <input
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Java Script"
          value={subCategory}
          onChange={({ target }) => setSubCategory(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="input-label">DATE START</label>
        <input
          type="date"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          value={new Date(dateStart).toISOString().split("T")[0]}
          onChange={({ target }) => setDateStart(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="input-label">DATE END</label>
        <input
          type="date"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="26/05/2024"
          value={new Date(dateEnd).toISOString().split("T")[0]}
          onChange={({ target }) => setDateEnd(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="input-label">CAPACITY</label>
        <input
          type="number"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="5"
          value={capacity}
          onChange={({ target }) => setCapacity(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="input-label">STATUS</label>
        <select
          id="status"
          name="status"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          value={status}
          onChange={({ target }) => setStatus(target.value)}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddCourse}
      >
        {type === "add" ? "ADD" : "Update"}
      </button>
    </div>
  );
};

export default AddEditCourses;
