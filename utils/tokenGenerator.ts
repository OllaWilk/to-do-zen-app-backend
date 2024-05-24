import jwt from 'jsonwebtoken';

export const createToken = (id: string, expiresIs: string) => {
  return jwt.sign({ id }, 'dfadlfjadlfjaldfjaldfjaldfjalfjaldjf', {
    expiresIn: `${expiresIs}`,
  });
};
