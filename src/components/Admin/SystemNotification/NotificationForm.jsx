import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5190/api/adminnotification';

export default function NotificationForm({ onNotify }) {
  const [form, setForm] = useState({
    subject: '',
    message: '',
    type: 'normal',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      alert("Please fill in both Subject and Message");
      return;
    }

    const payload = {
      ...form,
      time: new Date().toISOString(),
    };

    try {
      await axios.post(API_URL, payload);
      alert("Notification sent successfully!");
      setForm({ subject: '', message: '', type: 'normal' });
      setTimeout(() => onNotify(), 500);
    } catch (error) {
      console.error("Error creating notification:", error.response?.data);
      alert(`Error: ${error.response?.data?.title || "Unknown error"}`);
    }
  };

  return (
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
  );
}
