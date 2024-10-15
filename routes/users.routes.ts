import { Request, Response, Router } from 'express';
import {
  getAllUsers,
  loginUser,
  logoutUser,
  signupUser,
} from '../controllers/usersController';
import { requireAuth } from '../utils/requireAuth';
import { UserEntity } from '../types';

interface CustomRequest extends Request {
  user?: UserEntity;
}

export const usersRouter = Router();

usersRouter
  // Apply the requireAuth middleware only to the GET / route
  .get('/me', requireAuth, (req: CustomRequest, res) => {
    res.json(req.user);
  })

  // Routes without authentication
  .post('/login', loginUser)
  .post('/signup', signupUser)
  .post('/logout', logoutUser);
