import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import GlobalSpinner from '../../components/GlobalSpinner'; // ✅ Import spinner

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseCode: '', courseName: '', semester: '' });
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const fetchCourses = async () => {
    setLoading(true); // ✅ Start spinner
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      toast.error('❌ Failed to load courses');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false); // ✅ Stop spinner
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
    try {
      await api.post('/courses', form);
      toast.success('✅ Course added');
      setForm({ courseCode: '', courseName: '', semester: '' });
      fetchCourses();
    } catch (err) {
      console.error('Add error:', err);
      toast.error(err.response?.data?.message || '❌ Failed to add course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('✅ Course deleted');
      fetchCourses();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || '❌ Failed to delete course');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold">📘 Course Manager</h1>

      {loading ? (
        <GlobalSpinner /> // ✅ Full-page spinner
      ) : (
        <>
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
              className="md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Course
            </button>
          </form>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 space-y-3">
            <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">📋 All Courses</h2>
            {courses.map((course) => (
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
                  onClick={() => handleDelete(course._id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseManager;
