import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createTenant = async (req: Request, res: Response) => {
  const { userId, roomId } = req.body;
  try {
    const tenant = await prisma.tenant.create({
      data: {
        userId,
        roomId
      }
    });
    // Update room status
    await prisma.room.update({
      where: { id: roomId },
      data: { isOccupied: true }
    });
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: { user: true, room: { include: { property: true } } }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
