import { useEffect, useState } from 'react';
import api from '../utils/api';

const MaterialsPerSemesterChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await api.get('/materials');
        const materials = res.data;

        const semesterCount = {};

        materials.forEach((mat) => {
          const semester = mat.semester;
          semesterCount[semester] = (semesterCount[semester] || 0) + 1;
        });

        const formattedData = Object.entries(semesterCount).map(([semester, count]) => ({
          semester: `Semester ${semester}`,
          count,
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Failed to load materials per semester chart', err);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Materials Per Semester</h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No data available</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index} className="text-sm text-gray-700">
              {item.semester}: <strong>{item.count}</strong> materials
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaterialsPerSemesterChart;
