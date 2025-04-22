import React, { useState, useEffect, useContext } from 'react';
import { FiDownload, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const typeLabel = {
  slide: '🍝 Slides',
  book: '📚 Books',
  class_note: '📝 Notes',
  previous_question: '📄 PYQs',
};

const groupByCourse = (materials) => {
  const grouped = {};
  for (const mat of materials) {
    const courseId = mat.courseId?._id;
    if (!grouped[courseId]) grouped[courseId] = [];
    grouped[courseId].push(mat);
  }
  return grouped;
};

const groupByType = (materials) => {
  const grouped = {
    slide: [],
    book: [],
    class_note: [],
    previous_question: [],
  };
  for (const mat of materials) {
    if (grouped[mat.materialType]) {
      grouped[mat.materialType].push(mat);
    }
  }
  return grouped;
};

const BASE_URL = api.defaults.baseURL.replace('/api', '');

// ✅ Final simplified downloader
const handleMaterialDownload = (id) => {
  window.open(`${BASE_URL}/api/materials/download/${id}`, '_blank');
};

const MaterialTable = ({ materials, currentUserId, onToggleStatus }) => {
  if (!materials || materials.length === 0)
    return <div className="text-gray-500 px-6 py-4">No materials found.</div>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
        <thead className="bg-blue-50 dark:bg-gray-800 border-b-2 border-blue-200 dark:border-gray-700 sticky top-0 z-10">
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-200">
            <th className="px-6 py-4 w-2/5">File Name</th>
            <th className="px-6 py-4 text-center w-1/5">Action</th>
            <th className="px-6 py-4 text-center w-1/5">Status</th>
            <th className="px-6 py-4 w-1/5">Uploader</th>
            <th className="px-6 py-4 w-1/5">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {materials.map((mat, index) => (
            <motion.tr
              key={mat._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-200"
            >
              <td className="px-6 py-4 break-words max-w-md font-medium text-gray-900 dark:text-gray-100">
                {mat.title || mat.originalFilename || 'Untitled'}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleMaterialDownload(mat._id)}
                    className="flex justify-center"
                  >
                    <span className="md:hidden p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                      <FiDownload className="text-lg" />
                    </span>
                    <span className="hidden md:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs shadow">
                      <FiDownload /> Download
                    </span>
                  </button>
                  <a
                    href={`/preview?url=${encodeURIComponent(mat.fileUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="md:hidden p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition">
                      👁️
                    </span>
                    <span className="hidden md:inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-xs shadow">
                      👁️ View Doc
                    </span>
                  </a>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onToggleStatus(mat._id)}
                  className={`text-xs px-3 py-1 rounded-full transition font-medium flex items-center justify-center gap-1 mx-auto ${
                    mat.completedBy?.includes(currentUserId)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                  }`}
                >
                  <FiCheckCircle />
                  {mat.completedBy?.includes(currentUserId) ? 'Completed' : 'Mark Done'}
                </button>
              </td>
              <td className="px-6 py-4">
                <span className="block font-medium capitalize">{mat.uploadedBy?.role}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{mat.uploadedBy?.fullName}</span>
              </td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDate(mat.createdAt)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MaterialList = ({ materials }) => {
  const { user } = useContext(AuthContext);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [localMaterials, setLocalMaterials] = useState(materials);

  useEffect(() => {
    setLocalMaterials(materials);
  }, [materials]);

  const toggleCourseExpand = (courseId) => {
    setExpandedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  const handleTypeSelect = (courseId, typeKey) => {
    setSelectedTypes((prev) => ({ ...prev, [courseId]: typeKey }));
  };

  const toggleCompletion = async (materialId) => {
    try {
      await api.put(`/materials/toggle-status/${materialId}`);
      const updated = localMaterials.map((m) => {
        if (m._id === materialId) {
          const isCompleted = m.completedBy?.includes(user._id);
          const updatedCompletedBy = isCompleted
            ? m.completedBy.filter((id) => id !== user._id)
            : [...(m.completedBy || []), user._id];
          return { ...m, completedBy: updatedCompletedBy };
        }
        return m;
      });
      setLocalMaterials(updated);
    } catch (error) {
      console.error('Failed to toggle material status:', error);
    }
  };

  const groupedMaterials = groupByCourse(localMaterials);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMaterials).slice(0, 5).map(([courseId, courseMaterials], idx) => {
        const course = courseMaterials[0]?.courseId;
        const groupedByType = groupByType(courseMaterials);
        const selectedType = selectedTypes[courseId] || 'slide';
        const isOpen = expandedCourseId === courseId;

        return (
          <div
            key={courseId}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleCourseExpand(courseId)}
              className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 text-left group"
            >
              <h2 className="text-lg font-semibold text-blue-800 dark:text-white">
                {`Course ${idx + 1}: ${course?.courseCode} - ${course?.courseName}`}
              </h2>
              <FiChevronDown
                className={`transform text-xl text-blue-800 dark:text-white transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
                    <div className="md:order-2 w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[13px] sm:text-sm font-medium text-gray-700 dark:text-gray-300 px-3 sm:px-0">
                      <div className="flex-1">
                        🟡 Total: {courseMaterials.length} files | ✅{' '}
                        {courseMaterials.filter((m) => m.completedBy?.includes(user?._id)).length} done | ⏳{' '}
                        {courseMaterials.filter((m) => !m.completedBy?.includes(user?._id)).length} left
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-3">
                        {Object.entries(groupByType(courseMaterials)).map(([type, list]) => (
                          <span key={type}>
                            {typeLabel[type]}: {list.length}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3 md:order-1 px-3 sm:px-0">
                      {Object.entries(typeLabel).map(([typeKey, label]) => (
                        <button
                          key={typeKey}
                          onClick={() => handleTypeSelect(courseId, typeKey)}
                          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition shadow-sm ${
                            selectedType === typeKey
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <MaterialTable
                    materials={groupedByType[selectedType]}
                    currentUserId={user._id}
                    onToggleStatus={toggleCompletion}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default MaterialList;
