const Task = require("../models/task");
const User = require("../models/user");
const taskController = require('../controllers/taskController')
const express = require('express');
const auth = require("../middlewares/auth")
const router = express.Router();

router.post('/createTask', auth.auth ,taskController.createTask)
router.get('/taskList', auth.auth,taskController.taskList)
router.post('/editTask/:taskId', auth.auth,taskController.editTask)
router.put('/progressTrack/:taskId', auth.auth,taskController.progressTrack)
router.delete('/deleteTask/:taskId', auth.auth,taskController.deleteTask)
router.post('/assignTask/:taskId', auth.auth,taskController.assignTask)




module.exports = router;