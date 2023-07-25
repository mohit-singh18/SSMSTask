const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
  taskStatus: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started",
  },
  dueDate: { type: Date, required: true },
  tag: { type: String },
  comments: [{ type: String }],
  reminder: { type: String, default: "" },
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
