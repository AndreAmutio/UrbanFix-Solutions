import * as userRepo from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { ConflictError } from '../errors/ConflictError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { ValidationError } from '../errors/ValidationError.js';

export const register = async ({
  email,
  password,
  name,
  role,
  phone,
  address,
}) => {
  // Validar que el rol sea válido
  const validRoles = ['CLIENTE', 'TECNICO', 'ADMIN'];
  if (!validRoles.includes(role)) {
    throw new ValidationError('Rol inválido');
  }

  // Verificar si el email ya existe
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new ConflictError('El email ya está registrado');
  }

  // Hashear password
  const hashedPassword = await hashPassword(password);

  // Crear usuario
  const user = await userRepo.create({
    email,
    password: hashedPassword,
    name,
    role,
    phone: phone || null,
    address: address || null,
  });

  // Generar token
  const token = generateToken({ userId: user.id, role: user.role });

  // Respuesta (sin password)
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
    token,
  };
};

export const login = async ({ email, password }) => {
  // Buscar usuario
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AuthenticationError('Credenciales inválidas');
  }

  // Validar password
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new AuthenticationError('Credenciales inválidas');
  }

  // Generar token
  const token = generateToken({ userId: user.id, role: user.role });

  // Respuesta (sin password)
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
    token,
  };
};
