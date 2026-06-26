import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useSettings } from '../context/SettingsContext.js';
import { Keyboard, Trophy, Award, Settings, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Test', path: '/test', icon: Keyboard },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Verify', path: '/verify', icon: ShieldCheck },
    ...(user ? [{ label: 'Certificates', path: '/certificates', icon: Award }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-theme-sub/10 py-3 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-theme-main">
          <span className="text-3xl">⚡</span>
          <span className="bg-gradient-to-r from-theme-main via-theme-text to-theme-text bg-clip-text text-transparent">
            TypeSprint
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 font-medium text-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-theme-main'
                    : 'text-theme-sub hover:text-theme-text'
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User / Settings Profile */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Quick Toggle */}
          <button
            onClick={() => setTheme(theme === 'carbon' ? 'light' : theme === 'light' ? 'cyberpunk' : theme === 'cyberpunk' ? 'nord' : 'carbon')}
            className="p-2 rounded-lg text-theme-sub hover:text-theme-text hover:bg-theme-sub/10 transition-colors"
            title="Change Theme"
          >
            <Settings size={18} />
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-theme-main/50"
                />
                <span className="text-sm font-semibold text-theme-text">{user.displayName}</span>
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl glass-panel border border-theme-sub/20 py-2 z-20"
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-theme-text hover:bg-theme-main/10 transition-colors"
                      >
                        <User size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-theme-text hover:bg-theme-main/10 transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <hr className="border-theme-sub/10 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-theme-error hover:bg-theme-error/10 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-theme-sub hover:text-theme-text transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-theme-main text-black hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'carbon' ? 'light' : theme === 'light' ? 'cyberpunk' : theme === 'cyberpunk' ? 'nord' : 'carbon')}
            className="p-1.5 rounded-lg text-theme-sub hover:text-theme-text"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-theme-sub hover:text-theme-text"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 pt-3 border-t border-theme-sub/10 flex flex-col gap-4 overflow-hidden"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 py-1 text-base font-semibold ${
                    isActive(link.path) ? 'text-theme-main' : 'text-theme-sub'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}

            {user ? (
              <div className="flex flex-col gap-3 pt-3 border-t border-theme-sub/10 pb-2">
                <div className="flex items-center gap-2">
                  <img src={user.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full" />
                  <span className="font-semibold text-theme-text">{user.displayName}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-theme-sub"
                >
                  <User size={16} /> Dashboard
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-theme-sub"
                >
                  <Settings size={16} /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-theme-error text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t border-theme-sub/10 pb-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center py-2 rounded-lg border border-theme-sub/20 text-theme-text font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center py-2 rounded-lg bg-theme-main text-black font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
