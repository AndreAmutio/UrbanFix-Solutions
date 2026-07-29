import { body } from 'express-validator';
import { USER_ROLES } from '../utils/constants.js';

const validRoles = Object.values(USER_ROLES);

export const registerValidator = [
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .bail()
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .bail()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),

  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .bail()
    .isString()
    .withMessage('El nombre debe ser un texto')
    .trim(),

  body('role')
    .notEmpty()
    .withMessage('El rol es requerido')
    .bail()
    .isIn(validRoles)
    .withMessage(`El rol debe ser uno de: ${validRoles.join(', ')}`),

  body('phone')
    .optional()
    .isString()
    .withMessage('El teléfono debe ser un texto')
    .trim(),
];

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .bail()
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail(),

  body('password').notEmpty().withMessage('La contraseña es requerida'),
];
