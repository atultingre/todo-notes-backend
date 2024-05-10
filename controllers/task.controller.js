const User = require("../models/user.model");

const createTask = async (req, res) => {
  const { userId } = req.params;
  const { title, description, status } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the task object
    const task = {
      title: title,
      description: description,
      status: status || false,
    };

    // Add the task to the user's tasks array
    user.tasks.push(task);

    // Save the updated user object
    const createdTask = await user.save();

    res.status(201).json({ message: "Task created successfully", createdTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTasks = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return all tasks of the user
    res.status(200).json({ tasks: user.tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  const { userId, taskId } = req.params;
  console.log("userId, taskId: ", userId, taskId);

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the task to delete
    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the task from the user's tasks array
    user.tasks.splice(taskIndex, 1);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addSubTask = async (req, res) => {
  // const { id } = req.params;

  const { taskId, description, status } = req.body;

  try {
    // Find the user by taskId
    const user = await User.findOne({ "tasks._id": taskId });
    if (!user) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the task within the user's tasks array
    const task = user.tasks.find((task) => task._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Create the subtask object
    const subTask = {
      description: description,
      status: status || false,
    };

    // Add the subtask to the task's subTasks array
    task.subTasks.push(subTask);

    // Save the updated user object
    await user.save();

    res.status(201).json({ message: "Subtask added successfully", subTask });
  } catch (error) {
    console.error("Error adding subtask:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSubTask = async (req, res) => {
  const { userId, taskId, subTaskId } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the task within the user's tasks array
    const task = user.tasks.find((task) => task._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the index of the subtask to delete
    const subTaskIndex = task.subTasks.findIndex(
      (subTask) => subTask._id.toString() === subTaskId
    );
    if (subTaskIndex === -1) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    // Remove the subtask from the task's subTasks array
    task.subTasks.splice(subTaskIndex, 1);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateTask = async (req, res) => {
  const { userId, taskId } = req.params;
  const { title, description, status } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the task by taskId
    const task = user.tasks.find((task) => task._id.toString() === taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task properties
    if (title) task.title = title;
    if (description) task.description = description;
    if (status !== undefined) task.status = status;

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  addSubTask,
  deleteSubTask,
};
