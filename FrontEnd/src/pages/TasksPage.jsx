import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, ListChecks, Clock, TrendingUp } from "lucide-react";
import { fetchTasks, updateTask, deleteTask } from "../store/taskSlice";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { AISummaryCard } from "../components/AISummaryCard";

/**
 * TasksPage — The main dashboard page.
 *
 * What changed:
 *  - Added a stats bar showing pending / completed / completion %
 *  - Improved visual hierarchy with section icons
 *  - Added subtle fade-in animations
 *  - Enhanced empty state design
 *
 * All existing functionality (CRUD, modals, confirm dialog) is preserved.
 */
export const TasksPage = () => {
  const dispatch = useDispatch();
  const { items: tasks, status, error } = useSelector((state) => state.tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingTask(null), 200); // Wait for modal animation
  };

  const handleToggleStatus = (task) => {
    dispatch(
      updateTask({
        id: task._id,
        taskData: { isCompleted: !task.isCompleted },
      }),
    );
  };

  const handleDelete = (id) => {
    setDeletingTaskId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingTaskId) {
      dispatch(deleteTask(deletingTaskId));
    }
  };

  // Group tasks
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const completionPercent = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Tasks
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your daily goals and stay productive.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 shrink-0">
          <Plus size={18} />
          <span>New Task</span>
        </Button>
      </div>

      {/* ── Stats Bar ── */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{pendingTasks.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Pending</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0">
              <ListChecks size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{completedTasks.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Completed</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{completionPercent}%</p>
              <p className="text-xs text-gray-500 mt-0.5">Progress</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary — always rendered; card handles its own loading state */}
      <AISummaryCard />

      {status === "loading" && tasks.length === 0 && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {status === "failed" && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8">
          Failed to load tasks: {error}
        </div>
      )}

      {status === "succeeded" && tasks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed animate-fade-in">
          <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-gray-50 rounded-2xl flex items-center justify-center">
            <ListChecks size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No tasks yet</h3>
          <p className="mt-1 text-gray-500 mb-6 max-w-xs mx-auto">
            Start organizing your day by creating your first task.
          </p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus size={16} />
            Create Task
          </Button>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {pendingTasks.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                <Clock size={14} />
                Pending ({pendingTasks.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {pendingTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {completedTasks.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                <ListChecks size={14} />
                Completed ({completedTasks.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 opacity-75 hover:opacity-100 transition-opacity">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          task={editingTask}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
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
  );
};
