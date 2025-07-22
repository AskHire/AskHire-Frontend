import React from 'react';

const AdminNotification = ({ notifications, loading, error, onViewAllClick }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading notifications...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-600">No new notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.notificationId} // Assuming notificationId is the unique key
              className={`p-4 border-b hover:bg-gray-50 transition ${
                n.status === 'Admin' || n.type === 'Important'
                  ? 'bg-yellow-50 border-l-2 border-yellow-300'
                  : ''
              }`}
            >
              <p className="font-semibold text-sm text-gray-900 mb-1">
                {(n.status === 'Admin' || n.type === 'Important') && (
                  <span className="text-red-600 text-xs mr-1 font-bold">!</span>
                )}
                {n.subject}
              </p>
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{n.message}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{n.type}</span>
                <span>{new Date(n.time).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {(notifications.length > 0 || loading || error) && (
        <div className="p-3 border-t bg-gray-50 text-center">
          <button
            onClick={onViewAllClick}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNotification;