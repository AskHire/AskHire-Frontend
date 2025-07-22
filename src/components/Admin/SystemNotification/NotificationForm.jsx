import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5190/api/adminnotification';

export default function NotificationForm({ onNotify }) {
  const [form, setForm] = useState({
    subject: '',
    message: '',
    type: 'normal',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.subject.trim()) newErrors.subject = "Subject is required.";
    if (!form.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const payload = {
      ...form,
      time: new Date().toISOString(),
    };

    try {
      await axios.post(API_URL, payload);
      setForm({ subject: '', message: '', type: 'normal' });
      if (onNotify) onNotify(true);
    } catch (error) {
      if (onNotify) {
        const errorMsg = error.response?.data?.title || error.message || "Unknown error";
        onNotify(false, errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto">
        <div className="p-8 mt-8 space-y-4 bg-white shadow-md rounded-xl">

          {/* Subject */}
          <div>
            <label className="font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="font-semibold">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="font-semibold">Type</label>
            <div className="flex gap-4 mt-1">
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
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded-md ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Sending..." : "Notify"}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}
