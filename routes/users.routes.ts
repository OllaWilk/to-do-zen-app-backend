import { Router } from 'express';
import {
  getAllUsers,
  loginUser,
  signupUser,
} from '../controllers/usersController';

export const usersRouter = Router();

usersRouter
  .get('/', getAllUsers)
  .post('/login', loginUser)

  .post('/signup', signupUser);
