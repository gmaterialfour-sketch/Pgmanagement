import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { hashAadhaar, verifyWithUIDAI } from '../utils/compliance';

const aadhaarSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  otp: z.string().optional() // Mock OTP for UIDAI
});

export const verifyAadhaar = async (req: any, res: Response) => {
  try {
    const { aadhaarNumber, otp } = aadhaarSchema.parse(req.body);
    const userId = req.user.id;

    // Simulate UIDAI check
    const verification = await verifyWithUIDAI(aadhaarNumber, otp || '123456');
    
    if (verification.success) {
      const aadhaarHash = hashAadhaar(aadhaarNumber);
      
      await prisma.user.update({
        where: { id: userId },
        data: { 
          aadhaarHash,
          isVerified: true 
        }
      });

      return res.json({ message: 'Aadhaar verified successfully', name: verification.name });
    }

    res.status(400).json({ message: 'Aadhaar verification failed' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message });
    }
    res.status(500).json({ message: 'Error verifying Aadhaar' });
  }
};

const roleValues = ['ADMIN', 'TENANT', 'STUDENT', 'OWNER'] as const;

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(roleValues))
    .default('TENANT')
});

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid mobile number with country code'),
  role: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(z.enum(['STUDENT', 'OWNER']))
    .default('STUDENT')
});

const verifyOtpSchema = phoneSchema.extend({
  otp: z.string().trim().regex(/^\d{6}$/, 'OTP must be 6 digits')
});

const signToken = (user: { id: string; role: string }) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

const publicUser = (user: { id: string; name: string; email?: string | null; phone?: string | null; role: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role
});

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'TENANT'
      }
    });

    const token = signToken(user);

    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid registration data' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Please login via OTP' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    res.json({ token, user: publicUser(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid login data' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone, role } = phoneSchema.parse(req.body);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    console.log(`OTP for ${phone}: ${otp}`);

    // Production hook: replace this log with Twilio Verify or Messaging API.
    await prisma.user.upsert({
      where: { phone },
      update: { otp, otpExpiresAt, role },
      create: { 
        phone, 
        otp, 
        otpExpiresAt,
        name: role === 'OWNER' ? 'Owner User' : 'Student User',
        role
      }
    });
    
    res.json({
      message: 'OTP sent successfully',
      expiresInSeconds: 300,
      ...(process.env.NODE_ENV !== 'production' ? { mockOtp: otp } : {})
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid phone number' });
    }
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = verifyOtpSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { phone } });
    
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new code.' });
    }
    
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiresAt: null }
    });
    
    const token = signToken(verifiedUser);
    
    res.json({ token, user: publicUser(verifiedUser) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid OTP data' });
    }
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};
