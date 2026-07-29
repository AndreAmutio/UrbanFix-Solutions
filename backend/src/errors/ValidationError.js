import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message = 'Datos de entrada inválidos', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}
