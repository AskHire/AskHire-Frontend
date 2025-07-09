import { useState, useEffect } from 'react';
import AdminHeader from '../../components/Admin/AdminHeader';
import NotificationForm from '../../components/Admin/SystemNotification/NotificationForm';
import NotificationList from '../../components/Admin/SystemNotification/NotificationList';
import NotificationModal from '../../components/Admin/SystemNotification/NotificationModal';

const API_URL = 'http://localhost:5190/api/adminnotification';

export default function SystemNotification() {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

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

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">System Notification</h1>

      <NotificationForm onNotify={fetchNotifications} />

      <div className="mt-10">
        <h2 className="text-lg font-bold">Recent Notifications</h2>
        <NotificationList
          notifications={notifications}
          showAll={showAll}
          setShowAll={setShowAll}
          onSelect={setSelectedNotification}
          selectedNotification={selectedNotification}
        />
      </div>

      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}
