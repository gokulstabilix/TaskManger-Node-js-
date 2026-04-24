import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Edit, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md",
      task.isCompleted ? "border-gray-200 bg-gray-50/50" : "border-gray-200"
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
        
        <div className="flex-1 space-y-1">
          <h4 className={cn(
            "text-base font-semibold leading-none",
            task.isCompleted ? "text-gray-500 line-through" : "text-gray-900"
          )}>
            {task.title}
          </h4>
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
        <span className="text-xs text-gray-400">
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
