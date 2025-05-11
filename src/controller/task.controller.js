import Task from '../model/task.schema.js';
import User from '../model/user.schema.js'; 

export const createTask = async (req, res) => {
  const { title, description, status, dueDate, assignedTo } = req.body;

  try {
    const assignedUser = await User.findOne({ email: assignedTo });
    const createdByUser = await User.findOne({ email: req.user.email });

    if (!assignedUser) {
      return res.status(400).json({ message: "Assigned user not found" });
    }

    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      assignedTo, 
      createdBy: req.user.email, 
    });

    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo createdBy', 'email name');
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { taskId, title, description, status, dueDate, assignedTo } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (assignedTo) {
      const assignedUser = await User.findOne({ email: assignedTo });
      if (!assignedUser) {
        return res.status(400).json({ message: "Assigned user not found" });
      }
      task.assignedTo = assignedTo;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.remove();
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};
