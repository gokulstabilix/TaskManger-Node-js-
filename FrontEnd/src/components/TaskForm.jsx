import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createTask, updateTask } from '../store/taskSlice';

export const TaskForm = ({ task, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setIsCompleted(task.isCompleted || false);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      <Input
        label="Task Title"
        placeholder="e.g., Buy groceries"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Add more details about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {task && (
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          <span className="text-sm text-gray-700">Mark as completed</span>
        </label>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
