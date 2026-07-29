import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  filterSolicitudesValidator,
  changeStatusValidator,
} from '../validators/admin.validator.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

/**
 * @openapi
 * /api/admin/usuarios:
 *   get:
 *     tags: [Admin]
 *     summary: Listar todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios (sin password)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 */
router.get('/usuarios', adminController.getAllUsers);

/**
 * @openapi
 * /api/admin/solicitudes:
 *   get:
 *     tags: [Admin]
 *     summary: Listar todas las solicitudes (con filtro opcional)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDIENTE, ACEPTADA, EN_PROGRESO, COMPLETADA, RECHAZADA, CANCELADA]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *       400:
 *         description: Status inválido
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 */
router.get('/solicitudes', validate(filterSolicitudesValidator), adminController.getAllRequests);

/**
 * @openapi
 * /api/admin/solicitudes/{id}/estado:
 *   patch:
 *     tags: [Admin]
 *     summary: Cambiar estado de una solicitud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDIENTE, ACEPTADA, EN_PROGRESO, COMPLETADA, RECHAZADA, CANCELADA]
 *                 example: COMPLETADA
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 *       404:
 *         description: Solicitud no encontrada
 */
router.patch(
  '/solicitudes/:id/estado',
  validate(changeStatusValidator),
  adminController.changeRequestStatus,
);

export default router;
