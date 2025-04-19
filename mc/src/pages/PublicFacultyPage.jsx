import { useEffect, useState } from "react";
import axios from "../utils/api";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaGraduationCap } from "react-icons/fa";

const PublicFacultyPage = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get("/faculty");
        setFaculty(res.data);
      } catch (error) {
        console.error("Error loading faculty:", error);
      }
    };
    fetchFaculty();
  }, []);

  // Designation badge color by role
  const getBadgeClasses = (designation = "") => {
    const d = designation.toLowerCase();
    if (d.includes("associate")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (d.includes("assistant")) return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
    if (d.includes("professor")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    if (d.includes("lecturer")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Page Heading */}
      <div className="text-center mb-14 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 dark:text-white">
          Our Faculty
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg sm:text-xl">
          The brilliant minds who guide, inspire and lead with knowledge and kindness.
        </p>
      </div>

      {/* Faculty Grid */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {faculty.map((f, i) => (
          <motion.div
            key={f._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative rounded-3xl backdrop-blur-xl border border-blue-100 dark:border-gray-700 shadow-xl bg-white/60 dark:bg-gray-800/70 overflow-hidden transition-transform hover:scale-[1.03]"
          >
            <div className="flex flex-col items-center p-6 space-y-4 text-center">
              {/* Avatar */}
              <img
                src={f.photoUrl}
                alt={f.name || f.fullName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
              />

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {f.name || f.fullName || "Unnamed Faculty"}
              </h3>

              {/* Animated Role Badge */}
              <motion.span
                className={`inline-flex items-center gap-2 px-4 py-1 text-sm rounded-full font-semibold transition duration-300 shadow hover:shadow-lg hover:shadow-blue-300/30 dark:hover:shadow-blue-900/40 ${getBadgeClasses(f.designation)}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 + 0.2, duration: 0.4, ease: "easeOut" }}
              >
                <FaGraduationCap className="text-xs" />
                {f.designation}
              </motion.span>

              {/* Contact Icons */}
              <div className="flex items-center justify-center gap-4 pt-3">
                <a
                  href={`mailto:${f.email}`}
                  title={`Email ${f.name}`}
                  className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                >
                  <FaEnvelope className="text-blue-600 dark:text-blue-300" />
                </a>
                <a
                  href={`tel:${f.phone}`}
                  title={`Call ${f.name}`}
                  className="p-2 bg-green-100 dark:bg-green-900 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition"
                >
                  <FaPhoneAlt className="text-green-600 dark:text-green-300" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {faculty.length === 0 && (
        <p className="text-center mt-20 text-gray-500 dark:text-gray-400">
          No faculty members found.
        </p>
      )}
    </div>
  );
};

export default PublicFacultyPage;
