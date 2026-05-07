"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@pg-rental/ui";
import { api, getStoredToken } from "../../lib/client";

export default function OwnerPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const token = getStoredToken();
    if (!token) {
      setMessage("Login as an owner to manage PGs.");
      return;
    }
    setDashboard(await api.ownerDashboard(token));
  }

  useEffect(() => {
    load();
  }, []);

  async function createPg(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = getStoredToken();
    if (!token) return setMessage("Login required.");
    const form = new FormData(event.currentTarget);
    await api.createPg(token, {
      name: form.get("name"),
      address: form.get("address"),
      lat: Number(form.get("lat")),
      lng: Number(form.get("lng")),
      rent: Number(form.get("rent")),
      deposit: Number(form.get("deposit")),
      amenities: ["wifi", "meals", "laundry"],
      rooms: [
        { type: "single", total: 4, occupied: 0, rent: Number(form.get("rent")) + 3000 },
        { type: "double", total: 8, occupied: 0, rent: Number(form.get("rent")) }
      ]
    });
    setMessage("PG added.");
    await load();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-ink">Owner dashboard</h1>
      {message ? <p className="mt-2 text-sm text-campus">{message}</p> : null}
      <div className="mt-6 grid gap-6 md:grid-cols-[360px_1fr]">
        <form onSubmit={createPg} className="grid h-fit gap-3 rounded-lg border border-zinc-200 bg-white p-4">
          {[
            ["name", "PG name", "Campus House"],
            ["address", "Address", "North Campus"],
            ["lat", "Latitude", "28.6803"],
            ["lng", "Longitude", "77.2046"],
            ["rent", "Base rent", "12000"],
            ["deposit", "Deposit", "12000"]
          ].map(([name, label, value]) => (
            <label key={name} className="grid gap-1 text-sm font-medium">
              {label}
              <input name={name} defaultValue={value} className="rounded-md border border-zinc-300 px-3 py-2" />
            </label>
          ))}
          <Button type="submit">Add PG</Button>
        </form>
        <section className="grid gap-3">
          {(dashboard?.pgs || []).map((pg: any) => (
            <article key={pg.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold">{pg.name}</h2>
              <p className="text-sm text-zinc-600">{pg.address}</p>
              <p className="mt-2 text-sm">{pg.rooms?.length || 0} room types configured</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
