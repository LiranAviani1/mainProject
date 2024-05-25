import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  showToastMessage,
  getAllNotes,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [category, setCategory] = useState(noteData?.category || "");
  const [subCategory, setSubCategory] = useState(noteData?.subCategory || "");
  const [dateStart, setDateStart] = useState(noteData?.dateStart || new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(noteData?.dateEnd || new Date().toISOString().split('T')[0]);
  const [capacity, setCapacity] = useState(noteData?.capacity || "");
  const [status, setStatus] = useState(noteData?.status || "open");
  const [error, setError] = useState(null);
  
  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        category,
        subCategory,
        dateStart,
        dateEnd,
        capacity,
        status,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
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

  const editNote = async () => {
    const noteId = noteData._id

    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        category,
        subCategory,
        dateStart,
        dateEnd,
        capacity,
        status,
      });
      
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", 'update');
        getAllNotes();
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

  const handleAddNote = () => {
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

    if (!capacity) {
      setError("Please enter the capacity");
      return;
    }

    if(!status){
      setError("Please enter the status");
      return;
    }

    setError("");

    if(type === 'edit'){
      editNote()
    }else {
      addNewNote()
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
          value={new Date(dateStart).toISOString().split('T')[0]}
          onChange={({ target }) => setDateStart(target.value)}
        />
        
      </div>

      <div className="flex flex-col gap-2">
        <label className="input-label">DATE END</label>
        <input
          type="date"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="26/05/2024"
          value={new Date(dateEnd).toISOString().split('T')[0]}
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
        <select id="status" name="status" className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded" value={status}
          onChange={({ target }) => setStatus(target.value)}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
        
      </div>


      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
       {type === 'add' ?  "ADD" : "Update"}
      </button>
    </div>
  );
};

export default AddEditNotes;
