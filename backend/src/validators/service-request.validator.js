import { body, param } from 'express-validator';
import { SERVICE_STATUS, SERVICE_CATEGORIES } from '../utils/constants.js';

const validStatuses = Object.values(SERVICE_STATUS);
const validCategories = Object.values(SERVICE_CATEGORIES);

export const createServiceRequestValidator = [
  body('title')
    .notEmpty()
    .withMessage('El título es requerido')
    .bail()
    .isString()
    .withMessage('El título debe ser un texto')
    .trim(),

  body('description')
    .notEmpty()
    .withMessage('La descripción es requerida')
    .bail()
    .isString()
    .withMessage('La descripción debe ser un texto')
    .trim(),

  body('category')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .bail()
    .isIn(validCategories)
    .withMessage(`La categoría debe ser: ${validCategories.join(', ')}`),

  body('address')
    .optional()
    .isString()
    .withMessage('La dirección debe ser un texto')
    .trim(),

  body('scheduledDate')
    .notEmpty()
    .withMessage('La fecha y hora son requeridas')
    .bail()
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido (ISO 8601)')
    .toDate(),
];

export const serviceRequestParamValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El id debe ser un número entero positivo')
    .toInt(),
];

export const updateStatusValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El id debe ser un número entero positivo')
    .toInt(),

  body('status')
    .notEmpty()
    .withMessage('El estado es requerido')
    .bail()
    .isIn(validStatuses)
    .withMessage(`El estado debe ser uno de: ${validStatuses.join(', ')}`),
];
