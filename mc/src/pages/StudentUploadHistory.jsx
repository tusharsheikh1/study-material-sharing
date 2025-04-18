import { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { FiTrash2 } from 'react-icons/fi';

const StudentUploadHistory = () => {
  const { user } = useContext(AuthContext);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUploads = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/materials?uploadedBy=${user._id}`);
      setUploads(res.data);
    } catch (err) {
      console.error('Failed to fetch uploads:', err);
      setError('Failed to fetch uploads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteUpload = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await api.delete(`/materials/${id}`);
      setUploads((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete upload:', err);
      alert('Failed to delete upload. Please try again.');
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUploads();
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">📄 Your Uploaded Materials</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading your uploads...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : uploads.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't uploaded any materials yet.</p>
      ) : (
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div
              key={upload._id}
              className="bg-white p-4 rounded-lg border shadow flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  {upload.title || 'Uploaded File'}
                </p>
                <p className="text-sm text-gray-600">
                  {upload.materialType.replace('_', ' ').toUpperCase()} •{' '}
                  {upload.courseId?.courseName || 'Unknown Course'}
                </p>
                <p className="text-sm text-gray-500">
                  Semester: {upload.semester} | Batch: {upload.batch}
                </p>
                <a
                  href={upload.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View File
                </a>
              </div>
              <button
                onClick={() => deleteUpload(upload._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentUploadHistory;
