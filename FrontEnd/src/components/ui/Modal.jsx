import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const Modal = ({ isOpen, onClose, title, children, className, variant = "center" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-[100] flex", variant === "center" ? "items-center justify-center" : "justify-end")}>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity",
          "animate-in fade-in duration-300"
        )}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className={cn(
          "relative z-[100] bg-white dark:bg-[#1a1730] shadow-2xl transition-all flex flex-col",
          variant === "center" 
            ? "w-full max-w-lg max-h-[90vh] rounded-2xl p-6 transform overflow-hidden m-4 animate-in zoom-in-95 duration-200" 
            : "w-full max-w-md h-full rounded-l-3xl p-6 animate-in slide-in-from-right duration-300",
          className
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="mt-2 flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
