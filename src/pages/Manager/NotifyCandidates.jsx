import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerTopbar from '../../components/ManagerTopbar';
import SuccessModal from '../../components/SuccessModal';

const API_URL = 'http://localhost:5190/api/managernotification';

// Green Success Popup Component
function GreenSuccessPopup({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="flex justify-center mb-4">
      <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md shadow-sm flex items-center space-x-2 max-w-md">
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="text-green-600 hover:text-green-800 font-bold text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function ManagerNotificationForm({ onNotify }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!subject || !message) {
      setError('Please fill in both subject and message.');
      return;
    }
    setLoading(true);
    console.log('Sending notification with data:', { subject, message, type });
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, type, time: new Date().toISOString() })
      });

      console.log('API Response:', res);
      if (!res.ok) throw new Error(`Failed to send notification. Status: ${res.status}`);
      
      console.log('API call successful. Showing success popup.');
      setPopupMessage(`Notification of type '${type}' sent successfully!`);
      setShowSuccessModal(true);
      setSubject('');
      setMessage('');
      setType('Normal');
      if (onNotify) onNotify();
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Failed to send notification. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccessModal && (
        <SuccessModal message={popupMessage} onClose={() => setShowSuccessModal(false)} />
      )}
      
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="bg-white border border-blue-200 rounded-lg shadow-sm p-5 mb-8 max-w-2xl w-full">
          <h2 className="text-lg font-bold mb-4">Send Notification</h2>
          {error && <div className="mb-2 text-red-600">{error}</div>}
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Subject</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Enter notification subject"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Message</label>
            <textarea
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter your message"
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">Type</label>
            <div className="flex space-x-6">
              {['Normal', 'Important'].map(t => (
                <div key={t} className="flex items-center">
                  <input
                    id={t}
                    name="notification-type"
                    type="radio"
                    value={t}
                    checked={type === t}
                    onChange={e => setType(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={t} className="ml-2 text-gray-700">{t}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-full font-medium text-white ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function NotificationModal({ notification, onClose }) {
  if (!notification) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
        <h3 className="text-xl font-bold mb-2">{notification.subject}</h3>
        <p className="mb-4">{notification.message}</p>
        <div className="text-xs text-gray-500">{new Date(notification.time).toLocaleString()}</div>
        <div className="mt-2 text-xs text-gray-400">Type: {notification.type}</div>
      </div>
    </div>
  );
}

export default function NotifyCandidates() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotifications = notifications.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination controls (like LongList)
  const PaginationControls = () => {
    if (totalPages <= 1) return null;
    const getVisiblePages = () => {
      const pages = [];
      const maxVisible = 3;
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 2) {
          for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) pages.push(i);
        } else if (currentPage >= totalPages - 1) {
          for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(currentPage - 1);
          pages.push(currentPage);
          pages.push(currentPage + 1);
        }
      }
      return pages;
    };
    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 font-medium transition-colors min-w-[80px] ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Prev
        </button>
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-full font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 font-medium transition-colors min-w-[80px] ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6">
      <ManagerTopbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Notify Candidates</h2>
      


      <ManagerNotificationForm onNotify={fetchNotifications} />

      {/* <button
        onClick={() => navigate(-1)}
        className="ml-6 mb-8 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span>Back</span>
      </button> */}

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">Recent Notifications</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-blue-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentNotifications.length > 0 ? (
                currentNotifications.map((n, idx) => (
                  <tr key={n.id || n.notificationId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{startIndex + idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{n.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">{n.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{n.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(n.time).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedNotification(n)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No notifications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls />
      </div>

      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
      </main>
    </div>
    
  );
}