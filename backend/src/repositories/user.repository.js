import { prisma } from '../config/prisma.js';

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
  return prisma.user.update({ where: { id }, data });
};

export const findAll = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};
