const Task = require('../models/Task');
const catchAsync = require('../utils/catchAsync');

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = catchAsync(async (req, res) => {
  const newTask = await Task.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newTask
  });
});

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find();

  res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: tasks
  });
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      status: 'fail',
      message: 'Task not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: task
  });
});

// @desc    Update a task
// @route   PATCH /api/tasks/:id
exports.updateTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!task) {
    return res.status(404).json({
      status: 'fail',
      message: 'No task found with that ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: task
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = catchAsync(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      status: 'fail',
      message: 'No task found with that ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});