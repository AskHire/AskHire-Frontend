import React, { useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

export default function AdminSearchSort({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  dropdownOpen,
  setDropdownOpen
}) {
  const dropdownRef = useRef(null);

  return (
    <div className="flex items-center justify-end gap-3 mt-4 mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search admins..."
          className="w-64 px-8 py-2 border rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IoIosSearch className="absolute w-5 h-5 text-gray-900 transform -translate-y-1/2 left-3 top-1/2" />
      </div>

      {/* Sort Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center px-3 py-2 bg-gray-200 border rounded-md"
        >
          Sort by: {sortOrder} <BiChevronDown className="ml-2" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 w-32 mt-2 bg-white border rounded-md shadow-md">
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => { setSortOrder("Newest"); setDropdownOpen(false); }}
            >
              Newest
            </button>
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => { setSortOrder("Oldest"); setDropdownOpen(false); }}
            >
              Oldest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
