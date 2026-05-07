import { Router } from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, createBooking);
router.get('/my', authenticateJWT, getMyBookings);
router.patch('/:id/status', authenticateJWT, updateBookingStatus);

export default router;
