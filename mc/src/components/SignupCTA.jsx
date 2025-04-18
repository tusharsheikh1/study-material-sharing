import React from "react";
import { Link } from "react-router-dom";

const SignupCTA = () => {
  return (
    <section className="relative max-w-6xl mx-auto mt-32 mb-28 px-6 sm:px-12 py-20 text-center rounded-[2rem] border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden group transition-all duration-500">
      
      {/* Ambient Gradient Glow */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-violet-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-25 blur-[80px] rounded-[2rem] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
          Still not signed up? Let’s change that. 🚀
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
          Students are helping each other daily by sharing notes, slides, and questions.
          If you’re here to grow or guide — Track Mark is your platform to connect and contribute.
        </p>

        {/* CTA Button */}
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-indigo-400/40 hover:scale-[1.03] transition-all duration-300 group"
        >
          Create Your Free Account
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default SignupCTA;
