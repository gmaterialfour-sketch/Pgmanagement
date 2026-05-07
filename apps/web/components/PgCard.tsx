"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Star, Users } from "lucide-react";
import type { PgSummary } from "@pg-rental/api";
import { Badge, Button } from "@pg-rental/ui";
import { formatCurrencyInr } from "@pg-rental/utils";

export function PgCard({ pg }: { pg: PgSummary }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-ink">{pg.name}</h2>
          {pg.verified ? <Badge>Verified</Badge> : null}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-zinc-600">
          <MapPin size={15} /> {pg.address} {pg.distanceKm !== undefined ? `- ${pg.distanceKm.toFixed(1)} km away` : ""}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <span className="flex items-center gap-1">
            <Star size={15} /> {pg.ratings.overall}
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={15} /> Safety {pg.ratings.safety}
          </span>
          <span className="flex items-center gap-1">
            <Users size={15} /> {pg.occupancyRate}% full
          </span>
          <span className={pg.available ? "text-emerald-700" : "text-red-700"}>
            {pg.available ? `${pg.rooms.available} beds left` : "Full"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {pg.amenities.slice(0, 5).map((item) => (
            <span key={item} className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="flex min-w-40 flex-col justify-between gap-3 md:items-end">
        <div>
          <div className="text-xl font-bold text-ink">{formatCurrencyInr(pg.rent)}</div>
          <div className="text-xs text-zinc-500">deposit {formatCurrencyInr(pg.deposit)}</div>
        </div>
        <Link href={`/pgs/${pg.id}`}>
          <Button>View PG</Button>
        </Link>
      </div>
    </motion.article>
  );
}
