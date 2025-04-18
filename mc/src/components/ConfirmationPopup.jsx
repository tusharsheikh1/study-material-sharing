import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ConfirmationPopup = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 transform transition-all scale-100">
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-4">
          <FiAlertCircle className="text-red-600 text-3xl" />
          <h2 className="text-xl font-semibold text-gray-800">Are You Sure?</h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 mt-4 text-sm leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;