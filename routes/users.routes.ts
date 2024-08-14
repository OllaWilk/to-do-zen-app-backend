import { Router } from 'express';
import {
  getAllUsers,
  loginUser,
  logoutUser,
  signupUser,
} from '../controllers/usersController';
import { requireAuth } from '../utils/requireAuth';

export const usersRouter = Router();

usersRouter
  // Apply the requireAuth middleware only to the GET / route
  .get('/', requireAuth, getAllUsers)

  // Routes without authentication
  .post('/login', loginUser)
  .post('/signup', signupUser)
  .post('/logout', logoutUser);
