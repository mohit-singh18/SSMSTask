const Task = require("../models/task");
const User = require("../models/user");
const fun = require('../templatefunctions/functions');

module.exports = {
  //
  createTask: async (req, res) => {
    try {
      const date = new Date(req.body.dueDate);
      let task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: date,
        taskStatus: req.body.taskStatus,
        tag: req.body.tag,
        comments: req.body.comments,
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
      let fcmtokens = [];
      for (let mem of req.body.members) {
        const user = await User.findById({ _id: mem });
        fcmtokens.push(user.fcmtoken);
      }
      const message = {
        notification: {
          title: "Task Updates",
          body: `${req.body.title} Updated`,
        },
        token: fcmtokens,
      };
      fun.sendPushNotification(message);
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
      let fcmtokens = [];
      for (let mem of req.body.members) {
        const user = await User.findById({ _id: mem });
        fcmtokens.push(user.fcmtoken);
      }
      const message = {
        notification: {
          title: "Task Updates",
          body: `${req.body.title} Task Assigned`,
        },
        token: fcmtokens,
      };
      fun.sendPushNotification(message);
      task = await task.save();
      res.status(200).json(task);
    } catch (e) {
      res.status(400).json(e);
    }
  },
  //
  taskList: async (req, res) => {
    //query
    const filters = req.query;
    //
    try {
      const tasks = await Task.find();
      if (Object.keys(filters).length != 0) {
        const filteredtasks = tasks.filter((task) => {
          let isValid = true;
          if (filters["members"]) {
            const members = filters["members"].split(" ");
            for (let member of members) {
              isValid = isValid && task["members"].includes(member);
            }
          }
          for (key in filters) {
            if (key == "members") continue;
            isValid = isValid && task[key] == filters[key];
          }
          return isValid;
        });
        return res.status(200).json(filteredtasks);
      }
      res.status(200).json(tasks);
    } catch (e) {
      res.status(400).json(e);
    }
  },
  //
  userTaskList: async (req, res) => {
    //query
    const filters = req.query;
    //

    // paramerts
    const userId = req.params["userId"];
    //

    try {
      const tasks = await Task.find({ members: userId });

      if (Object.keys(filters).length != 0) {
        const filteredtasks = tasks.filter((task) => {
          let isValid = true;
          if (filters["members"]) {
            const members = filters["members"].split(" ");
            for (let member of members) {
              isValid = isValid && task["members"].includes(member);
            }
          }
          for (key in filters) {
            if (key == "members") continue;
            isValid = isValid && task[key] == filters[key];
          }
          return isValid;
        });
        return res.status(200).json(filteredtasks);
      }

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
