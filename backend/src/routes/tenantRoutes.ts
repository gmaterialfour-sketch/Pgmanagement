import { Router } from 'express';
import { createTenant, getTenants } from '../controllers/tenantController';
import { authenticateJWT, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, authorize(['ADMIN']), createTenant);
router.get('/', authenticateJWT, authorize(['ADMIN']), getTenants);

export default router;
