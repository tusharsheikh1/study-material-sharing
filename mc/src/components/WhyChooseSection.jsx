import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

// Import your Lottie animations
import materialsAnim from "../assets/lottie/materials.json";
import uploadAnim from "../assets/lottie/upload.json";
import studentsAnim from "../assets/lottie/students.json";

const features = [
  {
    animation: materialsAnim,
    title: "Centralized Materials",
    description:
      "Access notes, slides, books, and questions sorted by semester, course, and batch.",
    delay: 0,
    glow: "shadow-blue-500/30",
  },
  {
    animation: uploadAnim,
    title: "Fast Uploads",
    description:
      "Upload your study files securely and share them instantly with your classmates.",
    delay: 0.2,
    glow: "shadow-purple-500/30",
  },
  {
    animation: studentsAnim,
    title: "Built by Students",
    description:
      "Created by marketing students to fulfill the real needs of our academic journey.",
    delay: 0.4,
    glow: "shadow-green-500/30",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="relative z-10 py-24 px-6 sm:px-10 bg-gradient-to-br from-white/60 via-white/20 to-transparent dark:from-gray-900/60 dark:via-gray-900/20 dark:to-transparent backdrop-blur-3xl rounded-3xl overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2"
        >
          Why Choose{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Track Mark?
          </span>
        </motion.h2>

        {/* Underline glow bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-28 h-1 mt-2 mb-10 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full origin-left"
        />

        {/* Description */}
        <motion.p
          className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true }}
        >
          Student-powered. Academically focused. Built for impact.
        </motion.p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                rotate: [0, 1, -1, 0],
                transition: { duration: 0.8, repeat: Infinity, repeatType: "mirror" },
              }}
              className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-xl ${feature.glow} hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300`}
            >
              <div className="w-24 h-24 mx-auto mb-6">
                <Lottie animationData={feature.animation} loop={true} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-md leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
