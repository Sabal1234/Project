import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask } from '../controller/task.controller.js';
const taskRouter = express.Router();
import { isLoggedin } from '../middleware/auth.middleware.js'; 


taskRouter.post('/create', isLoggedin, createTask);
taskRouter.get('/', isLoggedin, getAllTasks);
taskRouter.put('/update',isLoggedin,  updateTask);
taskRouter.delete('/delete', isLoggedin,  deleteTask);

export default taskRouter;
