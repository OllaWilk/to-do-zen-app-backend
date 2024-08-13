import { Response, Request } from 'express';
import { UserCustomRequest } from '../types';
import { EventRecord } from '../records/event.record';
import { ValidationError } from '../utils/errors';

export const getAllEvents = async (req: UserCustomRequest, res: Response) => {
  try {
    const user_id = req.user.id;
    const eventRecord = await EventRecord.getAll(user_id);
    res.json({ eventRecord });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchEvents = async (req: UserCustomRequest, res: Response) => {
  try {
    const user_id = req.user.id;
    const search = await EventRecord.getAll(user_id, req.params.title);
    res.json(search);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sortEvents = async (req: UserCustomRequest, res: Response) => {
  try {
    const user_id = req.user.id;
    const { column, order } = req.params;

    const sort = await EventRecord.sortBy(
      user_id,
      column,
      order.toUpperCase() as 'ASC' | 'DESC'
    );
    res.json(sort);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
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
};

export const createEvent = async (req: UserCustomRequest, res: Response) => {
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
};

export const updateEvent = async (req: Request, res: Response) => {
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
    await event.update(updatedEventData);
    res.json(updatedEventData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await EventRecord.getOne(req.params.id);

    if (!event) {
      throw new ValidationError('No such event');
    }

    await event.delete();
    res.json({
      message: 'Event and associated photos deleted successfully.',
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
