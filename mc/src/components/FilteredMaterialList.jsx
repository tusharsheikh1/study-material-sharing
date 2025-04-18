import React, { useState } from 'react';

const formatDate = (dateStr) => {
  if (!dateStr || isNaN(new Date(dateStr).getTime())) return 'Unknown Date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

const typeLabel = {
  slide: '📽 Slide',
  book: '📚 Book',
  class_note: '📝 Class Note',
  previous_question: '📄 Previous Year',
};

const ITEMS_PER_PAGE = 10;

const FilteredMaterialList = ({ materials }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!materials || materials.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 text-center text-gray-500">
        No filtered materials found.
      </div>
    );
  }

  const totalPages = Math.ceil(materials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMaterials = materials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  return (
    <div className="space-y-2 overflow-x-auto">
      {/* ✅ Total Results */}
      <div className="text-sm text-gray-600 px-1">
        Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, materials.length)} of {materials.length} results
      </div>

      {/* ✅ Table for all devices */}
      <table className="min-w-full text-sm text-gray-800 bg-white rounded-2xl shadow border border-gray-200">
        <thead className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">File Name</th>
            <th className="px-4 py-3 text-left md:hidden">Action</th> {/* Mobile Action */}
            <th className="px-4 py-3 text-left">Course</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Uploader</th>
            <th className="px-4 py-3 text-left">Uploaded On</th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Action</th> {/* Desktop Action */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentMaterials.map((mat) => (
            <tr key={mat._id} className="hover:bg-gray-50 transition">
              {/* File Name */}
              <td className="px-4 py-3 font-medium">{mat.title || 'Untitled File'}</td>

              {/* Mobile Action Button */}
              <td className="px-4 py-3 md:hidden">
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded transition"
                >
                  Download
                </a>
              </td>

              {/* Course */}
              <td className="px-4 py-3">
                {mat.courseId?.courseCode} - {mat.courseId?.courseName}
              </td>

              {/* Type */}
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {typeLabel[mat.materialType] || '📁 File'}
                </span>
              </td>

              {/* Uploader */}
              <td className="px-4 py-3">
                {mat.uploadedBy?.fullName}
                <br />
                <span className="text-gray-500 capitalize text-xs">{mat.uploadedBy?.role}</span>
              </td>

              {/* Uploaded On */}
              <td className="px-4 py-3">{formatDate(mat.createdAt)}</td>

              {/* Desktop Action Button */}
              <td className="px-4 py-3 hidden md:table-cell">
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded transition"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          ⬅ Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default FilteredMaterialList;
