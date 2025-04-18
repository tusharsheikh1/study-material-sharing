import React from "react";
import booksVector from "../assets/booksVector.png";
import StatsSection from "../components/StatsSection";
import HomepageTopContributors from "../components/HomepageTopContributors";
import Testimonial from "../components/Testimonial";
import WhyChooseSection from "../components/WhyChooseSection";
import SignupCTA from "../components/SignupCTA"; // ✅ New import

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 px-4">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center py-20">
        <div className="text-center md:text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-10 shadow-xl transition-all duration-300">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Empowering <span className="text-blue-600 dark:text-blue-400">Students</span> to Learn,
            Share, and Grow Together
          </h1>
          <p className="text-md sm:text-lg mb-8 text-gray-700 dark:text-gray-300">
            Track Mark is the official academic sharing hub built by students of the Department of Marketing, 
            Jagannath University. Access curated resources, upload study materials, and contribute to a united learning experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a
              href="/register"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
            >
              Join the Community
            </a>
            <a
              href="/learn-more"
              className="px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded-lg shadow hover:bg-gray-700 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-200"
            >
              Explore Features
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <img
            src={booksVector}
            alt="Books and Students Vector"
            className="w-full max-w-md object-contain drop-shadow-2xl animate-fade-in"
            loading="lazy"
          />
        </div>
      </div>

      {/* Why Choose Section */}
      <WhyChooseSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <Testimonial />

      {/* Top Contributors */}
      <HomepageTopContributors />

      {/* Signup Call to Action */}
      <SignupCTA />
    </div>
  );
};

export default Home;
