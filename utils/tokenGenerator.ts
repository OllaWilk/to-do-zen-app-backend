import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createToken = (id: string, expiresIs: string) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: `${expiresIs}`,
  });
};
