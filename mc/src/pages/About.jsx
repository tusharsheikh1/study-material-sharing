import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero */}
      <motion.div className="text-center py-20 px-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white"
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <h1 className="text-5xl font-extrabold mb-4">About Track Mark</h1>
        <p className="text-xl opacity-90">Built by students, for students — powering smarter learning.</p>
      </motion.div>

      {/* Vision & Mission */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 py-16">
        <motion.div className="bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow hover:shadow-xl"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-2xl font-bold mb-3">🎯 Our Vision</h2>
          <p>Create a unified academic space where students collaborate, contribute, and grow together.</p>
        </motion.div>
        <motion.div className="bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow hover:shadow-xl"
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
          <h2 className="text-2xl font-bold mb-3">💡 Our Mission</h2>
          <p>Empower every student through technology and community-driven knowledge sharing.</p>
        </motion.div>
      </div>

      {/* Why Track Mark */}
      <motion.div className="max-w-5xl mx-auto px-4 py-12 text-center" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <h2 className="text-3xl font-bold mb-6">🚀 Why Track Mark?</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-left text-lg list-disc list-inside max-w-3xl mx-auto">
          <p>📚 Centralized course materials</p>
          <p>🔍 Powerful search & filter system</p>
          <p>📈 Progress tracking tools</p>
          <p>📥 Upload + share system</p>
          <p>👩‍💻 Secure role-based access</p>
          <p>💖 Made by students for real academic impact</p>
        </div>
      </motion.div>

      {/* Core Features */}
      <motion.div className="max-w-6xl mx-auto px-4 py-16" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <h2 className="text-3xl font-bold text-center mb-10">🔧 Core Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            'Upload Materials',
            'Batch-wise Filter',
            'Study Progress Chart',
            'Student Dashboard',
            'Searchable Slides & Notes',
            'Download Without Ads',
          ].map((feature, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">This feature enhances the overall learning and accessibility experience.</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline / Our Journey */}
      <motion.div className="max-w-5xl mx-auto px-4 py-16" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <h2 className="text-3xl font-bold text-center mb-10">📅 Our Journey</h2>
        <ul className="space-y-6 border-l-4 border-blue-500 pl-6">
          <li>
            <h4 className="font-bold text-blue-600">January 2025 – Idea Born</h4>
            <p>We realized students needed a centralized study space.</p>
          </li>
          <li>
            <h4 className="font-bold text-blue-600">February 2025 – Development Started</h4>
            <p>Team formed, and backend + frontend prototypes launched.</p>
          </li>
          <li>
            <h4 className="font-bold text-blue-600">April 2025 – Beta Testing</h4>
            <p>First test batch uploaded their materials and gave feedback.</p>
          </li>
        </ul>
      </motion.div>

      {/* Quote / CTA */}
      <motion.div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center py-12 px-4"
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <p className="text-2xl font-semibold italic">“Together we learn, together we grow.”</p>
        <p className="text-sm mt-2 opacity-80">— The Track Mark Team</p>
      </motion.div>
    </div>
  );
};

export default About;
