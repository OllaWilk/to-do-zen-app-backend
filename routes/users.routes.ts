import { Router } from 'express';
import { ValidationError } from '../utils/errors';
import { UserRecord } from '../records/user.record';

export const usersRouter = Router();

usersRouter
  .get('/', async (req, res) => {
    const usersRecord = await UserRecord.getAll();
    res.json({ usersRecord });
  })

  .post('/login', async (req, res) => {})

  .post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const exists = await UserRecord.getOne(email);

    if (exists) {
      throw new ValidationError(
        'It looks like you already have an account with us. Please try logging in'
      );
    }
    const user = new UserRecord({
      ...req.body,
      email,
      password_hash: password,
    });
    await user.addOne();
    res.status(200).json(user);

    res.end();
  });
