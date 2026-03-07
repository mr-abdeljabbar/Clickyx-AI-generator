import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Check if we are in a dashboard route where sidebar is visible
  const isDashboardRoute = ['/dashboard', '/generate', '/history', '/admin'].some(path =>
    location.pathname.startsWith(path)
  );

  const showSidebar = user && isDashboardRoute;

  const isAdmin = user?.role === 'ADMIN';

  const navLinks = [
    { name: 'Dashboard', path: isAdmin ? '/admin' : '/dashboard', protected: true },
    { name: 'Generate', path: '/generate', protected: true },
    ...(isAdmin ? [] : [{ name: 'About US', path: '/about' }]),
    ...(isAdmin ? [] : [{ name: 'Pricing', path: '/pricing' }]),
    ...(isAdmin ? [] : [{ name: 'Contact US', path: '/contact' }]),
  ];

  const filteredLinks = navLinks.filter(link => !link.protected || user);

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-white/5 backdrop-blur-md">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${showSidebar ? 'w-full max-w-none' : ''}`}>
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
              </div>
              <span className="text-xl font-black text-foreground tracking-tighter uppercase neon-glow">
                Clickyx <span className="text-primary">AI</span>
              </span>
            </Link>

            {/* Navigation links - Centered */}
            {!showSidebar && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                <nav className="flex space-x-1 border border-white/5 bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-xl">
                  {filteredLinks.map((link) => {
                    const active = isActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`relative px-3 py-1.5 text-xs font-semibold transition-all duration-300 rounded-xl group ${active
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                          }`}
                      >
                        {link.name}
                        {active && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_vars(--color-primary)]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>

          <div className="max-md:hidden flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest leading-none">Verified User</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-white/10 hover:border-red-500/50 rounded-lg transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground text-sm font-bold transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary-tech px-6 py-2 text-sm"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/5 transition-colors border border-white/20 hover:border-white/40"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/10 absolute w-full left-0 animate-in slide-in-from-top duration-300 z-[100] shadow-2xl">
          <div className="p-4 space-y-2">
            {filteredLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-center px-4 py-3 rounded-xl font-bold transition-all ${isActive(link.path)
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-white/5">
              {user ? (
                <div className="space-y-4">
                  <div className="px-4 text-center">
                    <p className="text-xs text-muted-foreground font-mono mb-1">{user.email}</p>
                    <p className="text-sm font-bold text-primary">Member Status: Active</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout Account
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-white/5 text-foreground font-bold rounded-xl border border-white/10"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
