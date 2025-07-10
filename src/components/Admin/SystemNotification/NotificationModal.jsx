export default function NotificationModal({ notification, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-100 bg-opacity-25">
      <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Message</h2>
        <div className="mt-4 space-y-2">
          <p>{notification.message}</p>
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
