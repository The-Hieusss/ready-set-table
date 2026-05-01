import {
  ArrowRight,
  CalendarRange,
  LayoutPanelTop,
  MapPin,
  MessageSquareText,
  Plus,
  Sparkles,
  Star,
  Store,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../components/AuthProvider";
import { getOwnerRestaurants, type Restaurant } from "../../lib/supabase";
import { toast } from "sonner";

export function OwnerDashboardPage() {
  const { profile, accessToken } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurants() {
      if (!profile || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getOwnerRestaurants(profile.id, accessToken);
        setRestaurants(data);
      } catch {
        toast.error("Could not load owner dashboard data");
      } finally {
        setLoading(false);
      }
    }

    void loadRestaurants();
  }, [accessToken, profile]);

  const metrics = useMemo(() => {
    const rated = restaurants.filter((restaurant) => typeof restaurant.rating === "number");
    const averageRating =
      rated.length > 0
        ? (rated.reduce((sum, restaurant) => sum + (restaurant.rating ?? 0), 0) / rated.length).toFixed(1)
        : "New";

    const completeListings = restaurants.filter(
      (restaurant) =>
        Boolean(restaurant.imageUrl) &&
        Boolean(restaurant.description?.trim()) &&
        Boolean(restaurant.phone?.trim()),
    ).length;

    return {
      totalRestaurants: restaurants.length,
      averageRating,
      completeListings,
    };
  }, [restaurants]);

  const featuredRestaurants = restaurants.slice(0, 3);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-[32px] p-8">
          <p className="section-label">Owner workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Run your restaurant portfolio with less friction
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Keep your listings polished, move quickly between restaurant operations, and maintain a cleaner handoff between the guest-facing product and the owner side.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/owner/restaurants/new" className="btn-gold">
              <Plus className="h-4 w-4" />
              Add Restaurant
            </Link>
            <Link to="/owner/restaurants" className="btn-outline">
              View Portfolio
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <HeroStat label="Restaurants" value={String(metrics.totalRestaurants)} />
            <HeroStat label="Average rating" value={metrics.averageRating} />
            <HeroStat
              label="Listing quality"
              value={`${metrics.completeListings}/${restaurants.length || 0}`}
            />
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.06] text-[#7ad5d6]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Quick actions</p>
              <p className="text-sm text-[var(--text-muted)]">Jump into the next high-value task</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <OwnerAction
              title="Add restaurant"
              body="Create a new venue with address, cuisine, image, and hours."
              to="/owner/restaurants/new"
              icon={<Plus className="h-4 w-4" />}
            />
            <OwnerAction
              title="Manage restaurants"
              body="Review your portfolio, update listing quality, and open restaurant-level tools."
              to="/owner/restaurants"
              icon={<Store className="h-4 w-4" />}
            />
            <OwnerAction
              title="Check reviews"
              body="Use your restaurant cards to move directly into review and reservation detail screens."
              to="/owner/restaurants"
              icon={<MessageSquareText className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <OwnerMetric
          icon={<LayoutPanelTop className="h-5 w-5" />}
          title="Total restaurants"
          value={String(metrics.totalRestaurants)}
        />
        <OwnerMetric
          icon={<Star className="h-5 w-5" />}
          title="Average rating"
          value={metrics.averageRating}
        />
        <OwnerMetric
          icon={<CalendarRange className="h-5 w-5" />}
          title="Listings with hours"
          value={String(restaurants.filter((restaurant) => Boolean(restaurant.opening_hours)).length)}
        />
        <OwnerMetric
          icon={<MessageSquareText className="h-5 w-5" />}
          title="Listings with description"
          value={String(
            restaurants.filter((restaurant) => Boolean(restaurant.description?.trim())).length,
          )}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="glass-card rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Portfolio snapshot
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                A quick read on the restaurants currently assigned to your ownership record.
              </p>
            </div>
            <Link
              to="/owner/restaurants"
              className="hidden items-center gap-2 text-sm font-semibold text-[#7ad5d6] transition hover:text-white sm:inline-flex"
            >
              Open all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 glass-card-soft rounded-[24px] p-5 text-sm text-[var(--text-muted)]">
              Loading dashboard data…
            </div>
          ) : featuredRestaurants.length === 0 ? (
            <div className="mt-6 glass-card-soft rounded-[24px] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-white/[0.1] bg-white/[0.06] text-[#7ad5d6]">
                <Store className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xl font-semibold text-white">No restaurants yet</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Add your first restaurant to activate the rest of the owner workflow.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {featuredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="glass-card-soft flex flex-col gap-4 rounded-[24px] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-white">{restaurant.name}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <MapPin className="h-4 w-4 text-[#7ad5d6]" />
                      {restaurant.address}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7ad5d6]">
                        {restaurant.cuisine_type ?? restaurant.cuisine}
                      </span>
                      <span className="rounded-full bg-[rgba(253,160,41,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-gold)]">
                        {typeof restaurant.rating === "number" ? restaurant.rating.toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <MiniAction to={`/owner/restaurants/${restaurant.id}/edit`} label="Edit" />
                    <MiniAction
                      to={`/owner/restaurants/${restaurant.id}/reservations`}
                      label="Reservations"
                    />
                    <MiniAction to={`/owner/restaurants/${restaurant.id}/reviews`} label="Reviews" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Listing quality checklist
          </h2>
          <div className="mt-6 space-y-4">
            <ChecklistRow
              label="Restaurants with cover image"
              current={restaurants.filter((restaurant) => Boolean(restaurant.imageUrl)).length}
              total={restaurants.length}
            />
            <ChecklistRow
              label="Restaurants with phone number"
              current={restaurants.filter((restaurant) => Boolean(restaurant.phone?.trim())).length}
              total={restaurants.length}
            />
            <ChecklistRow
              label="Restaurants with opening hours"
              current={restaurants.filter((restaurant) => Boolean(restaurant.opening_hours?.trim())).length}
              total={restaurants.length}
            />
            <ChecklistRow
              label="Restaurants with description"
              current={restaurants.filter((restaurant) => Boolean(restaurant.description?.trim())).length}
              total={restaurants.length}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card-soft rounded-[24px] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/[0.36]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function OwnerAction({
  title,
  body,
  to,
  icon,
}: {
  title: string;
  body: string;
  to: string;
  icon: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="glass-card-soft block rounded-[24px] p-5 transition hover:border-[rgba(122,213,214,0.28)]"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-[#7ad5d6]">{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{body}</p>
    </Link>
  );
}

function OwnerMetric({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="glass-card rounded-[28px] p-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7ad5d6]">
        {icon}
        Metric
      </div>
      <p className="mt-4 text-sm text-[var(--text-muted)]">{title}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function MiniAction({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6]"
    >
      {label}
    </Link>
  );
}

function ChecklistRow({
  label,
  current,
  total,
}: {
  label: string;
  current: number;
  total: number;
}) {
  const ratio = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="glass-card-soft rounded-[24px] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-white">{label}</p>
        <span className="text-sm font-semibold text-[var(--brand-gold)]">
          {current}/{total}
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#007a7b,#fda029)]"
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  );
}
