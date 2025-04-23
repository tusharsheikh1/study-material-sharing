import React from "react";
import Lottie from "lottie-react";
import studentLottie from "../assets/lottie/student.json"; // ✅ Lottie animation
import StatsSection from "../components/StatsSection";
import HomepageTopContributors from "../components/HomepageTopContributors";
import Testimonial from "../components/Testimonial";
import WhyChooseSection from "../components/WhyChooseSection";
import SignupCTA from "../components/SignupCTA";
import { LayoutDashboard } from "lucide-react";

const Home = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token");

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
          <Lottie
            animationData={studentLottie}
            loop
            className="w-full max-w-md drop-shadow-2xl animate-fade-in"
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

      {/* Sticky Go to Dashboard button for logged-in mobile users */}
      {isMobile && isLoggedIn && (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
    <a
      href="/user/dashboard"
      className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-xl backdrop-blur-md bg-white/20 dark:bg-gray-800/30 text-blue-800 dark:text-white font-semibold border border-blue-300 dark:border-gray-600 hover:bg-white/30 hover:dark:bg-gray-700/40 transition-all duration-300"
    >
      <LayoutDashboard className="w-5 h-5" />
      Go to Dashboard
    </a>
  </div>
)}
    </div>
  );
};

export default Home;
