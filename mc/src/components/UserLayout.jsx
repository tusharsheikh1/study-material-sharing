import Navbar from './UserNavbar';
import Sidebar from './UserSidebar';
import MobileBottomNav from './MobileBottomNav';

const UserLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col sm:flex-row bg-gradient-to-tr from-gray-100 via-white to-blue-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative bg-white/70 shadow-inner backdrop-blur-lg z-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 pb-24">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default UserLayout;
