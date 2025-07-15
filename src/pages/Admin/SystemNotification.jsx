import React, { useState, useEffect } from "react";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import Pagination from "../../components/Admin/Pagination";
import NotificationModal from '../../components/Admin/SystemNotification/NotificationModal';
import NotificationForm from '../../components/Admin/SystemNotification/NotificationForm';

const API_URL = "http://localhost:5190/api/adminnotification";

export default function SystemNotification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Time:desc");

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
      console.error("Error fetching notifications:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      await axios.delete(`${API_URL}/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications(currentPage, searchQuery, sortOrder);
      alert("Notification deleted successfully.");
    } catch (error) {
      console.error("Error deleting notification:", error);
      const msg = error.response?.data?.title || error.response?.data?.message || error.message;
      alert(`Failed to delete notification: ${msg}`);
    }
  };

  return (
    <div className="flex-1 min-h-screen p-6 bg-blue-50">
      <h1 className="mt-3 text-3xl font-bold text-gray-800">System Notifications</h1>

      {/* Create Form */}
      <div className="mt-6">
        <NotificationForm onNotify={() => fetchNotifications(currentPage, searchQuery, sortOrder)} />
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col gap-2 my-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by subject or message..."
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

      {/* Table */}
      <div className="p-4 overflow-x-auto bg-white shadow-md rounded-xl min-w-[768px]">
        <div className="grid grid-cols-12 px-4 py-3 text-sm font-semibold text-gray-600 border-b bg-gray-50 rounded-t-md">
          <span className="col-span-1">#</span>
          <span className="col-span-1 ">Type</span>
          <span className="col-span-5">Subject</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-2">Time</span>
          <span className="col-span-1 text-right">Delete</span>
        </div>

        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            const dateTime = new Date(notification.time);
            const date = dateTime.toLocaleDateString();
            const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={notification.notificationId}
                className="grid grid-cols-12 px-4 py-3 text-sm bg-white border-b hover:bg-gray-50"
                onClick={() => setSelectedNotification(notification)}
                style={{ cursor: "pointer" }}
              >
                <span className="col-span-1">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </span>

                <div className="flex col-span-1">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      notification.type.toLowerCase() === "important"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                </div>

                <span className="col-span-5">{notification.subject}</span>
                <span className="col-span-2">{date}</span>
                <span className="col-span-2">{time}</span>

                <div className="col-span-1 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.notificationId);
                    }}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Delete Notification"
                  >
                    <BiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-12 px-4 py-6 text-center text-gray-400">
            No notifications found.
          </div>
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

      {/* Modal */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}
