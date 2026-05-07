import { Router } from 'express';
import { createComplaint, getPropertyComplaints, updateComplaintStatus } from '../controllers/complaintController';
import { authenticateJWT, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, createComplaint);
router.get('/property/:propertyId', authenticateJWT, authorize(['ADMIN', 'OWNER']), getPropertyComplaints);
router.patch('/:id', authenticateJWT, authorize(['ADMIN', 'OWNER']), updateComplaintStatus);

export default router;
