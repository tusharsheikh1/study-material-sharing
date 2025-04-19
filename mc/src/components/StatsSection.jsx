import React, { useEffect, useState } from "react";
import api from "../utils/api"; // ✅ Use this instead of axios
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      type: "spring",
      stiffness: 80,
    },
  }),
};

const StatCard = ({ value, label, color, icon, index }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition duration-500 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />

      <motion.p
        className={`text-5xl font-extrabold text-${color}-600 dark:text-${color}-400`}
        animate={inView ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.5, repeat: 1 }}
      >
        {inView && (
          <>
            <CountUp
              end={parseFloat(value)}
              duration={2}
              separator=","
              decimals={value.includes('.') ? 1 : 0}
            />
            {value.includes("★") && "★"}
          </>
        )}
      </motion.p>
      <p className="mt-2 text-base text-gray-700 dark:text-gray-300 font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="text-xl">{icon}</span> {label}
      </p>
    </motion.div>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalMaterials: 0,
    activeStudents: 0,
    uniqueBatches: 0,
    satisfaction: "0.0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/materials/stats"); // ✅ Use centralized API
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4"
        >
          📊 Stats & Impact
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-12 text-lg"
        >
          Empowering our students with resources and recognition. Here's a snapshot of the impact.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            value={`${stats.totalMaterials}`}
            label="Materials Shared"
            color="blue"
            icon="📚"
            index={0}
          />
          <StatCard
            value={`${stats.activeStudents}`}
            label="Active Students"
            color="green"
            icon="👨‍🎓"
            index={1}
          />
          <StatCard
            value={`${stats.uniqueBatches}`}
            label="Batches Participated"
            color="purple"
            icon="🎓"
            index={2}
          />
          <StatCard
            value={`${stats.satisfaction}`}
            label="User Satisfaction"
            color="pink"
            icon="⭐"
            index={3}
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
