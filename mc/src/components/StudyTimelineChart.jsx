import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const StudyTimelineChart = ({ materials, currentUserId }) => {
  const [viewMode, setViewMode] = useState('daily'); // daily, weekly, monthly, yearly

  const dateCounts = useMemo(() => {
    const logMap = {};
    materials.forEach((mat) => {
      if (mat.materialType !== 'slide') return;
      (mat.completionLogs || []).forEach((log) => {
        if (log.user === currentUserId || log.user?._id === currentUserId) {
          let key;
          const date = dayjs(log.date);
          switch (viewMode) {
            case 'weekly':
              key = `${date.year()}-W${date.isoWeek()}`;
              break;
            case 'monthly':
              key = date.format('YYYY-MM');
              break;
            case 'yearly':
              key = date.format('YYYY');
              break;
            default:
              key = date.format('YYYY-MM-DD');
          }
          logMap[key] = (logMap[key] || 0) + 1;
        }
      });
    });
    return Object.entries(logMap).map(([date, count]) => ({ date, count })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [materials, currentUserId, viewMode]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">📅 Study Timeline Overview</h2>
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          className="border border-gray-300 text-sm rounded-md p-1 px-2 text-gray-700"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={dateCounts}
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-35}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            height={60}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorCount)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudyTimelineChart;