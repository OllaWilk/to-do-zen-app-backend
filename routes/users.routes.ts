import { Router } from 'express';
import bcrypt from 'bcrypt';
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
    const { email, password, username } = req.body;
    if (!email) {
      throw new ValidationError('Email and password fields cannot be empty.');
    }

    const exists = await UserRecord.getOne(email);

    if (exists) {
      throw new ValidationError(
        'This email is already in use. Please use a different email or try logging in.'
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = new UserRecord({
        ...req.body,
        username: username,
        email: email,
        password_hash: hash,
      });

      await user.signup();
      res.status(200).json(user);
    }

    res.end();
  });
