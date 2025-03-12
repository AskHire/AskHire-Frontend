import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import AdminHeader from "../../components/AdminHeader";

const usersData = [
  { id: 1, name: "Nicholas Patrick", role: "Admin", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Eshan Senadhi", role: "Admin", image: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, name: "Kasun Lakmal", role: "Candidate", image: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Larissa Burton", role: "Candidate", image: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 5, name: "Larissa Burton", role: "Manager", image: "https://randomuser.me/api/portraits/women/2.jpg" },
];

export default function UserRoles() {
  const [users, setUsers] = useState(usersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [roleFilter, setRoleFilter] = useState("");

  // Filter and sort users
  const filteredUsers = users
    .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(user => (roleFilter ? user.role === roleFilter : true))
    .sort((a, b) => (sortOrder === "newest" ? b.id - a.id : a.id - b.id));

  return (
    
    <div className="flex-1 p-6">
      {/* Header */}
      <AdminHeader />

      {/* title */}
      <div>
        <h1 className="mt-8 text-3xl font-bold">User Roles Manager</h1>
      </div>
      
      <div className="mt-4">
        {/* Search & Sort */}
        <div className="flex items-center justify-end gap-3 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <input type="text" placeholder="Search" className="w-64 px-8 py-2 border rounded-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            <IoIosSearch className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
          </div>

          {/* Sort Dropdown */}
          <select
            className="px-3 py-2 bg-gray-200 border rounded-md"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
          </select>
        </div>

        {/* Table Header */}
        <div className="p-4 ">
          <div className="grid grid-cols-12 p-3 font-semibold text-gray-500">
            <span className="col-span-1">#</span>
            <span className="col-span-2">Profile</span>
            <span className="col-span-5">Name</span>
            <span className="col-span-3">Role</span>
            <span className="col-span-1 text-right">More</span>
          </div>

          {/* User List */}
          {filteredUsers.map(user => (
            <div key={user.id} className="grid items-center grid-cols-12 p-4 mb-2 bg-white rounded-md shadow-sm">
              <span className="col-span-1 font-medium">{user.id}</span>
              <div className="col-span-2">
                <img className="w-10 h-10 rounded-full" src={user.image} alt={user.name} />
              </div>
              <span className="col-span-5 font-medium">{user.name}</span>

              
              <span
                className={`col-span-3 text-sm px-3 py-1 rounded-full text-white ${
                  user.role === "Admin" ? "bg-green-500" :
                  user.role === "Candidate" ? "bg-yellow-500" :
                  "bg-blue-500"
                }`}
              >
                {user.role}
              </span>
              <div className="col-span-1 text-right">
                <button className="text-gray-500 hover:text-gray-700">
                  <HiDotsVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* No results */}
          {filteredUsers.length === 0 && (
            <p className="py-4 text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
