import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const UserApproval = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get('/users');
      const unapproved = res.data.filter((user) => !user.approved);
      setUsers(unapproved);
    } catch (err) {
      toast.error('Failed to load users');
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
      toast.success('User approved');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success('User rejected & removed');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error('Failed to reject user');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">🚦 Pending User Approvals</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-green-500">✅ No pending approvals.</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl border border-gray-200 shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">{user.fullName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600 capitalize">Role: {user.role}</p>
                <p className="text-sm text-gray-500">Semester: {user.semester} | Batch: {user.batch}</p>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleApprove(user._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Reject
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
