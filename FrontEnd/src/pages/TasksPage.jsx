import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { fetchTasks, updateTask, deleteTask } from "../store/taskSlice";
import { TaskForm } from "../components/TaskForm";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { cn } from "../utils/cn";

export const TasksPage = () => {
  const dispatch = useDispatch();
  const { items: tasks, status } = useSelector((state) => state.tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
    setTimeout(() => setEditingTask(null), 300);
  };

  const handleDelete = (task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      dispatch(deleteTask(deletingTask._id));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending" && task.isCompleted) return false;
    if (filter === "Completed" && !task.isCompleted) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Management</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1a1730] border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl shrink-0">
            <span className="text-sm text-gray-500 font-medium px-2">Status</span>
            {["All", "Pending", "Completed"].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => setFilter(statusOption)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  filter === statusOption
                    ? "bg-white dark:bg-[#1a1730] text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/10"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {statusOption}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md shadow-primary-500/20 shrink-0"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Task
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1a1730] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Select</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => dispatch(updateTask({ id: task._id, taskData: { isCompleted: !task.isCompleted } }))}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={cn("text-sm font-semibold", task.isCompleted ? "text-gray-400 line-through" : "text-gray-900 dark:text-white")}>
                        {task.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] lg:max-w-xs">
                        {task.description || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        task.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" :
                        task.priority === "medium" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" :
                        "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300"
                      )}>
                        {task.priority || "LOW"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        task.isCompleted
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                      )}>
                        {task.isCompleted ? "COMPLETED" : "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 bg-gray-100 dark:bg-white/10 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-100 dark:bg-white/10 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No tasks found. Try adjusting your filters or create a new task.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTask ? "Edit Task" : "Create Task"} variant={editingTask ? "side" : "center"}>
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
