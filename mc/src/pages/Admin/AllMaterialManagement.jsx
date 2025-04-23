import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getMaterials } from '../../utils/api';
import api from '../../utils/api';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import GlobalSpinner from '../../components/GlobalSpinner'; // ✅ Added

const AllMaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await getMaterials();
      setMaterials(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await api.delete(`/materials/${id}`);
      toast.success('✅ Material deleted');
      fetchMaterials();
    } catch (err) {
      toast.error('❌ Delete failed');
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const groupMaterials = () => {
    const grouped = {};
    materials.forEach((mat) => {
      const batch = `Batch ${mat.batch}`;
      const semester = `Semester ${mat.semester}`;
      const type = mat.materialType;

      if (!grouped[batch]) grouped[batch] = {};
      if (!grouped[batch][semester]) grouped[batch][semester] = {};
      if (!grouped[batch][semester][type]) grouped[batch][semester][type] = [];

      grouped[batch][semester][type].push(mat);
    });
    return grouped;
  };

  const groupedMaterials = groupMaterials();

  const Chevron = ({ isOpen }) => (
    <span className="transition-transform duration-300">
      {isOpen ? <FaChevronDown /> : <FaChevronRight />}
    </span>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8">📚 Study Material Manager</h1>

      {loading ? (
        <GlobalSpinner /> // ✅ Global spinner used
      ) : Object.keys(groupedMaterials).length === 0 ? (
        <p className="text-center text-green-500 dark:text-green-400">✅ No materials found.</p>
      ) : (
        Object.entries(groupedMaterials).map(([batch, semesters]) => (
          <div key={batch} className="mb-6 border border-blue-300 dark:border-blue-800 rounded-lg overflow-hidden shadow">
            <button
              onClick={() => toggle(batch)}
              className="w-full flex items-center justify-between px-5 py-3 text-xl font-semibold bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
            >
              <span>📁 {batch}</span>
              <Chevron isOpen={expanded[batch]} />
            </button>

            {expanded[batch] &&
              Object.entries(semesters).map(([semester, types]) => {
                const semesterKey = `${batch}-${semester}`;
                return (
                  <div key={semesterKey} className="ml-4 border-l-2 border-blue-400 dark:border-blue-700">
                    <button
                      onClick={() => toggle(semesterKey)}
                      className="w-full flex items-center justify-between px-6 py-2 text-lg font-medium bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition"
                    >
                      <span>📂 {semester}</span>
                      <Chevron isOpen={expanded[semesterKey]} />
                    </button>

                    {expanded[semesterKey] &&
                      Object.entries(types).map(([type, mats]) => {
                        const typeKey = `${semesterKey}-${type}`;
                        return (
                          <div key={typeKey} className="ml-6 border-l-2 border-yellow-400 dark:border-yellow-600">
                            <button
                              onClick={() => toggle(typeKey)}
                              className="w-full flex items-center justify-between px-7 py-2 text-md font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                              <span>📄 {type.replace('_', ' ').toUpperCase()} <span className="ml-2 text-sm text-gray-500">({mats.length})</span></span>
                              <Chevron isOpen={expanded[typeKey]} />
                            </button>

                            {expanded[typeKey] && (
                              <div className="ml-5 mt-2 space-y-4">
                                {mats.map((mat) => (
                                  <div
                                    key={mat._id}
                                    className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:shadow-lg transition"
                                  >
                                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                      {mat.courseId?.courseCode} — {mat.courseId?.courseName}
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-sm">
                                      <div className="text-gray-600 dark:text-gray-400">
                                        👤 {mat.uploadedBy?.fullName}{' '}
                                        <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs uppercase">
                                          {mat.uploadedBy?.role}
                                        </span>
                                      </div>
                                      <div className="text-gray-500 dark:text-gray-400">
                                        🕒 {new Date(mat.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                      <a
                                        href={mat.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm transition"
                                      >
                                        View
                                      </a>
                                      <button
                                        onClick={() => handleDelete(mat._id)}
                                        className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 text-sm transition"
                                      >
                                        🗑️ Delete
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </div>
        ))
      )}
    </div>
  );
};

export default AllMaterialManagement;
