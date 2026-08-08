import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import serviceRequestRoutes from './service-request.routes.js';
import adminRoutes from './admin.routes.js';
import statsRoutes from './stats.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/solicitudes', serviceRequestRoutes);
router.use('/stats', statsRoutes);

export default router;
