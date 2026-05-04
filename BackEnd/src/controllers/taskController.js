const Task = require("../models/Task");
const catchAsync = require("../utils/catchAsync");
const aiService = require("../services/aiService");

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = catchAsync(async (req, res, next) => {
  // 1. Grab the user ID from the 'protect' middleware
  // 2. Add it to the data from the request body
  const taskData = {
    ...req.body,
    user: req.user.id // 👈 Automatically linking the logged-in user!
  };

  const newTask = await Task.create(taskData);

  res.status(201).json({
    status: 'success',
    data: { task: newTask }
  });
});

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = catchAsync(async (req, res) => {
  // const tasks = await Task.find();
  const tasks = await Task.find({ user: req.user.id }); // <--- FIX

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: tasks,
  });
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
exports.getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id).where('user').equals(req.user.id);

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
  // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });


  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id }, // <--- FIX
    req.body,
    { new: true, runValidators: true }
  );

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
  // const task = await Task.findByIdAndDelete(req.params.id);

  const task = await Task.findOneAndDelete(
    { _id: req.params.id, user: req.user.id } // <--- FIX
  );

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
  const tasks = await Task.find({ user: req.user.id });

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

// @desc    Chat with the AI about your tasks
// @route   POST /api/tasks/chat
exports.chatWithTasks = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    const error = new Error('Please provide a message');
    error.statusCode = 400;
    return next(error);
  }

  // 1. Get the context (all tasks)
  const tasks = await Task.find({ user: req.user.id });

  // 2. Get the AI's response
  const response = await aiService.chatWithTasks(tasks, message);

  // 3. Send back the answer
  res.status(200).json({
    status: 'success',
    data: {
      reply: response
    }
  });
});