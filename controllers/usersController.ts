import { Response, Request } from 'express';
import { UserRecord } from '../records/user.record';
import { createToken } from '../utils/tokenGenerator';
import { ValidationError } from '../utils/errors';

const isProduction = process.env.NODE_ENV === 'production';

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

    /* Create cookie with token */
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });

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

    /* Create cookie with token */
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      sameSite: 'none',
      domain: '.splotapp.eu',
    });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    maxAge: 1,
  });

  res.status(200).json({ message: 'Logged out successfully' });
};
