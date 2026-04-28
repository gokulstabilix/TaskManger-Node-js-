const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "A task title must have at least 3 characters"],
    maxlength: [50, "Title must be at most 50 characters long"],
  },
  description: {
    type: String,
    required: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    required: [true, "Priority is required"],
    enum: {
      values: ["low", "medium", "high"],
      message: "{VALUE} is not a valid priority"
    },
    default: "medium"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
