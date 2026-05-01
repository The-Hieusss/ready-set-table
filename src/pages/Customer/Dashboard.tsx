import {
  ArrowRight,
  CalendarClock,
  Clock3,
  Compass,
  MapPin,
  MessageSquareQuote,
  Sparkles,
  Star,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../components/AuthProvider";
import { getReservations, type Reservation } from "../../lib/supabase";
import { toast } from "sonner";

export function CustomerDashboardPage() {
  const { profile, accessToken } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await getReservations(accessToken);
        setReservations(data);
      } catch {
        toast.error("Could not load your reservation activity");
      } finally {
        setLoading(false);
      }
    }

    void loadReservations();
  }, [accessToken]);

  const stats = useMemo(() => {
    const upcoming = reservations
      .filter((reservation) => reservation.status === "upcoming")
      .sort(sortReservationsByDateTime);
    const completed = reservations
      .filter((reservation) => reservation.status === "completed")
      .sort(sortReservationsByDateTime)
      .reverse();
    const cancelled = reservations.filter((reservation) => reservation.status === "cancelled");
    const visitedRestaurants = new Set(completed.map((reservation) => reservation.restaurantName));

    return {
      upcoming,
      completed,
      cancelled,
      visitedRestaurants: visitedRestaurants.size,
      pendingReviews: completed.length,
    };
  }, [reservations]);

  const nextReservation = stats.upcoming[0] ?? null;
  const recentVisits = stats.completed.slice(0, 3);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-[32px] p-8">
          <p className="section-label">Dashboard overview</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Welcome back, {profile?.fullName ?? "Guest"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Keep track of your upcoming tables, revisit past dining plans, and move straight back into discovery when you are ready to book again.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/reservations" className="btn-gold">
              View reservations
            </Link>
            <Link to="/restaurants" className="btn-outline">
              Browse restaurants
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <HeroStat label="Upcoming" value={String(stats.upcoming.length)} />
            <HeroStat label="Completed" value={String(stats.completed.length)} />
            <HeroStat label="Cancelled" value={String(stats.cancelled.length)} />
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.06] text-[#7ad5d6]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Next move</p>
              <p className="text-sm text-[var(--text-muted)]">What matters most right now</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ActionCard
              title={nextReservation ? "Next reservation" : "Find your next table"}
              body={
                nextReservation
                  ? `${nextReservation.restaurantName} · ${formatDashboardDate(nextReservation.date)} at ${formatDashboardTime(nextReservation.time)}`
                  : "You do not have an upcoming table yet. Start a new search from the discovery page."
              }
              to={nextReservation ? "/reservations" : "/restaurants"}
              icon={<CalendarClock className="h-4 w-4" />}
            />
            <ActionCard
              title="Browse more restaurants"
              body="Jump back into discovery and explore restaurants by cuisine, city, and availability."
              to="/restaurants"
              icon={<Compass className="h-4 w-4" />}
            />
            <ActionCard
              title="Reservation history"
              body="See upcoming, completed, and cancelled bookings in one place."
              to="/reservations"
              icon={<MessageSquareQuote className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          icon={<CalendarClock className="h-5 w-5" />}
          label="Upcoming reservations"
          value={String(stats.upcoming.length)}
          accent="teal"
        />
        <StatCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Dining history"
          value={String(stats.completed.length)}
          accent="gold"
        />
        <StatCard
          icon={<MessageSquareQuote className="h-5 w-5" />}
          label="Pending reviews"
          value={String(stats.pendingReviews)}
          accent="navy"
        />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Restaurants visited"
          value={String(stats.visitedRestaurants)}
          accent="teal"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Reservation activity
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Your upcoming tables are surfaced first so you can act without hunting through history.
              </p>
            </div>
            <Link
              to="/reservations"
              className="hidden items-center gap-2 text-sm font-semibold text-[#7ad5d6] transition hover:text-white sm:inline-flex"
            >
              Open all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 glass-card-soft rounded-[24px] p-5 text-sm text-[var(--text-muted)]">
              Loading reservation activity…
            </div>
          ) : stats.upcoming.length === 0 ? (
            <div className="mt-6 glass-card-soft rounded-[24px] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-white/[0.1] bg-white/[0.06] text-[#7ad5d6]">
                <CalendarClock className="h-6 w-6" />
              </div>
              <p className="mt-4 text-xl font-semibold text-white">No upcoming reservations</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Start planning your next dining experience from the restaurant browse page.
              </p>
              <Link to="/restaurants" className="btn-gold mt-6">
                Browse restaurants
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {stats.upcoming.slice(0, 3).map((reservation) => (
                <div
                  key={reservation.id}
                  className="glass-card-soft flex flex-col gap-4 rounded-[24px] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-white">{reservation.restaurantName}</p>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {formatDashboardDate(reservation.date)} at {formatDashboardTime(reservation.time)}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <MapPin className="h-4 w-4 text-[#7ad5d6]" />
                      Party size {reservation.partySize}
                    </p>
                  </div>
                  <Link
                    to="/reservations"
                    className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-[rgba(122,213,214,0.45)] hover:text-[#7ad5d6]"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Recent visits
          </h2>
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="glass-card-soft rounded-[24px] p-5 text-sm text-[var(--text-muted)]">
                Loading recent visits…
              </div>
            ) : recentVisits.length === 0 ? (
              <div className="glass-card-soft rounded-[24px] p-5 text-sm leading-7 text-[var(--text-muted)]">
                Completed reservations will appear here after you dine.
              </div>
            ) : (
              recentVisits.map((reservation) => (
                <div key={reservation.id} className="glass-card-soft rounded-[24px] p-5">
                  <p className="font-semibold text-white">{reservation.restaurantName}</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {formatDashboardDate(reservation.date)} at {formatDashboardTime(reservation.time)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Party size {reservation.partySize}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function sortReservationsByDateTime(a: Reservation, b: Reservation) {
  return (
    new Date(`${a.date}T${normalizeTime(a.time)}`).getTime() -
    new Date(`${b.date}T${normalizeTime(b.time)}`).getTime()
  );
}

function normalizeTime(time: string) {
  return time.length === 5 ? `${time}:00` : time;
}

function formatDashboardDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatDashboardTime(value: string) {
  const date = new Date(`1970-01-01T${normalizeTime(value)}`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card-soft rounded-[24px] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/[0.36]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function ActionCard({
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

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent: "teal" | "gold" | "navy";
}) {
  const accentClass =
    accent === "teal"
      ? "bg-[rgba(0,122,123,0.18)] text-[#7ad5d6]"
      : accent === "gold"
        ? "bg-[rgba(253,160,41,0.16)] text-[var(--brand-gold)]"
        : "bg-[rgba(6,18,70,0.32)] text-[#b9c3ff]";

  return (
    <div className="glass-card rounded-[28px] p-6">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${accentClass}`}>
        {icon}
        Snapshot
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}
