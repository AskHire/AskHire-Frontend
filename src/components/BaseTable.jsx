import { useState, useMemo } from 'react';

export default function BaseTable({
  title,
  headers,
  rows,
  renderRow,
  searchKey = '',
  sortOptions = [],
}) {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const sortKeyExists = (val) => {
    if (!val.includes(':')) return false;
    const [key] = val.split(':');
    return rows.length > 0 && Object.hasOwn(rows[0], key);
  };

  const filteredRows = useMemo(() => {
    let result = [...rows];

    // 🔍 Filter by search
    if (search && searchKey) {
      result = result.filter((row) =>
        row[searchKey]?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ⬇️ Sort if selected
    if (sortOrder && sortKeyExists(sortOrder)) {
      const [key, direction] = sortOrder.split(':');
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        // Handle dates or strings
        if (!isNaN(new Date(valA)) && !isNaN(new Date(valB))) {
          return direction === 'desc'
            ? new Date(valB) - new Date(valA)
            : new Date(valA) - new Date(valB);
        } else {
          return direction === 'desc'
            ? String(valB).localeCompare(String(valA))
            : String(valA).localeCompare(String(valB));
        }
      });
    }

    return result;
  }, [rows, search, sortOrder, searchKey]);

  return (
    <div className="p-4 overflow-x-auto bg-white shadow-md rounded-xl">
      {/* Title and Controls */}
      <div className="flex flex-col items-start gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">{title}</h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search Input */}
          {searchKey && (
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          )}

          {/* Sort Dropdown */}
          {sortOptions.length > 0 && (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded-md"
            >
              <option value="" disabled>
                Sort by
              </option>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table Header */}
      <div className="min-w-[768px] grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 border-b rounded-t-md">
        {headers.map((header, idx) => (
          <span
            key={idx}
            className={`col-span-${header.span || 1} ${header.align || 'text-left'}`}
          >
            {header.label}
          </span>
        ))}
      </div>

      {/* Table Rows */}
      <div className="min-w-[768px] divide-y">
        {filteredRows.length > 0 ? (
          filteredRows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 px-4 py-3 text-sm transition bg-white hover:bg-gray-50"
            >
              {renderRow(row, idx)}
            </div>
          ))
        ) : (
          <div className="col-span-12 px-4 py-6 text-center text-gray-400">
            No matching records.
          </div>
        )}
      </div>
    </div>
  );
}
