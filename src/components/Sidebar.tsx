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
    <div className="max-md:hidden flex flex-col w-64 glass-panel border-r border-white/5 min-h-screen fixed left-0 top-0 pt-20 z-40 transition-all duration-500">
      <div className="px-6 py-2">
        <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase opacity-50">Navigation System</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all group ${active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-primary rounded-r-full shadow-[0_0_15px_vars(--color-primary)]" />
              )}
              <Icon className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-white/5">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_theme(colors.emerald.500)]" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Core Status</span>
            </div>
            <p className="text-xs font-mono font-bold text-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-bold text-muted-foreground rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="mr-3 h-5 w-5 transition-colors group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
