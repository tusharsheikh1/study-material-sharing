// /src/components/staff/StaffCard.jsx
import { FaEdit, FaTrash, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const StaffCard = ({ staff, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 text-center transition-transform hover:scale-[1.02] duration-300 space-y-4">
      {/* Profile Image */}
      <img
        src={staff.photoUrl}
        alt={staff.name}
        className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-md"
      />

      {/* Name */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        {staff.name}
      </h3>

      {/* Designation Badge */}
      <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full shadow-sm">
        <span className="inline-block mr-2">
          <svg
            className="w-4 h-4 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 9a3 3 0 106 0 3 3 0 00-6 0zM6 3a2 2 0 00-2 2v1.586A1.5 1.5 0 004.293 8.5L2 10.793V13h16v-2.207l-2.293-2.293A1.5 1.5 0 0016 6.586V5a2 2 0 00-2-2H6z" />
          </svg>
        </span>
        {staff.designation}
      </div>

      {/* Contact Buttons */}
      <div className="flex justify-center gap-4 mt-3">
        <a
          href={`mailto:${staff.email}`}
          title="Email"
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
        >
          <FaEnvelope className="w-4 h-4" />
        </a>
        <a
          href={`tel:${staff.phone}`}
          title="Phone"
          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
        >
          <FaPhoneAlt className="w-4 h-4" />
        </a>
      </div>

      {/* Admin Controls (optional) */}
      {onEdit && onDelete && (
        <div className="flex justify-center gap-6 pt-3">
          <button
            onClick={() => onEdit(staff)}
            className="text-blue-600 hover:text-blue-800 transition"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(staff._id)}
            className="text-red-500 hover:text-red-700 transition"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffCard;
