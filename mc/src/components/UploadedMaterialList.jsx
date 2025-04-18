import React, { useState } from 'react';
import { FiFileText, FiTrash2 } from 'react-icons/fi';

const UploadedMaterialList = ({ uploads, userId, deleting, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(uploads.length / itemsPerPage);
  const paginatedUploads = uploads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (uploads.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <FiFileText className="mx-auto text-6xl mb-2" />
        <p className="text-lg">No uploads found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">📄 Title</th>
              <th className="px-6 py-4 text-left">🗂 Type</th>
              <th className="px-6 py-4 text-left">📘 Course</th>
              <th className="px-6 py-4 text-left">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedUploads.map((upload) => (
              <tr key={upload._id} className="hover:bg-blue-50 transition-all duration-150">
                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                  {upload.title || 'Untitled'}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {upload.materialType.replace('_', ' ').toUpperCase()}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {upload.courseId?.courseName || 'N/A'}
                </td>
                <td className="px-6 py-4 flex gap-4 items-center">
                  <a
                    href={upload.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    🔗 View
                  </a>
                  {(upload.uploadedBy?._id || upload.uploadedBy) === userId && (
                    <button
                      onClick={() => onDelete(upload._id)}
                      className={`text-red-500 hover:text-red-600 transition ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={deleting}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadedMaterialList;