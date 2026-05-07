"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface GoogleSearchProps {
  onLocationSelected: (coords: { lat: number; lng: number }, name: string) => void;
}

export function GoogleSearch({ onLocationSelected }: GoogleSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "IN" } // Restrict to India as per user context
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      
      const name = place.formatted_address?.split(',')[0] || place.name || "Selected Location";
      onLocationSelected(coords, name);
    });
  }, [onLocationSelected]);

  return (
    <div className="relative flex-1 max-w-sm">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search area (e.g. North Campus)..."
        className="h-10 w-full rounded-md border border-zinc-200 pl-10 pr-4 text-sm focus:border-campus focus:outline-none"
      />
      <Search className="absolute left-3 top-2.5 text-zinc-400" size={17} />
    </div>
  );
}
