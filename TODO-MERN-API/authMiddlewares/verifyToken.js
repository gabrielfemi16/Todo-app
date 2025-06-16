const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Task = require("../models/taskModel");

const verifyJwtToken = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(401).json({ message: "No token.  Unauthorized" });
  }

  JWT.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "invalid or expired token" });
    }

    req.user = decodedToken;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(401).json({ messgae: "No token.  Unauthorized" });
  }

  JWT.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an Admin" });
    }

    req.user = decodedToken;
    next();
  });
};

const isTaskOwnerOrAdmin = async (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token" });
  }

  JWT.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const taskId = req.params.taskId;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(404).json({ message: "Invalid user id" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.userId.toString() === decodedToken.id;
    const isAdmin = decodedToken.isAdmin;

    if (isOwner || isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden. Not allowed." });
    }

    req.user = decodedToken;
  });
};

module.exports = {
  verifyJwtToken,
  isAdmin,
  isTaskOwnerOrAdmin,
};

