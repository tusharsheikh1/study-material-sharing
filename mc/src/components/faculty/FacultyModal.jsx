import FacultyForm from "./FacultyForm";
import { motion, AnimatePresence } from "framer-motion";

const FacultyModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-6 relative"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {initialData ? "Edit Faculty" : "Add New Faculty"}
            </h2>
            <FacultyForm
              initialData={initialData}
              isEditing={!!initialData}
              onSuccess={() => {
                onClose();
                onSuccess();
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FacultyModal;
