import { prisma } from '../config/prisma.js';

class StatsRepository {
  async getStatistics() {
    const [
      clientes,
      tecnicos,
      solicitudes,
      solicitudesCompletadas,
      solicitudesPendientes,
      solicitudesAceptadas,
      solicitudesEnProgreso,
      solicitudesRechazadas,
      solicitudesCanceladas,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'CLIENTE',
        },
      }),

      prisma.user.count({
        where: {
          role: 'TECNICO',
        },
      }),

      prisma.serviceRequest.count(),

      prisma.serviceRequest.count({
        where: {
          status: 'COMPLETADA',
        },
      }),

      prisma.serviceRequest.count({
        where: {
          status: 'PENDIENTE',
        },
      }),

      prisma.serviceRequest.count({
        where: {
          status: 'ACEPTADA',
        },
      }),

      prisma.serviceRequest.count({
        where: {
          status: 'EN_PROGRESO',
        },
      }),

      prisma.serviceRequest.count({
        where: {
          status: 'RECHAZADA',
        },
      }),

      prisma.serviceRequest.count({
        where: {
          status: 'CANCELADA',
        },
      }),
    ]);

    return {
      clientes,
      tecnicos,
      solicitudes,
      solicitudesCompletadas,
      solicitudesPendientes,
      solicitudesAceptadas,
      solicitudesEnProgreso,
      solicitudesRechazadas,
      solicitudesCanceladas,
    };
  }
}

export default new StatsRepository();
