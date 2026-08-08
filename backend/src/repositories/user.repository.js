import { prisma } from '../config/prisma.js';

// ============ OPERACIONES BÁSICAS ============

export const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

export const create = (data) => {
  return prisma.user.create({ data });
};

export const update = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

// ============ PARA ADMIN ============

export const findAll = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

// ============ PARA LISTAR TÉCNICOS (ADMIN) ============

export const findTechnicians = () => {
  return prisma.user.findMany({
    where: { role: 'TECNICO' },
    select: {
      id: true,
      name: true,
      phone: true,
      address: true,
      imageUrl: true,
      email: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });
};
