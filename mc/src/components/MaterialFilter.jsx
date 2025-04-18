import { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Filter, Layers, GraduationCap, BookOpenCheck, ScrollText } from 'lucide-react';

const MaterialFilter = ({ filters, setFilters }) => {
  const [courses, setCourses] = useState([]);
  const batchOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses:', err.message);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 space-y-6"
    >
      <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
        <Filter className="w-5 h-5 text-blue-500" /> Filter Materials
      </h3>

      {/* Semester */}
      <div>
        <label htmlFor="semester" className="block text-sm font-medium text-gray-600 flex items-center gap-1">
          <GraduationCap className="w-4 h-4" /> Semester
        </label>
        <select
          id="semester"
          name="semester"
          value={filters.semester}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-2 border rounded-xl bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Batch */}
      <div>
        <label htmlFor="batch" className="block text-sm font-medium text-gray-600 flex items-center gap-1">
          <Layers className="w-4 h-4" /> Batch
        </label>
        <select
          id="batch"
          name="batch"
          value={filters.batch}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-2 border rounded-xl bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {batchOptions.map((batch) => (
            <option key={batch} value={batch}>
              Batch {batch}
            </option>
          ))}
        </select>
      </div>

      {/* Course */}
      <div>
        <label htmlFor="courseId" className="block text-sm font-medium text-gray-600 flex items-center gap-1">
          <BookOpenCheck className="w-4 h-4" /> Course
        </label>
        <select
          id="courseId"
          name="courseId"
          value={filters.courseId}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-2 border rounded-xl bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseCode} - {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {/* Material Type */}
      <div>
        <label htmlFor="materialType" className="block text-sm font-medium text-gray-600 flex items-center gap-1">
          <ScrollText className="w-4 h-4" /> Material Type
        </label>
        <select
          id="materialType"
          name="materialType"
          value={filters.materialType}
          onChange={handleChange}
          className="w-full mt-2 px-4 py-2 border rounded-xl bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All</option>
          <option value="slide">Slide</option>
          <option value="book">Book</option>
          <option value="class_note">Class Note</option>
          <option value="previous_question">Previous Year Question</option>
        </select>
      </div>
    </motion.div>
  );
};

export default MaterialFilter;
