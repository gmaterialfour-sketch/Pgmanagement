import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createPayment = async (req: Request, res: Response) => {
  const { tenantId, amount, dueDate, type } = req.body;
  try {
    const payment = await prisma.payment.create({
      data: {
        tenantId,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status: 'PENDING',
        type: type || 'RENT'
      }
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsPaid = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { amountPaid, mode } = req.body; // Partial payment support

  try {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const totalAmount = payment.amount;
    const isPartial = amountPaid < totalAmount;
    
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: isPartial ? 'PARTIAL' : 'PAID',
        paidAt: new Date(),
        // amount: totalAmount - amountPaid // Optionally reduce if creating new pending for remainder
      }
    });

    res.json({
      ...updatedPayment,
      receiptUrl: `http://localhost:5000/api/payments/${id}/receipt` // Mock URL
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateReceipt = async (req: Request, res: Response) => {
  // Mock PDF generation
  res.setHeader('Content-Type', 'application/pdf');
  res.send('PDF Content Placeholder - PG Rent Receipt');
};

export const getPaymentStats = async (req: any, res: Response) => {
  try {
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID' }
    });
    const pendingPayments = await prisma.payment.count({
      where: { status: { in: ['PENDING', 'PARTIAL'] } }
    });
    res.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingPayments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
