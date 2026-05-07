export type Coordinates = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_KM = 6371;

export function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceKm(from: Coordinates, to: Coordinates) {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function occupancyRate(occupied: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((occupied / total) * 100);
}

export function isAvailable(occupied: number, total: number) {
  return total > occupied;
}

export function priceComparison(rent: number, nearbyAverage: number | null) {
  if (!nearbyAverage || nearbyAverage <= 0) return "market_unknown" as const;
  if (rent <= nearbyAverage * 0.9) return "below_market" as const;
  if (rent >= nearbyAverage * 1.1) return "above_market" as const;
  return "at_market" as const;
}

export function formatCurrencyInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}
