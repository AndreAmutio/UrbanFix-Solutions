import { AuthorizationError } from '../errors/AuthorizationError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError());
    }
    next();
  };
};
