import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import MaterialList from '../components/MaterialList';
import SlideProgressChart from '../components/SlideProgressChart';
import StudyTimelineChart from '../components/StudyTimelineChart';
import GlobalSpinner from '../components/GlobalSpinner'; // ✅ Import spinner

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
    if (filters.semester && filters.batch && user.role !== 'faculty') {
      fetchMaterials();
    }
  }, [user]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 min-h-screen">
      {loading && <GlobalSpinner />} {/* ✅ Spinner instead of text */}

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">📚 My Study Materials</h1>

      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

      {user.role !== 'faculty' && <MaterialList materials={materials} />}

      {user.role === 'faculty' && (
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Welcome, Faculty! You have upload access only.
        </p>
      )}

      {/* ✅ Charts moved below material list */}
      {user.role !== 'faculty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SlideProgressChart
            slideMaterials={materials.filter(m => m.materialType === 'slide')}
            currentUserId={user._id}
          />

          <StudyTimelineChart
            materials={materials}
            currentUserId={user._id}
          />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
