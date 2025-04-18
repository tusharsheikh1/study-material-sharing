import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AllMaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchFilter, setBatchFilter] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/materials');
      setMaterials(res.data);
    } catch (err) {
      toast.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await api.delete(`/materials/${id}`);
      toast.success('Material deleted');
      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const batchOptions = Array.from({ length: 100 }, (_, i) => i + 1);
  const filteredMaterials = batchFilter
    ? materials.filter((mat) => String(mat.batch) === String(batchFilter))
    : materials;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📂 All Uploaded Materials</h1>

      {/* Batch Filter */}
      <div className="mb-4">
        <label htmlFor="batchFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Batch
        </label>
        <select
          id="batchFilter"
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Batches</option>
          {batchOptions.map((batch) => (
            <option key={batch} value={batch}>
              Batch {batch}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading materials...</p>
      ) : filteredMaterials.length === 0 ? (
        <p className="text-center text-green-500">✅ No materials found for selected batch.</p>
      ) : (
        <div className="space-y-4">
          {filteredMaterials.map((mat) => (
            <div
              key={mat._id}
              className="bg-white border border-gray-200 rounded-xl shadow p-5 flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-lg font-semibold text-gray-800">
                  {mat.courseId?.courseCode} - {mat.courseId?.courseName}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  Uploaded by: {mat.uploadedBy?.role} - {mat.uploadedBy?.fullName}
                </p>
                <p className="text-sm text-gray-500">Type: {mat.materialType}</p>
                <p className="text-sm text-gray-500">
                  Semester: {mat.semester || 'N/A'} | Batch: {mat.batch || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Uploaded: {new Date(mat.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(mat._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMaterialManagement;
