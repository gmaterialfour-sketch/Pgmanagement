import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { hashAadhaar } from '../utils/compliance';

const staffSchema = z.object({
  name: z.string().min(2),
  role: z.string(),
  phone: z.string().optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/).optional(),
  propertyId: z.string().uuid()
});

export const addStaff = async (req: any, res: Response) => {
  try {
    const { aadhaarNumber, ...data } = staffSchema.parse(req.body);
    
    // Ensure the property belongs to the owner
    const property = await prisma.property.findFirst({
      where: { id: data.propertyId, ownerId: req.user.id }
    });

    if (!property) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const staff = await prisma.staff.create({
      data: {
        ...data,
        aadhaarHash: aadhaarNumber ? hashAadhaar(aadhaarNumber) : null
      }
    });

    res.status(201).json(staff);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message });
    }
    res.status(500).json({ message: 'Error adding staff' });
  }
};

export const getPropertyStaff = async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  try {
    const staff = await prisma.staff.findMany({
      where: { propertyId },
      include: { attendance: { take: 7, orderBy: { date: 'desc' } } }
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff' });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  const { staffId, status } = req.body;
  try {
    const attendance = await prisma.staffAttendance.create({
      data: {
        staffId,
        status, // PRESENT, ABSENT
        date: new Date()
      }
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance' });
  }
};
