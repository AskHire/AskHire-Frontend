import React, { useEffect, useState } from 'react';
import BaseTable from '../../BaseTable';
import axios from 'axios';
import Pagination from '../Pagination'; // Adjust path if needed

export default function VacancyTrackingTable() {
  const [data, setData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get('http://localhost:5190/api/AdminDashboard/vacancy-tracking')
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error('Error fetching vacancy tracking data:', err)
      );
  }, []);

  const headers = [
    { label: 'Vacancy Name', span: 3 },
    { label: 'Job Role', span: 2 },
    { label: 'Start Date', span: 2 },
    { label: 'End Date', span: 2 },
    { label: 'Status', span: 1 },
    { label: 'Applications', span: 1 },
  ];

  const sortOptions = [
    { label: 'Start Date (Newest)', value: 'startDate:desc' },
    { label: 'Start Date (Oldest)', value: 'startDate:asc' },
    { label: 'Applications (High to Low)', value: 'applicationsCount:desc' },
    { label: 'Applications (Low to High)', value: 'applicationsCount:asc' },
  ];

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  // Pagination controls
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="overflow-x-auto">
      <BaseTable
        title="Vacancy Tracking"
        headers={headers}
        rows={paginatedData}
        searchKey="vacancyName"
        sortOptions={sortOptions}
        renderRow={(row) => (
          <>
            <span className="col-span-3 truncate">{row.vacancyName}</span>
            <span className="col-span-2">{row.jobRole}</span>
            <span className="col-span-2">
              {new Date(row.startDate).toLocaleDateString()}
            </span>
            <span className="col-span-2">
              {new Date(row.endDate).toLocaleDateString()}
            </span>
            <span className="col-span-1">{row.status}</span>
            <span className="col-span-1 text-center">
              {row.applicationsCount}
            </span>
          </>
        )}
      />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
