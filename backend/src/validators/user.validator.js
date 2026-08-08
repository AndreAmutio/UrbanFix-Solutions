import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('El nombre debe ser un texto')
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .trim(),

  body('phone')
    .optional()
    .isString()
    .withMessage('El teléfono debe ser un texto')
    .trim(),

  body('address')
    .optional()
    .isString()
    .withMessage('La dirección debe ser un texto')
    .trim(),
];
