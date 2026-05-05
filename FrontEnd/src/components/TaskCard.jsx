import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.isCompleted;

  return (
    <div className="group relative flex flex-col justify-between gap-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1">
      {/* Top Header: Status & Priority */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onToggleStatus(task)}
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500",
            isCompleted
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 hover:bg-emerald-200"
              : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 hover:bg-amber-200"
          )}
        >
          {isCompleted ? "COMPLETED" : "PENDING"}
        </button>
        
        <span className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          task.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" :
          task.priority === "medium" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" :
          "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300"
        )}>
          {task.priority || "LOW"}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1">
        <h4 className={cn(
          "text-base font-bold leading-tight",
          isCompleted ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-900 dark:text-white"
        )}>
          {task.title}
        </h4>
        {task.description && (
          <p className={cn(
            "text-sm line-clamp-2",
            isCompleted ? "text-gray-400 dark:text-gray-600" : "text-gray-600 dark:text-gray-400"
          )}>
            {task.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy') : 'No date'}
        </span>
        
        {/* Actions (visible on hover) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-white/10 dark:hover:text-primary-400 focus:opacity-100 focus:outline-none transition-colors"
            aria-label="Edit task"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-white/10 dark:hover:text-red-400 focus:opacity-100 focus:outline-none transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
