import { Router } from 'express';
import * as controller from '../controllers/serviceRequest.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { uploadRequestImage } from '../middleware/upload.middleware.js';
import {
  createServiceRequestValidator,
  serviceRequestParamValidator,
  updateStatusValidator,
} from '../validators/service-request.validator.js';

const router = Router();

// ============ CLIENTE ============

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
 *             required: [title, description, category, scheduledDate]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fuga de agua
 *               description:
 *                 type: string
 *                 example: Hay una fuga en la cocina
 *               category:
 *                 type: string
 *                 enum: [ELECTRICIDAD, PLOMERIA, INFORMATICA, GASISTAS]
 *                 example: PLOMERIA
 *               address:
 *                 type: string
 *                 example: Av. Corrientes 1234, CABA
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-10T15:00:00.000Z
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
  controller.createServiceRequest,
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
router.get(
  '/mias',
  authenticate,
  authorize('CLIENTE'),
  controller.getClientRequests,
);

// ============ TÉCNICO ============

/**
 * @openapi
 * /api/solicitudes/disponibles:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Obtener solicitudes disponibles para aceptar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ELECTRICIDAD, PLOMERIA, INFORMATICA, GASISTAS]
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de solicitudes pendientes sin técnico asignado
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo TECNICO)
 */
router.get(
  '/disponibles',
  authenticate,
  authorize('TECNICO'),
  controller.getAvailableRequests,
);

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
  controller.acceptRequest,
);

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
router.get(
  '/mis-trabajos',
  authenticate,
  authorize('TECNICO'),
  controller.getTechnicianJobs,
);

// ============ TODOS (CLIENTE, TÉCNICO, ADMIN) ============

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
router.get(
  '/:id',
  authenticate,
  validate(serviceRequestParamValidator),
  controller.getRequestById,
);

// ============ IMAGEN (CLOUDINARY) ============

/**
 * @openapi
 * /api/solicitudes/{id}/imagen:
 *   post:
 *     tags: [Solicitudes]
 *     summary: Subir imagen a una solicitud
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *       400:
 *         description: No se subió ninguna imagen
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Solicitud no encontrada
 */
router.post(
  '/:id/imagen',
  authenticate,
  uploadRequestImage.single('image'),
  controller.updateRequestImage,
);

/**
 * @openapi
 * /api/solicitudes/{id}/imagen:
 *   delete:
 *     tags: [Solicitudes]
 *     summary: Eliminar imagen de una solicitud
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
 *         description: Imagen eliminada correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Solicitud no encontrada
 */
router.delete(
  '/:id/imagen',
  authenticate,
  validate(serviceRequestParamValidator),
  controller.removeRequestImage,
);

export default router;
