import { Router } from 'express';
import { register, login, sendOTP, verifyOTP, verifyAadhaar } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/verify-aadhaar', authenticateJWT, verifyAadhaar);

export default router;
