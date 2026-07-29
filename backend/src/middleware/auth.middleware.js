import { verifyToken } from '../utils/jwt.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AuthenticationError('Token no proporcionado'));
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    next(new AuthenticationError('Token inválido o expirado'));
  }
};
