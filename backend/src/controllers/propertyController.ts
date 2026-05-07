import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const nearbyQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional()
}).refine((data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice, {
  message: 'Minimum price cannot be greater than maximum price'
});

// Haversine formula to calculate distance in KM
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
};

export const getNearbyPGs = async (req: Request, res: Response) => {
  try {
    const { lat: userLat, lng: userLng, minPrice, maxPrice } = nearbyQuerySchema.parse(req.query);

    const whereClause: {
      monthlyRent?: {
        gte?: number;
        lte?: number;
      };
      latitude?: { not: null };
      longitude?: { not: null };
    } = {
      latitude: { not: null },
      longitude: { not: null }
    };

    if (minPrice || maxPrice) {
      whereClause.monthlyRent = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {})
      };
    }

    const pgs = await prisma.property.findMany({
      where: whereClause,
      include: { rooms: true }
    });

    // 1. Filter by 10km Radius & Calculate Distance
    const results = pgs
      .map(pg => {
        const distance = calculateDistance(userLat, userLng, pg.latitude!, pg.longitude!);
        
        const totalRooms = pg.totalRooms || pg.rooms.length;
        const occupiedRooms = pg.occupiedRooms || pg.rooms.filter(r => r.isOccupied).length;
        const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
        const roomTypes = ['Single', 'Double', 'Triple'].map((type) => {
          const roomsForType = pg.rooms.filter((room) => room.type.toLowerCase() === type.toLowerCase());
          const typeTotal = roomsForType.length;
          const typeOccupied = roomsForType.filter((room) => room.isOccupied).length;

          return {
            type,
            totalRooms: typeTotal,
            occupiedRooms: typeOccupied,
            availableRooms: Math.max(typeTotal - typeOccupied, 0)
          };
        });

        return {
          ...pg,
          distance: parseFloat(distance.toFixed(2)),
          occupancyRate: parseFloat(occupancyRate.toFixed(1)),
          totalRooms,
          occupiedRooms,
          availableRooms: Math.max(totalRooms - occupiedRooms, 0),
          roomTypes
        };
      })
      .filter(pg => pg.distance <= 10) // Only within 10km
      .sort((a, b) => a.distance - b.distance); // Nearest first

    const averagePrice = results.length
      ? results.reduce((sum, pg) => sum + pg.monthlyRent, 0) / results.length
      : 0;
    const enrichedResults = results.map((pg) => {
      const difference = pg.monthlyRent - averagePrice;
      const percentageDifference = averagePrice > 0 ? (difference / averagePrice) * 100 : 0;

      return {
        ...pg,
        averageNearbyRent: Math.round(averagePrice),
        priceDifference: Math.round(difference),
        priceComparison: Math.abs(percentageDifference) < 5
          ? 'Near average'
          : difference > 0
            ? 'Above average'
            : 'Below average'
      };
    });

    res.json({
      radiusKm: 10,
      count: enrichedResults.length,
      averagePrice: Math.round(averagePrice),
      pgs: enrichedResults
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid coordinates' });
    }
    res.status(500).json({ message: 'Error fetching PGs' });
  }
};

export const createProperty = async (req: any, res: Response) => {
  const { 
    name, location, latitude, longitude, 
    monthlyRent, depositAmount, ownerName, managerPhone,
    googlePlaceId, nearMetro, nearBusStand, nearCollege, totalRooms
  } = req.body;
  
  try {
    const property = await prisma.property.create({
      data: {
        name,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        monthlyRent: parseFloat(monthlyRent),
        depositAmount: parseFloat(depositAmount),
        ownerName,
        managerPhone,
        googlePlaceId,
        nearMetro,
        nearBusStand,
        nearCollege,
        totalRooms: parseInt(totalRooms),
        ownerId: req.user.id
      }
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
