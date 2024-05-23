import { Router } from 'express';
import { ValidationError } from '../utils/errors';
import { UserRecord } from '../records/user.record';

export const usersRouter = Router();

usersRouter
  .get('/', async (req, res) => {
    const usersRecord = await UserRecord.getAll();
    res.json({ usersRecord });
  })
  .post('/login', async (req, res) => {
    const user = new UserRecord({
      ...req.body,
      id: req.body.id,
      username: req.body.username,
      email: req.body.email,
      created_at: req.body.created_at,
      password_hash: req.body.password_hash,
    });

    await user.insert();
    res.json(user);
  })
  .post('/signup', async (req, res) => {
    res.json({ message: 'signin' });
  });
