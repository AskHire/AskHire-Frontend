import React from 'react';

const PaginationJob = ({ currentPage, totalPages, onPageChange }) => {
  // Determine the range of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // The max number of page buttons to show

    if (totalPages <= maxPagesToShow) {
      // If total pages are 5 or less, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // If more than 5 pages, calculate a dynamic range
      let startPage, endPage;
      if (currentPage <= 3) {
        // If on one of the first 3 pages, show 1 to 5
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + 1 >= totalPages) {
        // If on one of the last 3 pages, show the last 5
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // Otherwise, center the current page
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-8 mb-1 space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-4 py-2 rounded-full ${
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationJob;