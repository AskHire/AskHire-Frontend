import { IoIosSearch } from "react-icons/io";

export default function SearchAndSortBar({ searchQuery, onSearchChange, sortOrder, onSortChange }) {
  return (
    <div className="flex items-center justify-end gap-3 mt-4 mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="w-64 px-8 py-2 border rounded-xl"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <IoIosSearch className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
      </div>

      <select
        className="px-3 py-2 bg-gray-200 border rounded-md"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Sort by: Newest</option>
        <option value="oldest">Sort by: Oldest</option>
      </select>
    </div>
  );
}
