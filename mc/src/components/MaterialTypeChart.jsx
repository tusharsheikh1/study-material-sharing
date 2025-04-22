import { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const LABELS = {
  book: '📚 Book',
  slide: '🎓 Slide',
  class_note: '📝 Class Note',
  previous_question: '📄 Previous Question',
};

const MaterialTypeChart = () => {
  const [data, setData] = useState([]);

  const fetchMaterialStats = async () => {
    try {
      const res = await api.get('/materials');
      const materials = res.data;

      const typeCount = {};

      materials.forEach((mat) => {
        const type = mat.materialType;
        typeCount[type] = (typeCount[type] || 0) + 1;
      });

      const formattedData = Object.entries(typeCount).map(([type, count]) => ({
        name: LABELS[type] || type,
        value: count,
      }));

      setData(formattedData);
    } catch (err) {
      console.error('Failed to load material type chart', err);
    }
  };

  useEffect(() => {
    fetchMaterialStats();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">📂 Materials by Type</h2>
      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 text-sm">No materials found</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937', // gray-800
                borderColor: '#4b5563',     // gray-600
                color: '#f3f4f6',           // gray-100
              }}
              labelStyle={{ color: '#9ca3af' }} // gray-400
              wrapperStyle={{ zIndex: 50 }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ color: 'inherit' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MaterialTypeChart;
