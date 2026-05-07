import { Router } from 'express';
import { createPayment, markAsPaid, getPaymentStats } from '../controllers/paymentController';
import { authenticateJWT, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, authorize(['ADMIN']), createPayment);
router.patch('/:id/pay', authenticateJWT, markAsPaid);
router.get('/stats', authenticateJWT, authorize(['ADMIN']), getPaymentStats);

export default router;
