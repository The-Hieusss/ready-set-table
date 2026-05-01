import { ArrowRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

import type { Restaurant } from "../lib/supabase";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

function formatRating(rating?: number | null) {
  if (typeof rating !== "number") {
    return "New";
  }

  return rating.toFixed(1);
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <article className="glass-card specular-glow overflow-hidden rounded-[28px]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-700 hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-semibold text-[#7ad5d6] backdrop-blur-md">
          {restaurant.cuisine}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {restaurant.name}
            </h3>
            <p className="mt-1 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <MapPin className="h-3.5 w-3.5" />
              {restaurant.address}
            </p>
          </div>
          <div className="rounded-2xl bg-[rgba(253,160,41,0.14)] px-3 py-2 text-sm font-semibold text-[var(--brand-gold)]">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current" />
              {formatRating(restaurant.rating)}
            </span>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">
          {restaurant.description}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-[0.24em] text-white/[0.36]">
            {restaurant.city}
          </div>
          <Link
            to={`/restaurants/${restaurant.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-bold text-[var(--brand-navy)] transition hover:opacity-90"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
