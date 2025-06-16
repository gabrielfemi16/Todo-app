const multer = require("multer");
const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const path = require("path");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const getTask = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId: userId }).sort({
      createdAt: -1,
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No task found" });
    }
    res.status(200).json({ tasks });
  } catch (err) {
    console.log(err);
  }
};

const getSingleTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching task" });
  }
};

const createTask = async (req, res) => {
  try {
    const { taskName, taskDate } = req.body;
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ message: "invalid user id" });
    }

    if (!taskName || !taskDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTask = new Task({
      taskName: taskName,
      taskDate: taskDate,
      userId: userId,
    });

    const savedTask = await newTask.save();
    console.log(savedTask);
    res.status(200).json({ message: "Task created succefully", task: newTask });
  } catch (err) {
    console.log(err);
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskName, taskDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ message: "invalid task id" });
    }

    if (!taskName || !taskDate) {
      return res.status(404).json({ message: "All fields are required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { taskName: taskName, taskDate: taskDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.log(err);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ message: "invalid task id" });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const username = req.body.username;
    const image = req.file?.filename;

    if (!username && !image) {
      return res.status(400).json({ message: "All fields required" });
    }

    const updateData = {};
    updateData.username = username;
    updateData.image = image;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    // $set operator is used to update a document by setting the value of a field, creating a new field if one dosen't exist, or replacing the value of an existing filed

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newToken = JWT.sign(
      {
        id: updateUser._id,
        isAdmin: updateUser.isAdmin,
        username: updateUser.username,
        email: updateUser.email,
        image: updateUser.image,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwtToken", newToken, {
      httpOnly: true,
      maxAge: 86400 * 1000,
    });

    res
      .status(200)
      .json({ message: "Profile updated Successfully", user: updateUser });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleTaskDone = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.done = !task.done; // change to true or false depending on the existing value
    await task.save();
    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error toggling task done status" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  updateUser,
  getTask,
  getSingleTask,
  toggleTaskDone,
  upload,
};
