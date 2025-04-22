import Navbar from './UserNavbar';
import Sidebar from './UserSidebar';
import MobileBottomNav from './MobileBottomNav';

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col sm:flex-row bg-white dark:bg-gray-900 sm:bg-gradient-to-tr sm:from-gray-100 sm:via-white sm:to-blue-100 dark:sm:from-gray-900 dark:sm:via-gray-800 dark:sm:to-gray-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative bg-white dark:bg-gray-900 shadow-inner backdrop-blur-lg z-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 pb-24 text-gray-800 dark:text-gray-100">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default UserLayout;
