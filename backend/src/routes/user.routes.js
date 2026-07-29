import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateProfileValidator } from '../validators/user.validator.js';

const router = Router();

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me', authenticate, userController.getProfile);

/**
 * @openapi
 * /api/users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Actualizar perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nuevo Nombre
 *               phone:
 *                 type: string
 *                 example: "+541198765432"
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.patch('/me', authenticate, validate(updateProfileValidator), userController.updateProfile);

export default router;
