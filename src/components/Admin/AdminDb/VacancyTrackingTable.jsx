import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../Pagination';

export default function VacancyTrackingTable() {
  const [vacancies, setVacancies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const itemsPerPage = 5;
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchVacancies();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchVacancies = async () => {
    try {
      const params = new URLSearchParams({
        Page: currentPage,
        PageSize: itemsPerPage,
      });

      if (searchTerm) params.append('SearchTerm', searchTerm);
      if (statusFilter) params.append('StatusFilter', statusFilter);

      const response = await axios.get(
        `http://localhost:5190/api/AdminDashboard/vacancy-tracking?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVacancies(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    }
  };

  return (
    <div className="p-6 overflow-x-auto bg-white shadow-md rounded-xl">
      <h2 className="mb-4 text-xl font-bold">Vacancy Tracking</h2>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:justify-between sm:items-center">
        <input
          type="text"
          placeholder="Search by job role..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm bg-gray-100 border rounded-md"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm bg-gray-100 border rounded-md"
        >
          <option value="">Filter by Status</option>
          <option value="Open">Open</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 p-3 font-semibold text-gray-700 border-b bg-gray-50">
        <span className="col-span-3">Vacancy Name</span>
        <span className="col-span-3">Job Role</span>
        <span className="col-span-2">Start Date</span>
        <span className="col-span-2">End Date</span>
        <span className="col-span-1">Status</span>
        <span className="col-span-1 text-center">Apps</span>
      </div>

      {/* Vacancy Rows */}
      {vacancies.length > 0 ? (
        vacancies.map((vacancy) => (
          <div
            key={vacancy.vacancyId}
            className="grid grid-cols-12 p-3 text-sm border-b hover:bg-gray-50"
          >
            <span className="col-span-3 truncate">{vacancy.vacancyName}</span>
            <span className="col-span-3">{vacancy.jobRole}</span>
            <span className="col-span-2">
              {new Date(vacancy.startDate).toLocaleDateString()}
            </span>
            <span className="col-span-2">
              {new Date(vacancy.endDate).toLocaleDateString()}
            </span>
            <span className="col-span-1">{vacancy.status}</span>
            <span className="col-span-1 text-center">{vacancy.applicationsCount}</span>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-400">No vacancies found.</div>
      )}

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
