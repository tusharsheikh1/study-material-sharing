import { FaEdit, FaTrash, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const FacultyCard = ({ faculty, onEdit, onDelete }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-900/80 border border-blue-100 dark:border-gray-800 backdrop-blur-md shadow-xl rounded-3xl p-6 text-center space-y-4 transition transform hover:scale-[1.025] hover:shadow-2xl">
      <img
        src={faculty.photoUrl}
        alt={faculty.name}
        className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-400 dark:border-blue-600 shadow-md"
      />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {faculty.name}
      </h3>
      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
        {faculty.designation}
      </p>

      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <a
          href={`mailto:${faculty.email}`}
          className="flex items-center justify-center gap-2 hover:underline hover:text-blue-600 transition"
        >
          <FaEnvelope className="text-blue-500 dark:text-blue-400" /> {faculty.email}
        </a>
        <a
          href={`tel:${faculty.phone}`}
          className="flex items-center justify-center gap-2 hover:underline hover:text-green-600 transition"
        >
          <FaPhoneAlt className="text-green-600 dark:text-green-400" /> {faculty.phone}
        </a>
      </div>

      <div className="flex justify-center gap-6 pt-2">
        <button
          onClick={() => onEdit(faculty)}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 transition"
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(faculty._id)}
          className="text-red-500 hover:text-red-700 transition"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default FacultyCard;
