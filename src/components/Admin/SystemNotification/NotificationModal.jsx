export default function NotificationModal({ notification, onClose }) {
  const dateObj = new Date(notification.time);

  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = dateObj.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-100 bg-opacity-25">
      <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Message</h2>
        <div className="mt-4 space-y-2">
          <p>{notification.message}</p>
          <span className="flex items-center col-span-2">{timeString}</span>
          <span className="text-sm text-gray-500">{dateString}</span>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
