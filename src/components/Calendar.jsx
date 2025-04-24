import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateReminders, setDateReminders] = useState([]);
  const [reminderData, setReminderData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'add' or 'edit'
  const [editingReminderId, setEditingReminderId] = useState(null);

  // Fetch reminders on component load
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get('http://localhost:5190/api/Reminder');
      const calendarEvents = response.data.map(reminder => ({
        id: reminder.reminderId,
        title: reminder.title,
        date: new Date(reminder.date).toISOString().split('T')[0],
        extendedProps: {
          description: reminder.description,
          reminderId: reminder.reminderId
        }
      }));
      setEvents(calendarEvents);
      return response.data;
    } catch (error) {
      console.error('Failed to load reminders:', error);
      return [];
    }
  };

  const handleDateClick = async (info) => {
    setSelectedDate(info.dateStr);
    setReminderData({
      title: '',
      description: '',
      date: info.dateStr
    });
    
    // Fetch all reminders and filter for the selected date
    const allReminders = await fetchReminders();
    const selectedDateReminders = allReminders.filter(reminder => {
      const reminderDate = new Date(reminder.date).toISOString().split('T')[0];
      return reminderDate === info.dateStr;
    });
    
    setDateReminders(selectedDateReminders);
    // Always show the view tab first, regardless of whether there are reminders
    setActiveTab('view');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReminderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (editingReminderId) {
        // Update existing reminder
        await axios.put(`http://localhost:5190/api/Reminder/${editingReminderId}`, {
          ...reminderData,
          reminderId: editingReminderId
        });
      } else {
        // Create new reminder
        await axios.post('http://localhost:5190/api/Reminder', reminderData);
      }
      
      const updatedReminders = await fetchReminders();
      // Update the date reminders for the current view
      const updatedDateReminders = updatedReminders.filter(reminder => {
        const reminderDate = new Date(reminder.date).toISOString().split('T')[0];
        return reminderDate === selectedDate;
      });
      setDateReminders(updatedDateReminders);
      setActiveTab('view');
      setReminderData({
        title: '',
        description: '',
        date: selectedDate
      });
      setEditingReminderId(null);
    } catch (err) {
      setError(`Failed to ${editingReminderId ? 'update' : 'create'} reminder. Please try again.`);
      console.error(`Error ${editingReminderId ? 'updating' : 'creating'} reminder:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReminder = (reminder) => {
    setReminderData({
      title: reminder.title,
      description: reminder.description,
      date: new Date(reminder.date).toISOString().split('T')[0]
    });
    setEditingReminderId(reminder.reminderId);
    setActiveTab('edit');
  };

  const handleCancelEdit = () => {
    setReminderData({
      title: '',
      description: '',
      date: selectedDate
    });
    setEditingReminderId(null);
    setActiveTab('view');
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      await axios.delete(`http://localhost:5190/api/Reminder/${reminderId}`);
      // Update both the calendar events and the current date's reminders
      const updatedReminders = await fetchReminders();
      const updatedDateReminders = updatedReminders.filter(reminder => {
        const reminderDate = new Date(reminder.date).toISOString().split('T')[0];
        return reminderDate === selectedDate;
      });
      setDateReminders(updatedDateReminders);
      
      // Stay on view tab even if all reminders are deleted
      setActiveTab('view');
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      setError('Failed to delete reminder. Please try again.');
    }
  };

  const renderReminderForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={reminderData.date}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={reminderData.title}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Reminder title"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={reminderData.description}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Reminder description"
          rows="4"
          required
        />
      </div>
      
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={editingReminderId ? handleCancelEdit : () => setActiveTab('view')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isSubmitting ? 'Saving...' : (editingReminderId ? 'Update Reminder' : 'Save Reminder')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="calendar-container relative">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events}
        eventContent={(eventInfo) => (
          <div className="event-content">
            <b>{eventInfo.event.title}</b>
          </div>
        )}
      />
      
      {/* Integrated Modal within Calendar component */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {activeTab === 'edit' ? 'Edit Reminder' : `Reminders for ${selectedDate}`}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Tabs - Only show when not in edit mode */}
            {activeTab !== 'edit' && (
              <div className="flex border-b mb-4">
                <button
                  className={`py-2 px-4 ${activeTab === 'view' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('view')}
                >
                  View Reminders
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'add' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('add')}
                >
                  Add Reminder
                </button>
              </div>
            )}

            {/* View Reminders Tab */}
            {activeTab === 'view' && (
              <div>
                {dateReminders.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">No reminders for this date.</p>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Add a Reminder
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {dateReminders.map(reminder => (
                      <div key={reminder.reminderId} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-lg">{reminder.title}</h3>
                          <div className="space-x-2">
                            <button 
                              onClick={() => handleEditReminder(reminder)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteReminder(reminder.reminderId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600">{reminder.description}</p>
                      </div>
                    ))}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setActiveTab('add')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Add New Reminder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add Reminder Tab */}
            {activeTab === 'add' && renderReminderForm()}

            {/* Edit Reminder Tab */}
            {activeTab === 'edit' && renderReminderForm()}
          </div>
        </div>
      )}
    </div>
  );
}