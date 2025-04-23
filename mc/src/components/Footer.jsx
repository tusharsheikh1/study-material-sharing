import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Use this if you're using React Router
import { Facebook, Linkedin, Youtube } from "lucide-react";
import deptLogo from "../assets/department-logo.png";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-16 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-inner rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-gray-700 dark:text-gray-300 transition-all duration-300">
        
        {/* About */}
        <div className="lg:col-span-2 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEEzRAdbdYsoSdhFEBT7LStyej0KzWr99ekA&s"
              alt="JNU Logo"
              className="h-12 w-auto rounded-xl shadow-lg transition-transform hover:scale-105"
            />
            <img
              src={deptLogo}
              alt="Department Logo"
              className="h-12 w-auto rounded-xl shadow-lg transition-transform hover:scale-105"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Department of Marketing
            </span>
          </div>
          <p className="leading-relaxed">
            Centralized platform by the students of Jagannath University’s Marketing Department.
            Empowering academic collaboration and contribution.
          </p>
          <p className="mt-3 text-red-600 dark:text-red-400 font-medium flex items-start gap-2">
            ⚠️ <span>This is an unofficial student-run portal and not endorsed by JNU authorities.</span>
          </p>
        </div>

        {/* Contact */}
        <div className="animate-slide-up delay-100">
          {/* Contact */}
<div className="animate-slide-up delay-100">
  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📍 Address</h4>
  <ul className="space-y-2">
    <li>Dept. of Marketing, Jagannath University</li>
  </ul>
</div>

        </div>

        {/* Quick Links */}
        <div className="animate-slide-up delay-150">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🚀 Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/privacy-policy" className="footer-link">Privacy Policy</a></li>
            <li><a href="/help-center" className="footer-link">Help Center</a></li>
            <li><a href="/terms" className="footer-link">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="animate-slide-up delay-200">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📱 Follow Us</h4>
          <div className="flex gap-4 items-center">
            <a href="#" aria-label="Facebook" className="footer-icon"><Facebook size={22} /></a>
            <a href="#" aria-label="LinkedIn" className="footer-icon"><Linkedin size={22} /></a>
            <a href="#" aria-label="YouTube" className="footer-icon"><Youtube size={22} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 dark:border-gray-700 text-center py-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <p>💻 Built with ❤️ by Final Year Student (Mkt-15 Batch) — Department of Marketing</p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} Jagannath University. All rights reserved. <br />
          👨‍💻 Developed by{" "}
          <Link
            to="/developers"
            className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-800"
          >
            Tushar Sheikh
          </Link>
        </p>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .footer-link {
          position: relative;
          color: #2563eb;
          transition: all 0.2s;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, #3b82f6, #9333ea);
          left: 0;
          bottom: -1px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .footer-link:hover::after {
          transform: scaleX(1);
        }
        .footer-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, color 0.2s;
        }
        .footer-icon:hover {
          transform: scale(1.15);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
