import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateProfileValidator } from '../validators/user.validator.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// ============ PERFIL ============

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
 *                 address:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me', userController.getProfile);

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
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.patch(
  '/me',
  validate(updateProfileValidator),
  userController.updateProfile,
);

// ============ IMAGEN ============

/**
 * @openapi
 * /api/users/me/image:
 *   post:
 *     tags: [Users]
 *     summary: Subir foto de perfil
 *     security:
 *       - bearerAuth: []
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
 *         description: Foto actualizada
 *       400:
 *         description: No se subió ninguna imagen
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.post(
  '/me/image',
  upload.single('image'),
  userController.updateProfileImage,
);

/**
 * @openapi
 * /api/users/me/image:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar foto de perfil
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foto eliminada
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.delete('/me/image', userController.removeProfileImage);

// ============ PERFILES ESPECIALIZADOS ============

/**
 * @openapi
 * /api/users/me/client:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil completo del cliente con sus solicitudes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del cliente con solicitudes
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo CLIENTE)
 */
router.get('/me/client', userController.getClientProfile);

/**
 * @openapi
 * /api/users/me/technician:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil completo del técnico con sus trabajos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del técnico con trabajos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tenés permiso (solo TECNICO)
 */
router.get('/me/technician', userController.getTechnicianProfile);

// ============ ADMIN ============

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
router.get('/admin/users', authorize('ADMIN'), userController.getAllUsers);

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
router.get(
  '/admin/technicians',
  authorize('ADMIN'),
  userController.getTechnicians,
);

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
router.get('/admin/users/:id', authorize('ADMIN'), userController.getUserById);

export default router;
