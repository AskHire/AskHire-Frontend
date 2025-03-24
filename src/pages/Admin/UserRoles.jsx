import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import AdminHeader from "../../components/AdminHeader";

export default function UserRoles() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for details

  useEffect(() => {
    fetch("https://localhost:7256/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const filteredUsers = users
    .filter(user => user.firstName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortOrder === "newest" ? b.userId.localeCompare(a.userId) : a.userId.localeCompare(b.userId)));

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">User Roles Manager</h1>

      {/* Search & Sort */}
      <div className="flex items-center justify-end gap-3 mt-4 mb-4">
        <div className="relative">
          <input type="text" placeholder="Search" className="w-64 px-8 py-2 border rounded-xl" 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoIosSearch className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
        <select className="px-3 py-2 bg-gray-200 border rounded-md" value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>

      {/* User List */}
      <div className="p-4">
        <div className="grid grid-cols-12 p-3 font-semibold rounded-md">
          <span className="col-span-1">#</span>
          <span className="col-span-2">Profile</span>
          <span className="col-span-5">Name</span>
          <span className="col-span-3">Role</span>
          <span className="col-span-1 text-right">More</span>
        </div>

        {/* User Items */}
        
        <div className="p-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div key={user.userId} className="grid items-center justify-between grid-cols-12 p-3 mt-3 bg-white rounded-lg ">
                
                  <span className="col-span-1 font-medium">{index + 1}</span>
                  <div className="col-span-2">
                    <img className="w-10 h-10 rounded-full" src={user.image || "https://via.placeholder.com/40"} alt={user.firstName} />
                  </div>
                  <span className="col-span-5 font-medium">{user.firstName} {user.lastName}</span>
                  <span className={`col-span-3 text-sm px-3 py-1 rounded-full text-white 
                    ${user.role === "Admin" ? "bg-green-500" :
                      user.role === "Candidate" ? "bg-yellow-500" :
                      "bg-blue-500"
                    }`}>
                    {user.role}
                  </span>
                  <div className="col-span-1 text-right">
                    <button className="text-gray-500 hover:text-gray-700" 
                      onClick={() => setSelectedUser(selectedUser?.userId === user.userId ? null : user)}
                    >
                      <HiDotsVertical className="w-5 h-5" />
                    </button>
                  </div>
                

                {/* Show Details Card If Selected */}
                <div className="flex flex-col col-span-12">
                {selectedUser?.userId === user.userId && (
                  <div className="relative p-4 mt-2 bg-blue-100 rounded-lg boder">
                    <h2 className="text-lg font-bold">User Details</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Gender:</strong> {user.gender}</p>
                    <p><strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                    <p><strong>NIC:</strong> {user.nic}</p>
                    <p><strong>Mobile:</strong> {user.mobileNumber}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>State:</strong> {user.state}</p>

                    {/* Close Button */}
                    <button className="absolute text-sm text-red-500 underline top-2 right-2" onClick={() => setSelectedUser(null)}>Close</button>
                  </div>
                  
                )}
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-gray-500">No users found.</p>
          )}
        </div>
        
      </div>
    </div>
  );
}
