import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, LayoutDashboard, Image, History, CreditCard, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, protected: false },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Generate', path: '/generate', icon: Image, protected: true },
    { name: 'History', path: '/history', icon: History, protected: true },
    { name: 'Pricing', path: '/pricing', icon: CreditCard, protected: false },
  ];

  const filteredLinks = navLinks.filter(link => !link.protected || user);

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen fixed left-0 top-0 pt-16 z-40">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 ${
                isActive(link.path)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive(link.path) ? 'text-indigo-600' : 'text-slate-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      {user && (
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
