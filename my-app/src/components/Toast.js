// src/components/Toast.js
import { useEffect } from "react";

export default function Toast({ message, isVisible, onClose }) {
  // Automatically hide toast after 2 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose(); // Close toast after 2 seconds
      }, 2000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
      {message}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s, fadeOut 0.5s 1.5s; /* Fade in/out effect */
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }
      `}
      </style>
    </div>
  );
}
