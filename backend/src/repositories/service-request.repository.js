import { prisma } from '../config/prisma.js';

export const create = (data) => {
  return prisma.serviceRequest.create({
    data,
    include: {
      cliente: { select: { name: true, phone: true } },
    },
  });
};

export const findById = (id) => {
  return prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      cliente: { select: { name: true, phone: true, email: true } },
      tecnico: { select: { name: true, phone: true } },
    },
  });
};

export const findByClienteId = (clienteId) => {
  return prisma.serviceRequest.findMany({
    where: { clienteId },
    include: {
      tecnico: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findAvailable = () => {
  return prisma.serviceRequest.findMany({
    where: { status: 'PENDIENTE', tecnicoId: null },
    include: {
      cliente: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findByTecnicoId = (tecnicoId) => {
  return prisma.serviceRequest.findMany({
    where: { tecnicoId },
    include: {
      cliente: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const update = (id, data) => {
  return prisma.serviceRequest.update({
    where: { id },
    data,
    include: {
      cliente: { select: { name: true, phone: true, email: true } },
      tecnico: { select: { name: true, phone: true } },
    },
  });
};

export const findAll = (filters = {}) => {
  return prisma.serviceRequest.findMany({
    where: filters,
    include: {
      cliente: { select: { name: true, email: true } },
      tecnico: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
