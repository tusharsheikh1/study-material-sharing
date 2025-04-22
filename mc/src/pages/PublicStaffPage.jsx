// /src/pages/PublicStaffPage.jsx
import { useEffect, useState } from "react";
import axios from "../utils/api";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaUserTie } from "react-icons/fa";

const PublicStaffPage = () => {
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get("/staff");
        setStaffList(res.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-blue-400">
          Meet Our Office & Staff
        </h1>
        <p className="mt-3 text-md md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We’re proud to introduce the amazing people who support and manage our operations with dedication and care.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {staffList.map((staff, index) => (
          <motion.div
            key={staff._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white border border-gray-100 rounded-3xl shadow-lg p-6 text-center transition hover:scale-[1.02] duration-300"
          >
            <img
              src={staff.photoUrl}
              alt={staff.name}
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-md"
            />
            <h2 className="mt-4 text-xl font-bold text-gray-800">{staff.name}</h2>

            {/* Designation Badge */}
            <div className="mt-2 inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
              <FaUserTie className="text-purple-500" />
              {staff.designation}
            </div>

            {/* Contact Buttons */}
            <div className="mt-4 flex justify-center gap-4">
              <a
                href={`mailto:${staff.email}`}
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
              >
                <FaEnvelope />
              </a>
              <a
                href={`tel:${staff.phone}`}
                className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition"
              >
                <FaPhoneAlt />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PublicStaffPage;
