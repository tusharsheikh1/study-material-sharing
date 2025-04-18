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

const ContributorCard = ({ contributor, index }) => {
  const { fullName, role, batch, count, profileImage } = contributor;
  const avatarUrl = profileImage
    ? profileImage
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;
  const medalIcons = ["🥇", "🥈", "🥉"];
  const medal = medalIcons[index] || "";

  const roleInfo = roleStyles[role] || {
    icon: <FaUserGraduate />,
    color: "bg-gray-400",
    label: role,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="backdrop-blur-md bg-white/20 dark:bg-gray-800/40 p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-all duration-300 text-center border border-gray-200 dark:border-gray-700"
    >
      <img
        src={avatarUrl}
        alt={fullName}
        className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-600 shadow-lg"
      />
      <h4 className="text-xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-1">
        {fullName} <span className="text-2xl">{medal}</span>
      </h4>

      {/* Role + Batch */}
      <div className="flex justify-center gap-2 mt-3">
        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm shadow-md ${roleInfo.color}`}
        >
          {roleInfo.icon}
          {roleInfo.label}
        </span>
        {batch && (
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm px-3 py-1 rounded-full shadow-sm">
            🎓 Batch {batch}
          </span>
        )}
      </div>

      {/* Material Count */}
      <p className="mt-4 text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-wide">
        {count} Materials Contributed
      </p>
    </motion.div>
  );
};

const HomepageTopContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [range, setRange] = useState("all");

  const fetchContributors = async () => {
    try {
      const url =
        range === "all"
          ? "/materials/top-contributors"
          : `/materials/top-contributors?range=${range}`;
      const res = await api.get(url, {
        headers: { Authorization: undefined },
      });
      setContributors(res.data?.contributors || []);
    } catch (error) {
      console.error("Error fetching contributors:", error);
      setContributors([]);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, [range]);

  return (
    <section className="py-20 px-4 bg-gradient-to-tr from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white mb-4"
        >
          🏆 Top Contributors
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-10 text-base sm:text-lg">
          Honoring our top academic heroes who help the community grow.
        </p>

        {/* Range Filter Buttons */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {["all", "week", "month"].map((type) => (
            <button
              key={type}
              onClick={() => setRange(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                range === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              }`}
            >
              {type === "all" ? "All Time" : type === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {contributors.map((contributor, index) => (
            <ContributorCard key={index} contributor={contributor} index={index} />
          ))}
        </div>

        <div className="mt-12">
          <Link
            to="/leaderboard"
            className="inline-block text-blue-700 dark:text-blue-400 hover:underline text-sm font-semibold"
          >
            View Full Leaderboard →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomepageTopContributors;
