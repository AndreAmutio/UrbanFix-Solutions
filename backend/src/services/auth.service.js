import * as userRepo from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { ConflictError } from '../errors/ConflictError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export const register = async ({ email, password, name, role, phone }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new ConflictError('El email ya está registrado');
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepo.create({
    email,
    password: hashedPassword,
    name,
    role,
    phone,
  });

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
};

export const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AuthenticationError('Credenciales inválidas');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new AuthenticationError('Credenciales inválidas');
  }

  const token = generateToken({ userId: user.id, role: user.role });

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
};
