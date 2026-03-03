import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  
  // Define routes that should show the sidebar (dashboard-like routes)
  const isDashboardRoute = ['/dashboard', '/generate', '/history', '/pricing', '/admin'].some(path => 
    location.pathname.startsWith(path)
  );

  const showSidebar = user && isDashboardRoute;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex flex-grow">
        {showSidebar && <Sidebar />}
        <main 
          className={`flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${
            showSidebar ? 'md:pl-72' : ''
          }`}
        >
          {children}
        </main>
      </div>
      <div className={showSidebar ? 'md:pl-64' : ''}>
        <Footer />
      </div>
    </div>
  );
}
