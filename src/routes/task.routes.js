import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask } from '../controller/task.controller.js';
const taskRouter = express.Router();

taskRouter.post('/create', createTask);
taskRouter.get('/', getAllTasks);
taskRouter.put('/update', updateTask);
taskRouter.delete('/delete', deleteTask);

export default taskRouter;
