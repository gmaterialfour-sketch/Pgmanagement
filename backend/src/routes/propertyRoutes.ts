import { Router } from 'express';
import { createProperty, getNearbyPGs } from '../controllers/propertyController';
import { authenticateJWT, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, authorize(['ADMIN', 'OWNER']), createProperty);
router.get('/nearby', getNearbyPGs);
router.get('/search', getNearbyPGs);

export default router;
