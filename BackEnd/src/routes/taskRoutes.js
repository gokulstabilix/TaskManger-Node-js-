const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// This maps to POST http://localhost:3000/api/tasks/
router.post("/", taskController.createTask);

// This maps to GET http://localhost:3000/api/tasks/
router.get("/", taskController.getTasks);

// This route is unique because it doesn't return raw data, but an AI insight
router.get("/ai-summary", taskController.getAiSummary);

// This maps to GET http://localhost:3000/api/tasks/:id
router.get("/:id", taskController.getTaskById);
// This maps to PATCH http://localhost:3000/api/tasks/:id
router.patch("/:id", taskController.updateTask);
// This maps to DELETE http://localhost:3000/api/tasks/:id
router.delete("/:id", taskController.deleteTask);

// Put this with your other specialized routes
router.post('/chat', taskController.chatWithTasks);

module.exports = router;
