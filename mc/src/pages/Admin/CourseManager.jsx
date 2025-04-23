import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import GlobalSpinner from '../../components/GlobalSpinner';
import ConfirmationPopup from '../../components/ConfirmationPopup';
import { ImSpinner8 } from 'react-icons/im';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseCode: '', courseName: '', semester: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    courseId: null,
    loading: false,
  });
  const [expandedSemesters, setExpandedSemesters] = useState({});

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      toast.error('❌ Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/courses', form);
      toast.success('✅ Course added successfully');
      setForm({ courseCode: '', courseName: '', semester: '' });
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to add course');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setConfirmDelete((prev) => ({ ...prev, loading: true }));
    try {
      await api.delete(`/courses/${confirmDelete.courseId}`);
      toast.success('✅ Course deleted successfully'); // ✅ Success popup
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to delete course');
    } finally {
      setConfirmDelete({ isOpen: false, courseId: null, loading: false });
    }
  };

  const toggleSemester = (sem) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [sem]: !prev[sem],
    }));
  };

  const groupedCourses = {};
  courses.forEach((course) => {
    const sem = course.semester;
    if (!groupedCourses[sem]) groupedCourses[sem] = [];
    groupedCourses[sem].push(course);
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold">📘 Course Manager</h1>

      {loading ? (
        <GlobalSpinner />
      ) : (
        <>
          {/* Add Course Form */}
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700"
          >
            <input
              type="text"
              name="courseCode"
              placeholder="Course Code (e.g. CSE301)"
              value={form.courseCode}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              value={form.courseName}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            >
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
              ))}
            </select>
            <button
              type="submit"
              className="md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              disabled={adding}
            >
              {adding && <ImSpinner8 className="animate-spin" />} Add Course
            </button>
          </form>

          {/* Toggleable Semester Groups */}
          {[...Array(8)].map((_, i) => {
            const sem = i + 1;
            const coursesInSem = groupedCourses[sem] || [];
            const isOpen = expandedSemesters[sem] || false;

            return (
              <div key={sem} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow">
                <button
                  onClick={() => toggleSemester(sem)}
                  className="w-full flex items-center justify-between px-5 py-3 text-lg font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <span>📂 Semester {sem}</span>
                  <span>{isOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                </button>

                {isOpen && (
                  <div className="p-4 bg-white dark:bg-gray-900 space-y-3">
                    {coursesInSem.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No courses in this semester.</p>
                    ) : (
                      coursesInSem.map((course) => (
                        <div
                          key={course._id}
                          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-2"
                        >
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {course.courseCode} - {course.courseName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Semester: {course.semester}</p>
                          </div>
                          <button
                            onClick={() =>
                              setConfirmDelete({ isOpen: true, courseId: course._id, loading: false })
                            }
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Confirmation Popup with Spinner */}
      <ConfirmationPopup
        isOpen={confirmDelete.isOpen}
        loading={confirmDelete.loading}
        message="This course will be permanently removed. Are you sure?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ isOpen: false, courseId: null, loading: false })}
      />
    </div>
  );
};

export default CourseManager;
