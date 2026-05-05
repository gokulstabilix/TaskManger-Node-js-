import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, ListChecks, TrendingUp, Plus } from 'lucide-react';
import { fetchTasks, updateTask, deleteTask } from '../store/taskSlice';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AISummaryCard } from '../components/AISummaryCard';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector((s) => s.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchTasks());
  }, [status, dispatch]);

  const handleCreate = () => { setEditingTask(null); setIsModalOpen(true); };
  const handleEdit = (task) => { setEditingTask(task); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setTimeout(() => setEditingTask(null), 300); };
  const handleToggleStatus = (task) => dispatch(updateTask({ id: task._id, taskData: { isCompleted: !task.isCompleted } }));
  const handleDelete = (id) => {
    const taskToDelete = tasks.find(t => t._id === id);
    setDeletingTask(taskToDelete);
  };
  const handleConfirmDelete = () => { if (deletingTask) dispatch(deleteTask(deletingTask._id)); };

  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const completionPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* ── Top Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1a1730] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{pendingTasks.length}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Pending</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1a1730] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <ListChecks size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{completedTasks.length}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Completed</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1730] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{completionPercent}%</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Progress</p>
          </div>
        </div>
      </div>

      {/* ── AI Insights Box ── */}
      <AISummaryCard />


      {/* ── My Tasks Section ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your daily goals and stay productive.</p>
          </div>
          <button onClick={handleCreate} className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-primary-500/20">
            <Plus size={18} strokeWidth={2.5} />
            Add Task
          </button>
        </div>

        {status === 'loading' && tasks.length === 0 && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {status === 'succeeded' && tasks.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            <div className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center">
              <ListChecks size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No tasks yet</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400 mb-6">Start organizing your day.</p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pendingTasks.map((task) => (
              <TaskCard key={task._id} task={task} onToggleStatus={handleToggleStatus} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
            {completedTasks.map((task) => (
              <TaskCard key={task._id} task={task} onToggleStatus={handleToggleStatus} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask ? 'Edit Task' : 'Create Task'} variant={editingTask ? 'side' : 'center'}>
        <TaskForm task={editingTask} onSuccess={handleCloseModal} onCancel={handleCloseModal} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={deletingTask?.title}
      />
    </div>
  );
};
