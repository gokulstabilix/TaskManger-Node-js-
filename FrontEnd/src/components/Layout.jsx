import React from 'react';
import { Outlet } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <CheckSquare size={28} className="stroke-[2.5]" />
            <span className="text-xl font-bold tracking-tight text-gray-900">TaskFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
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
    </div>
  );
};
