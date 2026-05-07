import { Router } from 'express';
import { initiateMaskedCall } from '../utils/twilio';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

router.post('/call', authenticateJWT, async (req: any, res) => {
  const { recipientPhone } = req.body;
  const userPhone = req.user.phone;

  try {
    const call = await initiateMaskedCall(userPhone, recipientPhone);
    res.json(call);
  } catch (error) {
    res.status(500).json({ message: 'Communication error' });
  }
});

export default router;
