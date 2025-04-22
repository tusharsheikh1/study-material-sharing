// /src/components/staff/StaffList.jsx
import { useEffect, useState } from "react";
import axios from "../../utils/api";
import StaffCard from "./StaffCard";
import StaffModal from "./StaffModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("/staff");
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await axios.delete(`/staff/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setEditingStaff(null);
    setShowForm(false);
    fetchStaff();
  };

  useEffect(() => {
    fetchStaff();
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
            Office & Staff Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You have <strong>{staffList.length}</strong> staff member{staffList.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingStaff(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg transition"
        >
          <FaPlus className="text-sm" />
          Add Staff
        </button>
      </div>

      {/* Modal Form */}
      <StaffModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        initialData={editingStaff}
        onSuccess={handleSuccess}
      />

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {staffList.map((staff, index) => (
            <motion.div
              key={staff._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <StaffCard
                staff={staff}
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

export default StaffList;
