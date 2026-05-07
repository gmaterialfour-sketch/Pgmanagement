import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createComplaint = async (req: any, res: Response) => {
  const { propertyId, description, category } = req.body;
  const userId = req.user.id;

  try {
    const complaint = await prisma.complaint.create({
      data: {
        userId,
        propertyId,
        description,
        category: category || 'MAINTENANCE',
        status: 'OPEN'
      }
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPropertyComplaints = async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  try {
    const complaints = await prisma.complaint.findMany({
      where: { propertyId },
      include: { user: { select: { name: true, phone: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, ownerResponse } = req.body;

  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { 
        status, 
        ownerResponse,
        resolvedAt: status === 'RESOLVED' ? new Date() : null
      }
    });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
