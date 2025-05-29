import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  User, 
  Image, 
  Video, 
  Users, 
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'posts',
      label: 'Posts',
      icon: FileText,
      count: null
    },
    {
      id: 'about',
      label: 'About',
      icon: User,
      count: null
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: Image,
      count: null
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: Video,
      count: null
    },
    {
      id: 'friends',
      label: 'Friends',
      icon: Users,
      count: null
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      count: null
    },
    {
      id: 'materials',
      label: 'Study Materials',
      icon: BookOpen,
      count: null
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      count: null
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
      <div className="flex items-center overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              
              {tab.count !== null && (
                <span className="ml-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileTabs;