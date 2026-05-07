import { PgRentalApi } from "@pg-rental/api";

export const api = new PgRentalApi(process.env.EXPO_PUBLIC_API_URL);
