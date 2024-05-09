const express = require("express");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  addSubTask,
} = require("../controllers/task.controller");
const router = express.Router();

router.get("/", getAllTasks);
router.post("/create", createTask);
router.post("/update/:id", updateTask);
router.post("/delete/:id", deleteTask);
router.post("/:id/subtask", addSubTask);

module.exports = router;
