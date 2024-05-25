import moment from "moment";
import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({title, content, category, subCategory,dateStart,dateEnd,capacity,members,status, onEdit, onDelete, onPinNote}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">Title: {title}</h6>
        </div>
        
      </div>
      <div className="flex gap-3 mt-1">
        <div className="text-xs text-slate-500">Category: {category}</div>
        <div className="text-xs text-slate-500">Sub-Category: {subCategory}</div>
      </div>
      <p className="text-xs text-slate-600 mt-2">
        Content: {content?.slice(0, 60)}
      </p>

      
      <div className="flex right gap-2 mt-3">
          <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
          <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
        </div>
    </div>
  );
};

export default NoteCard;
