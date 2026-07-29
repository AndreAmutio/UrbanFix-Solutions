import * as userRepo from '../repositories/user.repository.js';
import * as serviceRequestRepo from '../repositories/service-request.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const getAllUsers = async () => {
  return userRepo.findAll();
};

export const getAllRequests = async (filters = {}) => {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  return serviceRequestRepo.findAll(where);
};

export const changeRequestStatus = async (id, status) => {
  const solicitud = await serviceRequestRepo.findById(id);
  if (!solicitud) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  return serviceRequestRepo.update(id, { status });
};
