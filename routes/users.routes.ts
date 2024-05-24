import { Router } from 'express';
import { ValidationError } from '../utils/errors';
import { createToken } from '../utils/tokenGenerator';
import { UserRecord } from '../records/user.record';

export const usersRouter = Router();

usersRouter
  .get('/', async (req, res) => {
    const usersRecord = await UserRecord.getAll();
    res.json({ usersRecord });
  })

  .post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserRecord.login(email, password);
      const token = createToken(user.id, '3d');
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })

  .post('/signup', async (req, res) => {
    try {
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

      await user.signup();

      const token = createToken(user.id, '3d');

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
