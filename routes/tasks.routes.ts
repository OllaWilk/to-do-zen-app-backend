import { Router } from 'express';
import { TaskRecord } from '../records/task.record';
import { ValidationError } from '../utils/errors';

export const tasksRouter = Router();

tasksRouter
  .get('/', async (req, res) => {
    const taskRecord = await TaskRecord.getAll();
    res.json({ taskRecord });
  })
  .get('/:id', async (req, res) => {
    const taskId = req.params.id;
    const task = await TaskRecord.getOne(taskId);

    if (!task) {
      throw new ValidationError('There is no such task');
    }

    res.json(task);
  });
