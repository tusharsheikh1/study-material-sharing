import { useEffect, useState } from 'react';
import MaterialFilter from '../components/MaterialFilter';
import FilteredMaterialList from '../components/FilteredMaterialList';
import api from '../utils/api';

const FindMaterials = () => {
  const [filters, setFilters] = useState({
    semester: '',
    batch: '',
    courseId: '',
    materialType: '',
  });

  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClearFilters = () => {
    setFilters({
      semester: '',
      batch: '',
      courseId: '',
      materialType: '',
    });
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await api.get('/materials', {
          params: { ...filters, sort: sortOrder },
        });
        setMaterials(response.data);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [filters, sortOrder]);

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-6 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-yellow-400">🔍 Find Materials</h2>
        <div className="flex items-center gap-4">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-sm rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">📅 Newest First</option>
            <option value="asc">📁 Oldest First</option>
          </select>

          <button
            onClick={handleClearFilters}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <MaterialFilter filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          Loading materials...
        </div>
      ) : (
        <FilteredMaterialList materials={materials} />
      )}
    </div>
  );
};

export default FindMaterials;
