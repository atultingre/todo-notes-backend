const express = require("express");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  addSubTask,
} = require("../controllers/task.controller");
const router = express.Router();

router.get("/:userId", getAllTasks);
router.post("/:userId/create", createTask);
router.delete("/:userId/delete/:taskId", deleteTask);
router.post("/:userId/update/:taskId", updateTask);
router.post("/:userId/:taskId/subtask", addSubTask);
router.post("/delete/subtask", deleteTask);

module.exports = router;
