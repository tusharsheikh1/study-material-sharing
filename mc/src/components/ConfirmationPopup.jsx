import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { ImSpinner8 } from 'react-icons/im';

const ConfirmationPopup = ({ isOpen, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 transform transition-all scale-100">
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-4">
          <FiAlertCircle className="text-red-600 text-3xl" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Are You Sure?</h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
          >
            {loading && <ImSpinner8 className="animate-spin text-lg" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
