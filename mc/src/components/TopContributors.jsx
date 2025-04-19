import { useEffect, useState } from 'react';
import api from '../utils/api';

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);

  const fetchContributors = async () => {
    try {
      const res = await api.get('/materials');
      const classNotes = res.data.filter((mat) => mat.materialType === 'class_note');

      // Count notes per uploader
      const countMap = {};
      classNotes.forEach((note) => {
        const uploaderId = note.uploadedBy?._id;
        if (uploaderId) {
          if (!countMap[uploaderId]) {
            countMap[uploaderId] = {
              count: 0,
              user: note.uploadedBy,
            };
          }
          countMap[uploaderId].count += 1;
        }
      });

      // Convert to array and sort by count descending
      const sorted = Object.values(countMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // top 10

      setContributors(sorted);
    } catch (err) {
      console.error('Failed to fetch top contributors', err);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">🏆 Top Class Note Uploaders</h2>
      {contributors.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No class notes uploaded yet.</p>
      ) : (
        <ol className="space-y-2 list-decimal list-inside">
          {contributors.map(({ user, count }) => (
            <li key={user._id} className="text-gray-800 dark:text-gray-200">
              <span className="font-medium">{user.fullName}</span>{' '}
              <span className="text-sm text-gray-500 dark:text-gray-400">({user.email})</span> —{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">{count}</span> notes
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default TopContributors;
