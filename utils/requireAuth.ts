import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRecord } from '../records/user.record';
import { UserEntity } from '../types';

interface CustomRequest extends Request {
  user: UserEntity;
}

export const requireAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.SECRET) as JwtPayload;

    if (!id) {
      throw new Error('Invalid token');
    }
    const user = await UserRecord.getOneById(id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};
