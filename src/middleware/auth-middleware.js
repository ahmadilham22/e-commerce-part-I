import jwt from 'jsonwebtoken';
import { ResponseError } from '../error/response-error.js';

const authMiddleware = async (req, res, next) => {
  const authToken = req.header('Authorization');

  if (!authToken) {
    return next(new ResponseError(404, 'Token not found'));
  }

  const token = authToken.split(' ')[1];
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN);

    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export { authMiddleware };
