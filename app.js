//modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");

//Routes
const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");

//models
const Task = require("./models/task");
//
const app = express();

//INIT
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((e) => {
    console.log(`${e}`);
  });
//

//routes
app.use(authRouter);
app.use(taskRouter);
app.get("/", (req, res) => {
  res.end("SSMS Task");
});

//Notification Schedules

cron.schedule("0 */12 * * *", async () => {
  const date = new Date();
  const tasks = await Task.find();
  tasks.forEach(async (item, index) => {
    if (item.dueDate.getDate() - date.getDate() < 0) {
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        { reminder: "DeadLine Exceeded !! " }
      );
    } else if (item.dueDate.getDate() - date.getDate() == 1) {
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        { reminder: "DeadLine Tommorow." }
      );
    } else if (item.dueDate.getDate() - date.getDate() == 0) {
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        { reminder: "Today is the DeadLine !!" }
      );
    } else if (item.dueDate.getDate() - date.getDate() <= 4) {
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        { reminder: "Due Date Approaching." }
      );
    }
  });
});

//
//server listening
app.listen(process.env.PORT, () => {
  console.log(`listening to port ${process.env.PORT}`);
});
