"use client";

import { PgRentalApi } from "@pg-rental/api";

export const api = new PgRentalApi(process.env.NEXT_PUBLIC_API_URL);

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("accessToken");
}

export function storeAuth(tokens: { accessToken: string; refreshToken: string }) {
  window.localStorage.setItem("accessToken", tokens.accessToken);
  window.localStorage.setItem("refreshToken", tokens.refreshToken);
}
