const Task = require("../models/task");
const User = require("../models/user");

module.exports = {
  //
  createTask: async (req, res) => {
    try {
      const date = new Date(req.body.dueDate);
      let task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: date,
        members: req.body.members,
        taskStatus: req.body.taskStatus,
        tag: req.body.tag,
        comments: req.body.comments,
        // dueDate: req.body.dueDate,
      });
      task = await task.save();
      res.status(200).json(task);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  //
  editTask: async (req, res) => {
    try {
      const date = new Date(req.body.dueDate);
      let task = await Task.findById({ _id: req.params["taskId"] });
      if (!task) {
        return res.status(400).json({
          msg: "Task does not Exist!!",
        });
      }
      task.title = req.body.title;
      task.dueDate = date;
      task.description = req.body.description;
      task.members = req.body.members;
      task.taskStatus = req.body.taskStatus;
      task.tag = req.body.tag;
      task.comments = req.body.comments;
      task = await task.save();
      res.status(200).json(task);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  //
  assignTask: async (req, res) => {
    try {
      let task = await Task.findById({ _id: req.params["taskId"] });
      if (req.body.members.length == 0) {
        return res.status(400).json({ error: "Atleast One Member Required." });
      }
      task.members = req.body.members;
      for (mem in req.body.members) {
        const user = await User.findByIdAndUpdate(
          { _id: mem },
          { $push: { tasks: req.params["taskId"] } }
        );
      }
      task = await task.save();
      res.status(200).json(task);
    } catch (e) {
      res.status(400).json(e);
    }
  },
  //
  taskList: async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json(tasks);
    } catch (e) {
      res.status(400).json(e);
    }
  },
  //
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndRemove({ _id: req.params["taskId"] });
      if (!task) {
        return res.status(400).json({
          msg: "Task does not Exist!!",
        });
      }
      res.status(200).json(task);
    } catch (e) {
      res.status(400).json(e);
    }
  },
  //
  progressTrack: async (req, res) => {
    try {
      const task = await Task.findById({
        _id: req.params["taskId"],
      });
      if (!task) {
        return res.status(400).json({
          msg: "Task does not Exist!!",
        });
      }
      task.taskStatus = req.body.taskStatus;
      res.status(200).json(task);
    } catch (e) {
      res.status(400).json(e);
    }
  },
};
