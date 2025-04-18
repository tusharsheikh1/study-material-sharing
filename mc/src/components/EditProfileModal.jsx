import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    semester: user.semester || '',
    batch: user.batch || '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || '');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('fullName', form.fullName);
    data.append('semester', form.semester);
    data.append('batch', form.batch);
    if (image) data.append('image', image);

    try {
      setSubmitting(true);
      const res = await api.put('/users/update-profile', data);
      toast.success('Profile updated!');
      if (onUpdate) onUpdate(res.data.user);
      onClose();
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Semester</label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            >
              <option value="">Select Semester</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Batch</label>
            <select
              name="batch"
              value={form.batch}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl"
            >
              <option value="">Select Batch</option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Batch {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 mt-2 rounded-full object-cover border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
