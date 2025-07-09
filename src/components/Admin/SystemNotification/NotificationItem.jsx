import { BiDotsVerticalRounded } from 'react-icons/bi';

export default function NotificationItem({ notification, isSelected, onSelect }) {
  const dateTime = new Date(notification.time);

  return (
    <div className="grid items-center grid-cols-12 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100">
      <div className="flex justify-center col-span-2">
        <span className={`inline-block h-4 w-4 rounded-full ${
          notification.type === 'important' ? 'bg-red-500' : 'bg-green-500'
        }`} />
      </div>
      <span className="col-span-6">{notification.subject}</span>
      <span className="col-span-2">{dateTime.toLocaleDateString()}</span>
      <span className="col-span-1 text-green-600">
        {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      <div className="col-span-1 text-right">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => onSelect(isSelected ? null : notification)}
        >
          <BiDotsVerticalRounded className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
