import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';


import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import roomRoutes from './routes/roomRoutes';
import tenantRoutes from './routes/tenantRoutes';
import paymentRoutes from './routes/paymentRoutes';
import googlePlacesRoutes from './routes/googlePlacesRoutes';
import bookingRoutes from './routes/bookingRoutes';
import staffRoutes from './routes/staffRoutes';
import complaintRoutes from './routes/complaintRoutes';
import communicationRoutes from './routes/communicationRoutes';
import { sendOTP, verifyOTP } from './controllers/authController';
import { getNearbyPGs } from './controllers/propertyController';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/google', googlePlacesRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/comm', communicationRoutes);

// Requested public API aliases.
app.post('/send-otp', sendOTP);
app.post('/verify-otp', verifyOTP);
app.get('/pgs/nearby', getNearbyPGs);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RentEase API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app };
