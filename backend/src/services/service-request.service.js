import * as serviceRequestRepo from '../repositories/service-request.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { AppError } from '../errors/AppError.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';

export const create = async (userId, data) => {
  const solicitud = await serviceRequestRepo.create({
    ...data,
    clienteId: userId,
  });

  return solicitud;
};

export const getMyRequests = async (clienteId) => {
  return serviceRequestRepo.findByClienteId(clienteId);
};

export const getAvailable = async () => {
  return serviceRequestRepo.findAvailable();
};

export const getMyJobs = async (tecnicoId) => {
  return serviceRequestRepo.findByTecnicoId(tecnicoId);
};

export const getById = async (id) => {
  const solicitud = await serviceRequestRepo.findById(id);
  if (!solicitud) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  return solicitud;
};

export const accept = async (id, tecnicoId) => {
  const solicitud = await serviceRequestRepo.findById(id);
  if (!solicitud) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  if (solicitud.status !== 'PENDIENTE') {
    throw new AppError('Esta solicitud ya no está disponible', 400);
  }

  if (solicitud.tecnicoId !== null) {
    throw new AppError('Esta solicitud ya fue tomada por otro técnico', 400);
  }

  return serviceRequestRepo.update(id, {
    status: 'ACEPTADA',
    tecnicoId,
  });
};

export const reject = async (id, tecnicoId) => {
  const solicitud = await serviceRequestRepo.findById(id);
  if (!solicitud) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  if (solicitud.tecnicoId !== tecnicoId) {
    throw new AuthorizationError('No podés rechazar esta solicitud');
  }

  return serviceRequestRepo.update(id, {
    status: 'RECHAZADA',
    tecnicoId: null,
  });
};
