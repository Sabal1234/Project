import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import taskRouter from './routes/task.routes.js';
import authRouter from './routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();


app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);



app.listen(3000, () => {        
  console.log('Server is running on port 3000');
});
