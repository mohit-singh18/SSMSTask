//modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
var admin = require("firebase-admin");
const fun = require("./templatefunctions/functions");

//Routes
const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");

//models
const Task = require("./models/task");
const User = require("./models/user");
//
const app = express();
var serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

//INIT
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
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
  const users = await User.find();
  const fcmmap = users.map(({ _id, fcmtoken }) => {
    return { [_id]: fcmtoken };
  });
  tasks.forEach(async (item, _) => {
    if (item.dueDate.getDate() - date.getDate() < 0) {
      const message = {
        notification: {
          title: "Reminder",
          body: "DeadLine Exceeded !!",
        },
        token: fcmmap[item._id],
      };
      fun.sendPushNotification(message);
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        {
          $set: {
            reminder: "DeadLine Exceeded !! ",
            priority: "High",
          },
        }
      );
    } else if (item.dueDate.getDate() - date.getDate() == 1) {
      const message = {
        notification: {
          title: "Reminder",
          body: "DeadLine Tommorow.",
        },
        token: fcmmap[item._id],
      };
      fun.sendPushNotification(message);
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        {
          $set: {
            reminder: "DeadLine Tommorow. ",
            priority: "High",
          },
        }
      );
    } else if (item.dueDate.getDate() - date.getDate() == 0) {
      const message = {
        notification: {
          title: "Reminder",
          body: "Today is the DeadLine !!",
        },
        token: fcmmap[item._id],
      };
      fun.sendPushNotification(message);
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        {
          $set: {
            reminder: "Today is the DeadLine !!",
            priority: "High",
          },
        }
      );
    } else if (item.dueDate.getDate() - date.getDate() <= 3) {
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        {
          $set: {
            reminder: "Due Date Approaching.",
            priority: "Medium",
          },
        }
      );
    } else if (item.dueDate.getDate() - date.getDate() > 3) {
      const task = await Task.findByIdAndUpdate(
        { _id: item._id },
        {
          $set: {
            reminder: "Due Date Approaching.",
            priority: "Low",
          },
        }
      );
    }
  });
});

//
//server listening
app.listen(process.env.PORT, () => {
  console.log(`listening to port ${process.env.PORT}`);
});
