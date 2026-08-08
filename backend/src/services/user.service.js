import * as userRepo from '../repositories/user.repository.js';
import * as serviceRequestRepo from '../repositories/serviceRequest.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';

// ============ PERFIL (CLIENTE Y TÉCNICO) ============

export const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { password, ...profile } = user;
  return profile;
};

export const updateProfile = async (userId, data) => {
  // SOLO campos de texto
  const allowedFields = ['name', 'phone', 'address'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new ValidationError('No hay campos válidos para actualizar');
  }

  const user = await userRepo.update(userId, updateData);
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { password, ...profile } = user;
  return profile;
};

// ============ IMAGEN (CLOUDINARY) ============

export const updateProfileImage = async (userId, imageUrl, imagePublicId) => {
  const user = await userRepo.update(userId, {
    imageUrl,
    imagePublicId,
  });

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { password, ...profile } = user;
  return profile;
};

export const removeProfileImage = async (userId) => {
  const user = await userRepo.update(userId, {
    imageUrl: null,
    imagePublicId: null,
  });

  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { password, ...profile } = user;
  return profile;
};

// ============ PERFIL COMPLETO CON SOLICITUDES (CLIENTE) ============

export const getClientProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  if (user.role !== 'CLIENTE') {
    throw new AuthorizationError(
      'Este perfil solo está disponible para clientes',
    );
  }

  const solicitudes = await serviceRequestRepo.findByClient(userId);

  const { password, ...profile } = user;
  return {
    ...profile,
    solicitudes,
  };
};

// ============ PERFIL COMPLETO CON TRABAJOS (TÉCNICO) ============

export const getTechnicianProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  if (user.role !== 'TECNICO') {
    throw new AuthorizationError(
      'Este perfil solo está disponible para técnicos',
    );
  }

  const trabajos = await serviceRequestRepo.findByTechnician(userId);

  const { password, ...profile } = user;
  return {
    ...profile,
    trabajosAsignados: trabajos,
  };
};

// ============ ADMIN ============

export const getAllUsers = async () => {
  return userRepo.findAll();
};

export const getTechnicians = async () => {
  return userRepo.findTechnicians();
};

export const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const { password, ...profile } = user;
  return profile;
};
