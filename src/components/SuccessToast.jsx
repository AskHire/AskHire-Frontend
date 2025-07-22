// components/SuccessToast.jsx
import React, { useEffect } from "react";

export default function SuccessToast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose && onClose(); // auto close
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed z-50 px-4 py-2 text-blue-800 bg-blue-100 border border-blue-300 rounded-lg shadow-lg top-4 right-4 animate-slide-in-out">
      <strong className="font-medium">Success!</strong> {message}
    </div>
  );
}
