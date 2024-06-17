import { Router } from 'express';
import { EventRecord } from '../records/event.record';
import { ValidationError } from '../utils/errors';
import { requireAuth } from '../utils/requireAuth';
import { UserCustomRequest } from '../types';

export const eventsRouter = Router();

// Middleware to verify authentications
eventsRouter.use(requireAuth);

eventsRouter
  // Route to get all events for the authenticated user
  .get('/', async (req: UserCustomRequest, res) => {
    try {
      const user_id = req.user.id;
      const eventRecord = await EventRecord.getAll(user_id);
      res.json({ eventRecord });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  // Route to get a single event by its ID
  .get('/:id', async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await EventRecord.getOne(eventId);

      if (!event) {
        throw new ValidationError('There is no such event');
      }

      res.json(event);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  })
  // Route to create a new event
  .post('/', async (req: UserCustomRequest, res) => {
    try {
      const user_id = req.user.id;

      const event = new EventRecord({
        ...req.body,
        id: req.body.id,
        created_at: req.body.created_at,
        creator_id: user_id,
      });

      await event.insert();
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  // Route to update an existing event
  .patch('/:id', async (req, res) => {
    try {
      const event = await EventRecord.getOne(req.params.id);
      if (!event) {
        throw new ValidationError('Event not found');
      }

      const updatedEventData = {
        title: req.body.title,
        price: Number(req.body.price),
        created_at: new Date(),
        event_date: req.body.event_date,
        status: req.body.status,
        description: req.body.description,
        url: req.body.url,
        lat: Number(req.body.lat),
        lon: Number(req.body.lon),
        category: req.body.category,
        duration: req.body.duration,
        reminder: Number(req.body.reminder),
      };
      console.log(req.body);
      await event.update(updatedEventData);
      res.json(updatedEventData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  // Route to delete an event
  .delete('/:id', async (req, res) => {
    try {
      const event = await EventRecord.getOne(req.params.id);

      if (!event) {
        throw new ValidationError('No such event');
      }

      await event.delete();
      res.json(event);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
