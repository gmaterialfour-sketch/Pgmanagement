"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { PgDetail } from "@pg-rental/api";
import { Button, Stat } from "@pg-rental/ui";
import { formatCurrencyInr } from "@pg-rental/utils";
import { api, getStoredToken } from "../../../lib/client";

export default function PgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pg, setPg] = useState<PgDetail | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.pg(id).then(setPg);
  }, [id]);

  async function bookNow() {
    if (!pg) return;
    const token = getStoredToken();
    if (!token) {
      setMessage("Please login as a student before booking.");
      return;
    }
    const roomType = pg.rooms.types[0];
    if (!roomType) {
      setMessage("This PG is currently full.");
      return;
    }
    await api.createBooking({ pgId: pg.id, roomType, token });
    const updated = await api.pg(pg.id);
    setPg(updated);
    setMessage("Booking confirmed.");
  }

  if (!pg) return <main className="p-6">Loading...</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <section>
          <h1 className="text-4xl font-bold text-ink">{pg.name}</h1>
          <p className="mt-2 text-zinc-600">{pg.address}</p>
          <p className="mt-4 text-zinc-700">{pg.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Rent" value={formatCurrencyInr(pg.rent)} />
            <Stat label="Available" value={pg.rooms.available} />
            <Stat label="Occupancy" value={`${pg.occupancyRate}%`} />
            <Stat label="Rating" value={pg.ratings.overall} />
          </div>
          <h2 className="mt-8 text-xl font-semibold">Nearby infrastructure</h2>
          <div className="mt-3 grid gap-2">
            {pg.infrastructure.map((item) => (
              <div key={`${item.type}-${item.name}`} className="rounded-md border border-zinc-200 bg-white p-3 text-sm">
                {item.name} - {item.distanceKm} km
              </div>
            ))}
          </div>
        </section>
        <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-2xl font-bold text-ink">{formatCurrencyInr(pg.rent)}</div>
          <div className="text-sm text-zinc-500">per month</div>
          <Button onClick={bookNow} disabled={!pg.available}>
            Book Now
          </Button>
          {message ? <p className="mt-3 text-sm text-campus">{message}</p> : null}
        </aside>
      </div>
    </main>
  );
}
