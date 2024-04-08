import { Router } from 'express';
import { TaskRecord } from '../records/task.record';

export const tasksRouter = Router();

tasksRouter.get('/', async (req, res) => {
  const taskRecord = await TaskRecord.getAll();
  res.json({ taskRecord });
});
