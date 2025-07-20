import React from "react";

export default function UserRoleBadge({ role, onClick }) {
  const color = {
    Admin: "bg-green-500",
    Manager: "bg-blue-500",
    Candidate: "bg-yellow-500",
  }[role] || "bg-gray-400";

  return (
    <button
      className={`text-sm px-5 py-1 rounded-full text-white ${color} w-24`}
      onClick={onClick}
    >
      {role}
    </button>
  );
}
