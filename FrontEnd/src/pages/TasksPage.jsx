import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { fetchTasks, updateTask, deleteTask } from "../store/taskSlice";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { AISummaryCard } from "../components/AISummaryCard";

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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
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
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="mx-auto h-12 w-12 text-gray-300 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
            <Plus size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
          <p className="mt-1 text-gray-500 mb-6">
            Get started by creating a new task.
          </p>
          <Button onClick={handleCreate} variant="outline">
            Create Task
          </Button>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-8">
          {pendingTasks.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
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
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
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
