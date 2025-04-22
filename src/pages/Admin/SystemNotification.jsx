import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import axios from 'axios';

const API_URL = 'https://localhost:7256/api/notifications'; // Adjust if needed

export default function SystemNotification() {
  const [form, setForm] = useState({
    subject: '',
    message: '',
    type: 'normal',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (!form.subject || !form.message) {
      alert("Please fill in both Subject and Message");
      return;
    }
  
    const payload = {
      subject: form.subject,
      message: form.message,
      type: form.type,
      time: new Date().toISOString(), // backend expects DateTime
    };
  
    try {
      await axios.post('https://localhost:7256/api/notifications', payload);
  
      alert("Notification sent successfully!");
  
      // Reset form
      setForm({
        subject: '',
        message: '',
        type: 'normal',
      });
  
      // Refresh notifications after short delay
      setTimeout(() => {
        fetchNotifications();
      }, 500);
  
    } catch (error) {
      console.error("Error creating notification:", error.response?.data);
      alert(`Error creating notification: ${error.response?.data?.title || "Unknown error"}`);
    }
  };
  

  return (
    <div className="flex-1 p-6">
      <AdminHeader />
      <h1 className="mt-8 text-3xl font-bold">System Notification</h1>
      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto">
          <div className="p-8 mt-8 space-y-4 bg-white shadow-md rounded-xl">
            <div>
              <div className="font-semibold">Subject</div>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <div className="font-semibold">Message</div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                rows="4"
                required
              />
            </div>

            <div className="font-semibold">Type</div>
            <div className="flex gap-4">
              {['normal', 'important'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={form.type === type}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Notify
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Recent Notifications */}
      <div className="mt-10">
        <h2 className="text-lg font-bold">Recent Notifications</h2>
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
            {(showAll ? notifications : notifications.slice(0, 4)).map((n) => {
              const dateTime = new Date(n.time);
              return (
                <div
                  key={n.notificationId}
                  className="grid items-center grid-cols-12 p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100"
                >
                  <div className="flex justify-center col-span-2">
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${
                        n.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    ></span>
                  </div>
                  <span className="col-span-6">{n.subject}</span>
                  <span className="col-span-2">{dateTime.toLocaleDateString()}</span>
                  <span className="col-span-1 text-green-600">
                    {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="col-span-1 text-right">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setSelectedNotification(
                          selectedNotification?.notificationId === n.notificationId ? null : n
                        )}
                    ><BiDotsVerticalRounded className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedNotification?.notificationId === n.notificationId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-blue-100 bg-opacity-25">
                      <div className="w-full max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center text-gray-700">Message</h2>
                        <div className="mt-4 space-y-2">
                          <p>{selectedNotification.message}</p>
                        </div>
                        <div className="flex justify-end mt-6">
                          <button
                            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                            onClick={() => setSelectedNotification(null)}
                          >Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
