import { AppError } from './AppError.js';

export class AuthenticationError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 401);
  }
}
