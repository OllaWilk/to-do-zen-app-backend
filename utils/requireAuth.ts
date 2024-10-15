import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRecord } from '../records/user.record';
import { UserCustomRequest, UserEntity } from '../types';

interface CustomRequest extends Request {
  user: UserEntity;
}

export const requireAuth = async (
  req: CustomRequest | UserCustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Read the token from the cookie
  const token = req.cookies.token;

  console.log('TOKEN', token);
  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // Verify the token using the secret key
    const { id } = jwt.verify(token, process.env.SECRET) as JwtPayload;

    if (!id) {
      throw new Error('Invalid token');
    }

    // Fetch the user from the database by ID
    const user = await UserRecord.getOneById(id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach the user to the request object for further uses
    req.user = user;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ error: 'Request is not authorized' });
    res.send(req.cookies);
  }
};
