import * as serviceRequestRepo from '../repositories/serviceRequest.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';
import {
  USER_ROLES,
  SERVICE_STATUS,
  SERVICE_CATEGORIES,
} from '../utils/constants.js';

// ============ CLIENTE ============

export const createServiceRequest = async (clienteId, data) => {
  // Validar que el cliente exista
  const cliente = await userRepo.findById(clienteId);
  if (!cliente) {
    throw new NotFoundError('Cliente no encontrado');
  }

  if (cliente.role !== USER_ROLES.CLIENTE) {
    throw new AuthorizationError('Solo los clientes pueden crear solicitudes');
  }

  // Validar categoría
  const validCategories = Object.values(SERVICE_CATEGORIES);
  if (!validCategories.includes(data.category)) {
    throw new ValidationError(
      `Categoría inválida. Debe ser: ${validCategories.join(', ')}`,
    );
  }

  // Validar campos requeridos (scheduledDate es OBLIGATORIO)
  const requiredFields = ['title', 'description', 'category', 'scheduledDate'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new ValidationError(`El campo ${field} es requerido`);
    }
  }

  // Reglas de negocio:
  // 1. Si no envía dirección, usar la del cliente
  // 2. scheduledDate es OBLIGATORIO (ya validado)
  // 3. imageUrl es opcional (se sube por separado)
  const requestData = {
    ...data,
    clienteId,
    status: SERVICE_STATUS.PENDIENTE,
    address: data.address || cliente.address,
    imageUrl: data.imageUrl || null,
    imagePublicId: data.imagePublicId || null,
  };

  // Crear solicitud
  const serviceRequest = await serviceRequestRepo.create(requestData);
  return serviceRequest;
};

export const getClientRequests = async (clienteId) => {
  const cliente = await userRepo.findById(clienteId);
  if (!cliente) {
    throw new NotFoundError('Cliente no encontrado');
  }

  if (cliente.role !== USER_ROLES.CLIENTE) {
    throw new AuthorizationError(
      'Solo los clientes pueden ver sus solicitudes',
    );
  }

  return serviceRequestRepo.findByClient(clienteId);
};

// ============ TÉCNICO ============

export const getAvailableRequests = async (category) => {
  // Si se pasa categoría, validar que sea válida
  const validCategories = Object.values(SERVICE_CATEGORIES);
  if (category && !validCategories.includes(category)) {
    throw new ValidationError(
      `Categoría inválida. Debe ser: ${validCategories.join(', ')}`,
    );
  }

  return serviceRequestRepo.findAvailable(category);
};

export const acceptRequest = async (tecnicoId, requestId) => {
  // Validar que el técnico exista
  const tecnico = await userRepo.findById(tecnicoId);
  if (!tecnico) {
    throw new NotFoundError('Técnico no encontrado');
  }

  if (tecnico.role !== USER_ROLES.TECNICO) {
    throw new AuthorizationError(
      'Solo los técnicos pueden aceptar solicitudes',
    );
  }

  // Buscar la solicitud
  const request = await serviceRequestRepo.findById(requestId);
  if (!request) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  // Validar que esté pendiente y sin técnico
  if (request.status !== SERVICE_STATUS.PENDIENTE) {
    throw new ValidationError('La solicitud no está disponible para aceptar');
  }

  if (request.tecnicoId) {
    throw new ValidationError('La solicitud ya fue asignada a otro técnico');
  }

  // Actualizar solicitud
  const updatedRequest = await serviceRequestRepo.update(requestId, {
    tecnicoId,
    status: SERVICE_STATUS.ACEPTADA,
  });

  return updatedRequest;
};

export const getTechnicianJobs = async (tecnicoId) => {
  const tecnico = await userRepo.findById(tecnicoId);
  if (!tecnico) {
    throw new NotFoundError('Técnico no encontrado');
  }

  if (tecnico.role !== USER_ROLES.TECNICO) {
    throw new AuthorizationError('Solo los técnicos pueden ver sus trabajos');
  }

  return serviceRequestRepo.findByTechnician(tecnicoId);
};

// ============ TODOS (CLIENTE, TÉCNICO, ADMIN) ============

export const getRequestById = async (id) => {
  const request = await serviceRequestRepo.findById(id);
  if (!request) {
    throw new NotFoundError('Solicitud no encontrada');
  }
  return request;
};

// ============ ADMIN ============

export const getAllRequests = async (filters = {}) => {
  const validStatuses = Object.values(SERVICE_STATUS);
  const validCategories = Object.values(SERVICE_CATEGORIES);

  // Validar status si se pasa
  if (filters.status && !validStatuses.includes(filters.status)) {
    throw new ValidationError(
      `Status inválido. Debe ser: ${validStatuses.join(', ')}`,
    );
  }

  // Validar categoría si se pasa
  if (filters.category && !validCategories.includes(filters.category)) {
    throw new ValidationError(
      `Categoría inválida. Debe ser: ${validCategories.join(', ')}`,
    );
  }

  return serviceRequestRepo.findAll(filters);
};

export const updateRequestStatus = async (requestId, status) => {
  const validStatuses = Object.values(SERVICE_STATUS);

  // Validar status
  if (!validStatuses.includes(status)) {
    throw new ValidationError(
      `Status inválido. Debe ser: ${validStatuses.join(', ')}`,
    );
  }

  // Buscar la solicitud
  const request = await serviceRequestRepo.findById(requestId);
  if (!request) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  // Actualizar
  const updatedRequest = await serviceRequestRepo.update(requestId, { status });
  return updatedRequest;
};

// ============ IMAGEN (CLOUDINARY) ============

export const updateRequestImage = async (
  requestId,
  imageUrl,
  imagePublicId,
) => {
  const request = await serviceRequestRepo.findById(requestId);
  if (!request) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  const updatedRequest = await serviceRequestRepo.update(requestId, {
    imageUrl,
    imagePublicId,
  });

  return updatedRequest;
};

export const removeRequestImage = async (requestId) => {
  const request = await serviceRequestRepo.findById(requestId);
  if (!request) {
    throw new NotFoundError('Solicitud no encontrada');
  }

  const updatedRequest = await serviceRequestRepo.update(requestId, {
    imageUrl: null,
    imagePublicId: null,
  });

  return updatedRequest;
};
