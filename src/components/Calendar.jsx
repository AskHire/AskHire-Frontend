import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDescription, setReminderDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCalendarEvents = async () => {
    try {
      const [interviewsRes, remindersRes] = await Promise.all([
        axios.get('http://localhost:5190/api/ManagerInterview'),
        axios.get('http://localhost:5190/api/Reminder'),
      ]);

      const interviewEvents = interviewsRes.data.map((interview) => {
        const fullTitle = interview.application?.vacancy?.vacancyName ?? '';
        const displayTitle = fullTitle.replace(/Interview/i, '').trim();

        return {
          id: interview.interviewId,
          title: displayTitle,
          date: interview.date,
          backgroundColor: '#bfdbfe',
          borderColor: '#bfdbfe',
          textColor: 'black',
          extendedProps: {
            type: 'interview',
            time: interview.time,
            description: interview.interview_Instructions || '',
          },
        };
      });

      const reminderEvents = remindersRes.data.map((reminder) => ({
        id: reminder.reminderId,
        title: `🔔 ${reminder.title}`,
        date: reminder.date,
        backgroundColor: '#f59e0b',
        borderColor: '#f59e0b',
        textColor: 'white',
        extendedProps: {
          type: 'reminder',
          description: reminder.description,
          titleRaw: reminder.title
        },
      }));

      setEvents([...interviewEvents, ...reminderEvents]);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setReminderTitle('');
    setReminderDescription('');
    setIsAddModalOpen(true);
  };

  const handleReminderSubmit = async () => {
    if (!reminderTitle || !reminderDescription) {
      alert('Please enter both title and description.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5190/api/Reminder', {
        title: reminderTitle,
        description: reminderDescription,
        date: selectedDate,
      });

      const newReminder = res.data;

      setEvents((prev) => [
        ...prev,
        {
          id: newReminder.reminderId,
          title: `🔔 ${newReminder.title}`,
          date: newReminder.date,
          backgroundColor: '#f59e0b',
          borderColor: '#f59e0b',
          textColor: 'white',
          extendedProps: {
            type: 'reminder',
            description: newReminder.description,
            titleRaw: newReminder.title
          },
        },
      ]);

      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding reminder:', error);
      alert('Failed to add reminder.');
    }
  };

  const handleEventClick = ({ event }) => {
    const { extendedProps } = event;
    if (extendedProps.type === 'reminder') {
      setSelectedEvent({
        id: event.id,
        type: 'reminder',
        title: extendedProps.titleRaw,
        description: extendedProps.description,
        date: event.startStr,
      });
    } else {
      setSelectedEvent({
        id: event.id,
        type: 'interview',
        title: event.title,
        description: extendedProps.description,
        date: event.startStr,
        time: extendedProps.time,
      });
    }
  };

  const handleDeleteReminder = async () => {
    if (!selectedEvent?.id) return;

    try {
      await axios.delete(`http://localhost:5190/api/Reminder/${selectedEvent.id}`);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Failed to delete reminder.');
    }
  };

  const handleUpdateReminder = async () => {
    if (!selectedEvent?.id) return;

    try {
      await axios.put(`http://localhost:5190/api/Reminder/${selectedEvent.id}`, {
        reminderId: selectedEvent.id,
        title: reminderTitle,
        description: reminderDescription,
        date: selectedEvent.date,
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === selectedEvent.id
            ? {
                ...e,
                title: `🔔 ${reminderTitle}`,
                extendedProps: {
                  ...e.extendedProps,
                  titleRaw: reminderTitle,
                  description: reminderDescription,
                },
              }
            : e
        )
      );

      setIsEditing(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating reminder:', error);
      alert('Failed to update reminder.');
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
        eventContent={(eventInfo) => {
          const { event } = eventInfo;
          const { description, type } = event.extendedProps;
          const firstLine = description?.split('\n')[0] ?? '';

          const bgColor = type === 'reminder' ? '#f59e0b' : '#bfdbfe';
          const textColor = type === 'reminder' ? 'white' : 'black';

          return (
            <div
              className="p-1 rounded"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '0.875rem',
                lineHeight: '1.25rem',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              <strong>{event.title}</strong>
              {firstLine && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {firstLine}
                </div>
              )}
            </div>
          );
        }}
        height="auto"
      />

      {/* Add Reminder Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Reminder for {selectedDate}</h2>
            <input
              type="text"
              placeholder="Reminder Title"
              className="w-full border border-gray-300 rounded-md p-2 mb-3"
              value={reminderTitle}
              onChange={(e) => setReminderTitle(e.target.value)}
            />
            <textarea
              placeholder="Reminder Description"
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
              value={reminderDescription}
              onChange={(e) => setReminderDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                onClick={handleReminderSubmit}
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Reminder or Interview Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">{isEditing ? 'Edit Reminder' : selectedEvent.title}</h2>
            <p className="text-sm text-gray-500 mb-1">📅 {selectedEvent.date}</p>
            {selectedEvent.time && <p className="text-sm text-gray-500 mb-2">🕒 {selectedEvent.time}</p>}

            {isEditing ? (
              <>
                <input
                  type="text"
                  className="w-full border p-2 mb-2 rounded"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                />
                <textarea
                  rows={3}
                  className="w-full border p-2 mb-4 rounded"
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                />
              </>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
            )}

            <div className="flex justify-end mt-4 gap-2">
              {selectedEvent.type === 'reminder' && !isEditing && (
                <>
                  <button
                    className="px-3 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                    onClick={() => {
                      setReminderTitle(selectedEvent.title);
                      setReminderDescription(selectedEvent.description);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                    onClick={handleDeleteReminder}
                  >
                    Delete
                  </button>
                </>
              )}
              {isEditing ? (
                <button
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                  onClick={handleUpdateReminder}
                >
                  Save
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
