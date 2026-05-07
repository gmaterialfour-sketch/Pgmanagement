import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createRoom = async (req: Request, res: Response) => {
  const { propertyId, roomNumber, rentAmount, type = 'Single' } = req.body;
  try {
    const room = await prisma.room.create({
      data: {
        roomNumber,
        type,
        rentAmount: parseFloat(rentAmount),
        property: {
          connect: { id: propertyId }
        }
      }
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoomsByProperty = async (req: Request, res: Response) => {
  const propertyId = String(req.params.propertyId);
  try {
    const rooms = await prisma.room.findMany({
      where: { propertyId }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
