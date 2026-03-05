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
  const isDashboardRoute = ['/dashboard', '/generate', '/history', '/admin'].some(path =>
    location.pathname.startsWith(path)
  );

  const showSidebar = user && isDashboardRoute;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col font-sans selection:bg-primary/30">
      {/* Immersive Background Layers */}
      <div className="fixed inset-0 ani-grid pointer-events-none opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-tr from-background via-transparent to-primary/5 pointer-events-none" />

      <Header />
      <div className="flex flex-1 relative z-10 w-full">
        {showSidebar && <Sidebar />}
        <main
          className={`flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ease-in-out ${showSidebar ? 'md:pl-72' : ''
            }`}
        >
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
      <div className={showSidebar ? 'md:pl-64' : ''}>
        <Footer />
      </div>
    </div>
  );
}
