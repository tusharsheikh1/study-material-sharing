import { useEffect, useState, useContext } from 'react';
import { FiUserPlus, FiUsers, FiMail, FiPhone, FiKey } from 'react-icons/fi';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../utils/api';
import ConfirmationPopup from '../components/ConfirmationPopup';
import AuthContext from '../context/AuthContext';

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'student',
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin');
        setUsers(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin', formData);
      setUsers([...users, response.data.user]);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditingUserId(user._id);
    setShowForm(true);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      password: '',
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/admin/${editingUserId}`, formData);
      setUsers(users.map((user) => (user._id === editingUserId ? response.data.user : user)));
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleCreateNewUser = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setShowForm(true);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'student',
      password: '',
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'student',
      password: '',
    });
  };

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/${userToDelete}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setShowPopup(false);
      setUserToDelete(null);
    }
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '';
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        ❌ Access Denied: Only admins can manage users.
      </div>
    );
  }

  if (loading) return <p className="text-gray-600 text-center">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <FiUsers /> User Management
        </h1>
        <button
          onClick={handleCreateNewUser}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all duration-200"
        >
          <FiUserPlus /> Create New User
        </button>
      </div>

      {/* Form */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          showForm ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <form
          onSubmit={isEditing ? handleUpdateUser : handleAddUser}
          className="bg-white rounded-xl shadow-lg p-6 mt-4 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <FiUsers className="text-gray-500" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-gray-500" />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="student">Student</option>
              <option value="cr">CR</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex items-center gap-2 md:col-span-2">
              <FiKey className="text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required={!isEditing}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <button
              type="submit"
              className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-lg text-white shadow-lg transition duration-200 ${
                isEditing
                  ? 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
                  : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800'
              }`}
            >
              {isEditing ? 'Update User' : 'Add User'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Profile</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found. Click "Create New User" to add one.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold">
                      {getInitials(user.fullName)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{user.fullName}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded font-medium ${
                        user.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : user.role === 'faculty'
                          ? 'bg-green-100 text-green-800'
                          : user.role === 'cr'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      title="Edit"
                      onClick={() => handleEditUser(user)}
                      className="text-yellow-500 hover:text-yellow-600 transition"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleDeleteClick(user._id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationPopup
        isOpen={showPopup}
        message="Are you sure you want to delete this user?"
        onConfirm={confirmDelete}
        onCancel={() => setShowPopup(false)}
      />
    </div>
  );
};

export default UserManagement;
