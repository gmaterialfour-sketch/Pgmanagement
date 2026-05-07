import { Request, Response } from 'express';
import { z } from 'zod';
import { calculateDistance } from './propertyController';

const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const placeIdSchema = z.object({
  placeId: z.string().min(1)
});

const locationQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(100).max(10000).default(3000)
});

type GoogleReview = {
  author_name?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
};

type NearbyPlace = {
  name?: string;
  place_id?: string;
  vicinity?: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
};

const requireGoogleKey = (res: Response) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;

  if (!key) {
    res.status(503).json({
      message: 'Google Maps API key is not configured on the server.'
    });
    return null;
  }

  return key;
};

export const getPlaceReviews = async (req: Request, res: Response) => {
  try {
    const { placeId } = placeIdSchema.parse(req.params);
    const key = requireGoogleKey(res);
    if (!key) return;

    const url = new URL(`${GOOGLE_PLACES_BASE_URL}/details/json`);
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', 'rating,user_ratings_total,reviews');
    url.searchParams.set('key', key);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return res.status(502).json({
        message: data.error_message || `Google Places returned ${data.status}`
      });
    }

    const reviews = (data.result?.reviews || []).slice(0, 3).map((review: GoogleReview) => ({
      authorName: review.author_name || 'Google user',
      rating: review.rating || 0,
      time: review.relative_time_description || '',
      text: review.text || ''
    }));

    res.json({
      rating: data.result?.rating || 0,
      reviewCount: data.result?.user_ratings_total || 0,
      topReviews: reviews
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid place id' });
    }
    res.status(500).json({ message: 'Unable to fetch Google reviews' });
  }
};

const findNearestPlace = async (
  key: string,
  lat: number,
  lng: number,
  radius: number,
  type: string,
  keyword?: string
) => {
  const url = new URL(`${GOOGLE_PLACES_BASE_URL}/nearbysearch/json`);
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', String(radius));
  url.searchParams.set('type', type);
  if (keyword) url.searchParams.set('keyword', keyword);
  url.searchParams.set('key', key);

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(data.error_message || `Google Places returned ${data.status}`);
  }

  const places = (data.results || []) as NearbyPlace[];
  const nearest = places
    .filter((place) => place.geometry?.location)
    .map((place) => {
      const placeLat = place.geometry!.location!.lat;
      const placeLng = place.geometry!.location!.lng;

      return {
        name: place.name || 'Nearby place',
        placeId: place.place_id || '',
        address: place.vicinity || '',
        distanceMeters: Math.round(calculateDistance(lat, lng, placeLat, placeLng) * 1000)
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters)[0];

  return nearest || null;
};

export const getNearbyInfrastructure = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = locationQuerySchema.parse(req.query);
    const key = requireGoogleKey(res);
    if (!key) return;

    const [busStand, metroStation, railwayStation, college, school] = await Promise.all([
      findNearestPlace(key, lat, lng, radius, 'bus_station'),
      findNearestPlace(key, lat, lng, radius, 'subway_station', 'metro station'),
      findNearestPlace(key, lat, lng, radius, 'train_station', 'railway station'),
      findNearestPlace(key, lat, lng, radius, 'university'),
      findNearestPlace(key, lat, lng, radius, 'school')
    ]);

    res.json({
      busStand,
      metroStation,
      railwayStation,
      collegeOrSchool: college || school
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message || 'Invalid location' });
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unable to fetch nearby places'
    });
  }
};

export const autocompleteAddress = async (req: Request, res: Response) => {
  try {
    const { input } = req.query;
    if (!input) return res.status(400).json({ message: 'Input is required' });

    const key = requireGoogleKey(res);
    if (!key) return;

    const url = new URL(`${GOOGLE_PLACES_BASE_URL}/autocomplete/json`);
    url.searchParams.set('input', String(input));
    url.searchParams.set('types', 'address');
    url.searchParams.set('components', 'country:in'); // Restrict to India
    url.searchParams.set('key', key);

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.predictions || []);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch autocomplete suggestions' });
  }
};
