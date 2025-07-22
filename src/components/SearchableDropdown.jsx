import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

const SearchableDropdown = ({
  items = [],
  searchQuery,
  setSearchQuery,
  onSelect,
  selectedId,
  recentItems = [],
  title = "Select Item",
  placeholder = "Search...",
  isOpen,
  setIsOpen
}) => {
  const dropdownRef = useRef(null);

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (jobTitle, jobId) => {
    onSelect(jobTitle, jobId);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Prevent dropdown from closing when clicking inside
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Header with dropdown trigger */}
      <div
        className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        <div className="text-gray-700">{title}</div>
        <div className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </div>

      {/* Dropdown content */}
      {isOpen && (
        <div 
          className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-50"
          onClick={handleDropdownClick}
        >
          {/* Search input */}
          <div className="p-3 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder={placeholder}
                className="w-full px-4 py-2 pl-10 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                value={searchQuery}
                onChange={handleSearchChange}
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          {/* Recently selected items */}
          {recentItems.length > 0 && !searchQuery && (
            <>
              <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Recently Selected
              </div>
              <div className="pb-2">
                {recentItems.map((item) => (
                  <div
                    key={`recent-${item.jobId}`}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleSelect(item.jobTitle, item.jobId)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{item.jobTitle}</span>
                      {item.jobId === selectedId && (
                        <span className="text-blue-600 text-sm font-medium">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Separator between recent and all items */}
          {recentItems.length > 0 && !searchQuery && (
            <div className="border-t mx-3"></div>
          )}

          {/* All items section */}
          {!searchQuery && recentItems.length > 0 && (
            <div className="px-4 pt-3 pb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              All Items
            </div>
          )}

          {/* Filtered list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-3 text-center">
                <p className="text-gray-500">
                  {searchQuery ? `No matches found for "${searchQuery}"` : "No items available"}
                </p>
              </div>
            ) : (
              <div className="py-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.jobId}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleSelect(item.jobTitle, item.jobId)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{item.jobTitle}</span>
                      {item.jobId === selectedId && (
                        <span className="text-blue-600 text-sm font-medium">✓ Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results summary */}
          {searchQuery && filteredItems.length > 0 && (
            <div className="px-4 py-2 border-t bg-gray-50 text-sm text-gray-600">
              {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;