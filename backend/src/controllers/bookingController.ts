import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const bookingSchema = z.object({
  propertyId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  bookingType: z.enum(['ONLINE', 'OFFLINE']).default('ONLINE'),
  totalAmount: z.number().min(0)
});

export const createBooking = async (req: any, res: Response) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    const userId = req.user.id;

    // Check if room is already occupied
    const room = await prisma.room.findUnique({
      where: { id: validatedData.roomId }
    });

    if (!room || room.isOccupied) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    const booking = await prisma.booking.create({
      data: {
        ...validatedData,
        userId,
        status: validatedData.bookingType === 'ONLINE' ? 'PENDING' : 'CONFIRMED'
      }
    });

    // If offline, mark room as occupied immediately
    if (validatedData.bookingType === 'OFFLINE') {
      await prisma.room.update({
        where: { id: validatedData.roomId },
        data: { isOccupied: true }
      });
      
      // Create tenant record
      await prisma.tenant.create({
        data: {
          userId,
          roomId: validatedData.roomId,
          checkInDate: new Date(validatedData.checkIn)
        }
      });
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message });
    }
    res.status(500).json({ message: 'Error creating booking' });
  }
};

export const getMyBookings = async (req: any, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        property: true,
        room: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { room: true }
    });

    if (status === 'CONFIRMED') {
      await prisma.room.update({
        where: { id: booking.roomId },
        data: { isOccupied: true }
      });
      
      await prisma.tenant.upsert({
        where: { userId: booking.userId },
        update: { roomId: booking.roomId },
        create: {
          userId: booking.userId,
          roomId: booking.roomId,
          checkInDate: booking.checkIn
        }
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};
