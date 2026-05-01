import { Calendar, Clock3, MapPin, Phone, Star, Users } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../components/AuthProvider";
import { createReservation, getRestaurantById, getReviews, type Restaurant, type Review } from "../../lib/supabase";
import { toast } from "sonner";

export function RestaurantDetailPage() {
  const { restaurantId = "" } = useParams();
  const navigate = useNavigate();
  const { accessToken, profile } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "reviews">("overview");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("19:30");
  const [partySize, setPartySize] = useState(2);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    Promise.all([getRestaurantById(restaurantId), getReviews(restaurantId)])
      .then(([restaurantResult, reviewResult]) => {
        setRestaurant(restaurantResult);
        setReviews(reviewResult);
      })
      .finally(() => setLoading(false));
  }, [restaurantId]);

  useEffect(() => {
    if (!reservationDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setReservationDate(tomorrow.toISOString().slice(0, 10));
    }
  }, [reservationDate]);

  if (loading) {
    return <div className="glass-card rounded-[28px] p-8 text-sm text-[var(--text-muted)]">Loading restaurant…</div>;
  }

  if (!restaurant) {
    return <div className="glass-card rounded-[28px] p-8 text-sm text-[var(--text-muted)]">Restaurant not found.</div>;
  }

  async function handleReserve() {
    if (!accessToken) {
      navigate("/login", { state: { from: `/restaurants/${restaurantId}` } });
      return;
    }

    if (!reservationDate || !reservationTime || partySize < 1) {
      toast.error("Choose a valid date, time, and party size.");
      return;
    }

    setReserving(true);

    try {
      await createReservation(
        {
          restaurantId,
          reservationDate,
          reservationTime,
          partySize,
        },
        accessToken,
      );

      toast.success(`Reservation confirmed for ${restaurant.name}.`);
      navigate("/reservations");
    } catch (error) {
      console.error("Reservation create failed", error);
      toast.error(
        error instanceof Error ? error.message : "Unable to create reservation.",
      );
    } finally {
      setReserving(false);
    }
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-[380px] w-full rounded-[32px] object-cover shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
          />
          <div className="glass-card rounded-[32px] p-7">
            <p className="section-label">{restaurant.cuisine}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {restaurant.name}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <MapPin className="h-4 w-4" />
              {restaurant.address}
            </p>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
              {restaurant.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <InfoCard
                icon={<Star className="h-4 w-4 fill-current" />}
                label="Average rating"
                value={restaurant.rating?.toFixed(1) ?? "New"}
              />
              <InfoCard
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={restaurant.phone ?? "Available on request"}
              />
              <InfoCard
                icon={<Calendar className="h-4 w-4" />}
                label="Opening hours"
                value={restaurant.opening_hours ?? "Daily service"}
              />
            </div>
          </div>
        </div>

        <aside className="glass-card h-fit rounded-[32px] p-7 lg:sticky lg:top-28">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Reserve a table</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            Confirm date, time, and party size from the same screen.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/[0.36]">
            {profile ? `Booking as ${profile.fullName}` : "Sign in required to reserve"}
          </p>

          <div className="mt-7 space-y-4">
            <Field label="Date" icon={<Calendar className="h-4 w-4" />}>
              <input
                type="date"
                className="field"
                value={reservationDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setReservationDate(event.target.value)}
              />
            </Field>
            <Field label="Time" icon={<Clock3 className="h-4 w-4" />}>
              <select
                className="field"
                value={reservationTime}
                onChange={(event) => setReservationTime(event.target.value)}
              >
                <option value="18:00">6:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>
            </Field>
            <Field label="Party size" icon={<Users className="h-4 w-4" />}>
              <input
                type="number"
                min={1}
                max={20}
                value={partySize}
                onChange={(event) => setPartySize(Number(event.target.value))}
                className="field"
              />
            </Field>
            <button
              type="button"
              onClick={handleReserve}
              disabled={reserving}
              className="btn-gold mt-2 w-full disabled:opacity-60"
            >
              {reserving ? "Reserving…" : "Reserve"}
            </button>
          </div>
        </aside>
      </div>

      <div className="glass-card rounded-[32px] p-6">
        <div className="flex flex-wrap gap-2">
          {(["overview", "reviews"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={
                tab === item
                  ? "rounded-full bg-[var(--brand-gold)] px-4 py-2 text-sm font-bold capitalize text-[var(--brand-navy)]"
                  : "rounded-full border border-white/[0.1] bg-white/[0.06] px-4 py-2 text-sm font-medium capitalize text-[var(--text-muted)]"
              }
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="glass-card-soft rounded-[24px] p-5">
              <p className="text-sm font-semibold text-white">About this venue</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                This page now follows the same dark hospitality visual language as the landing and browse flow, while still reading its content from the current backend layer.
              </p>
            </div>
            <div className="glass-card-soft rounded-[24px] p-5">
              <p className="text-sm font-semibold text-white">Review preview</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                {reviews.length} guest review{reviews.length === 1 ? "" : "s"} currently loaded for this restaurant.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="glass-card-soft rounded-[24px] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{review.reviewerName}</p>
                    <p className="text-sm text-[var(--text-muted)]">{review.createdAt}</p>
                  </div>
                  <div className="rounded-full bg-[rgba(253,160,41,0.14)] px-3 py-1 text-sm font-semibold text-[var(--brand-gold)]">
                    {review.rating.toFixed(1)}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{review.comment}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white/[0.72]">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-card-soft rounded-[24px] p-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/[0.36]">
        {icon}
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
