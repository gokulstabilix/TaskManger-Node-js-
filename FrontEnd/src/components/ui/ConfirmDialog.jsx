import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task?',
  taskTitle = '',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative z-[100] w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1730] p-6 text-left shadow-2xl transition-all',
          'animate-in zoom-in-95 duration-200'
        )}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        {/* Title */}
        <h3
          id="confirm-dialog-title"
          className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2"
        >
          {title}
        </h3>
        <div className="h-px w-full bg-gray-100 dark:bg-white/10 mb-6" />

        {/* Message */}
        <div className="mb-6 space-y-4">
          <p
            id="confirm-dialog-message"
            className="text-sm text-gray-600 dark:text-gray-300"
          >
            {message}
          </p>
          {/* {taskTitle && (
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {taskTitle}
            </p>
          )} */}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white border-none"
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white border-none"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
