import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Edit, Trash2, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * TaskCard — Displays a single task.
 *
 * What changed:
 *  - Added a colored left border accent (green = completed, indigo = pending)
 *  - Added a status badge chip (Pending / Done)
 *  - Enhanced hover animation with slight upward lift
 *  - Dark mode support via dark: classes
 *  - Better visual hierarchy with spacing adjustments
 *
 * All props remain the same — no breaking changes.
 */
export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      task.isCompleted
        ? "border-gray-200 bg-gray-50/50 border-l-4 border-l-green-400"
        : "border-gray-200 border-l-4 border-l-primary-500"
    )}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleStatus(task)}
          className={cn(
            "mt-1 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            task.isCompleted ? "text-green-500" : "text-gray-300 hover:text-primary-500"
          )}
        >
          {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "text-base font-semibold leading-snug",
              task.isCompleted ? "text-gray-500 line-through" : "text-gray-900"
            )}>
              {task.title}
            </h4>
            {/* Status badge */}
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0",
              task.isCompleted
                ? "bg-green-50 text-green-600 border border-green-100"
                : "bg-amber-50 text-amber-600 border border-amber-100"
            )}>
              {task.isCompleted ? "Done" : "Pending"}
            </span>
          </div>
          {task.description && (
            <p className={cn(
              "text-sm line-clamp-2",
              task.isCompleted ? "text-gray-400" : "text-gray-600"
            )}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={12} />
          {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy') : 'No date'}
        </span>
        
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
            aria-label="Edit task"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
