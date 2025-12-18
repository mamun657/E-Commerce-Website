import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f14] via-[#0f172a] to-[#0b0f14]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
