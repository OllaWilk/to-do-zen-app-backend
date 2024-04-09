import { Router } from 'express';
import { TaskRecord } from '../records/task.record';
import { ValidationError } from '../utils/errors';
import { time } from 'console';

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
  })

  .post('/', async (req, res) => {
    const task = new TaskRecord({
      ...req.body,
      title: req.body.title,
      category: req.body.category,
      reminder: req.body.reminder,
      priority: req.body.priority,
      description: req.body.description,
    });

    await task.insert();
    res.json(task);
    res.end();
  })

  .post('/:id', async (req, res) => {
    const task = await TaskRecord.getOne(req.params.id);
    const validPriorities = ['low', 'medium', 'high'];
    const updatedTaskData = {
      title: req.body.title,
      category: req.body.category,
      reminder: req.body.reminder,
      priority: req.body.priority,
      description: req.body.description,
    };

    if (!task) {
      throw new ValidationError('Task not found');
    }

    console.log(updatedTaskData.category);
    if (!validPriorities.includes(updatedTaskData.priority)) {
      throw new ValidationError(
        'Invalid priority. Please select one of the following priorities: low, medium, high'
      );
    }
    await task.update(updatedTaskData);
    res.json(task);
    res.end();
  });
