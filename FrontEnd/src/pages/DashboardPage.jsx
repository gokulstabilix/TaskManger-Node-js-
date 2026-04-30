import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LogOut, User, Mail, Shield, CheckSquare,
  Plus, ListChecks, Clock, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchTasks, updateTask, deleteTask } from '../store/taskSlice';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AISummaryCard } from '../components/AISummaryCard';
import { ChatBot } from '../components/chatbot/ChatBot';
import { useDarkMode } from '../hooks/useDarkMode';
import { Sun, Moon } from 'lucide-react';

/**
 * DashboardPage — Unified view combining the user dashboard and task management.
 *
 * Sections:
 *  1. Header with branding, dark-mode toggle, and sign-out
 *  2. Welcome banner with user info cards
 *  3. Full task management (stats, AI summary, task list, CRUD modals)
 *  4. Footer + ChatBot
 */
export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const [isDark, toggleDark] = useDarkMode();

  // ── Task state ────────────────────────────────────────────
  const { items: tasks, status, error } = useSelector((s) => s.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchTasks());
  }, [status, dispatch]);

  // ── Handlers ──────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/signup', { replace: true });
  };

  const handleCreate = () => { setEditingTask(null); setIsModalOpen(true); };
  const handleEdit = (task) => { setEditingTask(task); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setTimeout(() => setEditingTask(null), 200); };
  const handleToggleStatus = (task) => dispatch(updateTask({ id: task._id, taskData: { isCompleted: !task.isCompleted } }));
  const handleDelete = (id) => setDeletingTaskId(id);
  const handleConfirmDelete = () => { if (deletingTaskId) dispatch(deleteTask(deletingTaskId)); };

  // ── Derived data ──────────────────────────────────────────
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const completionPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div
          className="h-[2px] w-full"
          style={{ background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 40%, #a855f7 70%, #06b6d4 100%)' }}
          aria-hidden="true"
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <CheckSquare size={28} className="stroke-[2.5]" />
            <span className="text-xl font-bold tracking-tight text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              id="dark-mode-toggle"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              id="logout-btn"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 transition-all duration-200"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="animate-fade-in">
            {/* Welcome Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 p-8 sm:p-10 text-white shadow-xl shadow-primary-500/20 mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'User'} 👋</h1>
              <p className="mt-2 text-white/80 text-sm">Your TaskFlow dashboard — everything in one place.</p>
            </div>

            {/* User Info Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600"><User size={24} /></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Name</p>
                    <p className="text-gray-900 font-semibold">{user?.name || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><Mail size={24} /></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Email</p>
                    <p className="text-gray-900 font-semibold">{user?.email || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><Shield size={24} /></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Status</p>
                    <p className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      Authenticated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              Tasks Section (previously TasksPage)
             ═════════════════════════════════════════════════════════ */}

          {/* Task Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">My Tasks</h2>
              <p className="text-gray-500 mt-1">Manage your daily goals and stay productive.</p>
            </div>
            <Button onClick={handleCreate} className="gap-2 shrink-0">
              <Plus size={18} />
              <span>New Task</span>
            </Button>
          </div>

          {/* Stats Bar */}
          {tasks.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0"><Clock size={20} /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{pendingTasks.length}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pending</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0"><ListChecks size={20} /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{completedTasks.length}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Completed</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 shrink-0"><TrendingUp size={20} /></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{completionPercent}%</p>
                  <p className="text-xs text-gray-500 mt-0.5">Progress</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Summary */}
          <AISummaryCard />

          {/* Loading / Error / Empty states */}
          {status === 'loading' && tasks.length === 0 && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8">
              Failed to load tasks: {error}
            </div>
          )}

          {status === 'succeeded' && tasks.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed animate-fade-in">
              <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
                <ListChecks size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No tasks yet</h3>
              <p className="mt-1 text-gray-500 mb-6 max-w-xs mx-auto">Start organizing your day by creating your first task.</p>
              <Button onClick={handleCreate} variant="outline" className="gap-2">
                <Plus size={16} /> Create Task
              </Button>
            </div>
          )}

          {/* Task Lists */}
          {tasks.length > 0 && (
            <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              {pendingTasks.length > 0 && (
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    <Clock size={14} /> Pending ({pendingTasks.length})
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {pendingTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onToggleStatus={handleToggleStatus} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                  </div>
                </section>
              )}
              {completedTasks.length > 0 && (
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    <ListChecks size={14} /> Completed ({completedTasks.length})
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 opacity-75 hover:opacity-100 transition-opacity">
                    {completedTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onToggleStatus={handleToggleStatus} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Modals */}
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask ? 'Edit Task' : 'Create New Task'}>
            <TaskForm task={editingTask} onSuccess={handleCloseModal} onCancel={handleCloseModal} />
          </Modal>

          <ConfirmDialog
            isOpen={!!deletingTaskId}
            onClose={() => setDeletingTaskId(null)}
            onConfirm={handleConfirmDelete}
            title="Delete Task"
            message="Are you sure you want to delete this task? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
          />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 py-8 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
          <p>TaskFlow Management App &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Built with React, Tailwind CSS, and Redux Toolkit</p>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatBot />
    </div>
  );
};
