import { AppError } from '../errors/AppError.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const response = { error: err.message };

    if (err.errors) {
      response.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  console.error('Error no controlado:', err);

  const isDev = process.env.NODE_ENV !== 'production';

  return res.status(500).json(
    isDev
      ? { error: err.message, stack: err.stack }
      : { error: 'Error interno del servidor' },
  );
};
