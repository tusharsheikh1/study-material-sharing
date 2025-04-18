import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SlideProgressChart = ({ slideMaterials, currentUserId }) => {
  const doneCount = slideMaterials.filter(m => m.completedBy?.includes(currentUserId)).length;
  const leftCount = slideMaterials.length - doneCount;

  const chartData = [
    { name: 'Completed', value: doneCount },
    { name: 'Pending', value: leftCount },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  const completionRate = (doneCount / slideMaterials.length) * 100;
  let message = '';

  const notStarted = [
    '📖 Not a single step yet? Start now — your goals await!',
    '⏰ Time waits for no one. Begin your journey today!',
    '🧠 You’ve got this! All it takes is to start.',
    '🔥 Zero progress? Light that spark and let’s begin!'
  ];

  const slowProgress = [
    '📚 You’ve started — now build momentum!',
    '💡 Small steps matter. Let’s pick up the pace!',
    '🎯 Consistency beats intensity — keep going!',
    '🚶‍♂️ Slow and steady is fine, but let’s move a bit faster!'
  ];

  const steadyProgress = [
    '🔥 Awesome! You are killing it!',
    '🎯 Great job! Keep this momentum going.',
    '🚀 You’re on track to ace this semester!',
    '👏 Respect! You’re already over halfway through.'
  ];

  if (completionRate === 0) {
    message = notStarted[Math.floor(Math.random() * notStarted.length)];
  } else if (completionRate > 0 && completionRate < 50) {
    message = slowProgress[Math.floor(Math.random() * slowProgress.length)];
  } else {
    message = steadyProgress[Math.floor(Math.random() * steadyProgress.length)];
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Study Progress Overview</h2>
        <div className="text-right text-sm text-gray-600 space-y-1">
          <p>Total Materials: <span className="font-medium text-gray-800">{slideMaterials.length}</span></p>
          <p>
            Completed: <span className="text-green-600 font-semibold">{doneCount}</span> | 
            Pending: <span className="text-red-600 font-semibold">{leftCount}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', fontSize: '13px', padding: '8px', backgroundColor: '#f9fafb' }}
              itemStyle={{ color: '#374151' }}
            />
            <Legend iconType="circle" verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
        <p className="mt-2 text-base font-medium text-blue-600 text-center">{message}</p>
      </div>
    </div>
  );
};

export default SlideProgressChart;
