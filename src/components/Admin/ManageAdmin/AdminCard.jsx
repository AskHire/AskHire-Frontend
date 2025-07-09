import React from "react";
import { BiTrash } from "react-icons/bi";

export default function AdminCard({ admin, index, onDelete }) {
  return (
    <div className="grid items-center grid-cols-12 p-2 mb-2 bg-white rounded-md shadow-sm">
      <span className="col-span-1">{index + 1}</span>
      <div className="col-span-2">
        <img
          className="w-10 h-10 rounded-full"
          src={admin.image || "https://via.placeholder.com/40"}
          alt={admin.firstName}
        />
      </div>
      <span className="col-span-5">{admin.firstName} {admin.lastName}</span>
      <div className="col-span-4 text-right">
        <button
          onClick={() => onDelete(admin.id)}
          className="p-2 text-red-600 hover:text-red-800"
        >
          <BiTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
