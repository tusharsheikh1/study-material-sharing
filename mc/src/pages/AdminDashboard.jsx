import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { FaUsers, FaBook, FaUserCheck, FaUpload, FaUserShield } from 'react-icons/fa';
import MaterialsPerSemesterChart from '../components/MaterialsPerSemesterChart';
import MaterialTypeChart from '../components/MaterialTypeChart';
import TopContributors from '../components/TopContributors'; // ✅ NEW

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white rounded-xl shadow p-4 flex items-center space-x-4 border-t-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalMaterials: 0,
    pendingApprovals: 0,
    crAndFaculty: 0,
  });

  const fetchStats = async () => {
    try {
      const [usersRes, coursesRes, materialsRes] = await Promise.all([
        api.get('/users'),
        api.get('/courses'),
        api.get('/materials'),
      ]);

      const users = usersRes.data;
      const totalUsers = users.length;
      const pendingApprovals = users.filter((u) => !u.approved).length;
      const crAndFaculty = users.filter((u) => ['cr', 'faculty'].includes(u.role)).length;

      setStats({
        totalUsers,
        totalCourses: coursesRes.data.length,
        totalMaterials: materialsRes.data.length,
        pendingApprovals,
        crAndFaculty,
      });
    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaUsers />}
          title="Total Registered Users"
          value={stats.totalUsers}
          color="border-blue-500"
        />
        <StatCard
          icon={<FaUserCheck />}
          title="Pending Approvals"
          value={stats.pendingApprovals}
          color="border-yellow-500"
        />
        <StatCard
          icon={<FaBook />}
          title="Total Courses"
          value={stats.totalCourses}
          color="border-green-500"
        />
        <StatCard
          icon={<FaUpload />}
          title="Total Materials"
          value={stats.totalMaterials}
          color="border-purple-500"
        />
        <StatCard
          icon={<FaUserShield />}
          title="CRs & Faculty Members"
          value={stats.crAndFaculty}
          color="border-pink-500"
        />
      </div>

      {/* 📊 Charts */}
      <MaterialsPerSemesterChart />
      <MaterialTypeChart />
      <TopContributors /> {/* ✅ Leaderboard for note uploaders */}
    </div>
  );
};

export default AdminDashboard;
