import NotificationItem from './NotificationItem';

export default function NotificationList({ notifications, showAll, setShowAll, onSelect, selectedNotification }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-end mb-4">
        {!showAll && (
          <button onClick={() => setShowAll(true)} className="text-blue-600 hover:underline">
            View All
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 p-3 font-semibold rounded-md">
        <span className="col-span-2 text-center">Type</span>
        <span className="col-span-6">Subject</span>
        <span className="col-span-2">Date</span>
        <span className="col-span-1">Time</span>
        <span className="col-span-1 text-right">More</span>
      </div>

      <div className="mt-2 space-y-3">
        {(showAll ? notifications : notifications.slice(0, 4)).map((n) => (
          <NotificationItem
            key={n.notificationId}
            notification={n}
            isSelected={selectedNotification?.notificationId === n.notificationId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
