import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const SearchableDropdown = ({ 
  options = [], 
  value, 
  onSelect, 
  placeholder = "Search and select...", 
  loading = false,
  error = null,
  displayKey = 'name',
  valueKey = 'id',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter options based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option[displayKey].toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options, displayKey]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus on input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onSelect(null);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      handleSelect(filteredOptions[0]);
    }
  };

  const selectedOption = options.find(option => option[valueKey] === value);
  const displayValue = selectedOption ? selectedOption[displayKey] : '';

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div 
        className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 flex-1">
          <Search size={20} className="text-gray-400" />
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 outline-none text-lg"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-lg flex-1">
              {loading ? 'Loading...' : displayValue || placeholder}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedOption && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
          <ChevronDown 
            className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            size={20}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-60 overflow-hidden">
          {loading ? (
            <div className="px-4 py-3 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="px-4 py-3 text-red-500">{error}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">
              {searchQuery ? `No results found for "${searchQuery}"` : 'No options available'}
            </div>
          ) : (
            <div className="py-1 max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option[valueKey]}
                  className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                    option[valueKey] === value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option[displayKey]}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;