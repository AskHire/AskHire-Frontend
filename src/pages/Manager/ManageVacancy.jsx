import ManagerTopbar from '../../components/ManagerTopbar';
import React, { useEffect, useState } from "react";
import { ChevronDown, Search, Edit, Trash2, X } from "lucide-react";



const ManageVacancy = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editVacancy, setEditVacancy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Newest');

  useEffect(() => {
    fetch("http://localhost:5190/api/Vacancy")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job vacancy?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5190/api/Vacancy/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setVacancies(vacancies.filter((vacancy) => vacancy.vacancyId !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Error deleting job.");
    }
  };

  const handleEdit = (vacancy) => {
    setEditVacancy({...vacancy});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convert to appropriate types for number fields
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editVacancy),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      setVacancies(
        vacancies.map((vacancy) =>
          vacancy.vacancyId === editVacancy.vacancyId ? editVacancy : vacancy
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Error updating job.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter vacancies based on search query
  const filteredVacancies = vacancies.filter(vacancy => 
    vacancy.vacancyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort vacancies based on selected option
  const sortedVacancies = [...filteredVacancies].sort((a, b) => {
    if (sortOption === 'Newest') {
      return new Date(b.startDate) - new Date(a.startDate);
    } else if (sortOption === 'Oldest') {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortOption === 'Alphabetical') {
      return a.vacancyName.localeCompare(b.vacancyName);
    }
    return 0;
  });

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex-1 pt-1 pb-4 pr-6 pl-6">
      <div className="pb-4">
        <ManagerTopbar />
      </div>
      <h1 className="text-3xl font-bold mb-6">Manage Vacancy</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Active Vacancies</h2>
          
          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="px-4 py-2 pl-10 bg-gray-100 rounded-lg"
                value={searchQuery}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            
            <div className="relative">
              <select
                className="px-4 py-2 bg-gray-100 rounded-lg appearance-none pr-10"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Alphabetical</option>
              </select>
              <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                Sort by:
              </span>
            </div>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-12 py-2 border-b text-gray-500 text-sm">
          <div className="col-span-1 px-4">#</div>
          <div className="col-span-5 px-4">Vacancy Name</div>
          <div className="col-span-2 px-4">Start Date</div>
          <div className="col-span-2 px-4">End Date</div>
          <div className="col-span-1 text-center">Edit</div>
          <div className="col-span-1 text-center">Delete</div>
        </div>

        {/* Table Body */}
        {sortedVacancies.length > 0 ? (
          sortedVacancies.map((vacancy, index) => (
            <div 
              key={vacancy.vacancyId} 
              className="grid grid-cols-12 py-4 border-b items-center hover:bg-gray-50"
            >
              <div className="col-span-1 px-4 text-gray-500">{index + 1}</div>
              <div className="col-span-5 px-4 font-medium">{vacancy.vacancyName}</div>
              <div className="col-span-2 px-4">{new Date(vacancy.startDate).toLocaleDateString()}</div>
              <div className="col-span-2 px-4">{new Date(vacancy.endDate).toLocaleDateString()}</div>
              <div className="col-span-1 flex justify-center">
                <button 
                  className="p-2 bg-blue-100 text-blue-600 rounded-full"
                  onClick={() => handleEdit(vacancy)}
                >
                  <Edit size={16} />
                </button>
              </div>
              <div className="col-span-1 flex justify-center">
                <button 
                  className="p-2 bg-red-100 text-red-600 rounded-full"
                  onClick={() => handleDelete(vacancy.vacancyId)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No jobs available
          </div>
        )}
      </div>

      {/* Edit Vacancy Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Job Vacancy</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Vacancy Name</label>
                    <input
                      type="text"
                      name="vacancyName"
                      value={editVacancy?.vacancyName || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editVacancy?.startDate.split("T")[0] || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={editVacancy?.endDate.split("T")[0] || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (days)</label>
                    <input
                      type="number"
                      name="duration"
                      value={editVacancy?.duration || 0}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Required Skills</label>
                    <textarea
                      name="requiredSkills"
                      value={editVacancy?.requiredSkills || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience</label>
                    <textarea
                      name="experience"
                      value={editVacancy?.experience || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Education</label>
                    <textarea
                      name="education"
                      value={editVacancy?.education || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Instructions</label>
                    <textarea
                      name="instructions"
                      value={editVacancy?.instructions || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Non-Technical Skills</label>
                    <textarea
                      name="nonTechnicalSkills"
                      value={editVacancy?.nonTechnicalSkills || ''}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              
              {/* Assessment Setup */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Assessment Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CV Pass Mark</label>
                    <input
                      type="number"
                      name="cvPassMark"
                      value={editVacancy?.cvPassMark || 0}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Pre-Screen Pass Mark</label>
                    <input
                      type="number"
                      name="preScreenPassMark"
                      value={editVacancy?.preScreenPassMark || 0}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Question Count</label>
                    <input
                      type="number"
                      name="questionCount"
                      value={editVacancy?.questionCount || 0}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-6 mt-4 border-t">
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button 
                className="bg-gray-300 px-6 py-2 rounded-lg font-medium"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVacancy;