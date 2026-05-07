import { appConfig, type RoomType, type UserRole } from "@pg-rental/config";

export type ApiUser = {
  id: string;
  phone: string;
  name: string | null;
  role: UserRole;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type PgSummary = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  ownerName: string | null;
  rent: number;
  deposit: number;
  ratings: { food: number; safety: number; overall: number };
  rooms: { total: number; occupied: number; available: number; types: RoomType[] };
  amenities: string[];
  verified: boolean;
  distanceKm?: number;
  occupancyRate: number;
  available: boolean;
  nearbyAverageRent?: number | null;
  priceComparison?: "below_market" | "at_market" | "above_market" | "market_unknown";
};

export type PgDetail = PgSummary & {
  placeId: string | null;
  description: string | null;
  infrastructure: Array<{
    type: string;
    name: string;
    distanceKm: number;
  }>;
  googleRating: number | null;
  googleReviews: Array<{ author: string; rating: number; text: string; time: string }>;
};

export type Booking = {
  id: string;
  pgId: string;
  userId: string;
  roomType: RoomType;
  status: "confirmed" | "cancelled";
  createdAt: string;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  token?: string;
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class PgRentalApi {
  private baseUrl: string;

  constructor(baseUrl = appConfig.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(path: string, options: RequestOptions = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new ApiError(payload?.message || "Request failed", response.status, payload);
    }
    return payload as T;
  }

  requestOtp(input: { phone: string; role: UserRole; name?: string }) {
    return this.request<{ message: string; devOtp?: string }>("/auth/request-otp", {
      method: "POST",
      body: input
    });
  }

  verifyOtp(input: { phone: string; otp: string; role: UserRole }) {
    return this.request<{ user: ApiUser; tokens: AuthTokens }>("/auth/verify-otp", {
      method: "POST",
      body: input
    });
  }

  nearbyPgs(params: { lat: number; lng: number; page?: number; limit?: number; token?: string }) {
    const query = new URLSearchParams({
      lat: String(params.lat),
      lng: String(params.lng),
      page: String(params.page || 1),
      limit: String(params.limit || appConfig.pageSize)
    });
    return this.request<{ data: PgSummary[]; page: number; total: number }>(`/pgs/nearby?${query}`, {
      token: params.token
    });
  }

  pg(id: string, token?: string) {
    return this.request<PgDetail>(`/pgs/${id}`, { token });
  }

  createBooking(input: { pgId: string; roomType: RoomType; token: string }) {
    return this.request<{ booking: Booking }>("/bookings", {
      method: "POST",
      token: input.token,
      body: { pgId: input.pgId, roomType: input.roomType }
    });
  }

  ownerDashboard(token: string) {
    return this.request<{ pgs: PgDetail[]; bookings: Booking[] }>("/owners/dashboard", { token });
  }

  createPg(token: string, body: Record<string, unknown>) {
    return this.request<PgDetail>("/owners/pgs", { method: "POST", token, body });
  }
}

export const api = new PgRentalApi();
