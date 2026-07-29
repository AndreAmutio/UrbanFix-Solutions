import { AppError } from './AppError.js';

export class AuthorizationError extends AppError {
  constructor(message = 'No tenés permiso para acceder a este recurso') {
    super(message, 403);
  }
}
