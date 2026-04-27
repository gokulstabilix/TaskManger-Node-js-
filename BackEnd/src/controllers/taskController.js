const Task = require("../models/Task");
const catchAsync = require("../utils/catchAsync");
const aiService = require("../services/aiService");

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = catchAsync(async (req, res) => {
  const newTask = await Task.create(req.body);

  res.status(201).json({
    status: "success",
    data: newTask,
  });
});

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find();

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: tasks,
  });
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: task,
  });
});

// @desc    Update a task
// @route   PATCH /api/tasks/:id
exports.updateTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "No task found with that ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: task,
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "No task found with that ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// @desc    Get an AI-generated summary of all tasks
// @route   GET /api/tasks/ai-summary
exports.getAiSummary = catchAsync(async (req, res, next) => {
  // 1. Fetch all tasks from MongoDB
  const tasks = await Task.find();

  if (tasks.length === 0) {
    return res.status(200).json({
      status: "success",
      data: {
        summary:
          "You don't have any tasks yet! Add some to get an AI summary. 📝",
      },
    });
  }

  // 2. Pass the tasks to our AI Service
  const summary = await aiService.summarizeTasks(tasks);

  // 3. Send the AI's "thought" back to the user
  res.status(200).json({
    status: "success",
    data: {
      summary,
    },
  });
});
