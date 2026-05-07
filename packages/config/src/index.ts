export const appConfig = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:5000/api",
  defaultSearchRadiusKm: 10,
  pageSize: 20,
  otpTtlSeconds: 300,
  roomTypes: ["single", "double", "triple"] as const,
  roles: ["student", "owner", "admin"] as const
};

export type UserRole = (typeof appConfig.roles)[number];
export type RoomType = (typeof appConfig.roomTypes)[number];
