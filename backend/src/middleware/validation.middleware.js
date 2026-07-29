import { validationResult } from 'express-validator';
import { ValidationError } from '../errors/ValidationError.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    next(new ValidationError('Error de validación', extractedErrors));
  };
};
