import { Router } from 'express';
import * as statsController from '../controllers/stats.controller.js';

const router = Router();

/**
 * @openapi
 * /api/stats:
 *   get:
 *     tags: [Estadísticas]
 *     summary: Obtener estadísticas generales de la plataforma
 *     description: Retorna métricas generales como cantidad de clientes, técnicos y solicitudes por estado.
 *     responses:
 *       200:
 *         description: Estadísticas generales obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientes:
 *                   type: integer
 *                   example: 128
 *                   description: Cantidad de clientes registrados
 *                 tecnicos:
 *                   type: integer
 *                   example: 42
 *                   description: Cantidad de técnicos registrados
 *                 solicitudes:
 *                   type: integer
 *                   example: 356
 *                   description: Cantidad total de solicitudes creadas
 *                 solicitudesCompletadas:
 *                   type: integer
 *                   example: 241
 *                   description: Cantidad de solicitudes completadas
 *                 solicitudesPendientes:
 *                   type: integer
 *                   example: 18
 *                   description: Cantidad de solicitudes pendientes
 *                 solicitudesAceptadas:
 *                   type: integer
 *                   example: 12
 *                   description: Cantidad de solicitudes aceptadas
 *                 solicitudesEnProgreso:
 *                   type: integer
 *                   example: 9
 *                   description: Cantidad de solicitudes en progreso
 *                 solicitudesRechazadas:
 *                   type: integer
 *                   example: 6
 *                   description: Cantidad de solicitudes rechazadas
 *                 solicitudesCanceladas:
 *                   type: integer
 *                   example: 4
 *                   description: Cantidad de solicitudes canceladas
 */
router.get('/', statsController.getStatistics);

export default router;
