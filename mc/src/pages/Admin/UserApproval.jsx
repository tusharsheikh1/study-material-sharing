import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import GlobalSpinner from '../../components/GlobalSpinner';
import { CheckCircle, XCircle, Phone, User } from 'lucide-react';

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const UserApproval = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      const unapproved = res.data.filter((user) => !user.approved);
      setUsers(unapproved);
    } catch (err) {
      toast.error('❌ Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/users/approve/${id}`);
      toast.success('✅ User approved');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error('❌ Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success('✅ User rejected & removed');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error('❌ Failed to reject user');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">🚦 Pending User Approvals</h1>

      {loading ? (
        <GlobalSpinner />
      ) : users.length === 0 ? (
        <p className="text-center text-green-500 dark:text-green-400">✅ No pending approvals.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition hover:shadow-xl"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  getInitials(user.fullName)
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.fullName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.studentId}</p>
                {user.phoneNumber && (
                  <a
                    href={`tel:${user.phoneNumber}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                  >
                    <Phone size={14} /> {user.phoneNumber}
                  </a>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  <span className="bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-white px-2 py-0.5 rounded-md">
                    Role: {user.role}
                  </span>
                  <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-white px-2 py-0.5 rounded-md">
                    Semester: {user.semester}
                  </span>
                  <span className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-white px-2 py-0.5 rounded-md">
                    Batch: {user.batch}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserApproval;
