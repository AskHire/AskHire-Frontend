import React from "react";
import AdminCard from "./AdminCard";

export default function AdminList({ admins, onDelete }) {
  return (
    <div className="p-1">
      <div className="grid grid-cols-12 p-3 font-semibold">
        <span className="col-span-1">#</span>
        <span className="col-span-2">Profile</span>
        <span className="col-span-5">Name</span>
        <span className="col-span-4 text-right">Delete</span>
      </div>

      {admins.length > 0 ? (
        admins.map((admin, index) => (
          <AdminCard
            key={admin.id}
            admin={admin}
            index={index}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="mt-8 text-center text-gray-500">No admin users found.</p>
      )}
    </div>
  );
}
