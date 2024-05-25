import moment from "moment";
import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const CurseCard = ({
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
      <p className="text-xs text-black font-semibold mt-2">
        Content: {content?.slice(0, 60)}
      </p>
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
          Capacity: {capacity}
        </div>
        <div className="text-xs text-black font-semibold">
          Members: {members.length}
        </div>
      </div>
      <div className="flex justify-center gap-3 mt-2">
        <div className="text-xs text-black font-semibold">Status: {status}</div>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
        <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
      </div>
    </div>
  );
};

export default CurseCard;
