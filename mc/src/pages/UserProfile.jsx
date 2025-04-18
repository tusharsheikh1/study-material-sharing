import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { FiUser, FiEdit } from 'react-icons/fi';
import EditProfileModal from '../components/EditProfileModal';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);

  if (!user) {
    return <div className="text-center text-gray-500 py-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-300 shadow-xl">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-5xl font-extrabold">
                  {user.fullName?.charAt(0).toUpperCase() || <FiUser />}
                </div>
              )}
              <div
                className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow"
                title="Online"
              ></div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
                {user.fullName}
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                  ✅ Verified
                </span>
              </h2>
              <p className="text-md text-gray-600">{user.email}</p>

              <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full shadow-sm">
                  🎓 Role: {user.role}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full shadow-sm">
                  📘 Semester: {user.semester || 'N/A'}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full shadow-sm">
                  🧑‍🎓 Batch: {user.batch || 'N/A'}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center gap-3 mt-6 md:mt-0">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <FiEdit />
                Edit Info
              </button>
              <button
                onClick={() => setShowSemesterModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                🎯 Change Semester
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {showSemesterModal && (
        <EditProfileModal
          user={user}
          onlySemester={true} // 🚀 Important flag
          onClose={() => setShowSemesterModal(false)}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );
};

export default UserProfile;
