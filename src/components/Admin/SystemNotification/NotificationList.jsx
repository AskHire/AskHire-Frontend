import { BiDotsVerticalRounded } from 'react-icons/bi';
import BaseTable from '../../BaseTable';

export default function NotificationList({ notifications, onSelect, selectedNotification }) {
  const headers = [
    { label: 'Type', span: 2, align: 'text-center' },
    { label: 'Subject', span: 6 },
    { label: 'Date', span: 2 },
    { label: 'Time', span: 1 },
    { label: 'More', span: 1, align: 'text-right' },
  ];

  return (
    <BaseTable
      title="Notifications"
      headers={headers}
      rows={notifications}
      searchKey="subject"
      sortOptions={[
        { label: 'Newest', value: 'time:desc' },
        { label: 'Oldest', value: 'time:asc' },
      ]}
      renderRow={(notification) => {
        const dateTime = new Date(notification.time);
        return (
          <>
            <div className="flex justify-center col-span-2">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  notification.type === 'important' ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
            </div>
            <span className="col-span-6 text-gray-800">{notification.subject}</span>
            <span className="col-span-2 text-gray-600">
              {dateTime.toLocaleDateString()}
            </span>
            <span className="col-span-1 font-medium text-green-600">
              {dateTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <div className="col-span-1 text-right">
              <button
                onClick={() =>
                  onSelect(
                    selectedNotification?.notificationId === notification.notificationId
                      ? null
                      : notification
                  )
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <BiDotsVerticalRounded className="w-5 h-5" />
              </button>
            </div>
          </>
        );
      }}
    />
  );
}
