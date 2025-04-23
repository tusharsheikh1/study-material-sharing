import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I register for a Track Mark account?",
    answer: "Click 'Get Started' on the navbar. Provide your student ID and email. After registration, you'll receive approval from the admin.",
  },
  {
    question: "How can I upload study materials?",
    answer: "Log in to your dashboard. Click 'Upload', fill out details, and attach your files. Your upload will be visible after admin moderation.",
  },
  {
    question: "What file types are allowed?",
    answer: "Supported formats include PDF, DOCX, PPTX, JPG, PNG, and ZIP files.",
  },
  {
    question: "Who can view my uploads?",
    answer: "Only authenticated users from your department can access your materials. Admins ensure proper usage.",
  },
  {
    question: "How to reset my password?",
    answer: "Click 'Forgot Password' on the login page. Enter your email or student ID to receive an OTP for verification.",
  },
  {
    question: "How to contact support?",
    answer: "Email us at admin@portal.com or submit a support ticket (coming soon).",
  },
];

const HelpCenter = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-20 text-gray-800 dark:text-gray-200">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Help Center</h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Find answers to your questions about Track Mark. We’re here to help you get the most out of our platform.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/30 dark:bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-white/10 shadow-md transition-all duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className="text-lg font-semibold">{faq.question}</span>
              <span className={`text-2xl transition-transform duration-200 ${activeIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-300"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;
