import * as userRepo from '../repositories/user.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { password, ...profile } = user;
  return profile;
};

export const updateProfile = async (userId, data) => {
  const { name, phone } = data;

  const user = await userRepo.update(userId, { name, phone });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
  };
};
