import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaStar } from "react-icons/fa";

const roleStyles = {
  Admin: { icon: <FaUserTie />, color: "bg-red-500", label: "Admin" },
  Faculty: { icon: <FaChalkboardTeacher />, color: "bg-indigo-500", label: "Faculty" },
  CR: { icon: <FaStar />, color: "bg-blue-500", label: "Class Rep" },
  Student: { icon: <FaUserGraduate />, color: "bg-green-500", label: "Student" },
};

const Leaderboard = () => {
  const [contributors, setContributors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [range, setRange] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const url =
        range === "all"
          ? "/materials/top-contributors"
          : `/materials/top-contributors?range=${range}`;
      const res = await api.get(url, { headers: { Authorization: undefined } });
      const contributors = (res.data?.contributors || []).filter(
        (c) => c.role.toLowerCase() !== "faculty"
      );
      setContributors(contributors);
      setFiltered(contributors);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setContributors([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, [range]);

  useEffect(() => {
    let temp = [...contributors];
    if (selectedRole !== "all") {
      temp = temp.filter((c) => c.role === selectedRole);
    }
    if (selectedBatch !== "all") {
      temp = temp.filter((c) => String(c.batch) === selectedBatch);
    }
    setFiltered(temp);
  }, [selectedRole, selectedBatch, contributors]);

  const getMedal = (index) => {
    const medals = ["🥇", "🥈", "🥉"];
    return medals[index] || `#${index + 1}`;
  };

  const uniqueBatches = Array.from(
    new Set(contributors.map((c) => c.batch).filter(Boolean))
  ).sort();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-6">
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2"
        >
          🏆 Leaderboard
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Recognizing the most impactful academic contributors.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {["all", "week", "month"].map((type) => (
          <button
            key={type}
            onClick={() => setRange(type)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              range === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            }`}
          >
            {type === "all" ? "All Time" : type === "week" ? "This Week" : "This Month"}
          </button>
        ))}
      </div>

      {/* Role and Batch Filters */}
      <div className="flex justify-center flex-wrap gap-6 mb-10">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-white shadow-sm"
        >
          <option value="all">All Roles</option>
          <option value="Student">Student</option>
          <option value="CR">CR</option>
        </select>

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="px-4 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-white shadow-sm"
        >
          <option value="all">All Batches</option>
          {uniqueBatches.map((batch) => (
            <option key={batch} value={batch}>
              Batch {batch}
            </option>
          ))}
        </select>
      </div>

      {/* Contributor List */}
      <div className="max-w-5xl mx-auto grid gap-6">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No contributors found.</p>
        ) : (
          filtered.slice(0, 20).map((c, index) => {
            const roleInfo = roleStyles[c.role] || {
              icon: <FaUserGraduate />,
              color: "bg-gray-400",
              label: c.role,
            };
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/30 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-5 flex items-center gap-5 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-semibold">{getMedal(index)}</div>
                <img
                  src={
                    c.profileImage
                      ? c.profileImage
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName)}`
                  }
                  alt={c.fullName}
                  className="w-14 h-14 rounded-full border-2 border-white shadow"
                />
                <div className="flex-grow text-left">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {c.fullName}
                  </h3>
                  <div className="flex gap-2 mt-1 items-center flex-wrap text-sm">
                    <span
                      className={`text-white px-3 py-1 rounded-full flex items-center gap-1 ${roleInfo.color}`}
                    >
                      {roleInfo.icon}
                      {roleInfo.label}
                    </span>
                    {c.batch && (
                      <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-full">
                        🎓 Batch {c.batch}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  {c.count} Materials
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;
