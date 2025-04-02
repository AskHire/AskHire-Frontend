import React, { useState } from "react";

const CreateNotification = () => {
  const [formData, setFormData] = useState({
    message: "",
    time: "", // Format: YYYY-MM-DDTHH:MM (ISO format)
    type: "",
    subject: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the notification object to send to the backend
    const notificationData = {
      message: formData.message,
      time: formData.time, // Ensure time is in valid ISO format
      type: formData.type,
      subject: formData.subject,
    };

    try {
      const response = await fetch("https://localhost:7195/api/Notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit notification: ${errorText}`);
      }

      const data = await response.json();
      console.log("Notification added:", data);
      alert("Notification added successfully!");
    } catch (error) {
      console.error("Error submitting notification:", error);
      alert("Failed to add notification. " + error.message);
    }
  };

  return (
    <div>
      <h2>Create Notification</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Time:
          <input
            type="datetime-local"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Submit Notification</button>
      </form>
    </div>
  );
};

export default CreateNotification;
