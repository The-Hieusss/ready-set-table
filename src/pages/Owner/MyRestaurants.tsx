import { Calendar, FileText, MapPin, Plus, Settings, Star, Store } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../components/AuthProvider";
import { getOwnerRestaurants, type Restaurant } from "../../lib/supabase";
import { toast } from "sonner";

export default function MyRestaurants() {
  const { profile, accessToken } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      if (!profile || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getOwnerRestaurants(profile.id, accessToken);
        setRestaurants(data);
      } catch {
        toast.error("Could not load restaurants");
      } finally {
        setLoading(false);
      }
    }

    void fetchRestaurants();
  }, [accessToken, profile]);

  const averageRating = useMemo(() => {
    const rated = restaurants.filter((restaurant) => typeof restaurant.rating === "number");

    if (rated.length === 0) {
      return "New";
    }

    const total = rated.reduce((sum, restaurant) => sum + (restaurant.rating ?? 0), 0);
    return (total / rated.length).toFixed(1);
  }, [restaurants]);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="section-label">Owner inventory</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            My restaurants
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Manage the venues attached to your ownership account, review their listing quality, and jump directly into reservations or review operations.
          </p>
        </div>
        <Link to="/owner/restaurants/new" className="btn-gold">
          <Plus className="h-4 w-4" />
          Add Restaurant
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard label="Total restaurants" value={String(restaurants.length)} />
        <MetricCard label="Average rating" value={averageRating} />
        <MetricCard
          label="Coverage"
          value={restaurants.length > 0 ? `${restaurants.filter((restaurant) => Boolean(restaurant.imageUrl)).length}/${restaurants.length}` : "0/0"}
          caption="Listings with images"
        />
      </div>

      {loading ? (
        <div className="glass-card rounded-[32px] p-8 text-sm text-[var(--text-muted)]">
          Loading restaurants…
        </div>
      ) : restaurants.length === 0 ? (
        <div className="glass-card rounded-[32px] p-8 sm:p-12">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.1] bg-white/[0.06] text-[#7ad5d6]">
              <Store className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">
              No restaurants yet
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              You have not added any restaurants to your ownership portfolio. Create your first listing to start accepting reservations and collecting reviews.
            </p>
            <Link to="/owner/restaurants/new" className="btn-gold mt-6">
              <Plus className="h-4 w-4" />
              List your first restaurant
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {restaurants.map((restaurant) => (
            <article key={restaurant.id} className="glass-card overflow-hidden rounded-[30px]">
              <div className="grid gap-0 md:grid-cols-[0.42fr_0.58fr]">
                <div className="relative min-h-[240px]">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-full border border-white/[0.1] bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7ad5d6] backdrop-blur-md">
                    {restaurant.cuisine_type ?? restaurant.cuisine}
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-white">
                        {restaurant.name}
                      </h2>
                      <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <MapPin className="h-4 w-4 text-[#7ad5d6]" />
                        {restaurant.address}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[rgba(253,160,41,0.14)] px-3 py-2 text-sm font-semibold text-[var(--brand-gold)]">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {typeof restaurant.rating === "number" ? restaurant.rating.toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MiniInfo label="City" value={restaurant.city || "Not set"} />
                    <MiniInfo label="Phone" value={restaurant.phone || "Not set"} />
                  </div>

                  <p className="line-clamp-3 text-sm leading-7 text-[var(--text-muted)]">
                    {restaurant.description || "No description added yet."}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <ActionLink
                      to={`/owner/restaurants/${restaurant.id}/edit`}
                      icon={<Settings className="h-4 w-4" />}
                      label="Edit"
                    />
                    <ActionLink
                      to={`/owner/restaurants/${restaurant.id}/reservations`}
                      icon={<Calendar className="h-4 w-4" />}
                      label="Reservations"
                    />
                    <ActionLink
                      to={`/owner/restaurants/${restaurant.id}/reviews`}
                      icon={<FileText className="h-4 w-4" />}
                      label="Reviews"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function MetricCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="glass-card rounded-[28px] p-6">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-white">{value}</p>
      {caption ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/[0.36]">{caption}</p> : null}
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card-soft rounded-[20px] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/[0.36]">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function ActionLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6]"
    >
      {icon}
      {label}
    </Link>
  );
}
