import React from "react";

export default function Pagination({ currentPage, totalPages, onPrev, onNext, onPageChange }) {
  const maxButtons = 5;

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-8 mb-1 space-x-2">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-4 py-2 font-medium text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-4 py-2 rounded-full ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 font-medium text-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
