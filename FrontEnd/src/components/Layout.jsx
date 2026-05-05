import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { CheckSquare, LayoutDashboard, ListTodo, BarChart2, Settings, Sun, Moon, Search, Bell, LogOut } from 'lucide-react';
import { ChatBot } from './chatbot/ChatBot';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/cn';

export const Layout = () => {
  const [isDark, toggleDark] = useDarkMode();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: ListTodo },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50/50 font-sans dark:bg-[#0f0d1a]">
      {/* ── Sidebar ── */}
      <aside className="w-64 fixed inset-y-0 left-0 z-40 bg-[#1a1333] text-white flex flex-col shadow-2xl transition-all duration-300">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
          <div className="bg-white text-primary-700 p-1.5 rounded-xl shadow-lg shadow-white/10">
            <CheckSquare size={24} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            TaskFlow
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm",
                  isActive
                    ? "bg-white/10 text-white shadow-inner border border-white/5"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )
              }
            >
              <item.icon
                size={20}
                className={cn(
                  "transition-colors",
                  "group-hover:text-primary-400 text-gray-400 group-[.active]:text-primary-400"
                )}
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="h-20 sticky top-0 z-30 glass border-b border-gray-200 dark:border-gray-800 px-8 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDark}
              className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-[#0f0d1a]"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{user?.name || 'User'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/30">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      <ChatBot />
    </div>
  );
};
