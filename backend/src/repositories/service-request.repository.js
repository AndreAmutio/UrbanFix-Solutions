import { prisma } from '../config/prisma.js';

// ============ OPERACIONES BÁSICAS ============

export const create = (data) => {
  return prisma.serviceRequest.create({ data });
};

export const findById = (id) => {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      cliente: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          address: true,
        }
      },
      tecnico: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        }
      }
    }
  });
};

export const update = (id, data) => {
  return prisma.serviceRequest.update({
    where: { id },
    data
  });
};

// ============ PARA CLIENTE ============

export const findByClient = (clienteId) => {
  return prisma.serviceRequest.findMany({
    where: { clienteId },
    include: {
      tecnico: {
        select: {
          id: true,
          name: true,
          phone: true,
          imageUrl: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// ============ PARA TÉCNICO ============

export const findByTechnician = (tecnicoId) => {
  return prisma.serviceRequest.findMany({
    where: { tecnicoId },
    include: {
      cliente: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// ============ SOLICITUDES DISPONIBLES (para técnico) ============

export const findAvailable = () => {
  return prisma.serviceRequest.findMany({
    where: {
      status: 'PENDIENTE',
      tecnicoId: null,
    },
    include: {
      cliente: {
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
};

// ============ PARA ADMIN ============

export const findAll = (filter) => {
  const where = filter?.status ? { status: filter.status } : {};
  return prisma.serviceRequest.findMany({
    where,
    include: {
      cliente: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        }
      },
      tecnico: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};