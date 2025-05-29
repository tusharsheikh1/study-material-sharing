import React from "react";

const CreatePostModal = ({ visible, onClose, onSubmit, text, setText }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Create New Post</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none dark:bg-gray-700 dark:text-white"
          rows={4}
        />
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
