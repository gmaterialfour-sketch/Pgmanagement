import { Router } from 'express';
import { addStaff, getPropertyStaff, markAttendance } from '../controllers/staffController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, addStaff);
router.get('/property/:propertyId', authenticateJWT, getPropertyStaff);
router.post('/attendance', authenticateJWT, markAttendance);

export default router;
