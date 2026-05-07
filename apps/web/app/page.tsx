"use client";

import { useEffect, useState } from "react";
import { LocateFixed } from "lucide-react";
import type { PgSummary } from "@pg-rental/api";
import { Button } from "@pg-rental/ui";
import { api } from "../lib/client";
import { PgCard } from "../components/PgCard";
import { GoogleSearch } from "../components/GoogleSearch";

const fallback = { lat: 28.6803, lng: 77.2046 };

export default function HomePage() {
  const [coords, setCoords] = useState(fallback);
  const [locationName, setLocationName] = useState("Delhi");
  const [pgs, setPgs] = useState<PgSummary[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadNearby(nextCoords = coords) {
    setLoading(true);
    try {
      const response = await api.nearbyPgs(nextCoords);
      if (response.data?.length === 0 && nextCoords.lat !== fallback.lat) {
        const fallbackResponse = await api.nearbyPgs(fallback);
        setPgs(fallbackResponse.data || []);
        setCoords(fallback);
        setLocationName("Delhi (Fallback)");
      } else {
        setPgs(response.data || []);
        
        // Use free fallback geocoding if Google isn't providing a name yet
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${nextCoords.lat}&lon=${nextCoords.lng}&format=json`);
        const data = await geo.json();
        const name = data.display_name?.split(',')[0] + ', ' + (data.address?.city || data.address?.state || "Unknown");
        setLocationName(name);
      }
    } catch (err) {
      console.error(err);
      setPgs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCoords(next);
          loadNearby(next);
        },
        () => loadNearby(fallback),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      loadNearby(fallback);
    }
  }, []);

  function useLocation() {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoords(next);
        loadNearby(next);
      },
      () => loadNearby(fallback),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <main>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex min-h-[46vh] max-w-6xl flex-col justify-end px-4 pb-8 pt-10">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-wide text-campus">StayNear PG Rentals</div>
            <h1 className="mt-3 text-4xl font-bold text-ink md:text-6xl">Find verified PGs near campus, transit, and real student life.</h1>
            <p className="mt-4 max-w-2xl text-base text-zinc-600">
              Search rooms by distance, availability, safety, food rating, rent and nearby infrastructure from a single booking platform.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={useLocation}>
              <LocateFixed className="mr-2" size={17} /> Near Me
            </Button>
            <GoogleSearch 
              onLocationSelected={(next, name) => {
                setCoords(next);
                setLocationName(name);
                loadNearby(next);
              }} 
            />
            <a href="/login" className="inline-flex h-10 items-center rounded-md px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
              OTP login
            </a>
            <a href="/owner" className="inline-flex h-10 items-center rounded-md px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">
              Owner dashboard
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Nearby PGs</h2>
            <p className="text-sm text-zinc-500">Showing rentals near {locationName}</p>
          </div>
          <span className="text-sm text-zinc-500">{loading ? "Loading..." : `${pgs.length} results`}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {pgs.map((pg) => (
            <PgCard key={pg.id} pg={pg} />
          ))}
        </div>
      </section>
    </main>
  );
}
