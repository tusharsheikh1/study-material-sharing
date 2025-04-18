import React from 'react';
import { Link } from 'react-router-dom';

const developer = {
  name: 'Tushar Sheikh',
  role: 'Student',
  batch: 'Batch 15',
  image: 'https://scontent.fzyl2-2.fna.fbcdn.net/v/t39.30808-6/415535995_337021575790306_1033942528636397166_n.jpg',
  tagline: 'Building modern UIs and learning every day 🚀',
};

const MeetTheDevelopersSection = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 mt-28 text-center">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-14 tracking-tight">
        Meet the Developer
      </h2>

      <Link to="/developers" className="group block max-w-md mx-auto transition-transform duration-300 hover:scale-105">
        <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-5">
              <img
                src={developer.image}
                alt={developer.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 dark:ring-blue-600 opacity-10 group-hover:opacity-20 transition"></div>
            </div>

            {/* Name */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {developer.name}
            </h3>

            {/* Tags */}
            <div className="flex items-center justify-center gap-2 mt-2 mb-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                {developer.role}
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white">
                {developer.batch}
              </span>
            </div>

            {/* Tagline */}
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto italic mb-4">
              {developer.tagline}
            </p>

            {/* CTA link text */}
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline flex items-center justify-center gap-1">
              View full profile
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default MeetTheDevelopersSection;
