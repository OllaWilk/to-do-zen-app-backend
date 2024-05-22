import { Router } from 'express';
import { EventRecord } from '../records/event.record';
import { ValidationError } from '../utils/errors';

export const eventsRouter = Router();

eventsRouter
  .get('/', async (req, res) => {
    const eventRecord = await EventRecord.getAll();
    res.json({ eventRecord });
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
      id: req.body.id,
      title: req.body.title,
      created_at: req.body.created_at,
      price: Number(req.body.price),
      date: req.body.date,
      status: req.body.status,
      description: req.body.description,
      url: req.body.url,
      lat: Number(req.body.lat),
      lon: Number(req.body.lon),
      category: req.body.category,
      duration: req.body.duration,
      reminder: Number(req.body.reminder),
      creator_id: req.body.creator_id,
    });

    await event.insert();
    res.json(event);
    res.end();
  })

  .patch('/:id', async (req, res) => {
    const event = await EventRecord.getOne(req.params.id);
    const updatedEventData = {
      created_at: new Date(),
      title: req.body.title,
      price: Number(req.body.price),
      date: req.body.date,
      status: req.body.status,
      description: req.body.description,
      url: req.body.url,
      lat: Number(req.body.lat),
      lon: Number(req.body.lon),
      category: req.body.category,
      duration: req.body.duration,
      reminder: Number(req.body.reminder),
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
      throw new ValidationError('No such event');
    }

    await event.delete();
    res.json(event);
    res.end();
  });
