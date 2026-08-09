import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as serviceRequestController from '../controllers/serviceRequest.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  serviceRequestParamValidator,
  updateStatusValidator,
} from '../validators/service-request.validator.js';

const router = Router();

// Todas las rutas de admin requieren autenticación y rol ADMIN
router.use(authenticate);
router.use(authorize('ADMIN'));

// ============ USUARIOS ============

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Listar todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 */
router.get('/users', userController.getAllUsers);

/**
 * @openapi
 * /api/admin/technicians:
 *   get:
 *     tags: [Admin]
 *     summary: Listar solo técnicos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de técnicos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 */
router.get('/technicians', userController.getTechnicians);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Obtener usuario por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/users/:id', userController.getUserById);

// ============ SOLICITUDES ============

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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ELECTRICIDAD, PLOMERIA, INFORMATICA, GASISTAS]
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 *       400:
 *         description: Status o categoría inválido
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 */
router.get('/solicitudes', serviceRequestController.getAllRequests);

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
 *         description: Error de validación o status inválido
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo ADMIN)
 *       404:
 *         description: Solicitud no encontrada
 */
router.patch(
  '/solicitudes/:id/estado',
  validate(updateStatusValidator),
  serviceRequestController.updateRequestStatus,
);

export default router;
