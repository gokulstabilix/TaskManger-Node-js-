import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from './ui/Button';
import { createTask, updateTask } from '../store/taskSlice';

export const TaskForm = ({ task, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setIsCompleted(task.isCompleted || false);
      setPriority(task.priority || 'medium');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      isCompleted,
      priority,
    };

    try {
      if (task?._id) {
        await dispatch(updateTask({ id: task._id, taskData })).unwrap();
      } else {
        await dispatch(createTask(taskData)).unwrap();
      }
      onSuccess();
    } catch (err) {
      setError(err || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-500/20">
          {error}
        </div>
      )}
      
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Task Title
        </label>
        <input
          className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1333] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm"
          placeholder="e.g., Learn react"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          className="flex min-h-[120px] w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1333] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm resize-none"
          placeholder="Add more details about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1333] px-4 py-3 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm appearance-none"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="high">High (Do First)</option>
              <option value="medium">Medium (Schedule)</option>
              <option value="low">Low (Delegate)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Status
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1333] px-4 py-3 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-sm appearance-none"
              value={isCompleted ? "completed" : "pending"}
              onChange={(e) => setIsCompleted(e.target.value === "completed")}
            >
              <option value="pending">PENDING</option>
              <option value="completed">COMPLETED</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/10 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white border-none"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 border-none shadow-lg shadow-primary-500/30 text-white"
        >
          {task ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
