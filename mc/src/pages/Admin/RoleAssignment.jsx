import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const RoleAssignment = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      const students = res.data.filter((u) => u.role === 'student' && u.approved);
      setUsers(students);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await api.patch(`/users/role/${id}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) => prev.filter((u) => u._id !== id)); // Remove from list
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">🎓 Promote Student to CR / Faculty</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading approved students...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-green-500">✅ No students available for promotion.</p>
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
                <p className="text-sm text-gray-500">Semester: {user.semester} | Batch: {user.batch}</p>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleChangeRole(user._id, 'cr')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Promote to CR
                </button>
                <button
                  onClick={() => handleChangeRole(user._id, 'faculty')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Promote to Faculty
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleAssignment;
