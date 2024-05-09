import { Router } from 'express';
import { EventRecord } from '../records/event.record';
import { ValidationError } from '../utils/errors';

export const eventsRouter = Router();

eventsRouter
  .get('/', async (req, res) => {
    const eventsRecord = await EventRecord.getAll();
    res.json({ eventsRecord });
  })
  .get('/:id', async (req, res) => {
    const eventId = req.params.id;
    const event = await EventRecord.getOne(eventId);

    if (!event) {
      throw new ValidationError('There is no such event');
    }

    res.json(event);
  })

  .post('/', async (req, res) => {
    const event = new EventRecord({
      ...req.body,
      title: req.body.title,
      category: req.body.category,
      priority: req.body.priority,
      description: req.body.description,
    });

    await event.insert();
    res.json(event);
    res.end();
    console.log(event);
  })

  .patch('/:id', async (req, res) => {
    const event = await EventRecord.getOne(req.params.id);
    const updatedEventData = {
      title: req.body.title,
      category: req.body.category,
      priority: req.body.priority,
      description: req.body.description,
    };

    if (!event) {
      throw new ValidationError('Event not found');
    }

    await event.update(updatedEventData);
    res.json(updatedEventData);
    res.end();
  })

  .delete('/:id', async (req, res) => {
    const event = await EventRecord.getOne(req.params.id);

    if (!event) {
      throw new ValidationError('No such gift');
    }

    await event.delete();
    res.json(event);
    res.end();
  });
