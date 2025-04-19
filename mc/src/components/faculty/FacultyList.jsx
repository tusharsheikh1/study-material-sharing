import { useEffect, useState } from "react";
import axios from "../../utils/api";
import FacultyCard from "./FacultyCard";
import FacultyModal from "./FacultyModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const FacultyList = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("/faculty");
      setFacultyList(res.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;
    try {
      await axios.delete(`/faculty/${id}`);
      fetchFaculty();
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  const handleEdit = (faculty) => {
    setEditingFaculty(faculty);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setEditingFaculty(null);
    setShowForm(false);
    fetchFaculty();
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
            Faculty Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You have <strong>{facultyList.length}</strong> faculty member{facultyList.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingFaculty(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg transition"
        >
          <FaPlus className="text-sm" />
          Add Faculty
        </button>
      </div>

      {/* Modal Form */}
      <FacultyModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        initialData={editingFaculty}
        onSuccess={handleSuccess}
      />

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {facultyList.map((faculty, index) => (
            <motion.div
              key={faculty._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FacultyCard
                faculty={faculty}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FacultyList;
