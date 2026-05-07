import { Router } from 'express';
import { createRoom, getRoomsByProperty } from '../controllers/roomController';
import { authenticateJWT, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, authorize(['ADMIN']), createRoom);
router.get('/:propertyId', authenticateJWT, getRoomsByProperty);

export default router;
