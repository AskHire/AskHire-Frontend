import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import Pagination from "../../components/Admin/Pagination";
import NotificationModal from '../../components/Admin/SystemNotification/NotificationModal';
import NotificationForm from '../../components/Admin/SystemNotification/NotificationForm';
import DeleteModal from '../../components/DeleteModal'; // Adjust path if needed

const API_URL = "http://localhost:5190/api/adminnotification";

export default function SystemNotification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Time:desc");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Delete Modal related state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  const itemsPerPage = 5;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchNotifications(currentPage, searchQuery, sortOrder);
  }, [currentPage, searchQuery, sortOrder]);

  const fetchNotifications = async (page, search, sort) => {
    try {
      const params = new URLSearchParams({
        Page: page,
        PageSize: itemsPerPage,
      });

      if (search) params.append("SearchTerm", search);

      if (sort) {
        const [key, dir] = sort.split(":");
        params.append("SortBy", key);
        params.append("IsDescending", dir === "desc");
      }

      const response = await axios.get(`${API_URL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setErrorMessage("Error fetching notifications.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Open delete modal instead of direct delete
  const openDeleteModal = (notificationId) => {
    setNotificationToDelete(notificationId);
    setDeleteModalOpen(true);
  };

  // Confirm delete after modal confirmation
  const confirmDelete = async () => {
    if (!notificationToDelete) return;

    try {
      await axios.delete(`${API_URL}/${notificationToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("Notification deleted successfully.");
      fetchNotifications(currentPage, searchQuery, sortOrder);
    } catch (error) {
      setErrorMessage(
        `Failed to delete notification: ${
          error.response?.data?.title || error.response?.data?.message || error.message
        }`
      );
    } finally {
      setDeleteModalOpen(false);
      setNotificationToDelete(null);
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleNotificationCreated = () => {
    fetchNotifications(currentPage, searchQuery, sortOrder);
    setSuccessMessage("Notification created successfully.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="flex-1 min-h-screen pl-2 pr-4 md:pl-6 bg-blue-50">
      <h1 className="text-3xl font-bold text-gray-800">System Notifications</h1>

      {/* Create Form */}
      <div className="mt-6">
        <NotificationForm onNotify={handleNotificationCreated} />
      </div>

      <div>
        <h1 className="mt-12 mb-4 text-2xl font-bold">Notification List</h1>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col gap-2 my-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by subject"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded-md"
        >
          <option value="Time:desc">Newest</option>
          <option value="Time:asc">Oldest</option>
        </select>
      </div>

      <div className="p-4 overflow-x-auto bg-white shadow-md rounded-xl min-w-[768px]">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 border-b bg-gray-50 rounded-t-md">
          <span className="col-span-1">#</span>
          <span className="col-span-1">Type</span>
          <span className="col-span-5">Subject</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-2">Delete</span>
          <span className="col-span-1 text-center">More</span>
        </div>

        {/* Table Rows */}
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            const dateTime = new Date(notification.time);
            const date = dateTime.toLocaleDateString();

            return (
              <div
                key={notification.notificationId}
                className="grid grid-cols-12 px-4 py-3 text-sm bg-white border-b hover:bg-gray-50"
              >
                <span className="col-span-1">{(currentPage - 1) * itemsPerPage + index + 1}</span>

                <div className="flex items-center col-span-1">
                  <span
                    className={`w-5 h-5 rounded-full ${
                      notification.type.toLowerCase() === "important" ? "bg-red-500" : "bg-green-500"
                    }`}
                  />
                </div>

                <span className="flex items-center col-span-5">{notification.subject}</span>
                <span className="flex items-center col-span-2">{date}</span>
                <div className="col-span-2">
                  <button
                    onClick={() => openDeleteModal(notification.notificationId)}
                    className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
                  >
                    <BiTrash className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className="flex items-center justify-center col-span-1 text-blue-600 cursor-pointer select-none hover:text-blue-800"
                  title="View More"
                  onClick={() => setSelectedNotification(notification)}
                >
                  ...
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-12 px-4 py-6 text-center text-gray-400">No notifications found.</div>
        )}
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationModal notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed z-50 px-4 py-2 text-blue-800 bg-blue-100 border border-blue-300 rounded-lg shadow-lg top-4 right-4 animate-slide-in-out">
          <strong className="font-medium">Success!</strong> {successMessage}
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed z-50 px-4 py-2 text-red-800 bg-red-100 border border-red-300 rounded-lg shadow-lg top-4 right-4 animate-slide-in-out">
          <strong className="font-medium">Error!</strong> {errorMessage}
        </div>
      )}
    </div>
  );
}
