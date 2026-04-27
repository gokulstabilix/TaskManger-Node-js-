import React from 'react';
import { Outlet } from 'react-router-dom';
import { CheckSquare, Sun, Moon } from 'lucide-react';
import { ChatBot } from './chatbot/ChatBot';
import { useDarkMode } from '../hooks/useDarkMode';

/**
 * Layout — The app shell (header + content + footer).
 *
 * What changed:
 *  - Added <ChatBot /> so it's available on every page
 *  - Added dark mode toggle button in the header
 *  - Added a gradient accent line under the header
 */
export const Layout = () => {
  const [isDark, toggleDark] = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        {/* Gradient accent line at the very top */}
        <div
          className="h-[2px] w-full"
          style={{
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 40%, #a855f7 70%, #06b6d4 100%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <CheckSquare size={28} className="stroke-[2.5]" />
            <span className="text-xl font-bold tracking-tight text-gray-900">TaskFlow</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              id="dark-mode-toggle"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User avatar */}
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 py-8 bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
          <p>TaskFlow Management App &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Built with React, Tailwind CSS, and Redux Toolkit</p>
        </div>
      </footer>

      {/* Chatbot — floating, available on all pages */}
      <ChatBot />
    </div>
  );
};
