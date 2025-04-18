import React from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const MaterialUploadForm = ({
  formData,
  courses,
  semesterOptions,
  batchOptions,
  uploading,
  uploadProgress,
  handleChange,
  handleFileChange,
  handleSubmit,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white via-slate-50 to-blue-50 p-10 rounded-3xl shadow-2xl border border-gray-200 space-y-8"
    >
      <h3 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
        <FiUploadCloud className="text-4xl" /> Upload Study Material
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Material Type</label>
          <select
            name="materialType"
            value={formData.materialType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Type</option>
            <option value="class_note">Class Note</option>
            <option value="previous_question">Previous Year Question</option>
            <option value="book">Book</option>
            <option value="slide">Slide</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Course</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Semester</option>
            {semesterOptions.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Batch</label>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Batch</option>
            {batchOptions.map((batch) => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Upload File</label>
        <input
          type="file"
          onChange={handleFileChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl file:bg-blue-100 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-3 transition-all duration-300 ease-in-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 transition duration-200"
      >
        {uploading ? 'Uploading...' : 'Upload Material'}
      </button>

      {!uploading && uploadProgress === 100 && (
        <p className="text-green-600 text-sm font-medium text-center mt-4 animate-fade-in">
          ✅ Material uploaded successfully!
        </p>
      )}
    </form>
  );
};

export default MaterialUploadForm;
