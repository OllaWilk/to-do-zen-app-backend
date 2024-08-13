import { Response, Request } from 'express';
import { UserRecord } from '../records/user.record';
import { createToken } from '../utils/tokenGenerator';
import { ValidationError } from '../utils/errors';

export const getAllUsers = async (req: Request, res: Response) => {
  const usersRecord = await UserRecord.getAll();
  res.json({ usersRecord });
};

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const exists = await UserRecord.getOneByEmail(email);

    if (exists) {
      throw new ValidationError(
        'It looks like you already have an account with us. Please try logging in'
      );
    }

    const user = new UserRecord({
      ...req.body,
      email,
      password: password,
    });

    await user.signup();

    const token = createToken(user.id, '3d');

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserRecord.login(email, password);
    const token = createToken(user.id, '3d');

    /* Create cookie */
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
