import ManagerTopbar from '../../components/ManagerTopbar';
import React, { useEffect, useState } from "react";
import { Search, Edit, Trash2, X } from "lucide-react";
import DeleteModal from '../../components/DeleteModal';
import Pagination from '../../components/Admin/Pagination';

const ManageVacancy = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editVacancy, setEditVacancy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Newest');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const vacanciesPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:5190/api/Vacancy")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setVacancies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vacancies:", error);
        setError("Failed to load vacancies.");
        setLoading(false);
      });
  }, []);

  const confirmDelete = async () => {
    if (!vacancyToDelete) return;
    try {
      const response = await fetch(`http://localhost:5190/api/Vacancy/${vacancyToDelete.vacancyId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete vacancy");
      setVacancies(vacancies.filter(v => v.vacancyId !== vacancyToDelete.vacancyId));
      setShowDeleteModal(false);
      setVacancyToDelete(null);
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      alert("Error deleting vacancy.");
    }
  };

  const handleDelete = (vacancy) => {
    setVacancyToDelete(vacancy);
    setShowDeleteModal(true);
  };

  const handleEdit = (vacancy) => {
    setEditVacancy({ ...vacancy });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setEditVacancy({ ...editVacancy, [name]: parseInt(value, 10) });
    } else {
      setEditVacancy({ ...editVacancy, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!editVacancy) return;
    try {
      const response = await fetch(`http://localhost:5190/api/Vacancy/${editVacancy.vacancyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editVacancy),
      });
      if (!response.ok) throw new Error("Failed to update vacancy");
      setVacancies(
        vacancies.map((v) =>
          v.vacancyId === editVacancy.vacancyId ? editVacancy : v
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating vacancy:", error);
      alert("Error updating vacancy.");
    }
  };

  const filteredVacancies = vacancies.filter(v =>
    v.vacancyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVacancies = [...filteredVacancies].sort((a, b) => {
    if (sortOption === 'Newest') return new Date(b.startDate) - new Date(a.startDate);
    if (sortOption === 'Oldest') return new Date(a.startDate) - new Date(b.startDate);
    if (sortOption === 'Alphabetical') return a.vacancyName.localeCompare(b.vacancyName);
    return 0;
  });

  // Pagination logic
  const indexOfLast = currentPage * vacanciesPerPage;
  const indexOfFirst = indexOfLast - vacanciesPerPage;
  const currentVacancies = sortedVacancies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedVacancies.length / vacanciesPerPage);

  const paginate = (pageNum) => setCurrentPage(pageNum);

  // Reset to first page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption]);

  if (loading) return <div className="flex-1 pt-1 pb-4 pr-6 pl-6"><div className="pb-4"><ManagerTopbar /></div><p className="text-center py-8">Loading vacancies...</p></div>;
  if (error) return <div className="flex-1 pt-1 pb-4 pr-6 pl-6"><div className="pb-4"><ManagerTopbar /></div><p className="text-red-500 text-center py-8">{error}</p></div>;

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4"><ManagerTopbar /></div>
      <h1 className="text-3xl font-bold mb-6">Manage Vacancy</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Active Vacancies</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search vacancies..."
                className="px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            <select
              className="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {sortedVacancies.length} result{sortedVacancies.length !== 1 ? 's' : ''} for "{searchQuery}"
          </div>
        )}

        {/* Header Row */}
        <div className="grid grid-cols-12 py-2 border-b text-gray-500 text-sm">
          <div className="col-span-1 px-4">#</div>
          <div className="col-span-5 px-4">Vacancy Name</div>
          <div className="col-span-2 px-4">Start Date</div>
          <div className="col-span-2 px-4">End Date</div>
          <div className="col-span-1 text-center">Edit</div>
          <div className="col-span-1 text-center">Delete</div>
        </div>

        {/* Vacancy Rows */}
        {currentVacancies.length > 0 ? (
          currentVacancies.map((vacancy, index) => (
            <div key={vacancy.vacancyId} className="grid grid-cols-12 py-4 border-b items-center hover:bg-gray-50 transition-colors">
              <div className="col-span-1 px-4 text-gray-500">
                {(currentPage - 1) * vacanciesPerPage + index + 1}
              </div>
              <div className="col-span-5 px-4 font-medium">{vacancy.vacancyName}</div>
              <div className="col-span-2 px-4">{new Date(vacancy.startDate).toLocaleDateString()}</div>
              <div className="col-span-2 px-4">{new Date(vacancy.endDate).toLocaleDateString()}</div>
              <div className="col-span-1 flex justify-center">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors" onClick={() => handleEdit(vacancy)}>
                  <Edit size={16} />
                </button>
              </div>
              <div className="col-span-1 flex justify-center">
                <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors" onClick={() => handleDelete(vacancy)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? `No vacancies found matching "${searchQuery}"` : 'No vacancies available'}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={paginate}
            />
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Vacancy</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['vacancyName', 'startDate', 'endDate', 'duration', 'requiredSkills', 'experience', 'education', 'instructions', 'nonTechnicalSkills', 'cvPassMark', 'preScreenPassMark', 'questionCount'].map(field => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  {['requiredSkills', 'experience', 'education', 'instructions', 'nonTechnicalSkills'].includes(field) ? (
                    <textarea
                      name={field}
                      value={editVacancy?.[field] || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  ) : (
                    <input
                      type={['cvPassMark', 'preScreenPassMark', 'questionCount', 'duration'].includes(field) ? 'number' : field.includes('Date') ? 'date' : 'text'}
                      name={field}
                      value={field.includes('Date') ? editVacancy?.[field]?.split('T')[0] || '' : editVacancy?.[field] || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-2 pt-6 mt-4 border-t">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors" onClick={handleSave}>
                Save Changes
              </button>
              <button className="bg-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default ManageVacancy;