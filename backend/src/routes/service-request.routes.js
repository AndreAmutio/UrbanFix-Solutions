import { Router } from 'express';
import * as controller from '../controllers/service-request.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  createServiceRequestValidator,
  serviceRequestParamValidator,
} from '../validators/service-request.validator.js';

const router = Router();

/**
 * @openapi
 * /api/solicitudes:
 *   post:
 *     tags: [Solicitudes]
 *     summary: Crear nueva solicitud de servicio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, address]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fuga de agua
 *               description:
 *                 type: string
 *                 example: Hay una fuga en la cocina
 *               category:
 *                 type: string
 *                 example: Plomería
 *               address:
 *                 type: string
 *                 example: Av. Corrientes 1234, CABA
 *     responses:
 *       201:
 *         description: Solicitud creada
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo CLIENTE)
 */
router.post(
  '/',
  authenticate,
  authorize('CLIENTE'),
  validate(createServiceRequestValidator),
  controller.create,
);

/**
 * @openapi
 * /api/solicitudes/mias:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Obtener solicitudes del cliente autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes del cliente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo CLIENTE)
 */
router.get('/mias', authenticate, authorize('CLIENTE'), controller.getMyRequests);

/**
 * @openapi
 * /api/solicitudes/disponibles:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Obtener solicitudes disponibles para aceptar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes pendientes sin técnico asignado
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo TECNICO)
 */
router.get('/disponibles', authenticate, authorize('TECNICO'), controller.getAvailable);

/**
 * @openapi
 * /api/solicitudes/mis-trabajos:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Obtener trabajos asignados al técnico autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes asignadas al técnico
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo TECNICO)
 */
router.get('/mis-trabajos', authenticate, authorize('TECNICO'), controller.getMyJobs);

/**
 * @openapi
 * /api/solicitudes/{id}:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Obtener solicitud por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Solicitud no encontrada
 */
router.get('/:id', authenticate, validate(serviceRequestParamValidator), controller.getById);

/**
 * @openapi
 * /api/solicitudes/{id}/aceptar:
 *   patch:
 *     tags: [Solicitudes]
 *     summary: Aceptar una solicitud pendiente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud aceptada
 *       400:
 *         description: Solicitud no disponible o ya tomada
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo TECNICO)
 *       404:
 *         description: Solicitud no encontrada
 */
router.patch(
  '/:id/aceptar',
  authenticate,
  authorize('TECNICO'),
  validate(serviceRequestParamValidator),
  controller.accept,
);

/**
 * @openapi
 * /api/solicitudes/{id}/rechazar:
 *   patch:
 *     tags: [Solicitudes]
 *     summary: Rechazar una solicitud asignada
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Solicitud rechazada
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso o no pertenece al técnico
 *       404:
 *         description: Solicitud no encontrada
 */
router.patch(
  '/:id/rechazar',
  authenticate,
  authorize('TECNICO'),
  validate(serviceRequestParamValidator),
  controller.reject,
);

export default router;
