import { body, param, query } from 'express-validator';
import { SERVICE_STATUS } from '../utils/constants.js';

const validStatuses = Object.values(SERVICE_STATUS);

export const filterSolicitudesValidator = [
  query('status')
    .optional()
    .isIn(validStatuses)
    .withMessage(`El estado debe ser uno de: ${validStatuses.join(', ')}`),
];

export const changeStatusValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El id debe ser un número entero positivo')
    .toInt(),

  body('status')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isIn(validStatuses)
    .withMessage(`El estado debe ser uno de: ${validStatuses.join(', ')}`),
];
