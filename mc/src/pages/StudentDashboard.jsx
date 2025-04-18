import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import MaterialList from '../components/MaterialList';
import SlideProgressChart from '../components/SlideProgressChart';
import StudyTimelineChart from '../components/StudyTimelineChart';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filters = {
    semester: user?.semester || '',
    batch: user?.batch || '',
  };

  const fetchMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/materials', { params: filters });
      setMaterials(res.data);
    } catch (err) {
      console.error('Error fetching materials:', err.message);
      setError('Failed to fetch materials. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.semester && filters.batch) {
      fetchMaterials();
    }
  }, [user]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SlideProgressChart
          slideMaterials={materials.filter(m => m.materialType === 'slide')}
          currentUserId={user._id}
        />

        <StudyTimelineChart
          materials={materials}
          currentUserId={user._id}
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-800">📚 My Study Materials</h1>

      {/* Loading and Error States */}
      {loading && <p className="text-blue-500">Loading materials...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Material List */}
      <MaterialList materials={materials} />
    </div>
  );
};

export default StudentDashboard;
