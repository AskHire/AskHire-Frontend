import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

export default function JobSearchAndSort({ searchQuery, setSearchQuery, sortOrder, setSortOrder, dropdownOpen, setDropdownOpen, dropdownRef }) {
  return (
    <div className="flex items-center justify-end gap-3 mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-64 px-8 py-2 border rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IoIosSearch className="absolute w-5 h-5 text-gray-900 transform -translate-y-1/2 left-3 top-1/2" />
      </div>

      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center px-3 py-2 bg-gray-200 border rounded-md">
          Sort by: {sortOrder} <BiChevronDown className="ml-2" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-md">
            {["Newest", "Oldest"].map((order) => (
              <button key={order} className="w-full px-3 py-2 text-left hover:bg-gray-100" onClick={() => { setSortOrder(order); setDropdownOpen(false); }}>
                {order}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
