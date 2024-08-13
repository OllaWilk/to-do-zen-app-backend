import { Router } from 'express';
import { EventRecord } from '../records/event.record';
import { ValidationError } from '../utils/errors';
import { requireAuth } from '../utils/requireAuth';
import { UserCustomRequest } from '../types';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  searchEvents,
  sortEvents,
  updateEvent,
} from '../controllers/eventController';

export const eventsRouter = Router();

// Middleware to verify authentications
eventsRouter.use(requireAuth);

eventsRouter
  .get('/', getAllEvents)
  .get('/search/:title?', searchEvents)
  .get('/sort/:column/:order', sortEvents)
  .get('/:id', getEventById)
  .post('/', createEvent)
  .patch('/:id', updateEvent)
  .delete('/:id', deleteEvent);
