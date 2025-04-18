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
    <div className="bg-white p-6 rounded-xl shadow border mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">📂 Materials by Type</h2>
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No materials found</p>
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
            <Tooltip />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MaterialTypeChart;
